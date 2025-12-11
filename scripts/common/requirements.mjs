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
 * @property {string[]} [anyRule]
 * @property {string[]} [anyAction]
 * @property {string[]} [anyCustomization]
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
 * @param {Requirements} require
 * @param {NpcDataModel} model
 * @param context
 * @return {boolean}
 */
function checkRequire(require, model, context) {
  if (!require) return true;
  let met = true;

  if (require.anyResistance) {
    met = met && Object.values(model.affinities).some((damageType) => damageType.value === 'res');
  }

  if (require.anyImmunity) {
    met = met && Object.values(model.affinities).some((damageType) => damageType.value === 'imm');
  }

  if (require.anyNeutral) {
    met = met && Object.values(model.affinities).some((damageType) => damageType.value === '' && !damageType.vul);
  }

  if (require.attack) {
    met = met && !!model.attacks[require.attack];
  }

  if (require.rank) {
    met = met && require.rank.includes(model.rank);
  }

  if (require.anyRule) {
    met = met && require.anyRule.some((rule) => !!model.rules[rule]);
  }

  if (require.anyAction) {
    met = met && require.anyAction.some((action) => !!model.actions[action]);
  }

  if (require.anyCustomization) {
    met = met && require.anyCustomization.some((customization) => Customizations.checkApplied(context, customization));
  }

  if (require.level) {
    met = met && model.level >= require.level;
  }

  if (require.custom instanceof Function) {
    met = met && require.custom(model, context);
  }

  return met;
}

/**
 * @param {Requirements} disallow
 * @param {NpcDataModel} model
 * @param context
 * @return {boolean}
 */
function checkDisallow(disallow, model, context) {
  if (!disallow) return true;
  return !checkRequire(disallow, model, context);
}
