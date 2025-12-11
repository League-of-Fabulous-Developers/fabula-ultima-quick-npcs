import { CONSTANTS } from '../constants.mjs';
import { ChooseSpellStep } from './steps/choose-spell-step.mjs';
import { unallocatedSkills } from './designer-steps.mjs';
import { Customizations } from '../common/customizations.mjs';

/** @type {SkillOptions} */
export const designerSkillList = {
  damageVulnerability: {
    label: 'QUICKNPC.designer.skill.damageVulnerability.label',
    description: 'QUICKNPC.designer.skill.damageResistance.description',
    require: {
      anyNeutral: true,
    },
    choices: {
      vulnerability: {
        label: 'QUICKNPC.designer.skill.damageVulnerability.choice.vulnerability.label',
        options: (model) =>
          Object.fromEntries(
            Object.entries(CONSTANTS.damageTypes).filter(([key]) => {
              let affinity = model.affinities[key];
              return affinity.value === '' && !affinity.vul;
            }),
          ),
      },
    },
    apply: (model, context, choices) => {
      const { vulnerability } = choices;
      model.updateSource({
        affinities: {
          [vulnerability]: { vul: true },
        },
      });

      // refund used and add gained skill
      context[unallocatedSkills] += vulnerability === 'physical' ? 3 : 2;
    },
  },
  crisisEffect: {
    label: 'QUICKNPC.designer.skill.crisisEffect.label',
    description: 'QUICKNPC.designer.skill.crisisEffect.description',
    choices: {
      name: {
        editor: 'textfield',
        label: 'QUICKNPC.designer.skill.crisisEffect.choices.name.label',
        defaultText: 'QUICKNPC.designer.skill.crisisEffect.choices.name.default',
      },
      text: {
        editor: 'editor',
        label: 'QUICKNPC.designer.skill.crisisEffect.choices.text.label',
        defaultText: 'QUICKNPC.designer.skill.crisisEffect.choices.text.default',
      },
    },
    apply: (model, context, choices) => {
      const ruleIndex = (context['ruleIndex'] ??= 0);
      const {
        name = game.i18n.localize('QUICKNPC.designer.skill.crisisEffect.choices.name.default'),
        text = game.i18n.localize('QUICKNPC.designer.skill.crisisEffect.choices.text.default'),
      } = choices;

      model.updateSource({
        rules: {
          [ruleIndex]: {
            name: name,
            description: `<p>${game.i18n.localize('QUICKNPC.designer.skill.crisisEffect.prefix')}</p>${text}`,
          },
        },
      });
    },
  },
  damageAbsorption: {
    label: 'QUICKNPC.designer.skill.damageAbsorption.label',
    description: 'QUICKNPC.designer.skill.damageAbsorption.description',
    require: {
      custom: (model) => {
        const validAffinities = new Set(['res', 'imm']);
        return Object.values(model.affinities).some((value) => validAffinities.has(value.value));
      },
    },
    choices: {
      absorption: {
        label: 'QUICKNPC.designer.skill.damageAbsorption.choices.absorption.label',
        options: (model) => {
          const validAffinities = new Set(['res', 'imm']);
          return Object.fromEntries(
            Object.entries(CONSTANTS.damageTypes).filter(([key]) => {
              const affinity = model.affinities[key];
              return validAffinities.has(affinity.value);
            }),
          );
        },
      },
    },
    apply: (model, context, choices) => {
      const { absorption } = choices;
      model.updateSource({
        affinities: {
          [absorption]: { abs: true },
        },
      });
    },
  },
  damageImmunity: {
    label: 'QUICKNPC.designer.skill.damageImmunity.label',
    description: 'QUICKNPC.designer.skill.damageImmunity.description',
    require: {
      anyResistance: true,
    },
    choices: {
      immunity: {
        label: 'QUICKNPC.designer.skill.damageImmunity.choices.immunity.label',
        options: (model) =>
          Object.fromEntries(
            Object.entries(CONSTANTS.damageTypes).filter(([key]) => {
              const affinity = model.affinities[key];
              return affinity.value === 'res';
            }),
          ),
      },
    },
    apply: (model, context, choices) => {
      const { immunity } = choices;
      model.updateSource({
        affinities: {
          [immunity]: { imm: true },
        },
      });
    },
  },
  damageResistance: {
    label: 'QUICKNPC.designer.skill.damageResistance.label',
    description: 'QUICKNPC.designer.skill.damageResistance.description',
    choices: {
      resistance1: {
        label: 'QUICKNPC.designer.skill.damageResistance.choices.resistance.label',
        options: (model) =>
          Object.fromEntries(
            Object.entries(CONSTANTS.damageTypes).filter(([key]) => {
              let affinity = model.affinities[key];
              return affinity.value === '' && !affinity.res;
            }),
          ),
        group: 'resistances',
      },
      resistance2: {
        options: (model) =>
          Object.fromEntries(
            Object.entries(CONSTANTS.damageTypes).filter(([key]) => {
              let affinity = model.affinities[key];
              return affinity.value === '' && !affinity.res;
            }),
          ),
        group: 'resistances',
      },
    },
    apply: (model, context, choices) => {
      const { resistance1, resistance2 } = choices;

      model.updateSource({
        affinities: {
          [resistance1]: { res: true },
          [resistance2]: { res: true },
        },
      });
    },
  },
  finalAct: {
    label: 'QUICKNPC.designer.skill.finalAct.label',
    description: 'QUICKNPC.designer.skill.finalAct.description',
    disallow: {
      anyRule: ['finalAct'],
    },
    choices: {
      name: {
        editor: 'textfield',
        label: 'QUICKNPC.designer.skill.finalAct.choices.name.label',
        defaultText: 'QUICKNPC.designer.skill.finalAct.choices.name.default',
      },
      text: {
        editor: 'editor',
        label: 'QUICKNPC.designer.skill.finalAct.choices.text.label',
        defaultText: 'QUICKNPC.designer.skill.finalAct.choices.text.default',
      },
    },
    apply: (model, context, choices) => {
      const {
        name = game.i18n.localize('QUICKNPC.designer.skill.finalAct.choices.name.default'),
        text = game.i18n.localize('QUICKNPC.designer.skill.finalAct.choices.text.default'),
      } = choices;

      model.updateSource({
        rules: {
          finalAct: {
            name: name,
            description: `<p>${game.i18n.localize('QUICKNPC.designer.skill.finalAct.prefix')}</p>${text}`,
          },
        },
      });
    },
  },
  flying: {
    label: 'QUICKNPC.commonSkills.flying.name',
    description: 'QUICKNPC.commonSkills.flying.description',
    disallow: {
      anyRule: ['flying'],
    },
    apply: (model) => {
      model.updateSource({
        rules: {
          flying: {
            name: game.i18n.localize('QUICKNPC.commonSkills.flying.name'),
            description: game.i18n.localize('QUICKNPC.commonSkills.flying.ruleText'),
            summary: game.i18n.localize('QUICKNPC.commonSkills.flying.description'),
          },
        },
      });
    },
  },
  improvedDamage: {
    label: 'QUICKNPC.designer.skill.upgradeDamage.label',
    description: 'QUICKNPC.designer.skill.upgradeDamage.description',
    choices: {
      upgradeTarget: {
        label: 'QUICKNPC.designer.skill.upgradeDamage.choices.upgradeTarget.label',
        options: (model, context) => {
          const options = {};
          Object.entries(model.attacks).forEach(([key, attack]) => (options[`attack|${key}`] = attack.name));

          Object.entries(model.spells)
            .filter(([, spell]) => !!spell?.offensive?.damage)
            .forEach(([key, spell]) => (options[`spell|${key}`] = spell.name));

          const alreadyImproved = context['damageAlreadyImproved'] ?? [];
          alreadyImproved.forEach((key) => delete options[key]);
          return options;
        },
      },
    },
    apply: (model, context, choices) => {
      const { upgradeTarget } = choices;
      (context['damageAlreadyImproved'] ??= []).push(upgradeTarget);

      const separatorIndex = upgradeTarget.indexOf('|');
      const type = upgradeTarget.substring(0, separatorIndex);
      const key = upgradeTarget.substring(separatorIndex + 1);

      const changes = {};
      if (type === 'attack') {
        changes.attacks = {
          [key]: {
            baseDamage: model.attacks[key].baseDamage + 5,
          },
        };
      }
      if (type === 'spell') {
        changes.spells = {
          [key]: {
            offensive: {
              damage: {
                base: model.spells[key].offensive.damage.base + 5,
              },
            },
          },
        };
      }

      model.updateSource(changes);
    },
  },
  improveDefense: {
    label: 'QUICKNPC.designer.skill.improveDefenses.label',
    description: 'QUICKNPC.designer.skill.improveDefenses.description',
    choices: {
      improvement: {
        label: 'QUICKNPC.designer.skill.improveDefenses.description.choices.improvement.label',
        options: (model, context) => {
          return ['defImprovement', 'mDefImprovement'].reduce((options, key) => {
            if (!Customizations.checkApplied(context, key)) {
              options[key] = `QUICKNPC.designer.skill.improveDefenses.description.choices.improvement.${key}`;
            }
            return options;
          }, {});
        },
      },
    },
    apply: (model, context, choices) => {
      const { improvement } = choices;
      const changes = {};

      if (improvement === 'defImprovement') {
        changes.bonuses = {
          def: 2,
          mDef: 1,
        };
      }

      if (improvement === 'mDefImprovement') {
        changes.bonuses = {
          def: 1,
          mDef: 2,
        };
      }

      model.updateSource(changes);
      Customizations.markApplied(context, improvement);
    },
  },
  improveHitPoints: {
    label: 'QUICKNPC.designer.skill.improveHitPoints.label',
    description: 'QUICKNPC.designer.skill.improveHitPoints.description',
    apply: (model) => {
      model.updateSource({
        bonuses: {
          hp: model.bonuses.hp + 10,
        },
      });
    },
  },
  improveInitiative: {
    label: 'QUICKNPC.designer.skill.improveInitiative.label',
    description: 'QUICKNPC.designer.skill.improveInitiative.description',
    disallow: {
      anyCustomization: ['improveInitiative'],
    },
    apply: (model, context) => {
      model.updateSource({
        bonuses: {
          init: model.bonuses.init + 4,
        },
      });
      Customizations.markApplied(context, 'improveInitiative');
    },
  },
  reaction: {
    label: 'QUICKNPC.designer.skill.reaction.label',
    description: 'QUICKNPC.designer.skill.reaction.description',
    choices: {
      name: {
        editor: 'textfield',
        label: 'QUICKNPC.designer.skill.reaction.choices.name.label',
        defaultText: 'QUICKNPC.designer.skill.reaction.choices.name.default',
      },
      trigger: {
        editor: 'textfield',
        label: 'QUICKNPC.designer.skill.reaction.choices.trigger.label',
        defaultText: 'QUICKNPC.designer.skill.reaction.choices.trigger.default',
      },
      text: {
        editor: 'editor',
        label: 'QUICKNPC.designer.skill.reaction.choices.text.label',
        defaultText: 'QUICKNPC.designer.skill.reaction.choices.text.default',
      },
    },
    apply: (model, context, choices) => {
      const ruleIndex = (context['ruleIndex'] ??= 0);
      const {
        name = game.i18n.localize('QUICKNPC.designer.skill.reaction.choices.name.default'),
        trigger = game.i18n.localize('QUICKNPC.designer.skill.reaction.choices.trigger.default'),
        text = game.i18n.localize('QUICKNPC.designer.skill.reaction.choices.text.default'),
      } = choices;

      model.updateSource({
        rules: {
          [ruleIndex]: {
            name: name,
            description: `<p><b>${game.i18n.localize('QUICKNPC.designer.skill.reaction.choices.trigger.heading')}</b> ${trigger}</p>${text}`,
          },
        },
      });
    },
  },
  attackSpecialEffect: {
    label: 'QUICKNPC.designer.skill.attackSpecialEffect.label',
    description: 'QUICKNPC.designer.skill.attackSpecialEffect.description',
    choices: {
      attack: {
        label: 'QUICKNPC.designer.skill.attackSpecialEffect.choices.attack.label',
        options: (model) => Object.fromEntries(Object.entries(model.attacks).map(([key, value]) => [key, value.name])),
      },
      effect: {
        label: 'QUICKNPC.designer.skill.attackSpecialEffect.choices.effect.label',
        editor: 'editor',
        defaultText: 'QUICKNPC.designer.skill.attackSpecialEffect.choices.effect.default',
      },
    },
    apply: (model, context, choices) => {
      const {
        attack,
        effect = game.i18n.localize('QUICKNPC.designer.skill.attackSpecialEffect.choices.effect.default'),
      } = choices;

      model.updateSource({
        attacks: {
          [attack]: {
            special: [...model.attacks[attack].special, effect],
          },
        },
      });
    },
  },
  specialized: {
    label: 'QUICKNPC.designer.skill.specialized.label',
    description: 'QUICKNPC.designer.skill.specialized.description',
    choices: {
      specialization: {
        label: 'QUICKNPC.designer.skill.specialized.choices.specialization.label',
        options: (model, context) => {
          return ['accuracySpecialization', 'magicSpecialization', 'opposedCheckSpecialization'].reduce(
            (options, key) => {
              if (!Customizations.checkApplied(context, key)) {
                options[key] = `QUICKNPC.designer.skill.specialized.choices.specialization.${key}.label`;
              }
              return options;
            },
            {},
          );
        },
      },
    },
    apply: (model, context, choices) => {
      const { specialization } = choices;
      const changes = {};

      if (specialization === 'accuracySpecialization') {
        changes.bonuses = {
          accuracy: model.bonuses.accuracy + 3,
        };
      }

      if (specialization === 'magicSpecialization') {
        changes.bonuses = {
          accuracy: model.bonuses.magic + 3,
        };
      }

      if (specialization === 'opposedCheckSpecialization') {
        changes.rules = {
          opposedCheckSpecialization: {
            name: game.i18n.localize(
              'QUICKNPC.designer.skill.specialized.choices.specialization.opposedCheckSpecialization.name',
            ),
            summary: game.i18n.localize(
              'QUICKNPC.designer.skill.specialized.choices.specialization.opposedCheckSpecialization.summary',
            ),
            description: game.i18n.localize(
              'QUICKNPC.designer.skill.specialized.choices.specialization.opposedCheckSpecialization.summary',
            ),
          },
        };
      }

      model.updateSource(changes);
      Customizations.markApplied(context, specialization);
    },
  },
  spellcaster: {
    label: 'QUICKNPC.designer.skill.spellcaster.label',
    description: 'QUICKNPC.designer.skill.spellcaster.description',
    choices: {
      spells: {
        label: 'QUICKNPC.designer.skill.spellcaster.choices.spells.label',
        options: {
          oneSpell: 'QUICKNPC.designer.skill.spellcaster.choices.spells.oneSpell',
          twoSpells: 'QUICKNPC.designer.skill.spellcaster.choices.spells.twoSpells',
        },
      },
    },
    apply: (model, context, choices) => {
      const { spells } = choices;

      ChooseSpellStep.addSpell(context);

      if (spells === 'twoSpells') {
        ChooseSpellStep.addSpell(context);
      } else {
        model.updateSource({
          bonuses: {
            mp: model.bonuses.mp + 10,
          },
        });
      }
    },
  },
  statusEffectImmunity: {
    label: 'QUICKNPC.designer.skill.statusEffectImmunity.label',
    description: 'QUICKNPC.designer.skill.statusEffectImmunity.description',
    choices: {
      status1: {
        label: 'QUICKNPC.designer.skill.statusEffectImmunity.choices.status',
        options: (model) =>
          Object.fromEntries(Object.entries(CONSTANTS.statusEffects).filter(([key]) => !model.statusImmunities[key])),
        group: 'status',
      },
      status2: {
        options: (model) =>
          Object.fromEntries(Object.entries(CONSTANTS.statusEffects).filter(([key]) => !model.statusImmunities[key])),
        group: 'status',
      },
    },
    apply: (model, context, choices) => {
      const { status1, status2 } = choices;

      model.updateSource({
        statusImmunities: {
          [status1]: true,
          [status2]: true,
        },
      });
    },
  },
  uniqueAction: {
    label: 'QUICKNPC.designer.skill.uniqueAction.label',
    description: 'QUICKNPC.designer.skill.uniqueAction.description',
    choices: {
      name: {
        editor: 'textfield',
        label: 'QUICKNPC.designer.skill.uniqueAction.choices.name.label',
        defaultText: 'QUICKNPC.designer.skill.uniqueAction.choices.name.default',
      },
      text: {
        editor: 'editor',
        label: 'QUICKNPC.designer.skill.uniqueAction.choices.text.label',
        defaultText: 'QUICKNPC.designer.skill.uniqueAction.choices.text.default',
      },
    },
    apply: (model, context, choices) => {
      const ruleIndex = (context['ruleIndex'] ??= 0);
      const {
        name = game.i18n.localize('QUICKNPC.designer.skill.uniqueAction.choices.name.default'),
        text = game.i18n.localize('QUICKNPC.designer.skill.uniqueAction.choices.text.default'),
      } = choices;

      model.updateSource({
        rules: {
          [ruleIndex]: {
            name: name,
            description: `<p>${game.i18n.localize('QUICKNPC.designer.skill.uniqueAction.prefix')}</p>${text}`,
          },
        },
      });
    },
  },
};
