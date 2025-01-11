/**
 * @typedef {"d6", "d8", "d10", "d12"} AttributeDice
 */

/**
 * @typedef {"vul", "", "res", "imm", "abs"} Affinity
 */

/**
 * @typedef {"dex", "ins", "mig", "wlp"} Attribute
 */

/**
 * @typedef {"physical", "air", "bolt", "dark", "earth", "fire", "ice", "light", "poison"} DamageType
 */

/**
 * @typedef {"soldier", "elite", "champion1", "champion2", "champion3", "champion4", "champion5", "champion6"} Rank
 */

/**
 * @typedef {"beast", "construct", "demon", "elemental", "humanoid", "monster", "plant", "undead"} NpcSpecies
 */

/**
 * @typedef {"dazed", "shaken", "slow", "weak", "enraged", "poisoned"} StatusEffect
 */

/**
 * @typedef Attack
 * @property {string} name
 * @property {"melee", "ranged"} range
 * @property {[Attribute, Attribute]} attributes
 * @property {number} accuracy
 * @property {number} [damage]
 * @property {number} baseDamage
 * @property {DamageType} damageType
 * @property {"def", "mDef"} targetDefense
 * @property {string[]} special
 */

/**
 * @typedef Action
 * @property {string} name
 * @property {string} summary
 * @property {string} description
 */

/**
 * @typedef Spell
 * @property {string} name
 * @property {string} summary
 * @property {number} cost
 * @property {"self", "single", "upToThree", "special"} target
 * @property {"total", "perTarget"} costType
 * @property {"instant", "scene"} duration
 * @property {string} [opportunity]
 * @property {string} description
 * @property {Object} [offensive]
 * @property {[Attribute, Attribute]} offensive.attributes
 * @property {number} offensive.[accuracy]
 * @property {Object} offensive.[damage]
 * @property {number} offensive.damage.base
 * @property {number} offensive.damage.[value]
 * @property {DamageType} offensive.damage.type
 */

/**
 * @typedef Rule
 * @property {string} name
 * @property {string} [summary]
 * @property {string} description
 */

/**
 * @typedef NpcModel
 * @property {string} name
 * @property {number} level
 * @property {Rank} rank
 * @property {string} species
 * @property {Record<Attribute, AttributeDice>} attributes
 * @property {number} derived.hp
 * @property {number} derived.crisis
 * @property {number} derived.mp
 * @property {number} derived.init
 * @property {string} traits
 * @property {number} bonuses.hp
 * @property {number} bonuses.mp
 * @property {number} bonuses.def
 * @property {number} bonuses.mDef
 * @property {number} bonuses.init
 * @property {number} bonuses.accuracy
 * @property {number} bonuses.magic
 * @property {Record<DamageType, AffinityModel>} affinities
 * @property {Record<StatusEffect, boolean>} statusImmunities
 * @property {Record<string, Attack>} attacks
 * @property {Record<string, Action>} actions
 * @property {Record<string, Spell>} spells
 * @property {Record<string, Rule>} rules
 */

/**
 * @typedef AffinityModel
 * @property {boolean, "species"} vul
 * @property {boolean} res
 * @property {boolean} imm
 * @property {boolean} abs
 * @property {Affinity} value
 */

/**
 * @return AffinityModel
 */
function createAffinity() {
    return {
        vul: false,
        res: false,
        imm: false,
        abs: false,
        value: ""
    };
}

/**
 * @param {AffinityModel} affinity
 * @return {Affinity}
 */
function computeAffinity(affinity) {
    if (affinity.abs) {
        return "abs";
    }
    if (affinity.imm) {
        return "imm";
    }
    if (affinity.res && affinity.vul) {
        return "";
    }
    if (affinity.res) {
        return "res";
    }
    if (affinity.vul) {
        return "vul";
    }
    return "";
}


/**
 * @return NpcModel
 */
