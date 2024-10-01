export const LOG_MESSAGE = "Quick NPCs | "

export const CONSTANTS = {}

/**
 * @type {Record<Attribute, string>}
 */
CONSTANTS.attributes = {
    dex: 'QUICKNPC.attributes.dex',
    ins: 'QUICKNPC.attributes.ins',
    mig: 'QUICKNPC.attributes.mig',
    wlp: 'QUICKNPC.attributes.wlp',
}

/**
 * @type {Record<DamageType, string>}
 */
CONSTANTS.damageTypes = {
    physical: 'QUICKNPC.damageType.physical',
    air: 'QUICKNPC.damageType.air',
    bolt: 'QUICKNPC.damageType.bolt',
    dark: 'QUICKNPC.damageType.dark',
    earth: 'QUICKNPC.damageType.earth',
    fire: 'QUICKNPC.damageType.fire',
    ice: 'QUICKNPC.damageType.ice',
    light: 'QUICKNPC.damageType.light',
    poison: 'QUICKNPC.damageType.poison',
}

/**
 * @type {Record<DamageType, string>}
 */
CONSTANTS.damageTypeIcons = {
    physical: 'fua fu-phys',
    air: 'fua fu-wind',
    bolt: 'fua fu-bolt',
    dark: 'fua fu-dark',
    earth: 'fua fu-earth',
    fire: 'fua fu-fire',
    ice: 'fua fu-ice',
    light: 'fua fu-light',
    poison: 'fua fu-poison',
};

/**
 * @type {Record<StatusEffect, string>}
 */
CONSTANTS.statusEffects = {
    dazed: "QUICKNPC.statusEffects.dazed",
    shaken: "QUICKNPC.statusEffects.shaken",
    slow: "QUICKNPC.statusEffects.slow",
    weak: "QUICKNPC.statusEffects.weak",
    enraged: "QUICKNPC.statusEffects.enraged",
    poisoned: "QUICKNPC.statusEffects.poisoned",
}

/**
 * @typedef {"attack","equipment","guard","hinder","inventory","objective","spell","study"} SystemAction
 */
/**
 * @type {Record<SystemAction, string>}
 */
CONSTANTS.actions = {
    attack: "QUICKNPC.actions.attack",
    equipment: "QUICKNPC.actions.equipment",
    guard: "QUICKNPC.actions.guard",
    hinder: "QUICKNPC.actions.hinder",
    inventory: "QUICKNPC.actions.inventory",
    objective: "QUICKNPC.actions.objective",
    spell: "QUICKNPC.actions.spell",
    study: "QUICKNPC.actions.study",
}

/**
 * @typedef {"hp", "mp", "ip"} Resource
 */
/**
 * @type {Record<Resource, string>}
 */
CONSTANTS.resources = {
    hp: "QUICKNPC.resource.hp",
    mp: "QUICKNPC.resource.mp",
    ip: "QUICKNPC.resource.ip"
}