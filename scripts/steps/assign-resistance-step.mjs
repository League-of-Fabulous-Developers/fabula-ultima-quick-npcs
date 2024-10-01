import {CONSTANTS} from "../constants.mjs";
import {AbstractAssignAffinityStep} from "./abstract-assign-affinity-step.mjs";

const allDamageTypes = Object.keys(CONSTANTS.damageTypes)

const resistancesKey = "resistances";

export class AssignResistanceStep extends AbstractAssignAffinityStep {

    static get stepName() {
        return "QUICKNPC.step.assignAffinity.resistance"
    }

    static getOptions(model, context) {
        const validAffinities = ["vul", ""]
        return context[resistancesKey][0].filter(damageType => validAffinities.includes(model.affinities[damageType]))
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
        if (["res", "imm", "abs"].includes(affinity)) {
            return false
        } else {
            if (affinity === "vul") {
                value.affinities[this.damageType] = ""
            } else {
                value.affinities[this.damageType] = "res"
            }
            context[resistancesKey].shift();
            return value;
        }
    }
}