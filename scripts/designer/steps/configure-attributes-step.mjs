import {AbstractStep} from "../../stepper/abstract-step.mjs";

/**
 * @typedef {"d6","d8","d10","d12"} AttributeDice
 */

/**
 * @typedef {"balanced", "standard", "specialized", "hyperSpecialized"} AttributeDistribution
 */

/**
 * @type {Set<AttributeDice>}
 */
const validAttributeDice = new Set(["d6", "d8", "d10", "d12"]);

const attributeDiceLabels = {
    d6: "QUICKNPC.attributeDice.d6",
    d8: "QUICKNPC.attributeDice.d8",
    d10: "QUICKNPC.attributeDice.d10",
    d12: "QUICKNPC.attributeDice.d12",
}

const attributeConfigDone = "attributeConfigDone"

const attributeArrayKey = "attributeArray"

export class ConfigureAttributesStep extends AbstractStep {

    /** @type AttributeDice */
    #dex;
    /** @type AttributeDice */
    #ins;
    /** @type AttributeDice */
    #mig;
    /** @type AttributeDice */
    #wlp;

    constructor(formValues) {
        super(formValues);
        this.#dex = formValues.dex;
        this.#ins = formValues.ins;
        this.#mig = formValues.mig;
        this.#wlp = formValues.wlp;
    }

    static get template() {
        return "QUICKNPC.step.configureAttributes";
    }

    static getTemplateData(formValues, current, context) {
        /** @type {[AttributeDice, AttributeDice, AttributeDice, AttributeDice]} */
        const attributeArray = context[attributeArrayKey] ?? ["d8", "d8", "d8", "d8"];
        const attributes = ["ins", "dex", "mig", "wlp"]
        const attributeValues = attributes.reduce((previousValue, attribute) => {
            previousValue[attribute] = formValues[attribute] ?? "";
            return previousValue;
        }, {})

        return {
            attributes: attributes.map(value => ({
                name: value,
                label: `QUICKNPC.step.configureAttributes.attributes.${value}`,
                selected: attributeValues[value],
                options: this.#attributeOptions(value, attributeArray, attributeValues)
            }))
        }
    }

    /**
     * @param {Attribute} attribute
     * @param {[AttributeDice,AttributeDice,AttributeDice,AttributeDice]} distribution
     * @param {Record<Attribute, AttributeDice|"">} selectedValues
     * @return {Record<AttributeDice, string>}
     */
    static #attributeOptions(attribute, distribution, selectedValues) {
        const options = distribution.reduce((previousValue, currentValue) => {
            previousValue[currentValue] ??= 0;
            previousValue[currentValue] += 1;
            return previousValue;
        }, {})

        Object.values(selectedValues)
            .forEach((value) => {
                if (value in options) {
                    options[value] -= 1;
                }
            });

        const selectedAttributeValue = selectedValues[attribute];
        if (selectedAttributeValue in options) {
            options[selectedAttributeValue] += 1;
        }
        return Object.entries(options).map(([key, value]) => ({
            value: key,
            label: attributeDiceLabels[key],
            selected: key === selectedAttributeValue,
            disabled: value === 0
        }));
    }

    static shouldActivate(current, value, context) {
        return !context[attributeConfigDone]
    }

    apply(model, context) {
        if (!this.#isValidAttributeDistribution(context)) {
            return false
        } else {
            context[attributeConfigDone] = true
            model.updateSource({
                attributes: {
                    ins: this.#ins,
                    dex: this.#dex,
                    mig: this.#mig,
                    wlp: this.#wlp,
                }
            })

            return model;
        }
    }

    /**
     * @param {Object} context
     * @param {AttributeDice[] | false} attributeArray
     */
    static setAttributeArray(context, attributeArray) {
        if (attributeArray === false) {
            // short circuit for balanced distribution
            context[attributeConfigDone] = true;
            return;
        }

        if (!Array.isArray(attributeArray) || attributeArray.length !== 4 || !attributeArray.every(v => validAttributeDice.has(v))) {
            throw new Error("Invalid attribute array: " + JSON.stringify(attributeArray))
        }

        context[attributeArrayKey] = attributeArray;
    }

    #isValidAttributeDistribution(context) {
        const contextArray = [...context[attributeArrayKey]].sort();
        const configuredArray = [this.#ins, this.#dex, this.#mig, this.#wlp].sort();

        return contextArray.every((v, i) => v === configuredArray[i]);
    }
}