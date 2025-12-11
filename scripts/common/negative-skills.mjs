import { CONSTANTS } from '../constants.mjs';
import { Rules } from './rules.mjs';
import { pick } from './utils.mjs';
import { CommonSkills } from './skills.mjs';
import { ChooseRoleSkillStep } from '../wizard/steps/choose-role-skill-step.mjs';
import { Role } from '../wizard/roles/role.mjs';

/**
 * @type {SkillOptions}
 */
const negativeSkills = {
  bossSkillNone: CommonSkills.none,
  finalDetonation: {
    label: 'QUICKNPC.negativeSkills.finalDetonation.name',
    description: 'QUICKNPC.negativeSkills.finalDetonation.description',
    choices: {
      damageType: {
        label: 'QUICKNPC.commonChoices.damageType',
        options: CONSTANTS.damageTypes,
      },
    },
    apply: (model, context, { damageType }) => {
      model.rules.finalDetonation = Rules.simpleRule('QUICKNPC.negativeSkills.finalDetonation', {
        damageType: game.i18n.localize(CONSTANTS.damageTypes[damageType]),
      });
      ChooseRoleSkillStep.addRoleSkill(context, Role.getRole(context).roleSkills);
    },
  },
  finalRestore: {
    label: 'QUICKNPC.negativeSkills.finalRestore.name',
    description: 'QUICKNPC.negativeSkills.finalRestore.description',
    choices: {
      resource: {
        label: 'QUICKNPC.commonChoices.resource',
        options: pick(CONSTANTS.resources, 'hp', 'mp'),
      },
    },
    apply: (model, context, { resource }) => {
      model.rules.finalRestore = Rules.simpleRule('QUICKNPC.negativeSkills.finalRestore', {
        resource: game.i18n.localize(CONSTANTS.resources[resource]),
      });
      ChooseRoleSkillStep.addRoleSkill(context, Role.getRole(context).roleSkills);
    },
  },
  painfulMissNoAttackChoice: {
    label: 'QUICKNPC.negativeSkills.painfulMiss.name',
    description: 'QUICKNPC.negativeSkills.painfulMiss.description',
    choices: {
      target: {
        label: 'QUICKNPC.negativeSkills.painfulMiss.target.label',
        options: {
          self: 'QUICKNPC.negativeSkills.painfulMiss.target.self.label',
          ally: 'QUICKNPC.negativeSkills.painfulMiss.target.ally.label',
        },
      },
    },
    disallow: {
      attack: 'strong',
    },
    apply: (model, context, { target }) => {
      model.rules.painfulMiss = Rules.simpleRule('QUICKNPC.negativeSkills.painfulMiss', {
        attack: model.attacks.normal.name,
        target: game.i18n.localize(`QUICKNPC.negativeSkills.painfulMiss.target.${target}.rule`),
      });
      ChooseRoleSkillStep.addRoleSkill(context, Role.getRole(context).roleSkills);
    },
  },
  painfulMissAttackChoice: {
    label: 'QUICKNPC.negativeSkills.painfulMiss.name',
    description: 'QUICKNPC.negativeSkills.painfulMiss.description',
    choices: {
      attack: {
        label: 'QUICKNPC.negativeSkills.painfulMiss.attack.label',
        options: {
          normal: 'QUICKNPC.negativeSkills.painfulMiss.attack.normal',
          strong: 'QUICKNPC.negativeSkills.painfulMiss.attack.strong',
        },
      },
      target: {
        label: 'QUICKNPC.negativeSkills.painfulMiss.target.label',
        options: {
          self: 'QUICKNPC.negativeSkills.painfulMiss.target.self.label',
          ally: 'QUICKNPC.negativeSkills.painfulMiss.target.ally.label',
        },
      },
    },
    require: {
      attack: 'strong',
    },
    apply: (model, context, { attack, target }) => {
      model.rules.painfulMiss = Rules.simpleRule('QUICKNPC.negativeSkills.painfulMiss', {
        attack: model.attacks[attack].name,
        target: game.i18n.localize(`QUICKNPC.negativeSkills.painfulMiss.target.${target}.rule`),
      });
      ChooseRoleSkillStep.addRoleSkill(context, Role.getRole(context).roleSkills);
    },
  },
};

export const NegativeSkills = {
  list: negativeSkills,
};
