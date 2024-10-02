import {Stepper} from "./stepper.mjs";
import {NpcModel} from "./common/npc-model.mjs";
import {npcCreationSteps} from "./steps/steps.mjs";
import {CONSTANTS} from "./constants.mjs";

export class QuickNpcWizardV11 extends FormApplication {

    /**
     * @return FormApplicationOptions
     */
    static get defaultOptions() {
        return Object.assign(super.defaultOptions, {
            id: "quick-npc-wizard",
            classes: ["quick-npc-wizard"],
            title: "QUICKNPC.wizard.title",
            width: 900,
            height: "auto",
            closeOnSubmit: false,
            submitOnChange: true,
        })
    }

    get template() {
        return "/modules/fabula-ultima-quick-npcs/templates/v11compat.hbs";
    }


    async _updateObject(event) {
        return this.constructor.#commitData.call(this, event, this.form, new FormData(this.form));
    }

    async getData(options = {}) {
        return Object.assign(await super.getData(options), await this._prepareContext());
    }

    activateListeners(html) {
        super.activateListeners(html)
        html.find("[data-action=back]").on("click", this.constructor.#onBack.bind(this));
    }

    static async #commitData(event, form, formData) {
        let done = false;

        if (event.type === "submit") {
            const result = this.#stepper.nextStep(formData);
            if (result instanceof FormData) {
                this.#latestFormData = result;
            } else {
                done = result;
                this.#latestFormData = new FormData();
            }
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