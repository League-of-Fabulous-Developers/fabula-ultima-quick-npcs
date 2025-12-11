/**
 * @typedef Changes
 * @property {JsonModel} model
 * @property {Step[]} steps
 * @property {ConditionalChange[]} conditional
 */

/**
 * @typedef ConditionalChange
 * @property {string} choice
 * @property {string[]} values
 * @property {{model: JsonModel, steps: Step[]}} changes
 */

/**
 * @typedef JsonModel
 * @property {number} bonuses.[hp]
 * @property {number} bonuses.[mp]
 * @property {number} bonuses.[def]
 * @property {number} bonuses.[mDef]
 * @property {number} bonuses.[init]
 * @property {number} bonuses.[accuracy]
 * @property {number} bonuses.[magic]
 * @property {Record<DamageType, JsonAffinity>} affinities
 * @property {Record<StatusEffect, boolean>} statusImmunities
 * @property {Record<string, JsonAttack>} attacks
 * @property {Record<string, Action>} actions
 * @property {Record<string, Spell>} spells
 * @property {Record<string, Rule>} rules
 */

/**
 * @typedef {"vul", "", "res", "imm", "abs"} JsonAffinity
 */

/**
 * @typedef JsonAttack
 * @property {string} name
 * @property {"melee", "ranged"} range
 * @property {[Attribute, Attribute]} attributes
 * @property {number} accuracy
 * @property {number} baseDamage
 * @property {DamageType} damageType
 * @property {"def", "mDef"} targetDefense
 * @property {string[]} special
 */

/**
 * @typedef Step
 * @property {string} type
 */

import { AssignSpeciesVulnerabilityStep } from './steps/assign-species-vulnerability-step.mjs';
import { AssignImmunityStep } from './steps/assign-immunity-step.mjs';
import { AssignResistanceStep } from './steps/assign-resistance-step.mjs';
import { AssignVulnerabilityStep } from './steps/assign-vulnerability-step.mjs';
import { UpgradeResToAbsStep } from './steps/upgrade-res-abs-step.mjs';
import { UpgradeImmToAbsStep } from './steps/upgrade-imm-abs-step.mjs';
import { AssignStatusImmunityStep } from './steps/assign-status-immunity-step.mjs';
import { ConditionalBonusSkillStep } from './steps/conditional-bonus-skill-step.mjs';
import { ChooseCustomizationStep } from './steps/choose-customization-step.mjs';
import { ConfigureAttackStep } from './steps/configure-attack-step.mjs';
import { ChooseSpellStep } from './steps/choose-spell-step.mjs';
import { ChooseRoleSkillStep } from './steps/choose-role-skill-step.mjs';
import { Role } from './roles/role.mjs';
import { CONSTANTS } from '../constants.mjs';
import { Spells } from '../common/spells.mjs';

/**
 * @type {Record<string, (AffinityDataModel, boolean) => void>}
 */
const applyAffinity = new Proxy(
  {
    vul: (model, speciesVuln) => (model.vul = speciesVuln ? 'species' : true),
    res: (model) => (model.res = true),
    imm: (model) => (model.imm = true),
    abs: (model) => (model.abs = true),
  },
  {
    get(target, p, receiver) {
      if (Reflect.has(target, p)) {
        return Reflect.get(target, p, receiver);
      } else {
        return () => {};
      }
    },
  },
);

const isCheckDefinition = (value) => {
  return value.length === 2 && value.every((e) => e in CONSTANTS.attributes);
};

/**
 * @param {object} model
 * @param {object} jsonModel
 * @param {object} choices
 */
function applySimple(model, jsonModel, choices) {
  Object.entries(jsonModel).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const dupe = foundry.utils
        .duplicate(value)
        .map((element) => (typeof element === 'string' ? game.i18n.format(element, choices) : element));
      if (Array.isArray(model[key])) {
        if (isCheckDefinition(value) && isCheckDefinition(model[key])) {
          // check attribute special handling
          model[key] = value;
        } else {
          model[key].push(...dupe);
        }
      } else {
        model[key] = dupe;
      }
    } else if (typeof value === 'object') {
      model[key] ??= {};
      applySimple(model[key], value, choices);
    } else if (typeof value === 'number') {
      model[key] ??= 0;
      model[key] += value;
    } else if (typeof value === 'string') {
      model[key] = game.i18n.format(value, choices);
    } else {
      model[key] = foundry.utils.duplicate(value);
    }
  });
}

/**
 * @param {NpcDataModel} model
 * @param {JsonModel} jsonModel
 * @param {object} choices
 * @param {boolean} vulnAsSpeciesVuln
 */
function applyToModel(model, jsonModel, choices, vulnAsSpeciesVuln) {
  for (const key of ['bonuses', 'statusImmunities', 'attacks', 'spells', 'actions', 'rules']) {
    if (jsonModel[key]) {
      applySimple(model[key], jsonModel[key], choices);
    }
  }
  if (jsonModel.affinities) {
    Object.entries(jsonModel.affinities).forEach(([element, affinity]) => {
      /** @type AffinityDataModel */
      const affinityModel = model.affinities[element];
      applyAffinity[affinity](affinityModel, vulnAsSpeciesVuln);
    });
  }
}

