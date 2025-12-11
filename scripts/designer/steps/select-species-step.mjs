import { AbstractStep } from '../../stepper/abstract-step.mjs';
import { designerSpecies } from '../designer-species.mjs';
import { unallocatedSkills } from '../designer-steps.mjs';

const speciesSelectDone = 'speciesSelectDone';

export class SelectSpeciesStep extends AbstractStep {
  #species;

  constructor(formValues) {
    super(formValues);
    this.#species = formValues.selected;
  }

  static get template() {
    return 'QUICKNPC.step.singleSelect';
  }

  static getTemplateData(formValues, current, context) {
    return {
      step: 'QUICKNPC.step.selectSpecies.name',
      options: Object.fromEntries(Object.entries(designerSpecies).map(([key, value]) => [key, value.label])),
      selected: formValues.selected,
      emptyOption: 'QUICKNPC.step.selectSpecies.blank',
    };
  }

  static shouldActivate(current, value, context) {
    return !context[speciesSelectDone];
  }

  apply(model, context) {
    if (!(this.#species in designerSpecies)) {
      return false;
    }
    context[speciesSelectDone] = true;

    const selectedSpecies = designerSpecies[this.#species];
    context[unallocatedSkills] += selectedSpecies.skills;
    model.updateSource({
      name: game.i18n.localize(selectedSpecies.label),
      species: this.#species,
    });
    selectedSpecies.apply?.(model, context);
    return model;
  }
}