function newNpcModel() {
    return {
        name: "",
        level: 0,
        rank: "",
        species: "",
        traits: "",
        attributes: {
            dex: "d8",
            ins: "d8",
            mig: "d8",
            wlp: "d8",
        },
        derived: {
            hp: 0,
            crisis: 0,
            mp: 0,
            init: 8,
        },
        bonuses: {
            hp: 0,
            mp: 0,
            def: 0,
            mDef: 0,
            init: 0,
            accuracy: 0,
            magic: 0
        },
        affinities: {
            physical: createAffinity(),
            air: createAffinity(),
            bolt: createAffinity(),
            dark: createAffinity(),
            earth: createAffinity(),
            fire: createAffinity(),
            ice: createAffinity(),
            light: createAffinity(),
            poison: createAffinity(),
        },
        statusImmunities: {
            dazed: false,
            shaken: false,
            slow: false,
            weak: false,
            enraged: false,
            poisoned: false,
        },
        attacks: {},
        actions: {},
        spells: {},
        rules: {}
    }
}

/**
 * @param {NpcModel} model
 */
function updateDerived(model) {
    model.derived.hp = calculateHp(model);
    model.derived.crisis = Math.floor(model.derived.hp / 2)
    model.derived.mp = calculateMp(model)
    model.derived.init = calculateInit(model)
}

/**
 * @param {AttributeDice} dice
 * @return {number}
 */
function diceValue(dice) {
    const diceValues = {
        d6: 6,
        d8: 8,
        d10: 10,
        d12: 12
    }
    return diceValues[dice];
}

/**
 * @param {Rank} rank
 * @return {number}
 */
function hpRankMulti(rank) {
    /** @type {Record<Rank, number>} */
    const rankMultis = {
        soldier: 1,
        elite: 2,
        champion1: 1,
        champion2: 2,
        champion3: 3,
        champion4: 4,
        champion5: 5,
        champion6: 6,
    }

    return rankMultis[rank] ?? 1;
}

/**
 * @param {NpcModel} model
 */
function calculateHp(model) {
    const baseHp = diceValue(model.attributes.mig) * 5
    const levelHp = model.level * 2
    const bonusHp = model.bonuses.hp;
    const rankMulti = hpRankMulti(model.rank)

    return (baseHp + levelHp + bonusHp) * rankMulti;
}

/**
 * @param {Rank} rank
 * @return {number}
 */
function mpRankMulti(rank) {
    if (rank.startsWith("champion")) {
        return 2;
    } else {
        return 1;
    }
}

/**
 * @param {NpcModel} model
 * @return {number}
 */
function calculateMp(model) {
    const baseMp = diceValue(model.attributes.wlp) * 5
    const levelMp = model.level
    const bonusMp = model.bonuses.mp;
    const rankMulti = mpRankMulti(model.rank)

    return (baseMp + levelMp + bonusMp) * rankMulti;
}

/**
 * @param {NpcModel} model
 * @return {number}
 */
function calculateInit(model) {
    const baseInit = (diceValue(model.attributes.dex) + diceValue(model.attributes.ins)) / 2;
    return baseInit + model.bonuses.init;
}

/**
 * @param {NpcModel} model
 */
function updateAttacks(model) {
    const damageBonus = Math.floor(model.level / 20) * 5
    Object.values(model.attacks).forEach(attack => {
        attack.accuracy = model.bonuses.accuracy
        attack.damage = attack.baseDamage + damageBonus
    })
}

/**
 * @param {NpcModel} model
 */
function updateSpells(model) {
    const damageBonus = Math.floor(model.level / 20) * 5
    Object.values(model.spells).forEach(value => {
        const offensive = value.offensive;
        if (offensive) {
            offensive.accuracy = model.bonuses.magic
            const damage = offensive.damage;
            if (damage) {
                damage.value = damage.base + damageBonus
            }
        }
    })
}

/**
 * @param {NpcModel} model
 */
function updateAffinities(model) {
    for (const affinity of Object.values(model.affinities)) {
        affinity.value = computeAffinity(affinity)
    }
}

/**
 * @param {NpcModel} model
 */
function updateDerivedValues(model) {
    updateAffinities(model)
    updateDerived(model);
    updateAttacks(model);
    updateSpells(model);
}

const systemAffinityValues = {
    vul: -1,
    "": 0,
    res: 1,
    imm: 2,
    abs: 3
}

