import {AbstractChooseSkillStep} from "./abstract-choose-skill-step.mjs";


const spellKey = "spells";

export class ChooseSpellStep extends AbstractChooseSkillStep {

    static get stepName() {
        return "QUICKNPC.step.chooseSkill.spell"
    }

    static getOptions(model, context) {
        return context[spellKey][0]
    }

    /**
     * @param context
     * @param {SkillOptions} options
     */
    static addSpell(context, options) {
        (context[spellKey] ??= []).push(options);
    }

    static filterOptions(allOptions, model, context) {
        const applied = Object.keys(model.spells)
        const options = Object.entries(allOptions)
            .filter(([key]) => !applied.includes(key))

        return Object.fromEntries(options)
    }

    static shouldActivate(current, value, context) {
        return context[spellKey]?.length
    }

    static markApplied(context, selected) {
        context[spellKey].shift();
    }
}