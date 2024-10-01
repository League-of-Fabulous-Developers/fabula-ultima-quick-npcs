import {AbstractAssignAffinityStep} from "./abstract-assign-affinity-step.mjs";

const upgradeImmToAbsKey = "upgradeImmToAbs"

export class UpgradeImmToAbsStep extends AbstractAssignAffinityStep {

    static get stepName() {
        return "QUICKNPC.step.assignAffinity.upgradeImmToAbs"
    }

    static getOptions(model, context) {
        return Object.entries(model.affinities)
            .filter(([, value]) => value === "imm")
            .map(([key]) => key)
    }

    static addUpgrade(context) {
        context[upgradeImmToAbsKey] ??= 0;
        context[upgradeImmToAbsKey] += 1;
    }

    static shouldActivate(current, value, context) {
        return context[upgradeImmToAbsKey];
    }


    doApply(value, context) {
        const affinity = value.affinities[this.damageType];
        if (affinity !== "imm") {
            return false
        } else {
            value.affinities[this.damageType] = "abs"
            context[upgradeImmToAbsKey] -= 1;
            return value;
        }
    }
}