/**
 * @param {Attack} attack
 */
function createAttack(attack) {
    return {
        name: attack.name,
        type: "basic",
        system: {
            isFavored: {value: true},
            attributes: {
                primary: {value: attack.attributes[0]},
                secondary: {value: attack.attributes[1]}
            },
            defense: attack.targetDefense.toLowerCase(),
            damage: {value: attack.damage},
            type: {value: attack.range},
            damageType: {value: attack.damageType},
            description: (attack.special ?? []).reduce((previousValue, currentValue) => `${previousValue}<p>${currentValue}</p>`, "")
        }
    };
}

/**
 * @param {Spell} spell
 */
function createSpell(spell) {
    return {
        name: spell.name,
        type: "spell",
        system: {
            isFavored: {value: true},
            summary: {value: spell.summary},
            description: spell.description,
            mpCost: {value: spell.costType === "total" ? `${spell.cost}` : `${spell.cost}xT`},
            target: {value: game.i18n.localize(`QUICKNPC.spell.targets.${spell.target}`)},
            duration: {value: game.i18n.localize(`QUICKNPC.spell.duration.${spell.duration}`)},
            rollInfo: spell.offensive ? {
                attributes: {
                    primary: {value: spell.offensive.attributes[0]},
                    secondary: {value: spell.offensive.attributes[1]}
                },
                damage: spell.offensive.damage ? {
                    hasDamage: {value: true},
                    type: {value: spell.offensive.damage.type},
                    value: spell.offensive.damage.value
                } : {}
            } : {},
            hasRoll: {
                value: !!spell.offensive
            }
        }
    };
}

/**
 * @param {Action} action
 */
function createAction(action) {
    return {
        name: action.name,
        type: "miscAbility",
        system: {
            isFavored: {value: true},
            summary: {value: action.summary,},
            description: action.description
        }
    };
}

/**
 * @param {Rule} rule
 */
function createRule(rule) {
    return {
        name: rule.name,
        type: "rule",
        system: {
            isFavored: {value: true},
            summary: {value: rule.summary,},
            description: rule.description
        }
    };
}

/**
 * @param {NpcModel} model
 */
async function createActor(model) {
    return Actor.create({
        name: model.name,
        type: "npc",
        system: {
            species: {value: model.species},
            level: {value: model.level},
            traits: {value: model.traits},
            attributes: Object.fromEntries(Object.entries(model.attributes).map(([key, value]) => [key, {base: diceValue(value)}])),
            bonuses: {
                accuracy: {
                    accuracyCheck: model.bonuses.accuracy,
                    magicCheck: model.bonuses.magic
                }
            },
            derived: {
                def: {bonus: model.bonuses.def},
                mdef: {bonus: model.bonuses.mDef}
            },
            immunities: Object.fromEntries(Object.entries(model.statusImmunities).map(([key, value]) => [key, {base: value}])),
            resources: {
                hp: {
                    value: model.derived.hp,
                    bonus: model.bonuses.hp
                },
                mp: {
                    value: model.derived.mp,
                    bonus: model.bonuses.mp
                },
            },
            affinities: Object.fromEntries(Object.entries(model.affinities).map(([key, value]) => [key, {base: systemAffinityValues[value.value]}])),
            isElite: {value: model.rank === "elite"},
            isChampion: {value: model.rank.startsWith("champion") ? Number(model.rank.substring(8)) : 1},
            rank: {
                value: model.rank.substring(0, 8),
                replacedSoldiers: model.rank === "soldier" ? 1 : model.rank === "elite" ? 2 : Number(model.rank.substring(8))
            }
        },
        items: [
            ...Object.values(model.attacks).map(attack => createAttack(attack)),
            ...Object.values(model.spells).map(spell => createSpell(spell)),
            ...Object.values(model.actions).map(action => createAction(action)),
            ...Object.values(model.rules).map(rule => createRule(rule))
        ]
    })
}

export const NpcModel = {
    newNpcModel,
    updateDerivedValues,
    createActor,
    computeAffinity,
    createBlankAttack: undefined

}