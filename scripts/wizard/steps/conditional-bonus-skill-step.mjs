import { AbstractStep } from '../../stepper/abstract-step.mjs';
import { ChooseCustomizationStep } from './choose-customization-step.mjs';

/**
 * @typedef Drawback
 * @property {string} label
 * @property {((npcModel: NpcDataModel, context: unknown) => NpcDataModel)} apply
 */

/**
 * @typedef ConditionalBonusSkill
 * @property {Skill} drawback
 * @property {SkillOptions} options
 */

const conditionalBonusSkillsKey = 'conditionalBonusSkills';

export class ConditionalBonusSkillStep extends AbstractStep {
  /** @type boolean */
  #choice;

  /**
   * @param {Object} formValues
   */
  constructor(formValues) {
    super(formValues);
    this.#choice = Boolean(formValues.choice);
  }

  /**
   * @return string
   */
  static get template() {
    return 'QUICKNPC.step.conditionalBonusSkill';
  }

  /**
   * @param {Object} formValues
   * @param {NpcDataModel} current
   * @param context
   * @return {Record}
   */
  static getTemplateData(formValues, current, context) {
    /** @type ConditionalBonusSkill */
    const condiSkill = context[conditionalBonusSkillsKey][0];
    return {
      selected: Boolean(formValues.choice),
      conditionalBonusSkill: condiSkill,
    };
  }

  /**
   * @param context
   * @param {ConditionalBonusSkill} conditionalBonusSkill
   */
  static addConditionalBonusSkill(context, conditionalBonusSkill) {
    context[conditionalBonusSkillsKey] ??= [];
    context[conditionalBonusSkillsKey].push(conditionalBonusSkill);
  }

  /**
   * @param {AbstractStep} current
   * @param {NpcDataModel} value
   * @param context
   * @return boolean
   */
  static shouldActivate(current, value, context) {
    return context[conditionalBonusSkillsKey]?.length;
  }

  /**
   * @param {NpcDataModel} model
   * @param {Record} context
   * @return {NpcDataModel, false}
   */
  apply(model, context) {
    /** @type ConditionalBonusSkill */
    const condiSkill = context[conditionalBonusSkillsKey].shift();
    if (this.#choice) {
      const result = condiSkill.drawback.apply(model, context);
      if (result === false) {
        return false;
      }
      ChooseCustomizationStep.addCustomization(context, condiSkill.options);
    }
    return model;
  }
}
