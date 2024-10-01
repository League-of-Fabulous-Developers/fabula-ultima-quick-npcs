import {AbstractStep} from "./abstract-step.mjs";
import {beast} from "../species/beast.mjs";
import {Species} from "../species/species.mjs";
import {construct} from "../species/construct.mjs";
import {demon} from "../species/demon.mjs";
import {elemental} from "../species/elemental.mjs";
import {humanoid} from "../species/humanoid.mjs";
import {monster} from "../species/monster.mjs";
import {plant} from "../species/plant.mjs";
import {undead} from "../species/undead.mjs";
import {NpcModel} from "../common/npc-model.mjs";

/**
 * @type {Record<string, Species>}
 */
const species = {
    beast,
    construct,
    demon,
    elemental,
    humanoid,
    monster,
    plant,
    undead
}

const speciesSelectDone = "speciesSelectDone"

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
            options: Object.fromEntries(Object.entries(species).map(([key, value]) => [key, value.label])),
            selected: formData.get("selected"),
            emptyOption: "QUICKNPC.step.selectSpecies.blank"
        };
    }

    static shouldActivate(current, value, context) {
        return !context[speciesSelectDone]
    }

    apply(model, context) {
        if (!(this.#species in species)) {
            return false
        }
        context[speciesSelectDone] = true
        const selectedSpecies = species[this.#species];
        model.species = this.#species
        Species.setSpecies(context, selectedSpecies)
        model.name = `${model.name} ${game.i18n.localize(selectedSpecies.label)}`
        selectedSpecies.apply(model, context)
        NpcModel.updateDerivedValues(model)
        return model
    }
}