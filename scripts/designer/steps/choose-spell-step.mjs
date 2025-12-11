import { AbstractChooseSkillStep } from './abstract-choose-skill-step.mjs';
import { database } from '../../database.mjs';

const spellKey = 'spells';

export class ChooseSpellStep extends AbstractChooseSkillStep {
  static get stepName() {
    return 'QUICKNPC.step.chooseSkill.spell';
  }

  static getOptions(model, context) {
    const options = {};

    const db = database.typeData['designer-spell-list'];
    Object.entries(db).forEach(([file, data]) =>
      Object.entries(data.spells).forEach(
        ([key, spell]) =>
          (options[`${file}|${key}`] = {
            ...spell,
            group: data.name,
          }),
      ),
    );

    return options;
  }

  static getGroups(model, context) {
    return Object.values(database.typeData['designer-spell-list']).map((data) => data.name);
  }

  /**
   * @param context
   */
  static addSpell(context) {
    context[spellKey] ??= 0;
    context[spellKey] += 1;
  }

  static filterOptions(allOptions, model, context) {
    const applied = Object.keys(model.spells);
    const options = Object.entries(allOptions).filter(([key]) => !applied.includes(key));

    return Object.fromEntries(options);
  }

  static shouldActivate(current, value, context) {
    return context[spellKey] > 0;
  }

  static markApplied(context, selected) {
    context[spellKey] -= 1;
  }
}
