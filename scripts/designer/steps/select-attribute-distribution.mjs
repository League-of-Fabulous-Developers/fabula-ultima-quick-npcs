import {AbstractStep} from "../../stepper/abstract-step.mjs";
import {unallocatedSkills} from "../designer-steps.mjs";
import {ConfigureAttributesStep} from "./configure-attributes-step.mjs";

/**
 * @typedef {"d6","d8","d10","d12"} AttributeDice
 */

/**
 * @typedef {"balanced", "standard", "specialized", "hyperSpecialized"} AttributeDistribution
 */

/**
 * @type {Record<AttributeDistribution, [AttributeDice, AttributeDice, AttributeDice, AttributeDice]>}
 */
const attributeDistributions = {
    balanced: ["d8", "d8", "d8", "d8"],
    standard: ["d6", "d8", "d8", "d10"],
    specialized: ["d6", "d6","d10", "d10"],
    hyperSpecialized: ["d6", "d6", "d8", "d12"],
}

/** @type {Record<AttributeDistribution, string>} */
const attributesDistributionLabels = {
    balanced: "QUICKNPC.step.selectAttributeDistribution.attributeDistribution.balanced.label",
    standard: "QUICKNPC.step.selectAttributeDistribution.attributeDistribution.standard.label",
    specialized: "QUICKNPC.step.selectAttributeDistribution.attributeDistribution.specialized.label",
    hyperSpecialized: "QUICKNPC.step.selectAttributeDistribution.attributeDistribution.hyperSpecialized.label",
}

/** @type {Record<AttributeDistribution, string>} */
const attributesDistributionDescriptions = {
    balanced: "QUICKNPC.step.selectAttributeDistribution.attributeDistribution.balanced.description",
    standard: "QUICKNPC.step.selectAttributeDistribution.attributeDistribution.standard.description",
    specialized: "QUICKNPC.step.selectAttributeDistribution.attributeDistribution.specialized.description",
    hyperSpecialized: "QUICKNPC.step.selectAttributeDistribution.attributeDistribution.hyperSpecialized.description",
}

const attributeDistributionDone = "attributeDistributionDone"

export class SelectAttributeDistributionStep extends AbstractStep {

    /** @type AttributeDistribution */
    #attributeDistribution;

    constructor(formValues) {
        super(formValues);
        this.#attributeDistribution = formValues.selected ?? "balanced";
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    static getTemplateData(formValues, current, context) {
        const selected = formValues.selected ?? "balanced";
        return {
            step: "QUICKNPC.step.selectAttributeDistribution.name",
            options: attributesDistributionLabels,
            selected: selected,
            description: attributesDistributionDescriptions[selected]
        }
    }

    static shouldActivate(current, value, context) {
        return !context[attributeDistributionDone]
    }

    apply(model, context) {
        if (!(this.#attributeDistribution in attributeDistributions)) {
            return false
        } else {
            context[attributeDistributionDone] = true

            if (this.#attributeDistribution === "balanced") {
                model.updateSource({
                    attributes: {
                        ins: "d8",
                        dex: "d8",
                        mig: "d8",
                        wlp: "d8",
                    }
                });
                ConfigureAttributesStep.setAttributeArray(context, false);
            } else {
                ConfigureAttributesStep.setAttributeArray(context, attributeDistributions[this.#attributeDistribution]);
            }

            return model;
        }
    }

}