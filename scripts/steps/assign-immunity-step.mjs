import {CONSTANTS} from "../constants.mjs";
import {AbstractAssignAffinityStep} from "./abstract-assign-affinity-step.mjs";

const allDamageTypes = Object.keys(CONSTANTS.damageTypes)

const immunitiesKey = "immunities"

export class AssignImmunityStep extends AbstractAssignAffinityStep {

    static get stepName() {
        return "QUICKNPC.step.assignAffinity.immunity"
    }

    static getOptions(model, context) {
        const validAffinities = ["vul", "", "res"]
        return context[immunitiesKey][0].filter(damageType => validAffinities.includes(model.affinities[damageType]))
    }

    static addImmunity(context, options = allDamageTypes) {
        options = options.filter(value => allDamageTypes.includes(value))
        context[immunitiesKey] ??= [];
        context[immunitiesKey].push(options)
    }

    static shouldActivate(current, value, context) {
        return context[immunitiesKey]?.length
    }

    doApply(value, context) {
        if (["imm", "abs"].includes(value.affinities[this.damageType])) {
            return false
        } else {
            value.affinities[this.damageType] = "imm";
            context[immunitiesKey].shift();
            return value;
        }
    }
}