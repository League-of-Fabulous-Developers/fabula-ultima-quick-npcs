import { AbstractStep } from '../../stepper/abstract-step.mjs';
import { checkPrerequisites } from '../../common/requirements.mjs';

/**
 * @callback ApplySkill
 * @param {NpcDataModel} model
 * @param context
 * @param {Record<string, string>} [choices]
 * @return {void, false}
 */

/**
 * @typedef NestedChoice
 * @property {string} label
 * @property {Record<string, string>} options
 * @property {Record<string, string>} [conditional]
 * @property {string} [group]
 * @property {{min: number, max: number}} [multi]
 */

/**
 * @typedef Skill
 * @property {string} label
 * @property {string} description
 * @property {ApplySkill} apply
 * @property {Record<string, NestedChoice>} [choices]
 * @property {Requirements} [require]
 * @property {Requirements} [disallow]
 */

/**
 * @typedef {Record<string, Skill>} SkillOptions
 */

export class AbstractChooseSkillStep extends AbstractStep {
  /** @type DamageType */
  #skill;
  /** @type {Record<string, string>} */
  #choices;

  /**
   * @param {Object} formValues
   */
  constructor(formValues) {
    super(formValues);
    this.#skill = formValues.selected;
    this.#choices = Object.fromEntries(
      Object.entries(formValues)
        .filter(([key]) => key.startsWith('choice.'))
        .map(([key, value]) => [key.substring(7), value]),
    );
  }

  static get template() {
    return 'QUICKNPC.step.chooseSkill';
  }

  /**
   * @return string
   */
  static get stepName() {
    throw new Error("must override 'static get stepName() {}'");
  }

  /**
   * @param model
   * @param context
   * @return SkillOptions
   */
  static getOptions(model, context) {
    throw new Error("must override 'static getOptions() {}'");
  }

  /**
   * @param model
   * @param context
   * @return string[]
   */
  static getGroups(model, context) {
    return undefined;
  }

  /**
   * @param {SkillOptions} options
   * @param {NpcDataModel} model
   * @param context
   * @return SkillOptions
   */
  static filterOptions(options, model, context) {
    return options;
  }

  /**
   * @param {AbstractStep} current
   * @param {NpcDataModel} value
   * @param context
   * @return boolean
   */
  static shouldActivate(current, value, context) {
    throw new Error("must override 'static shouldActivate(current, value, context) {}'");
  }

  /**
   * @param context
   * @param {string} selected
   * @return void
   */
  static markApplied(context, selected) {
    throw new Error("must override 'static markApplied(context) {}'");
  }

  static getTemplateData(formValues, current, context) {
    let options = this.getOptions(current, context);
    options = AbstractChooseSkillStep.#checkPrerequisites(options, current, context);
    options = this.filterOptions(options, current, context);

    const selected = formValues.selected;

    const choices = Object.fromEntries(
      Object.entries(options[selected]?.choices ?? {})
        .map(([key, value]) => [key, foundry.utils.deepClone(value)])
        .filter(([, value]) => {
          return (
            !value.conditional ||
            Object.entries(value.conditional).every(([key, value]) => formValues[`choice.${key}`] === value)
          );
        }),
    );

    const selectedChoices = Object.fromEntries(
      Object.keys(choices).map((key) => {
        const formValue = formValues[`choice.${key}`];
        return [key, formValue];
      }),
    );

    Object.entries(choices).forEach(([choiceKey, choiceConfig]) => {
      if (!choiceConfig.multi && !choiceConfig.editor) {
        choiceConfig.options = Object.fromEntries(
          Object.entries(choiceConfig.options).map(([key, value]) => [key, { label: value }]),
        );
        if (choiceConfig.group) {
          const groupSelection = Object.entries(choices)
            .filter(([key, value]) => key !== choiceKey && value.group === choiceConfig.group)
            .map(([key]) => selectedChoices[key]);
          Object.entries(choiceConfig.options).forEach(([key, value]) => {
            if (groupSelection.includes(key)) {
              value.disabled = true;
            }
          });
        }
      }
    });

    return {
      step: this.stepName,
      options,
      selected,
      choices,
      selectedChoices,
      groups: this.getGroups(current, context),
    };
  }

  apply(model, context) {
    const options = this.constructor.getOptions(model, context);
    const selectedSkill = options[this.#skill];

    if (!selectedSkill) {
      return false;
    }

    const cleanedChoices = this.#cleanChoices(selectedSkill, this.#choices);

    if (!this.#choicesValid(selectedSkill, cleanedChoices)) {
      return false;
    }
    const result = selectedSkill.apply(model, context, cleanedChoices);
    if (result === false) {
      return false;
    }
    this.constructor.markApplied(context, this.#skill);
    return model;
  }

  #cleanChoices(selectedSkill, choices) {
    return Object.fromEntries(
      Object.entries(selectedSkill.choices ?? {})
        .filter(
          ([, value]) =>
            !value.conditional ||
            Object.entries(value.conditional).every(
              ([conditionKey, conditionValue]) => conditionValue === choices[conditionKey],
            ),
        )
        .map(([key]) => [key, choices[key]]),
    );
  }

  /**
   * @param {Skill} selectedSkill
   * @param {Record<string, string>} choices
   * @return {boolean}
   */
  #choicesValid(selectedSkill, choices) {
    if (!selectedSkill.choices) {
      return true;
    }

    const individualValuesValid = Object.entries(selectedSkill.choices)
      .filter(([, value]) => {
        return (
          !value.conditional ||
          Object.entries(value.conditional).every(([condition, value]) => choices[condition] === value)
        );
      })
      .every(([key, value]) => {
        const formValue = choices[key];
        if (value.multi) {
          return (
            Array.isArray(formValue) &&
            formValue.length >= (value.multi.min ?? 1) &&
            formValue.length <= (value.multi.max ?? Number.MAX_VALUE) &&
            formValue.every((item) => item in value.options)
          );
        } else {
          return !!value.options[formValue];
        }
      });

    if (individualValuesValid) {
      /** @type {Record<string, string[]>} */
      const groups = {};
      for (let [choice, config] of Object.entries(selectedSkill.choices)) {
        if (config.group) {
          (groups[config.group] ??= []).push(choices[choice]);
        }
      }
      return Object.values(groups).every((group) => group.every((value, idx, array) => array.indexOf(value) === idx));
    } else {
      return false;
    }
  }

  /**
   * @param {SkillOptions} options
   * @param {NpcDataModel} model
   * @param context
   * @return {SkillOptions}
   */
  static #checkPrerequisites(options, model, context) {
    return Object.fromEntries(
      Object.entries(options).filter(([, value]) => checkPrerequisites(value.require, value.disallow, model, context)),
    );
  }
}
