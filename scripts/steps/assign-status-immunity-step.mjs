import {AbstractStep} from "./abstract-step.mjs";
import {CONSTANTS} from "../constants.mjs";

/** @type StatusEffect[] */
const allStatuses = Object.keys(CONSTANTS.statusEffects)

const statusKey = "statusImmunities"

export class AssignStatusImmunityStep extends AbstractStep {

    /** @type DamageType */
    #status

    constructor(formData) {
        super(formData);
        this.#status = formData.get("selected");
    }

    static get template() {
        return 'QUICKNPC.step.singleSelect';
    }

    static getTemplateData(formData, current, context) {
        /** @type StatusEffect[] */
        const allOptions = context[statusKey][0];

        const options = Object.fromEntries(allOptions.filter(status => !current.statusImmunities[status])
            .map(option => [option, CONSTANTS.statusEffects[option]]))

        return {
            step: "QUICKNPC.step.assignStatusImmunity.name",
            options: options,
            selected: formData.get("selected"),
            emptyOption: "QUICKNPC.step.assignStatusImmunity.blank"
        }
    }

    static addStatusImmunity(context, options = allStatuses) {
        options = options.filter(value => allStatuses.includes(value))
        context[statusKey] ??= [];
        context[statusKey].push(options)
    }

    static shouldActivate(current, value, context) {
        return context[statusKey]?.length
    }

    apply(model, context) {
        if (!this.#status || model.statusImmunities[this.#status]) {
            return false;
        } else {
            model.statusImmunities[this.#status] = true;
            context[statusKey].shift();
            return model;
        }
    }
}