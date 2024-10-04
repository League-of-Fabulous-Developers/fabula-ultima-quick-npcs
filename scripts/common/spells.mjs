import {CONSTANTS} from "../constants.mjs";

const t1StatusEffects = {
    dazed: CONSTANTS.statusEffects.dazed,
    shaken: CONSTANTS.statusEffects.shaken,
    slow: CONSTANTS.statusEffects.slow,
    weak: CONSTANTS.statusEffects.weak
}

/**
 * @param {string} key
 * @param {Record<string, string>} [data]
 * @return {{name: string, summary: string, description: string}}
 */
const spellTexts = (key, data) => ({
    name: game.i18n.localize(`QUICKNPC.spell.${key}.name`),
    summary: game.i18n.localize(`QUICKNPC.spell.${key}.description`),
    description: data ? game.i18n.format(`QUICKNPC.spell.${key}.spellText`, data) : game.i18n.localize(`QUICKNPC.spell.${key}.spellText`)
})

function translateDamageType(damageType) {
    return game.i18n.localize(CONSTANTS.damageTypes[damageType]);
}

function translateStatus(status) {
    return game.i18n.localize(CONSTANTS.statusEffects[status]);
}

/**
 * @typedef {{ attributes: [Attribute, Attribute], level: number } & Record<string, string>} SpellParams
 */

/**
 * @type {Record<string, ((params: SpellParams) => Spell)>}
 */
