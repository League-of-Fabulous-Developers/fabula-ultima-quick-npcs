import { AbstractChooseSkillStep } from './abstract-choose-skill-step.mjs';
import { database } from '../../database.mjs';
import { ChooseRoleSkillStep } from './choose-role-skill-step.mjs';
import { Role } from '../roles/role.mjs';

const negativeSkillKey = 'negativeSkills';
const appliedNegativeSkillKey = 'appliedNegativeSkills';

export class ChooseNegativeSkillStep extends AbstractChooseSkillStep {
  static get stepName() {
    return 'QUICKNPC.step.chooseSkill.negative';
  }

  static getOptions(model, context) {
    const options = {
      none: {
        label: 'QUICKNPC.commonSkills.none.name',
        description: 'QUICKNPC.commonSkills.none.description',
        apply: () => {},
      },
    };

    const db = database.typeData['negative-skill-list'];
    Object.entries(db).forEach(([file, data]) =>
      Object.entries(data.skills).forEach(
        ([key, skill]) => (options[`${file}|${key}`] = { ...skill, group: data.name }),
      ),
    );

    return options;
  }

  static getGroups(model, context) {
    return ['', ...Object.values(database.typeData['negative-skill-list']).map((data) => data.name)];
  }

  /**
   * @param context
   */
  static addNegativeSkill(context) {
    context[negativeSkillKey] ??= 0;
    context[negativeSkillKey] += 1;
  }

  static shouldActivate(current, value, context) {
    return context[negativeSkillKey] > 0;
  }

  static markApplied(context, selected) {
    context[negativeSkillKey] -= 1;
    (context[appliedNegativeSkillKey] ??= []).push(selected);
    if (selected !== 'none') {
      const role = Role.getRole(context);
      ChooseRoleSkillStep.addRoleSkill(context, role.roleSkills);
    }
  }
}
