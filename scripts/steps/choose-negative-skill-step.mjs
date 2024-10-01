import {AbstractChooseSkillStep} from "./abstract-choose-skill-step.mjs";

const negativeSkillKey = "negativeSkills";
const appliedNegativeSkillKey = "appliedNegativeSkills";

export class ChooseNegativeSkillStep extends AbstractChooseSkillStep {

    static get stepName() {
        return "QUICKNPC.step.chooseSkill.negative"
    }

    static getOptions(model, context) {
        return context[negativeSkillKey][0]
    }

    /**
     * @param context
     * @param {SkillOptions} options
     */
    static addNegativeSkill(context, options) {
        (context[negativeSkillKey] ??= []).push(options);
    }

    static filterOptions(options, model, context) {
        const applied = context[appliedNegativeSkillKey] ?? []
        return Object.fromEntries(Object.entries(options)
            .filter(([key]) => !applied.includes(key)))
    }

    static shouldActivate(current, value, context) {
        return context[negativeSkillKey]?.length
    }

    static markApplied(context, selected) {
        context[negativeSkillKey].shift();
        (context[appliedNegativeSkillKey] ??= []).push(selected);
    }

}