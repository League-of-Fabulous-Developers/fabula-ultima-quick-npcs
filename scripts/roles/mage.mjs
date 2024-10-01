import {Role} from "./role.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {ConfigureAttackStep} from "../steps/configure-attack-step.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";
import {pick} from "../common/utils.mjs";
import {Spells} from "../common/spells.mjs";
import {CONSTANTS} from "../constants.mjs";
import {Rules} from "../common/rules.mjs";
import {AssignStatusImmunityStep} from "../steps/assign-status-immunity-step.mjs";

const basicMageSpellList = pick(Spells.asSkills, "breath", "cursedBreath", "fulgur", "glacies", "ignis", "lux", "omega", "terra", "umbra", "ventus")
const basicHighLevelMageSpellList = pick(Spells.asSkills, "flare", "iceberg", "thunderbolt")

const advancedMageSpellList = pick(Spells.asSkills, "cursedBreath", "drainSpirit", "lifeTheft", "mindTheft", "omega")
const advancedHighLevelMageSpellList = pick(Spells.asSkills, "devastation", "flare", "iceberg", "thunderbolt")

/**
 * @param {NpcModel} model
 * @return {SkillOptions}
 */
function getBasicSpellList(model) {
    const spellList = {}
    Object.assign(spellList, basicMageSpellList);
    if (model.level >= 30) {
        Object.assign(spellList, basicHighLevelMageSpellList)
    }
    return spellList
}

/**
 * @param {NpcModel} model
 * @return {SkillOptions}
 */
function getAdvancedSpellList(model) {
    const spellList = {}
    Object.assign(spellList, advancedMageSpellList);
    if (model.level >= 30) {
        Object.assign(spellList, advancedHighLevelMageSpellList)
    }
    return spellList
}


class Mage extends Role {

    get label() {
        return "QUICKNPC.role.mage.name";
    }

    get baseAttributes() {
        return {
            dex: "d8",
            ins: "d8",
            mig: "d6",
            wlp: "d10",
        };
    }

    get magicAttributes() {
        return ["ins", "wlp"];
    }

    get attributeChanges() {
        return [{ins: "d10", wlp: "d12", mig: "d8"}];
    }

    /**
     * An array with 6 functions, corresponding to level 10 through 60.
     * @return {[ApplySkill, ApplySkill, ApplySkill, ApplySkill, ApplySkill, ApplySkill]}
     */
    get skillsByLevel() {
        return [
            CommonSkills.normalAttackMagic.apply,
            CommonSkills.additionalRoleSkill.apply,
            CommonSkills.oneImmunity.apply,
            CommonSkills.additionalRoleSkill.apply,
            model => model.bonuses.magic += 3,
            CommonSkills.additionalRoleSkill.apply
        ];
    }

    applyBaseline(model, context) {
        AssignVulnerabilityStep.addVulnerability(context)

        model.bonuses.def += 1;
        model.bonuses.mDef += 2;

        model.attacks = {
            normal: {
                name: game.i18n.localize("QUICKNPC.attacks.normal"),
                accuracy: 0,
                targetDefense: "def",
                baseDamage: 5,
                damage: 0,
                damageType: "",
                special: []
            },
        }
        ConfigureAttackStep.configureAttributeChoice(context, "normal", [["dex", "ins"], ["ins", "wlp"]])
        ConfigureAttackStep.configureDamageTypeChoice(context, "normal")
        ConfigureAttackStep.configureRange(context, "normal")

        ChooseCustomizationStep.addCustomization(context, {
            baselineTwoSpells: {
                label: "QUICKNPC.role.mage.baselineTwoSpells.name",
                description: "QUICKNPC.role.mage.baselineTwoSpells.description",
                apply: (model, context) => {
                    const spellList = getBasicSpellList(model);
                    ChooseSpellStep.addSpell(context, spellList);
                    ChooseSpellStep.addSpell(context, spellList);
                }
            },
            baselineOneSpellMpBonus: {
                label: "QUICKNPC.role.mage.baselineOneSpellMpBonus.name",
                description: "QUICKNPC.role.mage.baselineOneSpellMpBonus.description",
                apply: (model, context) => {
                    ChooseSpellStep.addSpell(context, getBasicSpellList(model));
                    model.bonuses.mp += 10;
                }
            }
        })
    }

