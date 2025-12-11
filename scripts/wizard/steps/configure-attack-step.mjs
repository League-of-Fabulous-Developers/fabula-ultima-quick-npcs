import {AbstractStep} from "../../stepper/abstract-step.mjs";
import {CONSTANTS} from "../../constants.mjs";

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

    constructor(formValues) {
        super(formValues);
        this.#data = {
            name: formValues.name,
            attributes: formValues.attributes,
            range: formValues.range,
            damageType: formValues.damageType,
            special: formValues.special,
            nested: Object.fromEntries(Object.entries(formValues)
                .filter(([key]) => key.startsWith("special."))
                .map(([key, value]) => [key.substring(8), value]))
        }

    }

    static get template() {
        return 'QUICKNPC.step.configureAttack';
    }

    static getTemplateData(formValues, current, context) {
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
        if (special && formValues.special && special[formValues.special].choices) {
            nestedChoices = Object.fromEntries(Object.entries(special[formValues.special].choices ?? {})
                .filter(([, value]) => {
                    return !value.conditional || Object.entries(value.conditional).every(([key, value]) => formValues[`special.${key}`] === value)
                }))
            selectedNested = Object.fromEntries(Object.keys(nestedChoices)
                .map(key => {
                    const formValue = formValues[`special.${key}`];
                    return [key, formValue];
                }))
        }

        return {
            name: formValues.name ?? current.attacks[attackKey].name,
            attributes: attributes,
            selectedAttributes: formValues.attributes,
            ranges: ranges,
            selectedRange: formValues.range,
            damageTypes: damageTypes,
            selectedDamageType: formValues.damageType,
            special: special,
            selectedSpecial: formValues.special,
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
     * @param {NpcDataModel} value
     * @param context
     * @return boolean
     */
    static shouldActivate(current, value, context) {
        return context[attacksKey] != null && Object.keys(context[attacksKey]).length > 0
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

        attack.updateSource({
            name: name?.trim() ? name.trim(): attack.name,
            attributes: attributes ? attributes.split("+"): attack.attributes,
            range: range?.trim() ? range.trim() : attack.range,
            damageType: damageType ? damageType : attack.damageType,
        })

        if (special) {
            const result = this.#applySpecial(model, context, specialOptions, special, nested);
            if (result === false) {
                return false;
            }
        }

        delete context[attacksKey][attackKey]
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
     * @param {NpcDataModel} model
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