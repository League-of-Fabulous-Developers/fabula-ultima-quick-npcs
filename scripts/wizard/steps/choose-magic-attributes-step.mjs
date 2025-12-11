import { AbstractStep } from '../../stepper/abstract-step.mjs';
import { ChooseSpellStep } from './choose-spell-step.mjs';
import { Spells } from '../../common/spells.mjs';

/**
 * @type {Record<string, [Attribute, Attribute]>}
 */
const magicAttributesChoices = {
  'ins+wlp': ['ins', 'wlp'],
  'mig+wlp': ['mig', 'wlp'],
};

let magicAttributesTranslations;

Hooks.on('i18nInit', () => {
  magicAttributesTranslations = {
    'ins+wlp': game.i18n.format('QUICKNPC.pretty.attributes', {
      attr1: game.i18n.localize('QUICKNPC.attributes.ins'),
      attr2: game.i18n.localize('QUICKNPC.attributes.wlp'),
    }),
    'mig+wlp': game.i18n.format('QUICKNPC.pretty.attributes', {
      attr1: game.i18n.localize('QUICKNPC.attributes.mig'),
      attr2: game.i18n.localize('QUICKNPC.attributes.wlp'),
    }),
  };
});

export class ChooseMagicAttributesStep extends AbstractStep {
  #attributes;

  constructor(formValues) {
    super(formValues);
    this.#attributes = formValues.selected;
  }

  static get template() {
    return 'QUICKNPC.step.singleSelect';
  }

  /**
   * @param {Object} formValues
   * @param {NpcDataModel} model
   * @param context
   * @return {Record}
   */
  static getTemplateData(formValues, model, context) {
    return {
      step: 'QUICKNPC.step.chooseMagicAttributes.name',
      options: magicAttributesTranslations,
      selected: formValues.selected,
      emptyOption: 'QUICKNPC.step.chooseMagicAttributes.blank',
    };
  }

  /**
   * @param {AbstractStep} current
   * @param {NpcDataModel} value
   * @param context
   * @return boolean
   */
  static shouldActivate(current, value, context) {
    return !Spells.getAttributes(context) && ChooseSpellStep.shouldActivate(current, value, context);
  }

  /**
   * @param {NpcDataModel} value
   * @param {Record} context
   * @return {NpcDataModel, false}
   */
  apply(value, context) {
    if (!this.#attributes || !(this.#attributes in magicAttributesChoices)) {
      return false;
    } else {
      Spells.setAttributes(context, ...magicAttributesChoices[this.#attributes]);
      return value;
    }
  }
}
