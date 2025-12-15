import { AbstractChooseSkillStep } from './abstract-choose-skill-step.mjs';
import { database } from '../../database.mjs';

const bossSkillKey = 'bossSkills';
const appliedBossSkillKey = 'appliedBossSkills';

export class ChooseBossSkillStep extends AbstractChooseSkillStep {
  static get stepName() {
    return 'QUICKNPC.step.chooseSkill.boss';
  }

  static getOptions(model, context) {
    const options = {};

    const db = database.typeData['boss-skill-list'];
    Object.entries(db).forEach(([file, data]) =>
      Object.entries(data.skills).forEach(
        ([key, skill]) => (options[`${file}|${key}`] = { ...skill, group: data.name }),
      ),
    );

    return options;
  }

  static getGroups(model, context) {
    return Object.values(database.typeData['boss-skill-list']).map((data) => data.name);
  }

  /**
   * @param context
   */
  static addBossSkill(context) {
    context[bossSkillKey] ??= 0;
    context[bossSkillKey] += 1;
  }

  static shouldActivate(current, value, context) {
    return context[bossSkillKey] > 0;
  }

  static markApplied(context, selected) {
    context[bossSkillKey] -= 1;
    (context[appliedBossSkillKey] ??= []).push(selected);
  }
}
