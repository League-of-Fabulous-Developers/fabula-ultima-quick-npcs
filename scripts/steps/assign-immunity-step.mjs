import {CONSTANTS} from "../constants.mjs";
import {AbstractAssignAffinityStep} from "./abstract-assign-affinity-step.mjs";

/**
 * @param {AffinityModel} affinity
 * @return boolean
 */
const validAffinity = (affinity) => {
    return !affinity.abs && !affinity.imm && !affinity.res && !affinity.vul
}

const allDamageTypes = Object.keys(CONSTANTS.damageTypes)

const immunitiesKey = "immunities"

export class AssignImmunityStep extends AbstractAssignAffinityStep {

    static get stepName() {
        return "QUICKNPC.step.assignAffinity.immunity"
    }

    static getOptions(model, context) {
        return context[immunitiesKey][0].filter(damageType => {
            const affinity = model.affinities[damageType];
            return validAffinity(affinity)
        })
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
        const affinity = value.affinities[this.damageType];
        if (!validAffinity(affinity)) {
            return false
        } else {
            affinity.imm = true;
            context[immunitiesKey].shift();
            return value;
        }
    }
}