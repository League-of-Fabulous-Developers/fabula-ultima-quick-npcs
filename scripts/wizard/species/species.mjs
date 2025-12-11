const speciesKey = 'species';

export class Species {
  /**
   * @param context
   * @param {Species} species
   */
  static setSpecies(context, species) {
    context[speciesKey] = species;
  }

  /**
   * @param context
   * @return {Species}
   */
  static getSpecies(context) {
    return context[speciesKey];
  }

  /**
   * @return string
   */
  get label() {
    throw new Error("must override 'get label()'");
  }

  get npcSpecies() {
    throw new Error("must override 'get npcSpecies'");
  }

  /**
   * @param {NpcDataModel} model
   * @param context
   * @return void
   */
  apply(model, context) {
    throw new Error("must override 'apply(value, context)'");
  }
}
