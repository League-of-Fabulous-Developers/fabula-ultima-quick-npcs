import {AbstractStep} from "./abstract-step.mjs";
import {Role} from "../roles/role.mjs";
import {NpcModel} from "../common/npc-model.mjs";

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

    constructor(formData) {
        super(formData);
        this.#level = Number(formData.get("selected"))
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    static getTemplateData(formData, current, context) {
        return {
            step: "QUICKNPC.step.selectLevel.name",
            options: levels,
            selected: formData.get("selected"),
            emptyOption: "QUICKNPC.step.selectLevel.blank"
        }
    }

    static shouldActivate(current, value, context) {
        return !context[levelSelectDone]
    }

    apply(model, context) {
        if (!this.#level || !levels[this.#level]) {
            return false
        } else {
            context[levelSelectDone] = true
            model.level = this.#level;
            const role = Role.getRole(context);

            role.attributeChanges.slice(0, Math.floor(model.level / 20))
                .forEach(change => Object.assign(model.attributes, change))

            role.skillsByLevel.slice(0, Math.floor(model.level / 10))
                .forEach(apply => apply(model, context))

            model.bonuses.accuracy += Math.floor(model.level / 10)
            model.bonuses.magic += Math.floor(model.level / 10)

            NpcModel.updateDerivedValues(model)
            return model;
        }
    }
}