import { CONSTANTS } from '../constants.mjs';

/**
 * @property {string} name
 * @property {string} summary
 * @property {number} cost
 * @property {"self", "single", "upToThree", "special"} target
 * @property {"total", "perTarget"} costType
 * @property {"instant", "scene"} duration
 * @property {string} opportunity
 * @property {string} description
 * @property {OffensiveSpellDataModel, null} offensive
 */
export class SpellDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { StringField, NumberField, EmbeddedDataField } = foundry.data.fields;
    return {
      name: new StringField({ blank: true, nullable: false }),
      summary: new StringField({ blank: false, nullable: false }),
      cost: new NumberField({ min: 0, initial: 10 }),
      target: new StringField({
        blank: false,
        nullable: false,
        choices: ['self', 'single', 'upToThree', 'special', 'weapon'],
      }),
      costType: new StringField({
        blank: false,
        nullable: false,
        choices: ['total', 'perTarget'],
      }),
      duration: new StringField({
        blank: false,
        nullable: false,
        choices: ['instant', 'scene'],
      }),
      opportunity: new StringField({ blank: true, nullable: false }),
      description: new StringField({ blank: true, nullable: false }),
      offensive: new EmbeddedDataField(OffensiveSpellDataModel, {
        nullable: true,
      }),
    };
  }

  toItemData() {
    const systemDurations = {
      instant: 'instantaneous',
      scene: 'scene',
    };

    /**
     * @type {Record<"self"| "single"| "upToThree"| "special"|"weapon", string>}
     */
    const targetValuesToTargetingRules = {
      self: 'self',
      single: 'single',
      upToThree: 'multiple',
      special: 'special',
      weapon: 'weapon',
    };

    /**
     * @type {Record<"self"| "single"| "upToThree"|"special"|"weapon", string>}
     */
    const targetValuesToTargetCount = {
      self: 1,
      single: 1,
      upToThree: 3,
      special: 0,
      weapon: 1,
    };

    return {
      name: this.name,
      type: 'spell',
      system: {
        isFavored: { value: true },
        summary: { value: this.summary },
        description: this.description,
        mpCost: {
          value: this.costType === 'total' ? `${this.cost}` : `${this.cost}xT`,
        },
        target: {
          value: game.i18n.localize(`QUICKNPC.spell.targets.${this.target}`),
        },
        duration: { value: systemDurations[this.duration] },
        isOffensive: { value: !!this.offensive },
        rollInfo: this.offensive
          ? {
              attributes: {
                primary: { value: this.offensive.attributes[0] },
                secondary: { value: this.offensive.attributes[1] },
              },
              damage: this.offensive.damage
                ? {
                    hasDamage: { value: true },
                    type: { value: this.offensive.damage.type },
                    value: this.offensive.damage.value,
                  }
                : {},
            }
          : {},
        hasRoll: {
          value: !!this.offensive,
        },
        cost: {
          resource: 'mp',
          amount: this.cost,
        },
        targeting: {
          rule: targetValuesToTargetingRules[this.target],
          max: targetValuesToTargetCount[this.target],
        },
      },
    };
  }
}

/**
 * @property {[Attribute, Attribute]} attributes
 * @property {DamagingSpellDataModel, null} damage
 */
class OffensiveSpellDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { ArrayField, StringField, EmbeddedDataField } = foundry.data.fields;
    return {
      attributes: new ArrayField(
        new StringField({
          blank: false,
          nullable: false,
          choices: Object.keys(CONSTANTS.attributes),
        }),
        { min: 2, max: 2 },
      ),
      damage: new EmbeddedDataField(DamagingSpellDataModel, { nullable: true }),
    };
  }

  get accuracy() {
    return this.parent.parent.derived.bonusAccuracy + this.parent.parent.bonuses.magic;
  }
}

/**
 * @property {number} base
 * @property {DamageType} type
 */
class DamagingSpellDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { NumberField, StringField } = foundry.data.fields;
    return {
      base: new NumberField({ min: 0, initial: 10 }),
      type: new StringField({
        blank: false,
        nullable: false,
        choices: Object.keys(CONSTANTS.damageTypes),
      }),
    };
  }

  get value() {
    return this.base + this.parent.parent.parent.derived.bonusDamage;
  }
}
