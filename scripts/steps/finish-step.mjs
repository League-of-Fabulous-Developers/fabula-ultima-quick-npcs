import {AbstractStep} from "./abstract-step.mjs";

const finished = "finished"

export class FinishStep extends AbstractStep {
    constructor(formData) {
        super(formData);
    }

    static get template() {
        return "QUICKNPC.step.finish"
    }

    static getTemplateData(formData, current, context) {
        return {}
    }

    static shouldActivate(current, value, context) {
        return !context[finished];
    }

    apply(value, context) {
        context[finished] = true;
        return value;
    }
}