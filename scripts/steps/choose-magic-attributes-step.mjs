import {AbstractStep} from "./abstract-step.mjs";
import {ChooseSpellStep} from "./choose-spell-step.mjs";
import {Spells} from "../common/spells.mjs";

/**
 * @type {Record<string, [Attribute, Attribute]>}
 */
const magicAttributesChoices = {
    "ins+wlp": ["ins", "wlp"],
    "mig+wlp": ["mig", "wlp"]
}

let magicAttributesTranslations;

Hooks.on("i18nInit", () => {
    magicAttributesTranslations = {
        "ins+wlp": game.i18n.format("QUICKNPC.pretty.attributes", {
            attr1: game.i18n.localize("QUICKNPC.attributes.ins"),
            attr2: game.i18n.localize("QUICKNPC.attributes.wlp")
        }),
        "mig+wlp": game.i18n.format("QUICKNPC.pretty.attributes", {
            attr1: game.i18n.localize("QUICKNPC.attributes.mig"),
            attr2: game.i18n.localize("QUICKNPC.attributes.wlp")
        }),
    }
})

export class ChooseMagicAttributesStep extends AbstractStep {

    #attributes

    constructor(formData) {
        super(formData);
        this.#attributes = formData.get("selected");
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    /**
     * @param {FormData} formData
     * @param {NpcModel} model
     * @param context
     * @return {Record}
     */
    static getTemplateData(formData, model, context) {
        return {
            step: "QUICKNPC.step.chooseMagicAttributes.name",
            options: magicAttributesTranslations,
            selected: formData.get("selected"),
            emptyOption: "QUICKNPC.step.chooseMagicAttributes.blank",
        }
    }

    /**
     * @param {AbstractStep} current
     * @param {NpcModel} value
     * @param context
     * @return boolean
     */
    static shouldActivate(current, value, context) {
        return !Spells.getAttributes(context) && ChooseSpellStep.shouldActivate(current, value, context);
    }

    /**
     * @param {NpcModel} value
     * @param {Record} context
     * @return {NpcModel, false}
     */
    apply(value, context) {
        if (!this.#attributes || !(this.#attributes in magicAttributesChoices)) {
            return false
        } else {
            Spells.setAttributes(context, ...magicAttributesChoices[this.#attributes])
            return value;
        }
    }
}