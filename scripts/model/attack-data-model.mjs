import { CONSTANTS } from '../constants.mjs';

/**
 * @property {string} name
 * @property {"melee", "ranged"} range
 * @property {[Attribute, Attribute]} attributes
 * @property {number} baseDamage
 * @property {DamageType} damageType
 * @property {"def", "mDef"} targetDefense
 * @property {string[]} special
 */
export class AttackDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { StringField, ArrayField, NumberField } = foundry.data.fields;
    return {
      name: new StringField({ blank: true, nullable: false }),
      range: new StringField({
        blank: false,
        nullable: false,
        choices: ['melee', 'ranged'],
      }),
      attributes: new ArrayField(
        new StringField({
          blank: false,
          nullable: false,
          choices: Object.keys(CONSTANTS.attributes),
        }),
        { min: 2, max: 2, initial: ['dex', 'ins'] },
      ),
      baseDamage: new NumberField({ min: 0, initial: 5 }),
      damageType: new StringField({
        blank: false,
        nullable: false,
        choices: Object.keys(CONSTANTS.damageTypes),
      }),
      targetDefense: new StringField({
        blank: false,
        nullable: false,
        initial: 'def',
        choices: ['def', 'mDef'],
      }),
      special: new ArrayField(new StringField({ blank: false, nullable: false })),
    };
  }

  get accuracy() {
    return this.parent.derived.bonusAccuracy + this.parent.bonuses.accuracy;
  }

  get damage() {
    return this.baseDamage + this.parent.derived.bonusDamage;
  }

  toItemData() {
    return {
      name: this.name,
      type: 'basic',
      system: {
        isFavored: { value: true },
        attributes: {
          primary: { value: this.attributes[0] },
          secondary: { value: this.attributes[1] },
        },
        defense: this.targetDefense.toLowerCase(),
        damage: { value: this.baseDamage },
        type: { value: this.range },
        damageType: { value: this.damageType },
        description: this.special.reduce((previousValue, currentValue) => `${previousValue}<p>${currentValue}</p>`, ''),
      },
    };
  }
}
