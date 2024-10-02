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
     * @param {NpcModel} value
     * @param {Record} context
     * @return {NpcModel, false}
     */
    apply(value, context) {
        throw new Error("'apply(value, context) {}' must be overridden")
    }

    get formData() {
        const formData = new FormData();

        for (let [key, value] of this.#data.entries()) {
            formData.append(key, value)
        }

        return formData;
    }

}