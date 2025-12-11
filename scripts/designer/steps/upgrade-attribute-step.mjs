import {AbstractStep} from "../../stepper/abstract-step.mjs";

/**
 * @typedef {"d6","d8","d10","d12"} AttributeDice
 */

/**
 * @typedef {"balanced", "standard", "specialized", "hyperSpecialized"} AttributeDistribution
 */

const upgradeLadder = {
    d6: "d8",
    d8: "d10",
    d10: "d12"
}

const attributeLabels = {
    ins: "QUICKNPC.step.upgradeAttribute.attribute.ins",
    dex: "QUICKNPC.step.upgradeAttribute.attribute.dex",
    mig: "QUICKNPC.step.upgradeAttribute.attribute.mig",
    wlp: "QUICKNPC.step.upgradeAttribute.attribute.wlp"
}

const attributeUpgradesKey = "attributeUpgrades"

export class UpgradeAttributeStep extends AbstractStep {

    #upgradedAttribute;

    constructor(formValues) {
        super(formValues);
        this.#upgradedAttribute = formValues.selected;
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    static getTemplateData(formValues, current, context) {
        const options = Object.fromEntries(Object.entries(current.attributes)
            .filter(([, dice]) => dice in upgradeLadder)
            .map(([attribute]) => [attribute, attributeLabels[attribute]]))
        return {
            step: "QUICKNPC.step.upgradeAttribute.name",
            options: options,
            selected: formValues.selected,
            emptyOption: "QUICKNPC.step.upgradeAttribute.blank"
        }

    }

    static shouldActivate(current, value, context) {
        return context[attributeUpgradesKey] > 0;
    }

    apply(model, context) {
        if (!this.#upgradedAttribute || !(model.attributes[this.#upgradedAttribute] in upgradeLadder)) {
            return false
        } else {
            context[attributeUpgradesKey] -= 1;
            model.updateSource({
                attributes: {
                    [this.#upgradedAttribute]: upgradeLadder[model.attributes[this.#upgradedAttribute]],
                }
            })

            return model;
        }
    }

    /**
     * @param {Object} context
     * @param {number} attributeUpgrades
     */
    static setAvailableAttributeUpgrades(context, attributeUpgrades) {
        if (!Number.isInteger(attributeUpgrades)) {
            throw new Error("attributeUpgrades must be an integer, was: " + attributeUpgrades);
        }
        context[attributeUpgradesKey] = attributeUpgrades;
    }
}