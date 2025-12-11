import { Role } from './role.mjs';
import { parseChanges, parseSkill } from '../wizard-changes.mjs';

export class JsonRole extends Role {
  #data;
  #skillsByLevel;
  #roleSkills;
  #customizations;

  constructor(data) {
    super();
    this.#data = data.role;
    this.#skillsByLevel = this.#data.skillsByLevel.map((changes) => parseChanges(changes, this.#data.spellLists));
    this.#roleSkills = Object.fromEntries(
      Object.entries(this.#data.roleSkills).map(([key, value]) => [key, parseSkill(value, this.#data.spellLists)]),
    );
    this.#customizations = Object.fromEntries(
      Object.entries(this.#data.customizations).map(([key, value]) => [key, parseSkill(value, this.#data.spellLists)]),
    );
  }

  get label() {
    return this.#data.label;
  }

  get baseAttributes() {
    return this.#data.baseAttributes;
  }

  get attributeChanges() {
    return this.#data.attributeChanges;
  }

  get skillsByLevel() {
    return this.#skillsByLevel;
  }

  applyBaseline(model, context) {
    const applierFunction = parseChanges(this.#data.baseline, this.#data.spellLists);
    applierFunction(model, context);
  }

  get roleSkills() {
    return this.#roleSkills;
  }

  get customizations() {
    return this.#customizations;
  }
}
