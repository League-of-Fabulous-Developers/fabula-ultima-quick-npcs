import {Stepper} from "./stepper.mjs";
import {NpcModel} from "./common/npc-model.mjs";
import {npcCreationSteps} from "./steps/steps.mjs";
import {CONSTANTS} from "./constants.mjs";

export class QuickNpcWizardV12 extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

    /** @type ApplicationConfiguration */
    static DEFAULT_OPTIONS = {
        id: "quick-npc-wizard",
        tag: "form",
        window: {
            contentClasses: ["quick-npc-wizard"],
            title: "QUICKNPC.wizard.title",
        },
        position: {
            width: 900,
            height: "auto"
        },
        form: {
            closeOnSubmit: false,
            submitOnChange: true,
            handler: QuickNpcWizardV12.#commitData
        },
        actions: {
            back: QuickNpcWizardV12.#onBack
        }
    };

    static PARTS = {
        preview: {
            id: "preview",
            template: "QUICKNPC.wizard.preview"
        },
        stepper: {
            id: "stepper",
            template: "QUICKNPC.wizard.stepper"
        }
    };

    static async #commitData(event, form, formData) {
        let done = false;

        if (event.type === "submit") {
            done = this.#stepper.nextStep(formData);
            this.#latestFormData = new FormData()
        } else {
            this.#latestFormData = formData
        }

        if (done) {
            this.close()
            const npcModel = this.#stepper.currentState[0];
            const actor = await NpcModel.createActor(npcModel);
            console.log(npcModel, actor)
            actor.sheet.render(true)
        } else {
            this.render()
        }
    }

    static #onBack() {
        this.#latestFormData = this.#stepper.revertLastStep();
        this.render()
    }

    /** @type {Stepper<NpcModel>} */
    #stepper = new Stepper(npcCreationSteps, NpcModel.newNpcModel())
    #latestFormData = new FormData()

    async _prepareContext() {
        const stepper = this.#stepper;
        const step = stepper.currentStep;

        const [current, context] = stepper.currentState;
        let preview = stepper.previewAfterCurrentStep(this.#latestFormData)
        let nextDisabled = false;
        if (!preview) {
            preview = current;
            nextDisabled = true;
        }

        return {
            preview: preview,
            damageTypeIcons: CONSTANTS.damageTypeIcons,
            stepTemplate: step.template,
            templateData: step.getTemplateData(this.#latestFormData, current, context),
            backDisabled: stepper.isFirstStep,
            nextDisabled: nextDisabled
        };
    }
}