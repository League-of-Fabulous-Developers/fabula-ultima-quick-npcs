import { CONSTANTS } from '../constants.mjs';
import { Actions } from './actions.mjs';
import { Rules } from './rules.mjs';
import { pick } from './utils.mjs';

/**
 * @type {SkillOptions}
 */
const bossSkills = {
  corrosiveStatus: {
    label: 'QUICKNPC.bossSkills.corrosiveStatus.name',
    description: 'QUICKNPC.bossSkills.corrosiveStatus.description',
    choices: {
      damageType: {
        label: 'QUICKNPC.commonChoices.damageType',
        options: CONSTANTS.damageTypes,
      },
      status: {
        label: 'QUICKNPC.commonChoices.status',
        options: CONSTANTS.statusEffects,
      },
    },
    apply: (model, context, choices) => {
      model.actions.corrosiveStatus = Actions.simpleAction('QUICKNPC.bossSkills.corrosiveStatus', {
        damageType: game.i18n.localize(CONSTANTS.damageTypes[choices.damageType]),
        status: game.i18n.localize(CONSTANTS.statusEffects[choices.status]),
      });
    },
  },
  crushingAdvantage: {
    label: 'QUICKNPC.bossSkills.crushingAdvantage.name',
    description: 'QUICKNPC.bossSkills.crushingAdvantage.description',
    apply: (model) => {
      model.rules.crushingAdvantage = Rules.simpleRule('QUICKNPC.bossSkills.crushingAdvantage');
    },
  },
  elementalCrisis: {
    label: 'QUICKNPC.bossSkills.elementalCrisis.name',
    description: 'QUICKNPC.bossSkills.elementalCrisis.description',
    apply: (model) => {
      model.rules.elementalCrisis = Rules.simpleRule('QUICKNPC.bossSkills.elementalCrisis');
    },
  },
  partRegeneration: {
    label: 'QUICKNPC.bossSkills.partRegeneration.name',
    description: 'QUICKNPC.bossSkills.partRegeneration.description',
    apply: (model) => {
      model.rules.partRegeneration = Rules.simpleRule('QUICKNPC.bossSkills.partRegeneration');
    },
  },
  temporaryDefenses: {
    label: 'QUICKNPC.bossSkills.temporaryDefenses.name',
    description: 'QUICKNPC.bossSkills.temporaryDefenses.description',
    choices: {
      defense: {
        label: 'QUICKNPC.bossSkills.temporaryDefenses.choice',
        options: {
          def: 'QUICKNPC.bossSkills.temporaryDefenses.def',
          mDef: 'QUICKNPC.bossSkills.temporaryDefenses.mDef',
        },
      },
    },
    apply: (model, context, { defense }) => {
      model.rules.temporaryDefenses = Rules.simpleRule('QUICKNPC.bossSkills.temporaryDefenses', {
        defense: game.i18n.localize(`QUICKNPC.bossSkills.temporaryDefenses.${defense}`),
        value: 12 + Math.floor(model.level / 20),
      });
    },
  },
  zombification: {
    label: 'QUICKNPC.bossSkills.zombification.name',
    description: 'QUICKNPC.bossSkills.zombification.description',
    choices: {
      status: {
        label: 'QUICKNPC.commonChoices.status',
        options: pick(CONSTANTS.statusEffects, 'weak', 'poisoned'),
      },
    },
    apply: (model, context, { status }) => {
      model.rules.zombification = Rules.simpleRule('QUICKNPC.bossSkills.zombification', {
        status: game.i18n.localize(CONSTANTS.statusEffects[status]),
      });
    },
  },
};

export const BossSkills = {
  list: bossSkills,
};
