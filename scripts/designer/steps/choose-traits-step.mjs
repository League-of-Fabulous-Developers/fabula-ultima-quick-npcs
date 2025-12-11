import { AbstractStep } from '../../stepper/abstract-step.mjs';

const traitsDone = 'traitsDone';

export class ChooseTraitsStep extends AbstractStep {
  #name;
  #traits;

  constructor(formValues) {
    super(formValues);
    this.#name = formValues.name;
    this.#traits = formValues.traits;
  }

  static get template() {
    return 'QUICKNPC.step.chooseTraits';
  }

  static getTemplateData(formValues, current, context) {
    return {
      name: formValues.name ?? current.name,
      traits: formValues.traits,
    };
  }

  static shouldActivate(current, value, context) {
    return !context[traitsDone];
  }

  apply(value, context) {
    context[traitsDone] = true;
    this.#name && (value.name = this.#name.trim() || value.name);
    this.#traits && (value.traits = this.#traits.trim() || value.traits);
    return value;
  }
}
