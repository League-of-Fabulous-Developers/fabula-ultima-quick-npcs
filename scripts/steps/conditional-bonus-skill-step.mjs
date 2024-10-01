import {AbstractStep} from "./abstract-step.mjs";
import {ChooseCustomizationStep} from "./choose-customization-step.mjs";

/**
 * @typedef Drawback
 * @property {string} label
 * @property {((npcModel: NpcModel, context: unknown) => NpcModel)} apply
 */

/**
 * @typedef ConditionalBonusSkill
 * @property {Skill} drawback
 * @property {SkillOptions} options
 */

const conditionalBonusSkillsKey = "conditionalBonusSkills"

export class ConditionalBonusSkillStep extends AbstractStep {

    /** @type boolean */
    #choice

    /**
     * @param {FormData} formData
     */
    constructor(formData) {
        super(formData)
        this.#choice = Boolean(formData.get("choice"));
    }

    /**
     * @return string
     */
    static get template() {
        return "QUICKNPC.step.conditionalBonusSkill";
    }

    /**
     * @param {FormData} formData
     * @param {NpcModel} current
     * @param context
     * @return {Record}
     */
    static getTemplateData(formData, current, context) {
        /** @type ConditionalBonusSkill */
        const condiSkill = context[conditionalBonusSkillsKey][0];
        return {
            selected: Boolean(formData.get("choice")),
            conditionalBonusSkill: condiSkill
        }
    }

    /**
     * @param context
     * @param {ConditionalBonusSkill} conditionalBonusSkill
     */
    static addConditionalBonusSkill(context, conditionalBonusSkill) {
        context[conditionalBonusSkillsKey] ??= [];
        context[conditionalBonusSkillsKey].push(conditionalBonusSkill)
    }

    /**
     * @param {AbstractStep} current
     * @param {NpcModel} value
     * @param context
     * @return boolean
     */
    static shouldActivate(current, value, context) {
        return context[conditionalBonusSkillsKey]?.length
    }

    /**
     * @param {NpcModel} model
     * @param {Record} context
     * @return {NpcModel, false}
     */
    apply(model, context) {
        /** @type ConditionalBonusSkill */
        const condiSkill = context[conditionalBonusSkillsKey].shift();
        if (this.#choice) {
            const result = condiSkill.drawback.apply(model, context);
            if (result === false) {
                return false;
            }
            ChooseCustomizationStep.addCustomization(context, condiSkill.options)
        }
        return model;
    }

}