import { AbstractStep } from '../../stepper/abstract-step.mjs';

const finished = 'finished';

export class FinishStep extends AbstractStep {
  static get template() {
    return 'QUICKNPC.step.finish';
  }

  static getTemplateData(formValues, current, context) {
    return {};
  }

  static shouldActivate(current, value, context) {
    return !context[finished];
  }

  apply(value, context) {
    context[finished] = true;
    return value;
  }
}
