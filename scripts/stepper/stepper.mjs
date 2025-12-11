import { AbstractStep } from './abstract-step.mjs';

export class Stepper {
  /** @type unknown */
  #model;
  /** @type {AbstractStep[]} */
  #stepsTaken = [];
  /** @type {typeof AbstractStep[]} */
  #steps;
  /** @type {typeof AbstractStep} */
  #CurrentStep;
  /** @type Object[] */
  #redoData = [];
  /** @type object */
  #initialContext = {};

  /**
   * @param {typeof AbstractStep[]} steps
   * @param {foundry.abstract.DataModel} model
   */
  constructor(steps, model) {
    this.#steps = [...steps];
    this.#model = model;
    this.#CurrentStep = this.#steps[0];
    const initialContext = {};
    this.#steps.forEach((step) => step.initContext(initialContext));
    this.#initialContext = foundry.utils.deepClone(initialContext);
  }

  /**
   * @param {Object} formValues
   * @return {boolean | Object} true if done, false if data is invalid for current step, FormData if the next step has known redo data
   */
  nextStep(formValues) {
    const [value, context] = this.currentState;
    const CurrentStep = this.currentStep;

    let currentStep;
    let canRedo = false;
    try {
      currentStep = new CurrentStep(formValues);
      let redoData = this.#redoData.at(-1);
      if (redoData) {
        canRedo = foundry.utils.objectsEqual(formValues, redoData);
      }
    } catch (cause) {
      const msg = `Invalid data for step ${CurrentStep?.name}`;
      console.error(msg, formValues, cause);
      throw new Error(msg, { cause });
    }

    try {
      const result = currentStep.apply(value, context);
      if (result === false) {
        return false;
      }
    } catch (cause) {
      const msg = `Unable to apply current step '${CurrentStep?.name}'`;
      console.error(msg, currentStep, context, cause);
      throw new Error(msg, { cause });
    }

    let NextStep;
    try {
      NextStep = this.#steps.find((step) => step.shouldActivate(currentStep, value, context));
    } catch (cause) {
      const msg = `Error determining the next step for ${CurrentStep?.name}`;
      console.error(msg, currentStep, context, cause);
      throw new Error(msg, { cause });
    }

    if (!NextStep) {
      return true;
    }

    if (!foundry.utils.isSubclass(NextStep, AbstractStep)) {
      const msg = `${NextStep?.name} is not a subclass of Step`;
      console.error(msg, NextStep);
      throw new Error(msg);
    }

    this.#stepsTaken.push(currentStep);
    this.#CurrentStep = NextStep;

    console.debug('Current step', NextStep.name);

    if (canRedo) {
      this.#redoData.pop();
      const redoData = this.#redoData.at(-1);
      if (redoData) {
        return foundry.utils.deepClone(redoData);
      } else {
        return false;
      }
    } else {
      this.#redoData = [];
      return false;
    }
  }

  /**
   * @param {Object} formValues
   * @return {unknown, false}
   */
  previewAfterCurrentStep(formValues) {
    const [value, context] = this.currentState;
    const step = new this.#CurrentStep(formValues);
    return step.apply(value, context);
  }

  /**
   * @return {void | Object}
   */
  revertLastStep() {
    const lastStep = this.#stepsTaken.pop();
    if (lastStep) {
      this.#CurrentStep = lastStep.constructor;
      const formValues = lastStep.formValues;
      this.#redoData.push(formValues);
      return formValues;
    }
  }

  /**
   * @return {typeof AbstractStep}
   */
  get currentStep() {
    return this.#CurrentStep;
  }

  /**
   * @return {[unknown, Record]}
   */
  get currentState() {
    const value = new this.#model();
    const context = { ...this.#initialContext };
    for (const step of this.#stepsTaken) {
      step.apply(value, context);
    }
    return [value, context];
  }

  get isFirstStep() {
    return this.#stepsTaken.length === 0;
  }
}
