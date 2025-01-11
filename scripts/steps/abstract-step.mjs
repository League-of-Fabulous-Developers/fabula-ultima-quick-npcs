import {copyFormData} from "../common/utils.mjs";


export class AbstractStep {

    /**
     * @type FormData
     */
    #data

    /**
     * @param {FormData} formData
     */
    constructor(formData) {
        this.#data = Object.freeze(formData)
    }

    /**
     * @return {FormData}
     */
    get formData() {
        return copyFormData(this.#data);
    }

    /**
     * @return string
     */
    static get template() {
        throw new Error("'static get template() {}' must be overridden")
    }

    /**
     * @param {FormData} formData
     * @param {NpcModel} model
     * @param context
     * @return {Record}
     */
    static getTemplateData(formData, model, context) {
        return {}
    }

    /**
     * @param {AbstractStep} current
     * @param {NpcModel} value
     * @param context
     * @return boolean
     */
    static shouldActivate(current, value, context) {
        throw new Error("'static shouldActivate(current, value, context) {}' must be overridden")
    }

    /**
     * @param context
     */
    static initContext(context) {
        // do nothing by default
    }

    /**
     * @param {NpcModel} value
     * @param {Record} context
     * @return {NpcModel, false}
     */
    apply(value, context) {
        throw new Error("'apply(value, context) {}' must be overridden")
    }
}