const allSpells = {
    areaStatus: ({status}) => ({
        ...spellTexts("areaStatus", {status: translateStatus(status)}),
        cost: 20,
        target: "special",
        costType: "total",
        duration: "instant",
    }),
    aura: () => ({
        ...spellTexts("aura"),
        cost: 5,
        target: "upToThree",
        costType: "perTarget",
        duration: "scene",
    }),
    awaken: () => ({
        ...spellTexts("awaken"),
        cost: 20,
        target: "single",
        costType: "total",
        duration: "scene",
    }),
    barrier: () => ({
        ...spellTexts("barrier"),
        cost: 5,
        target: "upToThree",
        costType: "perTarget",
        duration: "scene",
    }),
    breath: ({attributes, damageType}) => ({
        ...spellTexts("breath", {damageType: translateDamageType(damageType)}),
        cost: 5,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes,
            damage: {
                base: 10,
                type: damageType
            }
        }
    }),
    cleanse: () => ({
        ...spellTexts("cleanse"),
        cost: 5,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant",
    }),
    curse: ({attributes, status}) => ({
        ...spellTexts("curse", {status: translateStatus(status)}),
        cost: 5,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes
        }
    }),
    curseXL: ({attributes, status1, status2}) => ({
        ...spellTexts("curseXL", {
            status1: translateStatus(status1),
            status2: translateStatus(status2),
        }),
        cost: 10,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes
        }
    }),
    cursedBreath: ({attributes, damageType, status}) => ({
        ...spellTexts("cursedBreath", {
            damageType: translateDamageType(damageType),
            status: translateStatus(status)
        }),
        cost: 10,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes,
            damage: {
                base: 15,
                type: damageType
            }
        },
    }),
    devastation: ({damageType}) => ({
        ...spellTexts("devastation", {damageType: translateDamageType(damageType)}),
        cost: 30,
        target: "special",
        costType: "total",
        duration: "instant",
    }),
    dispel: () => ({
        ...spellTexts("dispel"),
        cost: 10,
        target: "single",
        costType: "total",
        duration: "instant",
    }),
    divination: () => ({
        ...spellTexts("divination"),
        cost: 10,
        target: "self",
        costType: "total",
        duration: "scene"
    }),
    drainSpirit: ({attributes}) => ({
        ...spellTexts("drainSpirit"),
        cost: 5,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes,
        }
    }),
    elementalShroud: () => ({
        ...spellTexts("elementalShroud"),
        cost: 5,
        target: "upToThree",
        costType: "perTarget",
        duration: "scene"
    }),
    enrage: ({attributes}) => ({
        ...spellTexts("enrage"),
        cost: 10,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes
        },
    }),
    flare: ({attributes}) => ({
        ...spellTexts("flare"),
        cost: 20,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes,
            damage: {
                base: 25,
                type: "fire"
            }
        }
    }),
    fulgur: ({attributes}) => ({
        ...spellTexts("fulgur"),
        cost: 10,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant",
        opportunity: game.i18n.localize("QUICKNPC.spell.fulgur.opportunity"),
        offensive: {
            attributes: attributes,
            damage: {
                base: 15,
                type: "bolt"
            }
        }
    }),
    glacies: ({attributes}) => ({
        ...spellTexts("glacies"),
        cost: 10,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant",
        opportunity: game.i18n.localize("QUICKNPC.spell.glacies.opportunity"),
        offensive: {
            attributes: attributes,
            damage: {
                base: 15,
                type: "ice"
            }
        }
    }),
    heal: ({level}) => ({
        ...spellTexts("heal", {amount: level < 20 ? "40" : level < 40 ? "50" : "60"}),
        cost: 10,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant"
    }),
    iceberg: ({attributes}) => ({
        ...spellTexts("iceberg"),
        cost: 20,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes,
            damage: {
                base: 25,
                type: "ice"
            }
        }
    }),
    ignis: ({attributes}) => ({
        ...spellTexts("ignis"),
        cost: 10,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant",
        opportunity: game.i18n.localize("QUICKNPC.spell.ignis.opportunity"),
        offensive: {
            attributes: attributes,
            damage: {
                base: 15,
                type: "fire"
            }
        }
    }),
    lickWounds: ({level}) => ({
        ...spellTexts("lickWounds", {amount: level < 20 ? "20" : level < 40 ? "30" : level < 60 ? "40" : "60"}),
        cost: 5,
        target: "self",
        costType: "total",
        duration: "instant",
    }),
    lifeTheft: ({attributes, damageType}) => ({
        ...spellTexts("lifeTheft", {damageType: translateDamageType(damageType)}),
        cost: 10,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes,
            damage: {
                base: 15,
                type: damageType
            }
        }
    }),
    lux: ({attributes}) => ({
        ...spellTexts("lux"),
        cost: 10,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant",
        opportunity: game.i18n.localize("QUICKNPC.spell.lux.opportunity"),
        offensive: {
            attributes: attributes,
            damage: {
                base: 15,
                type: "light"
            }
        }
    }),
    mindTheft: ({attributes, damageType}) => ({
        ...spellTexts("mindTheft", {damageType: translateDamageType(damageType)}),
        cost: 10,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes,
            damage: {
                base: 15,
                type: damageType
            }
        }
    }),
    mirror: () => ({
        ...spellTexts("mirror"),
        cost: 5,
        target: "single",
        costType: "total",
        duration: "scene",
    }),
    omega: ({attributes}) => ({
        ...spellTexts("omega"),
        cost: 20,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes,
        }
    }),
    poison: ({attributes}) => ({
        ...spellTexts("poison"),
        cost: 5,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant",
        offensive: {
            attributes: attributes,
        }
    }),
    quicken: () => ({
        ...spellTexts("quicken"),
        cost: 20,
        target: "single",
        costType: "total",
        duration: "instant"
    }),
    rage: ({attributes}) => ({
        ...spellTexts("rage"),
        cost: 10,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant",
        offensive: {
            attributes: attributes,
        }
    }),
    reinforce: () => ({
        ...spellTexts("reinforce"),
        cost: 5,
        target: "upToThree",
        costType: "perTarget",
        duration: "scene",
    }),
    shell: () => ({
        ...spellTexts("shell"),
        cost: 10,
        target: "self",
        costType: "total",
        duration: "scene",
    }),
    stop: ({attributes}) => ({
        ...spellTexts("stop"),
        cost: 10,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes,
        }
    }),
    terra: ({attributes}) => ({
        ...spellTexts("terra"),
        cost: 10,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant",
        opportunity: game.i18n.localize("QUICKNPC.spell.terra.opportunity"),
        offensive: {
            attributes: attributes,
            damage: {
                base: 15,
                type: "earth"
            }
        }
    }),
    thunderbolt: ({attributes}) => ({
        ...spellTexts("thunderbolt"),
        cost: 20,
        target: "single",
        costType: "total",
        duration: "instant",
        offensive: {
            attributes: attributes,
            damage: {
                base: 25,
                type: "bolt"
            }
        }
    }),
    umbra: ({attributes}) => ({
        ...spellTexts("umbra"),
        cost: 10,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant",
        opportunity: game.i18n.localize("QUICKNPC.spell.umbra.opportunity"),
        offensive: {
            attributes: attributes,
            damage: {
                base: 15,
                type: "dark"
            }
        }
    }),
    ventus: ({attributes}) => ({
        ...spellTexts("ventus"),
        cost: 10,
        target: "upToThree",
        costType: "perTarget",
        duration: "instant",
        opportunity: game.i18n.localize("QUICKNPC.spell.ventus.opportunity"),
        offensive: {
            attributes: attributes,
            damage: {
                base: 15,
                type: "air"
            }
        }
    }),
    warCry: () => ({
        ...spellTexts("warCry"),
        cost: 10,
        target: "upToThree",
        costType: "perTarget",
        duration: "scene",
    }),
    weaken: ({attributes, damageType}) => ({
        ...spellTexts("weaken", {damageType: translateDamageType(damageType)}),
        cost: 10,
        target: "single",
        costType: "total",
        duration: "scene",
        offensive: {
            attributes: attributes,
        }
    }),
}

