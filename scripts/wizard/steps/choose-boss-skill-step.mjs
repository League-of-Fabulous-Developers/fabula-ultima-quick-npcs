import { AbstractChooseSkillStep } from './abstract-choose-skill-step.mjs';

const bossSkillKey = 'bossSkills';
const appliedBossSkillKey = 'appliedBossSkills';

export class ChooseBossSkillStep extends AbstractChooseSkillStep {
  static get stepName() {
    return 'QUICKNPC.step.chooseSkill.boss';
  }

  static getOptions(model, context) {
    return context[bossSkillKey][0];
  }

  /**
   * @param context
   * @param {SkillOptions} options
   */
  static addBossSkill(context, options) {
    (context[bossSkillKey] ??= []).push(options);
  }

  static filterOptions(options, model, context) {
    const applied = context[appliedBossSkillKey] ?? [];
    return Object.fromEntries(Object.entries(options).filter(([key]) => !applied.includes(key)));
  }

  static shouldActivate(current, value, context) {
    return context[bossSkillKey]?.length;
  }

  static markApplied(context, selected) {
    context[bossSkillKey].shift();
    (context[appliedBossSkillKey] ??= []).push(selected);
  }
}
