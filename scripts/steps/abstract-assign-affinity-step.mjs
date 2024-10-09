import {AbstractStep} from "./abstract-step.mjs";
import {NpcModel} from "../common/npc-model.mjs";
import {CONSTANTS} from "../constants.mjs";

const allDamageTypes = Object.keys(CONSTANTS.damageTypes)

export class AbstractAssignAffinityStep extends AbstractStep {

    /** @type DamageType */
    #damageType

    get damageType() {
        return this.#damageType
    }

    /**
     * @param {FormData} formData
     */
    constructor(formData) {
        super(formData);
        this.#damageType = formData.get("selected");
    }

    static get template() {
        return 'QUICKNPC.step.singleSelect';
    }

    /**
     * @return string
     */
    static get stepName() {
        throw new Error("must override 'static get stepName() {}'")
    }

    /**
     * @param {NpcModel} model
     * @param context
     * @return DamageType[]
     */
    static getOptions(model, context) {
        throw new Error("must override 'static getOptions() {}'")
    }

    /**
     * @param {AbstractStep} current
     * @param {NpcModel} model
     * @param context
     * @return boolean
     */
    static shouldActivate(current, model, context) {
        throw new Error("must override 'static shouldActivate(current, value, context) {}'")
    }

    static getTemplateData(formData, current, context) {
        const rawOptions = this.getOptions(current, context);

        const options = Object.fromEntries(Object.entries(CONSTANTS.damageTypes).filter(([key]) => rawOptions.includes(key)))

        const selected = formData.get("selected");

        return {
            step: this.stepName,
            options,
            selected,
            emptyOption: "QUICKNPC.step.assignAffinity.blank"
        }
    }

    apply(model, context) {
        if (!this.#damageType || !allDamageTypes.includes(this.#damageType)) {
            return false;
        }
        const result = this.doApply(model, context);
        if (result) {
            NpcModel.updateDerivedValues(result);
        }
        return result;
    }

    /**
     * @param {NpcModel} model
     * @param context
     * @return {NpcModel, false}
     */
    doApply(model, context) {
        throw new Error("must override 'doApply(model, context) {}'")
    }
}