/**
 * @typedef {"vul", "", "res", "imm", "abs"} Affinity
 */
import { NpcDataModel } from './npc-data-model.mjs';

export class DerivedValuesDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {};
  }

  /** @override */
  _configure(options) {
    super._configure(options);
    if (!(this.parent instanceof NpcDataModel)) {
      throw new Error('Incorrect parent data model, DerivedValues requires an NPC as parent.');
    }
  }

  #hpRankMulti() {
    const rankMultis = {
      soldier: 1,
      elite: 2,
      champion1: 1,
      champion2: 2,
      champion3: 3,
      champion4: 4,
      champion5: 5,
      champion6: 6,
    };
    return rankMultis[this.parent.rank] ?? 1;
  }

  #mpRankMulti() {
    if (this.parent.rank && this.parent.rank.startsWith('champion')) {
      return 2;
    } else {
      return 1;
    }
  }

  get hp() {
    const npc = this.parent;
    const baseHp = this.parent.attributeValue('mig') * 5;
    const levelHp = npc.level * 2;
    const bonusHp = npc.bonuses.hp;
    const rankMulti = this.#hpRankMulti();

    return (baseHp + levelHp + bonusHp) * rankMulti;
  }

  get crisis() {
    return Math.floor(this.hp / 2);
  }

  get mp() {
    const npc = this.parent;
    const baseMp = this.parent.attributeValue('wlp') * 5;
    const levelMp = npc.level;
    const bonusMp = npc.bonuses.mp;
    const rankMulti = this.#mpRankMulti();

    return (baseMp + levelMp + bonusMp) * rankMulti;
  }

  get init() {
    const dex = this.parent.attributeValue('dex');
    const ins = this.parent.attributeValue('ins');
    const baseInit = Math.floor((dex + ins) / 2);
    return baseInit + this.parent.bonuses.init;
  }

  get bonusDamage() {
    return Math.floor(this.parent.level / 20) * 5;
  }

  get bonusAccuracy() {
    return Math.floor(this.parent.level / 10);
  }
}
