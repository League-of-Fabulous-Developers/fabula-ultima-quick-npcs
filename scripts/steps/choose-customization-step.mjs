import {AbstractChooseSkillStep} from "./abstract-choose-skill-step.mjs";
import {Customizations} from "../common/customizations.mjs";

const customizationsKey = "customizations"

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
        if (Object.keys(options).length) {
            (context[customizationsKey] ??= []).push(options)
        }
    }

    /**
     * @param {SkillOptions} options
     * @param {NpcModel} model
     * @param context
     * @return SkillOptions
     */
    static filterOptions(options, model, context) {
        return Object.fromEntries(Object.entries(options)
            .filter(([key]) => !Customizations.checkApplied(context, key)));
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
        Customizations.markApplied(context, selected);
    }

}