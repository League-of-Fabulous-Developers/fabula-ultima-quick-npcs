import { AbstractStep } from '../../stepper/abstract-step.mjs';
import { CONSTANTS } from '../../constants.mjs';

/** @type StatusEffect[] */
const allStatuses = Object.keys(CONSTANTS.statusEffects);

const statusKey = 'statusImmunities';

export class AssignStatusImmunityStep extends AbstractStep {
  /** @type DamageType */
  #status;

  constructor(formValues) {
    super(formValues);
    this.#status = formValues.selected;
  }

  static get template() {
    return 'QUICKNPC.step.singleSelect';
  }

  static getTemplateData(formValues, current, context) {
    /** @type StatusEffect[] */
    const allOptions = context[statusKey][0];

    const options = Object.fromEntries(
      allOptions
        .filter((status) => !current.statusImmunities[status])
        .map((option) => [option, CONSTANTS.statusEffects[option]]),
    );

    return {
      step: 'QUICKNPC.step.assignStatusImmunity.name',
      options: options,
      selected: formValues.selected,
      emptyOption: 'QUICKNPC.step.assignStatusImmunity.blank',
    };
  }

  static addStatusImmunity(context, options = allStatuses) {
    options = options.filter((value) => allStatuses.includes(value));
    context[statusKey] ??= [];
    context[statusKey].push(options);
  }

  static shouldActivate(current, value, context) {
    return context[statusKey]?.length;
  }

  apply(model, context) {
    if (!this.#status || model.statusImmunities[this.#status]) {
      return false;
    } else {
      model.updateSource({ [`statusImmunities.${this.#status}`]: true });
      context[statusKey].shift();
      return model;
    }
  }
}
