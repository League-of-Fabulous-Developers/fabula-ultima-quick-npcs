import {CONSTANTS} from "../constants.mjs";
import {Spells} from "../common/spells.mjs";

const damageTypeKey = "damageType";

export class DesignerSpellList {

    #data;
    #name;
    #spells;

    constructor(data, filePath) {
        this.#data = foundry.utils.deepFreeze(foundry.utils.deepClone(data.spellList));
        this.#name = data.name;
        this.#spells = Object.fromEntries(Object.entries(this.#data).map(([key, value]) => {
            let fullKey = `${filePath}|${key}`;
            return [key, this.#parseSpell(value, fullKey)];
        }));
    }

    get name() {
        return this.#name;
    }

    get spells() {
        return this.#spells;
    }

    /**
     * @param jsonData
     * @param {string} key
     * @return {Skill}
     */
    #parseSpell(jsonData, key) {

        /** @type {Record<string, NestedChoice>} */
        const choicesForSpell = {}
        const spellChoices = {...(jsonData.choices ?? {})}

        let chooseDamageType = false;
        if (typeof jsonData.offensive === "object" && typeof jsonData.offensive.damageType !== "string") {
            chooseDamageType = true;
            if (jsonData.offensive.damageType === true) {
                choicesForSpell[damageTypeKey] = {
                    label: "QUICKNPC.commonChoices.damageType",
                    options: CONSTANTS.damageTypes
                }
            } else {
                choicesForSpell[damageTypeKey] = {
                    label: "QUICKNPC.commonChoices.damageType",
                    options: Object.fromEntries(jsonData.offensive.damageType.map(damageType => ([damageType, CONSTANTS.damageTypes[damageType]])))
                }
            }
            delete spellChoices[damageTypeKey];
        }

        Object.assign(choicesForSpell, spellChoices);

        return {
            label: jsonData.name,
            description: jsonData.summary,
            choices: choicesForSpell,
            require: jsonData.require,
            disallow: jsonData.disallow,
            apply: (model, context, choices) => {
                choices = {...choices}
                /** @type Spell */
                const spell = {
                    name: "",
                    summary: "",
                    description: "",
                    cost: jsonData.cost,
                    costType: jsonData.costType,
                    target: jsonData.target,
                    duration: jsonData.duration,
                    opportunity: "",
                };

                if (jsonData.offensive) {
                    spell.offensive = {
                        accuracy: 0,
                        attributes: Spells.getAttributes(context)
                    }
                    if (typeof jsonData.offensive === "object") {
                        spell.offensive.damage = {
                            base: jsonData.offensive.baseDamage,
                            value: 0,
                            type: jsonData.offensive.damageType,
                        }
                        if (chooseDamageType) {
                            spell.offensive.damage.type = choices[damageTypeKey];
                        }
                    }
                }
                choices = Object.fromEntries(Object.entries(choices).map(([key, value]) => [key, game.i18n.localize(choicesForSpell[key]?.options[value] ?? value)]))
                spell.name = game.i18n.format(jsonData.name, choices);
                spell.summary = game.i18n.format(jsonData.summary, choices);
                spell.description = game.i18n.format(jsonData.description, choices);
                spell.opportunity = game.i18n.format(jsonData.opportunity ?? "", choices);
                model.updateSource({
                    spells: {
                        [key]: spell
                    }
                });
            }
        }
    }
}