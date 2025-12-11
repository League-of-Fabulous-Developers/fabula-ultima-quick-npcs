import {AbstractStep} from "../../stepper/abstract-step.mjs";
import {Species} from "../species/species.mjs";
import {database} from "../../database.mjs";

const speciesSelectDone = "speciesSelectDone"

const speciesDatabase = "speciesDatabase"

export class SelectSpeciesStep extends AbstractStep {

    #species

    constructor(formValues) {
        super(formValues);
        this.#species = formValues.selected;
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    static getTemplateData(formValues, current, context) {
        return {
            step: "QUICKNPC.step.selectSpecies.name",
            options: Object.fromEntries(Object.entries(context[speciesDatabase]).map(([key, value]) => [key, value.label])),
            selected: formValues.selected,
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
        model.updateSource({
            name: `${model.name} ${game.i18n.localize(selectedSpecies.label)}`,
            species: selectedSpecies.npcSpecies
        })
        selectedSpecies.apply(model, context)
        return model
    }
}