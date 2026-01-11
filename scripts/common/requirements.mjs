import { Customizations } from './customizations.mjs';

/**
 * @callback CustomRequirement
 * @param {NpcDataModel} model
 * @param {Object} context
 * @return boolean
 */

/**
 * @typedef Requirements
 * @property {boolean} [anyResistance]
 * @property {boolean} [anyImmunity]
 * @property {boolean} [anyNeutral]
 * @property {Rank[]} [rank]
 * @property {string} [attack]
 * @property {string[], "*"} [anySpell]
 * @property {string[], "*"} [anyRule]
 * @property {string[], "*"} [anyAction]
 * @property {string[], "*"} [anyCustomization]
 * @property {CustomRequirement} [custom]
 * @property {number} level
 */

/**
 * @param {Requirements} require
 * @param {Requirements} disallow
 * @param {NpcDataModel} model
 * @param context
 * @return boolean
 */
export function checkPrerequisites(require, disallow, model, context) {
  return checkRequire(require, model, context) && checkDisallow(disallow, model, context);
}

/**
 * @param {Requirements} requirements
 * @param {NpcDataModel} model
 * @param context
 * @return {boolean}
 */
function evaluateRequirements(requirements, model, context) {
  const evaluation = {};

  if (requirements.anyResistance) {
    evaluation.anyResistance = Object.values(model.affinities).some((damageType) => damageType.value === 'res');
  }

  if (requirements.anyImmunity) {
    evaluation.anyImmunity = Object.values(model.affinities).some((damageType) => damageType.value === 'imm');
  }

  if (requirements.anyNeutral) {
    evaluation.anyNeutral = Object.values(model.affinities).some(
      (damageType) => damageType.value === '' && !damageType.vul,
    );
  }

  if (requirements.attack) {
    evaluation.attack = !!model.attacks[requirements.attack];
  }

  if (requirements.rank) {
    evaluation.rank = requirements.rank.includes(model.rank);
  }

  if (requirements.anySpell) {
    if (requirements.anySpell === '*') {
      evaluation.anySpell = Object.entries(model.spells).length > 0;
    } else {
      evaluation.anySpell = requirements.anySpell.some((spell) => !!model.spells[spell]);
    }
  }

  if (requirements.anyRule) {
    if (requirements.anyRule === '*') {
      evaluation.anyRule = Object.entries(model.rules).length > 0;
    } else {
      evaluation.anyRule = requirements.anyRule.some((rule) => !!model.rules[rule]);
    }
  }

  if (requirements.anyAction) {
    if (requirements.anyAction === '*') {
      evaluation.anyAction = Object.entries(model.actions).length > 0;
    } else {
      evaluation.anyAction = requirements.anyAction.some((action) => !!model.actions[action]);
    }
  }

  if (requirements.anyCustomization) {
    evaluation.anyCustomization = requirements.anyCustomization.some((customization) =>
      Customizations.checkApplied(context, customization),
    );
  }

  if (requirements.level) {
    evaluation.level = model.level >= requirements.level;
  }

  if (requirements.custom instanceof Function) {
    evaluation.custom = requirements.custom(model, context);
  }

  return evaluation;
}

/**
 * @param {Requirements} require
 * @param {NpcDataModel} model
 * @param context
 * @return {boolean}
 */
function checkRequire(require, model, context) {
  if (!require) return true;
  return Object.values(evaluateRequirements(require, model, context)).every(Boolean);
}

/**
 * @param {Requirements} disallow
 * @param {NpcDataModel} model
 * @param context
 * @return {boolean}
 */
function checkDisallow(disallow, model, context) {
  if (!disallow) return true;
  return !Object.values(evaluateRequirements(disallow, model, context)).some(Boolean);
}
