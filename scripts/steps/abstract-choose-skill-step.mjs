import {AbstractStep} from "./abstract-step.mjs";
import {NpcModel} from "../common/npc-model.mjs";
import {checkPrerequisites} from "../common/requirements.mjs";

/**
 * @callback ApplySkill
 * @param {NpcModel} model
 * @param context
 * @param {Record<string, string>} [choices]
 * @return {void, false}
 */

/**
 * @typedef NestedChoice
 * @property {string} label
 * @property {Record<string, string>} options
 * @property {Record<string, string>} [conditional]
 * @property {string} [group]
 */

/**
 * @typedef Skill
 * @property {string} label
 * @property {string} description
 * @property {ApplySkill} apply
 * @property {Record<string, NestedChoice>} [choices]
 * @property {Requirements} [require]
 * @property {Requirements} [disallow]
 */

/**
 * @typedef {Record<string, Skill>} SkillOptions
 */

export class AbstractChooseSkillStep extends AbstractStep {

    /** @type DamageType */
    #skill
    /** @type {Record<string, string>} */
    #choices

    /**
     * @param {FormData} formData
     */
    constructor(formData) {
        super(formData);
        this.#skill = formData.get("selected");
        this.#choices = Object.fromEntries(Array.from(formData.entries())
            .filter(([key]) => key.startsWith("choice."))
            .map(([key, value]) => [key.substring(7), value]));
    }

    static get template() {
        return 'QUICKNPC.step.chooseSkill';
    }

    /**
     * @return string
     */
    static get stepName() {
        throw new Error("must override 'static get stepName() {}'")
    }

    /**
     * @param model
     * @param context
     * @return SkillOptions
     */
    static getOptions(model, context) {
        throw new Error("must override 'static getOptions() {}'")
    }


    /**
     * @param {SkillOptions} options
     * @param {NpcModel} model
     * @param context
     * @return SkillOptions
     */
    static filterOptions(options, model, context) {
        return options
    }

    /**
     * @param {AbstractStep} current
     * @param {NpcModel} value
     * @param context
     * @return boolean
     */
    static shouldActivate(current, value, context) {
        throw new Error("must override 'static shouldActivate(current, value, context) {}'")
    }

    /**
     * @param context
     * @param {string} selected
     * @return void
     */
    static markApplied(context, selected) {
        throw new Error("must override 'static markApplied(context) {}'")
    }

    static getTemplateData(formData, current, context) {
        let options = this.getOptions(current, context);
        options = AbstractChooseSkillStep.#checkPrerequisites(options, current, context);
        options = this.filterOptions(options, current, context);

        const selected = formData.get("selected");

        const choices = Object.fromEntries(Object.entries(options[selected]?.choices ?? {})
            .filter(([, value]) => {
                return !value.conditional || Object.entries(value.conditional).every(([key, value]) => formData.get(`choice.${key}`) === value)
            }));

        const selectedChoices = Object.fromEntries(Object.keys(choices)
            .map(key => {
                const formValue = formData.get(`choice.${key}`);
                return [key, formValue];
            }))

        return {
            step: this.stepName,
            options,
            selected,
            choices,
            selectedChoices
        }
    }

    apply(model, context) {
        const options = this.constructor.getOptions(model, context);
        const selectedSkill = options[this.#skill];
        if (!selectedSkill || !this.#choicesValid(selectedSkill, this.#choices)) {
            return false;
        }
        const result = selectedSkill.apply(model, context, this.#choices)
        if (result === false) {
            return false
        }
        NpcModel.updateDerivedValues(model)
        this.constructor.markApplied(context, this.#skill)
        return model;
    }

    /**
     * @param {Skill} selectedSkill
     * @param {Record<string, string>} choices
     * @return {boolean}
     */
    #choicesValid(selectedSkill, choices) {
        if (!selectedSkill.choices) {
            return true;
        }

        const individualValuesValid = Object.entries(selectedSkill.choices)
            .filter(([, value]) => {
                return !value.conditional || Object.entries(value.conditional).every(([condition, value]) => choices[condition] === value)
            })
            .every(([key, value]) => !!value.options[choices[key]]);
        if (individualValuesValid) {
            /** @type {Record<string, string[]>} */
            const groups = {}
            for (let [choice, config] of Object.entries(selectedSkill.choices)) {
                if (config.group) {
                    (groups[config.group] ??= []).push(choices[choice]);
                }
            }
            return Object.values(groups).every(group => group.every((value, idx, array) => array.indexOf(value) === idx))
        } else {
            return false;
        }
    }

    /**
     * @param {SkillOptions} options
     * @param {NpcModel} model
     * @param context
     * @return {SkillOptions}
     */
    static #checkPrerequisites(options, model, context) {
        return Object.fromEntries(Object.entries(options)
            .filter(([, value]) => checkPrerequisites(value.require, value.disallow, model, context)));
    }
}