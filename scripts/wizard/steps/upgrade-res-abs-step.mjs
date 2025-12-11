import {AbstractAssignAffinityStep} from "./abstract-assign-affinity-step.mjs";

/**
 * @param {AffinityModel} affinity
 * @return boolean
 */
const validAffinity = (affinity) => {
    return affinity.res && affinity.value === "res"
}

const upgradeResToAbsKey = "upgradeResToAbs"

export class UpgradeResToAbsStep extends AbstractAssignAffinityStep {

    static get stepName() {
        return "QUICKNPC.step.assignAffinity.upgradeResToAbs"
    }

    static getOptions(model, context) {
        return Object.entries(model.affinities)
            .filter(([, value]) => validAffinity(value))
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
        if (!validAffinity(affinity)) {
            return false
        } else {
            affinity.updateSource({abs: true});
            context[upgradeResToAbsKey] -= 1;
            return value;
        }
    }
}