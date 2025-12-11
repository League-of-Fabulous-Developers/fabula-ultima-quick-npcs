import { AbstractAssignAffinityStep } from './abstract-assign-affinity-step.mjs';

/**
 * @param {AffinityDataModel} affinity
 * @return boolean
 */
const validAffinity = (affinity) => {
  return !affinity.abs && affinity.imm;
};

const upgradeImmToAbsKey = 'upgradeImmToAbs';

export class UpgradeImmToAbsStep extends AbstractAssignAffinityStep {
  static get stepName() {
    return 'QUICKNPC.step.assignAffinity.upgradeImmToAbs';
  }

  static getOptions(model, context) {
    return Object.entries(model.affinities)
      .filter(([, value]) => validAffinity(value))
      .map(([key]) => key);
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
    if (!validAffinity(affinity)) {
      return false;
    } else {
      affinity.updateSource({ abs: true });
      context[upgradeImmToAbsKey] -= 1;
      return value;
    }
  }
}
