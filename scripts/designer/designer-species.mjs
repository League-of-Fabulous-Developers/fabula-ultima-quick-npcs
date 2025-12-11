import { AssignResistanceStep } from './steps/assign-resistance-step.mjs';
import { AssignImmunityStep } from './steps/assign-immunity-step.mjs';
import { AssignSpeciesVulnerabilityStep } from './steps/assign-species-vulnerability-step.mjs';
import { Rules } from '../common/rules.mjs';

export const designerSpecies = {
  beast: {
    label: 'QUICKNPC.species.beast.name',
    skills: 4,
  },
  construct: {
    label: 'QUICKNPC.species.construct.name',
    skills: 2,
    apply: (model) =>
      model.updateSource({
        affinities: {
          poison: { imm: true },
          earth: { res: true },
        },
        statusImmunities: { poisoned: true },
      }),
  },
  demon: {
    label: 'QUICKNPC.species.demon.name',
    skills: 3,
    apply: (model, context) => {
      AssignResistanceStep.addResistance(context);
      AssignResistanceStep.addResistance(context);
    },
  },
  elemental: {
    label: 'QUICKNPC.species.elemental.name',
    skills: 2,
    apply: (model, context) => {
      model.updateSource({
        affinities: {
          poison: { imm: true },
        },
        statusImmunities: {
          poisoned: true,
        },
      });
      AssignImmunityStep.addImmunity(context);
    },
  },
  humanoid: {
    label: 'QUICKNPC.species.humanoid.name',
    skills: 4,
  },
  monster: {
    label: 'QUICKNPC.species.monster.name',
    skills: 4,
  },
  plant: {
    label: 'QUICKNPC.species.plant.name',
    skills: 3,
    apply: (model, context) => {
      model.updateSource({
        statusImmunities: {
          dazed: true,
          shaken: true,
          enraged: true,
        },
      });
      AssignSpeciesVulnerabilityStep.addSpeciesVulnerability(context, ['air', 'bolt', 'fire', 'ice']);
    },
  },
  undead: {
    label: 'QUICKNPC.species.undead.name',
    skills: 2,
    apply: (model) => {
      model.updateSource({
        affinities: {
          dark: { imm: true },
          light: { vul: 'species' },
          poison: { imm: true },
        },
        statusImmunities: {
          poisoned: true,
        },
        rules: {
          undeadHealing: Rules.simpleRule('QUICKNPC.species.undead.undeadHealing'),
        },
      });
    },
  },
};