const stepMapping = {
  AssignSpeciesVulnerability: (context, step) =>
    AssignSpeciesVulnerabilityStep.addSpeciesVulnerability(context, step.options),
  AssignImmunity: (context, step) => AssignImmunityStep.addImmunity(context, step.options),
  AssignResistance: (context, step) => AssignResistanceStep.addResistance(context, step.options),
  AssignVulnerability: (context, step) => AssignVulnerabilityStep.addVulnerability(context, step.options),
  UpgradeResToAbs: (context) => UpgradeResToAbsStep.addUpgrade(context),
  UpgradeImmToAbs: (context) => UpgradeImmToAbsStep.addUpgrade(context),
  AssignStatusImmunity: (context, step) => AssignStatusImmunityStep.addStatusImmunity(context, step.options),
  ConditionalBonusSkill: (context, step, spellLists) =>
    ConditionalBonusSkillStep.addConditionalBonusSkill(context, {
      drawback: parseSkill(step.drawback, spellLists),
      options: Object.fromEntries(
        Object.entries(step.options).map(([key, value]) => [key, parseSkill(value, spellLists)]),
      ),
    }),
  ChooseCustomization: (context, step, spellLists) =>
    ChooseCustomizationStep.addCustomization(
      context,
      Object.fromEntries(Object.entries(step.options).map(([key, value]) => [key, parseSkill(value, spellLists)])),
    ),
  ConfigureAttack: (context, step, spellLists) => {
    const attack = step.attack;
    if (step.configure.attributes) {
      ConfigureAttackStep.configureAttributeChoice(context, attack, step.configure.attributes);
    }
    if (step.configure.damageType) {
      if (step.configure.damageType === true) {
        ConfigureAttackStep.configureDamageTypeChoice(context, attack);
      } else {
        ConfigureAttackStep.configureDamageTypeChoice(context, attack, step.configure.damageType);
      }
    }
    if (step.configure.range) {
      ConfigureAttackStep.configureRange(context, attack);
    }
    if (step.configure.special) {
      ConfigureAttackStep.configureSpecialChoice(
        context,
        attack,
        Object.fromEntries(
          Object.entries(step.configure.special).map(([key, value]) => [key, parseSkill(value, spellLists)]),
        ),
      );
    }
  },
  ChooseSpell: (context, step, spellLists) => {
    let spells;
    if (typeof step.spells === 'string') {
      spells = Object.fromEntries(
        Object.entries(spellLists[step.spells]).map(([key, value]) => [key, parseSpell(value, key)]),
      );
    } else {
      spells = Object.fromEntries(Object.entries(step.spells).map(([key, value]) => [key, parseSpell(value, key)]));
    }
    ChooseSpellStep.addSpell(context, spells);
  },
  ChooseRoleSkill: (context) => ChooseRoleSkillStep.addRoleSkill(context, Role.getRole(context).roleSkills),
};

function registerStep(step, context, spellLists) {
  return stepMapping[step.type](context, step, spellLists);
}

/**
 * @typedef JsonSpell
 * @property {string} name
 * @property {string} summary
 * @property {string} description
 * @property {number} cost
 * @property {"self", "single", "upToThree", "special"} target
 * @property {"total", "perTarget"} costType
 * @property {"instant", "scene"} duration
 * @property {string} opportunity
 * @property {true, {baseDamage: number, typeChoice: true | DamageType[]}} offensive
 * */

/**
 * @param {{steps?: Step[]}} data
 * @param {Record<string, Record<string, JsonSpell>>} spellLists
 * @param spellLists
 */
function validateSpellLists(data, spellLists) {
  if (data.steps) {
    for (let step of data.steps) {
      if (step.type === 'ChooseSpell') {
        if (typeof step.spells === 'string') {
          if (!spellLists[step.spells]) {
            ui.notifications.error(
              game.i18n.format('QUICKNPC.error.unknownSpellList', {
                spellList: step.spells,
              }),
            );
            throw new Error(`Unknown spell list: ${step.spells}`);
          }
        }
      }
    }
  }
}

/**
 * @param {Changes} data
 * @param {Record<string, Record<string, JsonSpell>>} spellLists
 * @param {boolean} vulnAsSpeciesVuln if vulnerabilities should be recorded as caused by species
 * @param {Record<string, NestedChoice>} skillChoices
 * @return ApplySkill
 */
