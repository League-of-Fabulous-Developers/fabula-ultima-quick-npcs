import { AbstractStep } from '../../stepper/abstract-step.mjs';
import { CONSTANTS } from '../../constants.mjs';

const allDamageTypes = Object.keys(CONSTANTS.damageTypes);

export class AbstractAssignAffinityStep extends AbstractStep {
  /** @type DamageType */
  #damageType;

  get damageType() {
    return this.#damageType;
  }

  /**
   * @param {Object} formValues
   */
  constructor(formValues) {
    super(formValues);
    this.#damageType = formValues.selected;
  }

  static get template() {
    return 'QUICKNPC.step.singleSelect';
  }

  /**
   * @return string
   */
  static get stepName() {
    throw new Error("must override 'static get stepName() {}'");
  }

  /**
   * @param {NpcDataModel} model
   * @param context
   * @return DamageType[]
   */
  static getOptions(model, context) {
    throw new Error("must override 'static getOptions() {}'");
  }

  /**
   * @param {AbstractStep} current
   * @param {NpcDataModel} model
   * @param context
   * @return boolean
   */
  static shouldActivate(current, model, context) {
    throw new Error("must override 'static shouldActivate(current, value, context) {}'");
  }

  static getTemplateData(formValues, current, context) {
    const rawOptions = this.getOptions(current, context);

    const options = Object.fromEntries(
      Object.entries(CONSTANTS.damageTypes).filter(([key]) => rawOptions.includes(key)),
    );

    const selected = formValues.selected;

    return {
      step: this.stepName,
      options,
      selected,
      emptyOption: 'QUICKNPC.step.assignAffinity.blank',
    };
  }

  apply(model, context) {
    if (!this.#damageType || !allDamageTypes.includes(this.#damageType)) {
      return false;
    }
    return this.doApply(model, context);
  }

  /**
   * @param {NpcDataModel} model
   * @param context
   * @return {NpcDataModel, false}
   */
  doApply(model, context) {
    throw new Error("must override 'doApply(model, context) {}'");
  }
}
