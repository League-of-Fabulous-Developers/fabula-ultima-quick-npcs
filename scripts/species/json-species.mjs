import {Species} from "./species.mjs";
import {parseChanges, parseSkill} from "../common/changes.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";


export class JsonSpecies extends Species {

    #data

    constructor(data) {
        super();
        this.#data = data.species
    }

    /**
     * @return string
     */
    get label() {
        return this.#data.name
    }

    get npcSpecies() {
        return this.#data.npcSpecies;
    }

    /**
     * @param {NpcModel} model
     * @param context
     * @return void
     */
    apply(model, context) {
        parseChanges(this.#data.changes, this.#data.spellLists)(model, context);
        const customizationOptions = Object.fromEntries(Object.entries(this.#data.customizationOptions).map(([k, v]) => [k, parseSkill(v, this.#data.spellLists)]));
        for (let i = 0; i < this.#data.customizationCount; i++) {
            ChooseCustomizationStep.addCustomization(context, customizationOptions);
        }
    }

}