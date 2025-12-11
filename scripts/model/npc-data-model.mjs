/**
 * @typedef {"dex", "ins", "mig", "wlp"} Attribute
 */

/**
 * @typedef {"d6", "d8", "d10", "d12"} AttributeDice
 */

/**
 * @typedef {"soldier", "elite", "champion1", "champion2", "champion3", "champion4", "champion5", "champion6"} Rank
 */

/**
 * @typedef {"beast", "construct", "demon", "elemental", "humanoid", "monster", "plant", "undead"} Species
 */

/**
 * @typedef {"physical", "air", "bolt", "dark", "earth", "fire", "ice", "light", "poison"} DamageType
 */

import {DerivedValuesDataModel} from "./derived-values-data-model.mjs";
import {AffinityDataModel} from "./affinity-data-model.mjs";
import {AttackDataModel} from "./attack-data-model.mjs";
import {ActionDataModel} from "./action-data-model.mjs";
import {SpellDataModel} from "./spell-data-model.mjs";
import {RuleDataModel} from "./rule-data-model.mjs";

class AttributeDiceField extends foundry.data.fields.StringField {
    constructor() {
        super({
            blank: false,
            nullable: false,
            initial: "d8",
            choices: ["d6", "d8", "d10", "d12"]
        })
    }
}

/**
 * @property {string} name
 * @property {number} level
 * @property {Rank} rank
 * @property {Species} species
 * @property {string} traits
 * @property {Record<Attribute, AttributeDice>} attributes
 * @property {DerivedValuesDataModel} derived
 * @property {Record<"hp"|"mp"|"def"|"mDef"|"init"|"accuracy"|"magic", number>} bonuses
 * @property {Record<DamageType, AffinityDataModel>} affinities
 * @property {Record<"dazed"|"shaken"|"slow"|"weak"|"enraged"|"poisoned", boolean>} statusImmunities
 * @property {Record<string, AttackDataModel>} attacks
 * @property {Record<string, ActionDataModel>} actions
 * @property {Record<string, SpellDataModel>} spells
 * @property {Record<string, RuleDataModel>} rules
 */
export class NpcDataModel extends foundry.abstract.DataModel {

    static defineSchema() {
        const {
            StringField,
            NumberField,
            EmbeddedDataField,
            SchemaField,
            BooleanField,
            TypedObjectField
        } = foundry.data.fields;
        return {
            name: new StringField({blank: true, nullable: false}),
            level: new NumberField({min: 0, initial: 0, max: 60, nullable: false}),
            rank: new StringField({
                blank: true,
                choices: ["soldier", "elite", "champion1", "champion2", "champion3", "champion4", "champion5", "champion6"]
            }),
            species: new StringField({
                blank: true,
                choices: ["beast", "construct", "demon", "elemental", "humanoid", "monster", "plant", "undead"]
            }),
            traits: new StringField({blank: true, nullable: false}),
            attributes: new SchemaField({
                dex: new AttributeDiceField(),
                ins: new AttributeDiceField(),
                mig: new AttributeDiceField(),
                wlp: new AttributeDiceField(),
            }),
            derived: new EmbeddedDataField(DerivedValuesDataModel),
            bonuses: new SchemaField({
                hp: new NumberField({initial: 0}),
                mp: new NumberField({initial: 0}),
                def: new NumberField({initial: 0}),
                mDef: new NumberField({initial: 0}),
                init: new NumberField({initial: 0}),
                accuracy: new NumberField({initial: 0}),
                magic: new NumberField({initial: 0})
            }),
            affinities: new SchemaField({
                physical: new EmbeddedDataField(AffinityDataModel),
                air: new EmbeddedDataField(AffinityDataModel),
                bolt: new EmbeddedDataField(AffinityDataModel),
                dark: new EmbeddedDataField(AffinityDataModel),
                earth: new EmbeddedDataField(AffinityDataModel),
                fire: new EmbeddedDataField(AffinityDataModel),
                ice: new EmbeddedDataField(AffinityDataModel),
                light: new EmbeddedDataField(AffinityDataModel),
                poison: new EmbeddedDataField(AffinityDataModel),
            }),
            statusImmunities: new SchemaField({
                dazed: new BooleanField({initial: false}),
                shaken: new BooleanField({initial: false}),
                slow: new BooleanField({initial: false}),
                weak: new BooleanField({initial: false}),
                enraged: new BooleanField({initial: false}),
                poisoned: new BooleanField({initial: false}),
            }),
            attacks: new TypedObjectField(new EmbeddedDataField(AttackDataModel)),
            actions: new TypedObjectField(new EmbeddedDataField(ActionDataModel)),
            spells: new TypedObjectField(new EmbeddedDataField(SpellDataModel)),
            rules: new TypedObjectField(new EmbeddedDataField(RuleDataModel)),
        }

    }

    /**
     * @param {Attribute} attribute
     */
    attributeValue(attribute) {
        const diceValues = {
            d6: 6,
            d8: 8,
            d10: 10,
            d12: 12
        }
        return diceValues[this.attributes[attribute]];
    }


    toActorData() {
        const systemAffinityValues = {
            vul: -1,
            "": 0,
            res: 1,
            imm: 2,
            abs: 3
        }

        return {
            name: this.name,
            type: "npc",
            system: {
                species: {value: this.species},
                level: {value: this.level},
                traits: {value: this.traits},
                attributes: Object.fromEntries(Object.entries(this.attributes).map(([key]) => [key, {base: this.attributeValue(key)}])),
                bonuses: {
                    accuracy: {
                        accuracyCheck: this.bonuses.accuracy,
                        magicCheck: this.bonuses.magic
                    },
                    damage: {
                        melee: this.derived.bonusDamage,
                        ranged: this.derived.bonusDamage,
                        spell: this.derived.bonusDamage
                    }
                },
                derived: {
                    def: {bonus: this.bonuses.def},
                    mdef: {bonus: this.bonuses.mDef}
                },
                immunities: Object.fromEntries(Object.entries(this.statusImmunities).map(([key, value]) => [key, {base: value}])),
                resources: {
                    hp: {
                        value: this.derived.hp,
                        bonus: this.bonuses.hp
                    },
                    mp: {
                        value: this.derived.mp,
                        bonus: this.bonuses.mp
                    },
                },
                affinities: Object.fromEntries(Object.entries(this.affinities).map(([key, value]) => [key, {base: systemAffinityValues[value.value]}])),
                isElite: {value: this.rank === "elite"},
                isChampion: {value: this.rank.startsWith("champion") ? Number(this.rank.substring(8)) : 1},
                rank: {
                    value: this.rank.substring(0, 8),
                    replacedSoldiers: this.rank === "soldier" ? 1 : this.rank === "elite" ? 2 : Number(this.rank.substring(8))
                }
            },
            items: [
                ...Object.values(this.attacks).map(attack => attack.toItemData()),
                ...Object.values(this.spells).map(spell => spell.toItemData()),
                ...Object.values(this.actions).map(action => action.toItemData()),
                ...Object.values(this.rules).map(rule => rule.toItemData())
            ]
        }
    }
}