    /**
     * @return SkillOptions
     */
    get roleSkills() {
        return {
            statusImmunities: {
                label: "QUICKNPC.role.mage.statusImmunities.name",
                description: "QUICKNPC.role.mage.statusImmunities.description",
                apply: (model, context) => {
                    AssignStatusImmunityStep.addStatusImmunity(context, ["dazed", "enraged", "poisoned", "shaken"])
                    AssignStatusImmunityStep.addStatusImmunity(context, ["dazed", "enraged", "poisoned", "shaken"])
                }
            },
            twoResistances: CommonSkills.twoResistancesExceptPhysical,
            normalAttackMpRecovery: CommonSkills.normalAttackMpRecovery,
            normalAttackVolatile: {
                label: "QUICKNPC.role.mage.normalAttackVolatile.name",
                description: "QUICKNPC.role.mage.normalAttackVolatile.description",
                require: {
                    attack: "normal"
                },
                apply: (model) => {
                    model.attacks.normal.special.push(game.i18n.localize("QUICKNPC.role.mage.normalAttackVolatile.specialText"))
                }
            },
            spells: {
                label: "QUICKNPC.role.mage.spells.name",
                description: "QUICKNPC.role.mage.spells.description",
                apply: (model, context) => {
                    ChooseCustomizationStep.addCustomization(context, {
                        twoSpells: {
                            label: "QUICKNPC.role.mage.twoSpells.name",
                            description: "QUICKNPC.role.mage.twoSpells.description",
                            apply: (model, context) => {
                                const spellList = getAdvancedSpellList(model);
                                ChooseSpellStep.addSpell(context, spellList);
                                ChooseSpellStep.addSpell(context, spellList);
                            }
                        },
                        oneSpellMpBonus: {
                            label: "QUICKNPC.role.mage.oneSpellMpBonus.name",
                            description: "QUICKNPC.role.mage.oneSpellMpBonus.description",
                            apply: (model, context) => {
                                ChooseSpellStep.addSpell(context, getAdvancedSpellList(model));
                                model.bonuses.mp += 10;
                            }
                        }
                    })
                }
            },
            elementDrain: {
                label: "QUICKNPC.role.mage.elementDrain.name",
                description: "QUICKNPC.role.mage.elementDrain.description",
                apply: (model) => model.rules.elementDrain = Rules.simpleRule("QUICKNPC.role.mage.elementDrain")
            },
            elementShift: {
                label: "QUICKNPC.role.mage.elementShift.name",
                description: "QUICKNPC.role.mage.elementShift.description",
                apply: (model) => model.rules.elementShift = Rules.simpleRule("QUICKNPC.role.mage.elementShift")
            },
            magicalMastery: {
                label: "QUICKNPC.role.mage.magicalMastery.name",
                description: "QUICKNPC.role.mage.magicalMastery.description",
                apply: (model) => model.rules.magicalMastery = Rules.simpleRule("QUICKNPC.role.mage.magicalMastery")
            },
        };
    }

    /**
     * @return SkillOptions
     */
    get customizations() {
        return {
            oneImmunity: CommonSkills.oneImmunity,
            collateralDamage: {
                label: "QUICKNPC.role.mage.collateralDamage.name",
                description: "QUICKNPC.role.mage.collateralDamage.description",
                choices: {
                    damageType: {
                        label: "QUICKNPC.commonChoices.damageType",
                        options: CONSTANTS.damageTypes
                    }
                },
                apply: (model, context, {damageType}) => {
                    model.rules.collateralDamage = Rules.simpleRule("QUICKNPC.role.mage.collateralDamage", {
                        damageType: game.i18n.localize(CONSTANTS.damageTypes[damageType]),
                    })
                }
            },
            overwhelm: {
                label: "QUICKNPC.role.mage.overwhelm.name",
                description: "QUICKNPC.role.mage.overwhelm.description",
                apply: (model) => {
                    model.rules.overwhelm = Rules.simpleRule("QUICKNPC.role.mage.overwhelm")
                }
            },
            soulburst: {
                label: "QUICKNPC.role.mage.soulburst.name",
                description: "QUICKNPC.role.mage.soulburst.description",
                apply: (model) => {
                    model.rules.soulburst = Rules.simpleRule("QUICKNPC.role.mage.soulburst")
                }
            }
        };
    }
}

export const mage = new Mage();