const roleKey = 'role';

export class Role {
  /**
   * @param context
   * @param {Role} role
   */
  static setRole(context, role) {
    context[roleKey] = role;
  }

  /**
   * @param context
   * @return {Role}
   */
  static getRole(context) {
    return context[roleKey];
  }

  /**
   * @return string
   */
  get label() {
    throw new Error("must override 'get label()'");
  }

  /**
   * @return {Record<Attribute, AttributeDice>}
   */
  get baseAttributes() {
    throw new Error("must override 'get baseAttributes()'");
  }

  /**
   * @typedef {{[key: typeof Attribute]: AttributeDice}} AttributeChange
   */
  /**
   * @return {[AttributeChange, AttributeChange, AttributeChange]}
   */
  get attributeChanges() {
    throw new Error("must override 'get attributeChanges()'");
  }

  /**
   * An array with 6 functions, corresponding to level 10 through 60.
   * @return {[ApplySkill, ApplySkill, ApplySkill, ApplySkill, ApplySkill, ApplySkill]}
   */
  get skillsByLevel() {
    throw new Error("must override 'get skillsByLevel()'");
  }

  /**
   * @param {NpcDataModel} model
   * @param context
   * @return void
   */
  applyBaseline(model, context) {
    throw new Error("must override 'applyBaseline(value, context)'");
  }

  /**
   * @return SkillOptions
   */
  get roleSkills() {
    throw new Error("must override 'get roleSkills()'");
  }

  /**
   * @return SkillOptions
   */
  get customizations() {
    throw new Error("must override 'get customizations()'");
  }
}
