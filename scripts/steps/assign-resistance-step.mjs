import {CONSTANTS} from "../constants.mjs";
import {AbstractAssignAffinityStep} from "./abstract-assign-affinity-step.mjs";

/**
 * @param {AffinityModel} affinity
 * @return boolean
 */
const validAffinity = (affinity) => {
    return !affinity.abs && !affinity.imm && !affinity.res && (!affinity.vul || affinity.vul === "species")
}

const allDamageTypes = Object.keys(CONSTANTS.damageTypes)

const resistancesKey = "resistances";

export class AssignResistanceStep extends AbstractAssignAffinityStep {

    static get stepName() {
        return "QUICKNPC.step.assignAffinity.resistance"
    }

    static getOptions(model, context) {
        return context[resistancesKey][0].filter(damageType => {
            const affinity = model.affinities[damageType];
            return validAffinity(affinity)
        })
    }

    /**
     * @param context
     * @param {DamageType[]} options
     */
    static addResistance(context, options = allDamageTypes) {
        options = options.filter(value => allDamageTypes.includes(value))
        context[resistancesKey] ??= []
        context[resistancesKey].push(options)
    }

    static shouldActivate(current, value, context) {
        return context[resistancesKey]?.length;
    }

    doApply(value, context) {
        const affinity = value.affinities[this.damageType];
        if (!validAffinity(affinity)) {
            return false
        } else {
            affinity.res = true
            context[resistancesKey].shift();
            return value;
        }
    }
}