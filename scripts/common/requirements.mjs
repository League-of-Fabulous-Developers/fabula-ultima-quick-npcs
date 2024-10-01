/**
 * @typedef Requirements
 * @property {boolean} [anyResistance]
 * @property {boolean} [anyImmunity]
 * @property {Rank[]} [rank]
 * @property {string} [attack]
 * @property {string[]} [anyRule]
 * @property {string[]} [anyAction]
 */


/**
 * @param {Requirements} require
 * @param {Requirements} disallow
 * @param {NpcModel} model
 * @return boolean
 */
export function checkPrerequisites(require, disallow, model) {
    return checkRequire(require, model) && checkDisallow(disallow, model);
}

/**
 * @param {Requirements} require
 * @param {NpcModel} model
 * @return {boolean}
 */
function checkRequire(require, model) {
    if (!require) return true;
    let met = true

    if (require.anyResistance) {
        met = met && Object.values(model.affinities).some(damageType => damageType === "res")
    }

    if (require.attack) {
        met = met && !!model.attacks[require.attack]
    }

    if (require.rank) {
        met = met && require.rank.includes(model.rank)
    }

    if (require.anyRule) {
        met = met && require.anyRule.some(rule => !!model.rules[rule])
    }

    if (require.anyAction) {
        met = met && require.anyAction.some(action => !!model.actions[action])
    }


    return met
}

/**
 * @param {Requirements} disallow
 * @param {NpcModel} model
 * @return {boolean}
 */
function checkDisallow(disallow, model) {
    if (!disallow) return true;
    return !checkRequire(disallow, model)
}

/**
 * @type {Record<string, Requirements>}
 */
export const CommonRequirements = {
    anyResistance: {
        anyResistance: true
    },
    anyImmunity: {
        anyImmunity: true
    },
    eliteOrChampion: {
        rank: ["elite", "champion1", "champion2", "champion3", "champion4", "champion5", "champion6"]
    },
    normalAttack: {
        attack: "normal"
    },
    strongAttack: {
        attack: "strong"
    }
}