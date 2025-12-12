import { AbstractStep } from '../../stepper/abstract-step.mjs';
import { Role } from '../roles/role.mjs';

const levels = {
  5: '5',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  60: '60',
};

const levelSelectDone = 'levelSelectDone';

export class SelectLevelStep extends AbstractStep {
  #level;

  constructor(formValues) {
    super(formValues);
    this.#level = Number(formValues.selected);
  }

  static get template() {
    return 'QUICKNPC.step.singleSelect';
  }

  static getTemplateData(formValues, current, context) {
    return {
      step: 'QUICKNPC.step.selectLevel.name',
      options: levels,
      selected: formValues.selected,
      emptyOption: 'QUICKNPC.step.selectLevel.blank',
    };
  }

  static shouldActivate(current, value, context) {
    return !context[levelSelectDone];
  }

  apply(model, context) {
    if (!this.#level || !levels[this.#level]) {
      return false;
    } else {
      context[levelSelectDone] = true;
      const changes = { level: this.#level, attributes: {} };
      const role = Role.getRole(context);

      role.attributeChanges
        .slice(0, Math.floor(this.#level / 20))
        .forEach((change) => Object.assign(changes.attributes, change));

      model.updateSource(changes);

      role.skillsByLevel.slice(0, Math.floor(this.#level / 10)).forEach((apply) => apply(model, context));

      return model;
    }
  }
}
