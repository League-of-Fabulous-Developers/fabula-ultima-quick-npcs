import { parseSkill } from './wizard-changes.mjs';

export class NegativeSkillList {
  #data;
  #name;
  #skills;

  constructor(data) {
    this.#name = data.name;
    this.#data = foundry.utils.deepFreeze(foundry.utils.deepClone(data.skillList));
    this.#skills = Object.fromEntries(Object.entries(this.#data).map(([key, value]) => [key, parseSkill(value)]));
  }

  get name() {
    return this.#name;
  }

  get skills() {
    return this.#skills;
  }
}
