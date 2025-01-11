import {AbstractStep} from "./abstract-step.mjs";
import {Species} from "../species/species.mjs";
import {NpcModel} from "../common/npc-model.mjs";
import {database} from "../database.mjs";

const speciesSelectDone = "speciesSelectDone"

const speciesDatabase = "speciesDatabase"

export class SelectSpeciesStep extends AbstractStep {

    #species

    constructor(formData) {
        super(formData);
        this.#species = formData.get("selected");
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    static getTemplateData(formData, current, context) {
        return {
            step: "QUICKNPC.step.selectSpecies.name",
            options: Object.fromEntries(Object.entries(context[speciesDatabase]).map(([key, value]) => [key, value.label])),
            selected: formData.get("selected"),
            emptyOption: "QUICKNPC.step.selectSpecies.blank"
        };
    }

    static shouldActivate(current, value, context) {
        return !context[speciesSelectDone]
    }

    static initContext(context) {
        context[speciesDatabase] = database.typeData.species ?? {};
    }

    apply(model, context) {
        if (!(this.#species in context[speciesDatabase])) {
            return false
        }
        context[speciesSelectDone] = true
        const selectedSpecies = context[speciesDatabase][this.#species];
        Species.setSpecies(context, selectedSpecies)
        model.name = `${model.name} ${game.i18n.localize(selectedSpecies.label)}`
        model.species = selectedSpecies.npcSpecies
        selectedSpecies.apply(model, context)
        NpcModel.updateDerivedValues(model)
        return model
    }
}