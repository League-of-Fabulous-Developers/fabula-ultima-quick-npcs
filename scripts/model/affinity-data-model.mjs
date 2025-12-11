class SpeciesVulnerabilityField extends foundry.data.fields.DataField {
  /** @override */
  _validateType(value) {
    return typeof value === 'boolean' || value === 'species';
  }
}

/**
 * @property {boolean, "species"} vul
 * @property {boolean} res
 * @property {boolean} imm
 * @property {boolean} abs
 */
export class AffinityDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { BooleanField } = foundry.data.fields;
    return {
      vul: new SpeciesVulnerabilityField({ initial: false }),
      res: new BooleanField({ initial: false }),
      imm: new BooleanField({ initial: false }),
      abs: new BooleanField({ initial: false }),
    };
  }

  /**
   * @return {"vul","","res","imm","abs"}
   */
  get value() {
    if (this.abs) {
      return 'abs';
    }
    if (this.imm) {
      return 'imm';
    }
    if (this.res && this.vul) {
      return '';
    }
    if (this.res) {
      return 'res';
    }
    if (this.vul) {
      return 'vul';
    }
    return '';
  }
}
