import {Stepper} from "../stepper/stepper.mjs";
import {NpcDataModel} from "../model/npc-data-model.mjs";
import {CONSTANTS} from "../constants.mjs";
import {npcDesignerSteps, unallocatedSkills} from "./designer-steps.mjs";

export class NpcDesigner extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.Application) {

    /** @type ApplicationConfiguration */
    static DEFAULT_OPTIONS = {
        id: "quick-npc-designer",
        tag: "form",
        window: {
            contentClasses: ["quick-npc-designer", "quick-npc-wizard"],
            title: "QUICKNPC.designer.title",
            controls: [{
                icon: "fas fa-hat-wizard",
                label: "Debug Info",
                action: "debug",
                tooltip: "Print debug info to log"
            }]
        },
        position: {
            width: 900,
            height: "auto"
        },
        form: {
            closeOnSubmit: false,
            submitOnChange: true,
            handler: NpcDesigner.#commitData
        },
        actions: {
            back: NpcDesigner.#onBack,
            debug: NpcDesigner.#onDebug
        }
    };

    static PARTS = {
        preview: {
            id: "preview",
            template: "QUICKNPC.designer.preview"
        },
        stepper: {
            id: "stepper",
            template: "QUICKNPC.designer.stepper"
        }
    };

    static async #commitData(event, form, formData) {
        let done = false;
        const formValues = formData.object;

        if (event.type === "submit") {
            const result = this.#stepper.nextStep(formValues);
            if (result instanceof Object) {
                this.#latestFormValues = result;
            } else {
                done = result;
                this.#latestFormValues = {};
            }
        } else {
            this.#latestFormValues = formValues
        }

        if (done) {
            this.close()
            const npcModel = this.#stepper.currentState[0];
            const actor = await Actor.create(npcModel.toActorData());
            console.log(npcModel, actor)
            actor.sheet.render(true)
        } else {
            this.render()
        }
    }

    static #onBack() {
        this.#latestFormValues = this.#stepper.revertLastStep();
        this.render()
    }

    static #onDebug() {
        console.log("Wizard debug info");
        console.log("Current Model:", this.#stepper.currentState[0])
        console.log("Formdata:", this.#latestFormValues)
        console.log("Model Preview:", this.#stepper.previewAfterCurrentStep(this.#latestFormValues));
        console.log("Stepper state:", this.#stepper)
    }

    /** @type {Stepper<NpcModel>} */
    #stepper = new Stepper(npcDesignerSteps, NpcDataModel)
    /** @type {Object} */
    #latestFormValues = {}

    async _prepareContext() {
        const stepper = this.#stepper;
        const step = stepper.currentStep;

        const [current, context] = stepper.currentState;
        let preview = stepper.previewAfterCurrentStep(this.#latestFormValues)
        let nextDisabled = false;
        if (!preview) {
            preview = current;
            nextDisabled = true;
        }

        return {
            preview: preview,
            damageTypeIcons: CONSTANTS.damageTypeIcons,
            stepTemplate: step.template,
            templateData: step.getTemplateData(this.#latestFormValues, current, context),
            backDisabled: stepper.isFirstStep,
            nextDisabled: nextDisabled,
            unallocatedSkills: context[unallocatedSkills] ?? "-"
        };
    }
}