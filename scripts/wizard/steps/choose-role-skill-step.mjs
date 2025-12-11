import { AbstractChooseSkillStep } from './abstract-choose-skill-step.mjs';

const roleSkillKey = 'roleSkills';
const appliedRoleSkillKey = 'appliedRoleSkills';

export class ChooseRoleSkillStep extends AbstractChooseSkillStep {
  static get stepName() {
    return 'QUICKNPC.step.chooseSkill.role';
  }

  static getOptions(model, context) {
    return context[roleSkillKey][0];
  }

  /**
   * @param context
   * @param {SkillOptions} options
   */
  static addRoleSkill(context, options) {
    if (Object.keys(options).length) {
      (context[roleSkillKey] ??= []).push(options);
    }
  }

  static filterOptions(allOptions, model, context) {
    const applied = context[appliedRoleSkillKey] ?? [];
    const options = Object.entries(allOptions).filter(([key]) => !applied.includes(key));

    return Object.fromEntries(options);
  }

  static shouldActivate(current, value, context) {
    return context[roleSkillKey]?.length;
  }

  static markApplied(context, selected) {
    context[roleSkillKey].shift();
    (context[appliedRoleSkillKey] ??= []).push(selected);
  }
}
