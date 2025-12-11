import {AbstractStep} from "../../stepper/abstract-step.mjs";
import {unallocatedSkills} from "../designer-steps.mjs";
import {UpgradeAttributeStep} from "./upgrade-attribute-step.mjs";

const levels = {
    "5": "5",
    "10": "10",
    "20": "20",
    "30": "30",
    "40": "40",
    "50": "50",
    "60": "60"
};

const levelSelectDone = "levelSelectDone"

export class SelectLevelStep extends AbstractStep {

    #level

    constructor(formValues) {
        super(formValues);
        this.#level = Number(formValues.selected)
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    static getTemplateData(formValues, current, context) {
        return {
            step: "QUICKNPC.step.selectLevel.name",
            options: levels,
            selected: formValues.selected,
            emptyOption: "QUICKNPC.step.selectLevel.blank"
        }
    }

    static shouldActivate(current, value, context) {
        return !context[levelSelectDone]
    }

    /**
     * @param context
     */
    static initContext(context) {
        context[unallocatedSkills] = 0;
    }

    apply(model, context) {
        if (!this.#level || !levels[this.#level]) {
            return false
        } else {
            context[levelSelectDone] = true
            model.updateSource({level: this.#level});
            context[unallocatedSkills] += Math.floor(model.level / 10)
            UpgradeAttributeStep.setAvailableAttributeUpgrades(context, Math.floor(model.level / 20))
            return model;
        }
    }

}