export function parseChanges(data, spellLists = {}, vulnAsSpeciesVuln = false, skillChoices = {}) {
  validateSpellLists(data, spellLists);

  if (data.conditional) {
    for (const conditionalChange of data.conditional) {
      if (!(conditionalChange.choice in skillChoices)) {
        ui.notifications.error(
          game.i18n.format('QUICKNPC.error.unknownChoice', {
            choice: conditionalChange.choice,
          }),
        );
        throw new Error(`Unknown choice for conditional changes: ${conditionalChange.choice}`);
      } else {
        for (const value of conditionalChange.values) {
          if (!(value in skillChoices[conditionalChange.choice].options)) {
            ui.notifications.error(
              game.i18n.format('QUICKNPC.error.unknownChoiceOption', {
                choice: conditionalChange.choice,
                option: value,
              }),
            );
            throw new Error(`Unknown choice option for conditional changes: ${conditionalChange.choice} -> ${value}`);
          }
        }

        validateSpellLists(conditionalChange.changes, spellLists);
      }
    }
  }

  return (model, context, choices = {}) => {
    const changes = model.toObject(true);
    choices = Object.fromEntries(
      Object.entries(choices).map(([key, value]) => [
        key,
        game.i18n.localize(skillChoices[key]?.options[value] ?? value),
      ]),
    );
    if (data.model) {
      applyToModel(changes, data.model, choices, vulnAsSpeciesVuln);
    }
    if (data.steps) {
      data.steps.forEach((step) => registerStep(step, context, spellLists));
    }
    if (data.conditional) {
      for (const conditionalChange of data.conditional) {
        const choice = choices[conditionalChange.choice];
        if (conditionalChange.values.some((value) => value === choice)) {
          const changes = conditionalChange.changes;
          if (changes.model) {
            applyToModel(changes, data.model, choices, vulnAsSpeciesVuln);
          }
          if (changes.steps) {
            data.steps.forEach((step) => registerStep(step, context, spellLists));
          }
        }
      }
    }
    model.updateSource(changes);
  };
}

/**
 * @typedef JsonSkill
 * @property {string} label
 * @property {string} description
 * @property {Changes} changes
 * @property {Record<string, NestedChoice>} [choices]
 * @property {Requirements} [require]
 * @property {Requirements} [disallow]
 */

/**
 * @param {JsonSkill} jsonData
 * @param {Record<string, Record<string, JsonSpell>>} spellLists
 * @return Skill
 */
export function parseSkill(jsonData, spellLists = {}) {
  const { changes, ...skill } = jsonData;
  skill.apply = parseChanges(changes, spellLists, false, skill.choices);
  return skill;
}

const damageTypeKey = 'damageType';

/**
 * @param jsonData
 * @param {string} key
 * @return {Skill}
 */
function parseSpell(jsonData, key) {
  /** @type {Record<string, NestedChoice>} */
  const choicesForSpell = {};
  const spellChoices = { ...(jsonData.choices ?? {}) };

  let chooseDamageType = false;
  if (typeof jsonData.offensive === 'object' && typeof jsonData.offensive.damageType !== 'string') {
    chooseDamageType = true;
    if (jsonData.offensive.damageType === true) {
      choicesForSpell[damageTypeKey] = {
        label: 'QUICKNPC.commonChoices.damageType',
        options: CONSTANTS.damageTypes,
      };
    } else {
      choicesForSpell[damageTypeKey] = {
        label: 'QUICKNPC.commonChoices.damageType',
        options: Object.fromEntries(
          jsonData.offensive.damageType.map((damageType) => [damageType, CONSTANTS.damageTypes[damageType]]),
        ),
      };
    }
    delete spellChoices[damageTypeKey];
  }

  Object.assign(choicesForSpell, spellChoices);

  return {
    label: jsonData.name,
    description: jsonData.summary,
    choices: choicesForSpell,
    require: jsonData.require,
    disallow: jsonData.disallow,
    apply: (model, context, choices) => {
      choices = { ...choices };
      /** @type Spell */
      const spell = {
        name: '',
        summary: '',
        description: '',
        cost: jsonData.cost,
        costType: jsonData.costType,
        target: jsonData.target,
        duration: jsonData.duration,
        opportunity: '',
      };

      if (jsonData.offensive) {
        spell.offensive = {
          accuracy: 0,
          attributes: Spells.getAttributes(context),
        };
        if (typeof jsonData.offensive === 'object') {
          spell.offensive.damage = {
            base: jsonData.offensive.baseDamage,
            value: 0,
            type: jsonData.offensive.damageType,
          };
          if (chooseDamageType) {
            spell.offensive.damage.type = choices[damageTypeKey];
          }
        }
      }
      choices = Object.fromEntries(
        Object.entries(choices).map(([key, value]) => [
          key,
          game.i18n.localize(choicesForSpell[key]?.options[value] ?? value),
        ]),
      );
      spell.name = game.i18n.format(jsonData.name, choices);
      spell.summary = game.i18n.format(jsonData.summary, choices);
      spell.description = game.i18n.format(jsonData.description, choices);
      spell.opportunity = game.i18n.format(jsonData.opportunity ?? '', choices);
      model.updateSource({ [`spells.${key}`]: spell });
    },
  };
}