/**
 * @param {string} key
 * @param {Record<string, NestedChoice>} [choices]
 * @param {((choices: Record<string, string>) => boolean)} [validateChoices]
 * @return {Skill}
 */
const spellSkill = (key, choices, validateChoices) => ({
    label: `QUICKNPC.spell.${key}.name`,
    description: `QUICKNPC.spell.${key}.description`,
    choices,
    apply: (model, context, userChoices) => {
        if (validateChoices && !validateChoices(userChoices)) {
            return false;
        }
        model.spells[key] = allSpells[key]({...userChoices, attributes: getAttributes(context)})
    }
})

/**
 * @type {SkillOptions}
 */
const asSkills = {
    areaStatus: spellSkill("areaStatus", {
        status: {
            label: "QUICKNPC.commonChoices.status",
            options: {...t1StatusEffects}
        }
    }),
    aura: spellSkill("aura"),
    awaken: spellSkill("awaken"),
    barrier: spellSkill("barrier"),
    breath: spellSkill("breath", {
        damageType: {
            label: "QUICKNPC.commonChoices.damageType",
            options: CONSTANTS.damageTypes
        }
    }),
    cleanse: spellSkill("cleanse"),
    curse: spellSkill("curse", {
        status: {
            label: "QUICKNPC.commonChoices.status",
            options: {...t1StatusEffects}
        }
    }),
    curseXL: spellSkill("curseXL", {
            status1: {
                label: "QUICKNPC.spell.curseXL.status1",
                options: t1StatusEffects
            },
            status2: {
                label: "QUICKNPC.spell.curseXL.status2",
                options: t1StatusEffects
            },
        },
        (choices) => choices.status1 !== choices.status2),
    cursedBreath: spellSkill("cursedBreath", {
        damageType: {
            label: "QUICKNPC.commonChoices.damageType",
            options: CONSTANTS.damageTypes
        },
        status: {
            label: "QUICKNPC.commonChoices.status",
            options: t1StatusEffects
        }
    }),
    devastation: spellSkill("devastation", {
        damageType: {
            label: "QUICKNPC.commonChoices.damageType",
            options: CONSTANTS.damageTypes
        }
    }),
    dispel: spellSkill("dispel"),
    divination: spellSkill("divination"),
    drainSpirit: spellSkill("drainSpirit"),
    elementalShroud: spellSkill("elementalShroud"),
    enrage: spellSkill("enrage"),
    flare: spellSkill("flare"),
    fulgur: spellSkill("fulgur"),
    glacies: spellSkill("glacies"),
    heal: spellSkill("heal"),
    iceberg: spellSkill("iceberg"),
    ignis: spellSkill("ignis"),
    lickWounds: spellSkill("lickWounds"),
    lifeTheft: spellSkill("lifeTheft", {
        damageType: {
            label: "QUICKNPC.commonChoices.damageType",
            options: CONSTANTS.damageTypes
        }
    }),
    lux: spellSkill("lux"),
    mindTheft: spellSkill("mindTheft", {
        damageType: {
            label: "QUICKNPC.commonChoices.damageType",
            options: CONSTANTS.damageTypes
        }
    }),
    mirror: spellSkill("mirror"),
    omega: spellSkill("omega"),
    poison: spellSkill("poison"),
    quicken: spellSkill("quicken"),
    rage: spellSkill("rage"),
    reinforce: spellSkill("reinforce"),
    shell: spellSkill("shell"),
    stop: spellSkill("stop"),
    terra: spellSkill("terra"),
    thunderbolt: spellSkill("thunderbolt"),
    umbra: spellSkill("umbra"),
    ventus: spellSkill("ventus"),
    warCry: spellSkill("warCry"),
    weaken: spellSkill("weaken", {
        damageType: {
            label: "QUICKNPC.commonChoices.damageType",
            options: CONSTANTS.damageTypes
        }
    }),
}

const spellAttributeKey = "spellcastingAttributes"

/**
 * @param context
 * @param {Attribute} attr1
 * @param {Attribute} attr2
 */
function setAttributes(context, attr1, attr2) {
    if (attr1 in CONSTANTS.attributes && attr2 in CONSTANTS.attributes) {
        context[spellAttributeKey] = [attr1, attr2]
    } else {
        throw new Error(`Invalid attributes: [${attr1} + ${attr2}]`)
    }
}

/**
 * @param context
 * @return {[Attribute, Attribute]}
 */
function getAttributes(context) {
    return context[spellAttributeKey];
}

export const Spells = {
    allSpells,
    asSkills,
    setAttributes,
    getAttributes
}