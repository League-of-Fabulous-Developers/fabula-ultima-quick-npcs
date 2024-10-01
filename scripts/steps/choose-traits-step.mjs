import {AbstractStep} from "./abstract-step.mjs";

const traitsDone = "traitsDone"

export class ChooseTraitsStep extends AbstractStep {

    #name
    #traits

    constructor(formData) {
        super(formData);
        this.#name = formData.get("name");
        this.#traits = formData.get("traits");
    }

    static get template() {
        return "QUICKNPC.step.chooseTraits"
    }

    static getTemplateData(formData, current, context) {
        return {
            name: formData.get("name") ?? current.name,
            traits: formData.get("traits"),
        }
    }

    static shouldActivate(current, value, context) {
        return !context[traitsDone]
    }

    apply(value, context) {
        context[traitsDone] = true;
        this.#name && (value.name = this.#name.trim() || value.name);
        this.#traits && (value.traits = this.#traits.trim() || value.traits);
        return value;
    }
}