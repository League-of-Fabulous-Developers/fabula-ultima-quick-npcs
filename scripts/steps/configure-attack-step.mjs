import {AbstractStep} from "./abstract-step.mjs";
import {CONSTANTS} from "../constants.mjs";
import {NpcModel} from "../common/npc-model.mjs";

const allDamageTypes = Object.keys(CONSTANTS.damageTypes)

const attacksKey = "attacks"

const attributeKey = "attributes"

const damageTypeKey = "damageType"

const rangeKey = "range"

const specialKey = "special"

export class ConfigureAttackStep extends AbstractStep {

    /**
     * @type Object
     * @property {string} name
     * @property {string} [attributes]
     * @property {"melee", "ranged"} range
     * @property {DamageType} [damageType]
     * @property {string} [special]
     * @property {Record<string, string>} [nested]
     */
    #data

    constructor(formData) {
        super(formData);
        this.#data = {
            name: formData.get("name"),
            attributes: formData.get("attributes"),
            range: formData.get("range"),
            damageType: formData.get("damageType"),
            special: formData.get("special"),
            nested: Object.fromEntries(Array.from(formData.entries())
                .filter(([key]) => key.startsWith("special."))
                .map(([key, value]) => [key.substring(8), value]))
        }

    }

    static get template() {
        return 'QUICKNPC.step.configureAttack';
    }

    static getTemplateData(formData, current, context) {
        const attackKey = Object.keys(context[attacksKey])[0];
        const attack = context[attacksKey][attackKey];

        let attributes
        if (attack[attributeKey]) {
            attributes = Object.fromEntries(attack[attributeKey].map(([attr1, attr2]) => ([
                `${attr1}+${attr2}`,
                game.i18n.format("QUICKNPC.pretty.attributes", {
                    attr1: game.i18n.localize(`QUICKNPC.attributes.${attr1}`),
                    attr2: game.i18n.localize(`QUICKNPC.attributes.${attr2}`),
                })
            ])))
        }

        let ranges
        if (attack[rangeKey]) {
            ranges = {
                melee: "QUICKNPC.attacks.melee",
                ranged: "QUICKNPC.attacks.ranged",
            }
        }

        let damageTypes
        if (attack[damageTypeKey]) {
            damageTypes = Object.fromEntries(attack[damageTypeKey].map(damageType => ([damageType, CONSTANTS.damageTypes[damageType]])))
        }

        /** @type SkillOptions */
        let special = attack[specialKey];
        let nestedChoices;
        let selectedNested;
        if (special && formData.get("special") && special[formData.get("special")].choices) {
            nestedChoices = Object.fromEntries(Object.entries(special[formData.get("special")].choices ?? {})
                .filter(([, value]) => {
                    return !value.conditional || Object.entries(value.conditional).every(([key, value]) => formData.get(`special.${key}`) === value)
                }))
            selectedNested = Object.fromEntries(Object.keys(nestedChoices)
                .map(key => {
                    const formValue = formData.get(`special.${key}`);
                    return [key, formValue];
                }))
        }

        return {
            name: formData.get("name") ?? current.attacks[attackKey].name,
            attributes: attributes,
            selectedAttributes: formData.get("attributes"),
            ranges: ranges,
            selectedRange: formData.get("range"),
            damageTypes: damageTypes,
            selectedDamageType: formData.get("damageType"),
            special: special,
            selectedSpecial: formData.get("special"),
            nestedChoices: nestedChoices,
            selectedNested: selectedNested,
        }
    }

    /**
     * @param context
     * @param {string} attackKey
     * @param {[Attribute, Attribute][]} options
     */
    static configureAttributeChoice(context, attackKey, options) {
        const attackContext = context[attacksKey] ??= {};
        const attack = attackContext[attackKey] ??= {}
        attack[attributeKey] = options.filter(value => value.every(attribute => attribute in CONSTANTS.attributes))
    }

    /**
     * @param context
     * @param {string} attackKey
     * @param {DamageType[]} options
     */
    static configureDamageTypeChoice(context, attackKey, options = allDamageTypes) {
        options = options.filter(value => allDamageTypes.includes(value))
        const attackContext = context[attacksKey] ??= {};
        const attack = attackContext[attackKey] ??= {}
        attack[damageTypeKey] = options
    }

    /**
     * @param context
     * @param {string} attackKey
     */
    static configureRange(context, attackKey) {
        const attackContext = context[attacksKey] ??= {};
        const attack = attackContext[attackKey] ??= {}
        attack[rangeKey] = true
    }

    /**
     * @param context
     * @param {string} attackKey
     * @param {SkillOptions} choice
     */
    static configureSpecialChoice(context, attackKey, choice) {
        const attackContext = context[attacksKey] ??= {};
        const attack = attackContext[attackKey] ??= {};
        attack[specialKey] = choice
    }

    /**
     * @param {AbstractStep} current
     * @param {NpcModel} value
     * @param context
     * @return boolean
     */
    static shouldActivate(current, value, context) {
        return Object.keys(context[attacksKey]).length
    }

    apply(model, context) {
        const attackKey = Object.keys(context[attacksKey])[0];
        const attackContext = context[attacksKey][attackKey]
        const {
            [attributeKey]: attributeOptions,
            [rangeKey]: configureRange,
            [damageTypeKey]: damageTypeOptions,
            [specialKey]: specialOptions
        } = attackContext ?? {};
        const attack = model.attacks[attackKey];
        const {name, attributes, range, damageType, special, nested} = this.#data

        if (!(attack
            && attackContext
            && this.#validateAttributes(attributeOptions, attributes)
            && this.#validateRange(configureRange, range)
            && this.#validateDamageType(damageTypeOptions, damageType)
            && this.#validateSpecial(specialOptions, special, nested))) {
            return false;
        }

        name.trim() && (attack.name = name);
        attributes && (attack.attributes = (attributes.split("+")));
        range && (attack.range = range);
        damageType && (attack.damageType = damageType);

        if (special) {
            const result = this.#applySpecial(model, context, specialOptions, special, nested);
            if (result === false) {
                return false;
            }
        }

        delete context[attacksKey][attackKey]
        NpcModel.updateDerivedValues(model)
        return model;
    }

    /**
     * @param {SkillOptions} specialOptions
     * @param {string} special
     * @param {Record} nested
     * @return {boolean}
     */
    #validateSpecial(specialOptions, special, nested) {
        if (!specialOptions && !special) {
            return true;
        }
        if (specialOptions && !special) {
            return false
        }
        return Object.entries(specialOptions[special].choices ?? {})
            .filter(([, value]) => {
                return !value.conditional || Object.entries(value.conditional).every(([condition, value]) => nested[condition] === value)
            })
            .every(([key]) => !!nested[key]);
    }

    /**
     * @param {DamageType[]} damageTypeOptions
     * @param {DamageType} damageType
     * @return {boolean}
     */
    #validateDamageType(damageTypeOptions, damageType) {
        if (!damageTypeOptions && !damageType) {
            return true;
        }
        if (damageTypeOptions && !damageType) {
            return false
        }
        return damageTypeOptions.includes(damageType);
    }

    /**
     * @param {[Attribute, Attribute][]} attributeOptions
     * @param {string} attributes
     * @return {undefined}
     */
    #validateAttributes(attributeOptions, attributes) {
        if (!attributeOptions && !attributes) {
            return true
        }
        if (attributeOptions && !attributes) {
            return false
        }
        const attributeArray = attributes.split("+");
        return attributeOptions.some(option => attributeArray.every((value, index) => option[index] === value));
    }

    /**
     * @param {NpcModel} model
     * @param context
     * @param {SkillOptions} specialOptions
     * @param {string} special
     * @param {Record<string, string>} nested
     * @return {void, false}
     */
    #applySpecial(model, context, specialOptions, special, nested) {
        return specialOptions[special].apply(model, context, nested)
    }

    /**
     *
     * @param configureRange
     * @param range
     * @return {boolean}
     */
    #validateRange(configureRange, range) {
        if (!configureRange && !range) {
            return true
        }
        return ["melee", "ranged"].includes(range);
    }
}