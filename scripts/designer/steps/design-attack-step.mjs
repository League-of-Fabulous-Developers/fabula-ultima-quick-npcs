import {AbstractStep} from "../../stepper/abstract-step.mjs";
import {CONSTANTS} from "../../constants.mjs";


const designAttacksDoneKey = "designAttacksDone"

const attackIndexKey = "attackIndex"

export class DesignAttackStep extends AbstractStep {

    /**
     * @type Object
     * @property {string} name
     * @property {[Attribute, Attribute]} attributes
     * @property {"melee", "ranged"} range
     * @property {DamageType} damageType
     */
    #data

    constructor(formValues) {
        super(formValues);
        this.#data = {
            name: formValues.name,
            attributes: formValues.attributes,
            range: formValues.range,
            damageType: formValues.damageType,
            createMore: formValues.createMore,
        }

    }

    static get template() {
        return 'QUICKNPC.step.designAttack';
    }

    static getTemplateData(formValues, current, context) {

        const ranges = {
            melee: "QUICKNPC.attacks.melee",
            ranged: "QUICKNPC.attacks.ranged",
        }

        const [firstSelectedAttribute = "", secondSelectedAttribute = ""] = formValues.attributes ?? []

        return {
            name: formValues.name ?? game.i18n.localize("QUICKNPC.step.designAttack.attackName.default"),
            attributes: CONSTANTS.attributes,
            firstSelectedAttribute: firstSelectedAttribute,
            secondSelectedAttribute: secondSelectedAttribute,
            ranges: ranges,
            selectedRange: formValues.range,
            damageTypes: CONSTANTS.damageTypes,
            selectedDamageType: formValues.damageType,
            createMore: formValues.createMore
        }
    }

    /**
     * @param {AbstractStep} current
     * @param {NpcDataModel} value
     * @param context
     * @return boolean
     */
    static shouldActivate(current, value, context) {
        return !context[designAttacksDoneKey];
    }

    apply(model, context) {
        const attackIndex = context[attackIndexKey] ?? 0;
        const {name, attributes, range, damageType, createMore} = this.#data

        if (!(this.#validateAttributes(attributes) && this.#validateRange(range) && this.#validateDamageType(damageType))) {
            return false;
        }

        model.updateSource({
            attacks: {
                [attackIndex]: {
                    name: name.trim(),
                    attributes: attributes,
                    range: range,
                    damageType: damageType,
                }
            }
        })

        if (!createMore) {
            context[designAttacksDoneKey] = true;
        } else {
            context[attackIndexKey] = attackIndex + 1;
        }

        return model;
    }

    /**
     * @param {DamageType} damageType
     * @return {boolean}
     */
    #validateDamageType(damageType) {
        return damageType in CONSTANTS.damageTypes;
    }

    /**
     * @param {[Attribute, Attribute]} attributes
     * @return {undefined}
     */
    #validateAttributes(attributes) {
        const [first, second] = attributes ?? [];

        return first && second && first in CONSTANTS.attributes && second in CONSTANTS.attributes;
    }

    /**
     *
     * @param range
     * @return {boolean}
     */
    #validateRange(range) {
        return ["melee", "ranged"].includes(range);
    }
}