import {AbstractChooseSkillStep} from "./abstract-choose-skill-step.mjs";

const customizationsKey = "customizations"
const appliedCustomizationsKey = "appliedCustomizations"


export class ChooseCustomizationStep extends AbstractChooseSkillStep {

    /**
     * @return string
     */
    static get stepName() {
        return "QUICKNPC.step.chooseSkill.customization"
    }

    /**
     * @param model
     * @param context
     * @return SkillOptions
     */
    static getOptions(model, context) {
        return context[customizationsKey][0]
    }

    /**
     * @param context
     * @param {SkillOptions} options
     */
    static addCustomization(context, options) {
        (context[customizationsKey] ??= []).push(options)
    }

    /**
     * @param {SkillOptions} options
     * @param {NpcModel} model
     * @param context
     * @return SkillOptions
     */
    static filterOptions(options, model, context) {
        const applied = context[appliedCustomizationsKey] ?? []
        return Object.fromEntries(Object.entries(options)
            .filter(([key]) => !applied.includes(key)));
    }

    /**
     * @param {AbstractStep} current
     * @param {NpcModel} value
     * @param context
     * @return boolean
     */
    static shouldActivate(current, value, context) {
        return context[customizationsKey]?.length
    }

    static markApplied(context, selected) {
        context[customizationsKey].shift();
        (context[appliedCustomizationsKey] ??= []).push(selected);
    }

}