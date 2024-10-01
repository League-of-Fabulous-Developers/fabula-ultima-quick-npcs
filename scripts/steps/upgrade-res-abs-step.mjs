import {AbstractAssignAffinityStep} from "./abstract-assign-affinity-step.mjs";

const upgradeResToAbsKey = "upgradeResToAbs"

export class UpgradeResToAbsStep extends AbstractAssignAffinityStep {

    static get stepName() {
        return "QUICKNPC.step.assignAffinity.upgradeResToAbs"
    }

    static getOptions(model, context) {
        return Object.entries(model.affinities)
            .filter(([, value]) => value === "res")
            .map(([key]) => key)
    }

    static addUpgrade(context) {
        context[upgradeResToAbsKey] ??= 0;
        context[upgradeResToAbsKey] += 1;
    }

    static shouldActivate(current, value, context) {
        return context[upgradeResToAbsKey];
    }


    doApply(value, context) {
        const affinity = value.affinities[this.damageType];
        if (affinity !== "res") {
            return false
        } else {
            value.affinities[this.damageType] = "abs"
            context[upgradeResToAbsKey] -= 1;
            return value;
        }
    }
}