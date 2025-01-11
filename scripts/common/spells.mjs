import {CONSTANTS} from "../constants.mjs";

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
    setAttributes,
    getAttributes
}