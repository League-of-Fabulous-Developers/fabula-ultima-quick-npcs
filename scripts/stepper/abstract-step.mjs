export class AbstractStep {
  /**
   * @type Object
   */
  #data;

  /**
   * @param {Object} formValues
   */
  constructor(formValues) {
    this.#data = foundry.utils.deepFreeze(foundry.utils.deepClone(formValues));
  }

  /**
   * @return {Object}
   */
  get formValues() {
    return this.#data;
  }

  /**
   * @return string
   */
  static get template() {
    throw new Error("'static get template() {}' must be overridden");
  }

  /**
   * @param {Object} formValues
   * @param {NpcDataModel} model
   * @param context
   * @return {Record}
   */
  static getTemplateData(formValues, model, context) {
    return {};
  }

  /**
   * @param {AbstractStep} current
   * @param {NpcDataModel} value
   * @param context
   * @return boolean
   */
  static shouldActivate(current, value, context) {
    throw new Error("'static shouldActivate(current, value, context) {}' must be overridden");
  }

  /**
   * @param context
   */
  static initContext(context) {
    // do nothing by default
  }

  /**
   * @param {NpcDataModel} value
   * @param {Record} context
   * @return {NpcDataModel, false}
   */
  apply(value, context) {
    throw new Error("'apply(value, context) {}' must be overridden");
  }
}
