import {AbstractStep} from "./steps/abstract-step.mjs";
import {copyFormData, formDataEquals} from "./common/utils.mjs";


export class Stepper {

    /** @type unknown */
    #initialValue
    /** @type {AbstractStep[]} */
    #stepsTaken = []
    /** @type {typeof AbstractStep[]} */
    #steps
    /** @type {typeof AbstractStep} */
    #CurrentStep
    /** @type FormData[] */
    #redoData = []
    /** @type object */
    #initialContext = {}

    /**
     * @param {typeof AbstractStep[]} steps
     * @param {unknown} initialValue
     */
    constructor(steps, initialValue) {
        this.#steps = [...steps]
        this.#initialValue = initialValue
        this.#CurrentStep = this.#steps[0]
        this.#initialContext = {}
        this.#steps.forEach(step => step.initContext(this.#initialContext))
    }

    /**
     * @param {FormData} formData
     * @return {boolean | FormData} true if done, false if data is invalid for current step, FormData is the next step has known redo data
     */
    nextStep(formData) {
        const [value, context] = this.currentState;
        const CurrentStep = this.currentStep

        let currentStep
        let canRedo = false;
        try {
            currentStep = new CurrentStep(formData);
            let redoData = this.#redoData.at(-1);
            if (redoData) {
                canRedo = formDataEquals(formData, redoData)
            }
        } catch (cause) {
            const msg = `Invalid data for step ${CurrentStep?.name}`;
            console.error(msg, formData, cause)
            throw new Error(msg, {cause})
        }

        try {
            const result = currentStep.apply(value, context);
            if (result === false) {
                return false;
            }
        } catch (cause) {
            const msg = `Unable to apply current step '${CurrentStep?.name}'`;
            console.error(msg, currentStep, context, cause)
            throw new Error(msg, {cause})
        }

        let NextStep
        try {
            NextStep = this.#steps.find(step => step.shouldActivate(currentStep, value, context))
        } catch (cause) {
            const msg = `Error determining the next step for ${CurrentStep?.name}`;
            console.error(msg, currentStep, context, cause)
            throw new Error(msg, {cause})
        }

        if (!NextStep) {
            return true;
        }

        if (!foundry.utils.isSubclass(NextStep, AbstractStep)) {
            const msg = `${NextStep?.name} is not a subclass of Step`
            console.error(msg, NextStep)
            throw new Error(msg)
        }

        this.#stepsTaken.push(currentStep)
        this.#CurrentStep = NextStep

        console.debug("Current step", NextStep.name)

        if (canRedo) {
            this.#redoData.pop();
            const redoData = this.#redoData.at(-1);
            if (redoData) {
                return copyFormData(redoData)
            } else {
                return false;
            }
        } else {
            this.#redoData = []
            return false;
        }
    }

    /**
     * @param {FormData} formData
     * @return {unknown, false}
     */
    previewAfterCurrentStep(formData) {
        const [value, context] = this.currentState;
        const step = new this.#CurrentStep(formData);
        return step.apply(value, context)
    }

    /**
     * @return {void | FormData}
     */
    revertLastStep() {
        const lastStep = this.#stepsTaken.pop();
        if (lastStep) {
            this.#CurrentStep = lastStep.constructor
            const formData = lastStep.formData;
            this.#redoData.push(formData);
            return formData
        }
    }

    /**
     * @return {typeof AbstractStep}
     */
    get currentStep() {
        return this.#CurrentStep
    }

    /**
     * @return {[unknown, Record]}
     */
    get currentState() {
        let value = foundry.utils.duplicate(this.#initialValue)
        let context = {...this.#initialContext}
        for (const step of this.#stepsTaken) {
            value = step.apply(foundry.utils.duplicate(value), context)
        }
        return [value, context]
    }

    get isFirstStep() {
        return this.#stepsTaken.length === 0
    }
}