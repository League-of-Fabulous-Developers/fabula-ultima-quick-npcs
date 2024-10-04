import {CommonSkills} from "../common/skills.mjs";
import {AssignStatusImmunityStep} from "../steps/assign-status-immunity-step.mjs";
import {Role} from "./role.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {ConfigureAttackStep} from "../steps/configure-attack-step.mjs";
import {CONSTANTS} from "../constants.mjs";
import {Rules} from "../common/rules.mjs";
import {CommonRequirements} from "../common/requirements.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";
import {pick} from "../common/utils.mjs";
import {Spells} from "../common/spells.mjs";

const sentinelSpellList = pick(Spells.asSkills, "breath", "lickWounds", "shell", "warCry")

/**
 * @param {StatusEffect} status
 * @return Skill
 */
const statusChoice = status => ({
    label: `QUICKNPC.statusEffects.${status}`,
    description: `QUICKNPC.role.sentinel.normalAttackStatus.description.${status}`,
    apply: model => {
        model.attacks.normal.special.push(game.i18n.format("QUICKNPC.role.sentinel.normalAttackStatus.specialText", {
            status: game.i18n.localize(CONSTANTS.statusEffects[status])
        }));
    }
});

const normalAttackSpecialChoices = {
    dazed: statusChoice("dazed"),
    shaken: statusChoice("shaken"),
    slow: statusChoice("slow"),
    weak: statusChoice("weak"),
};

class Sentinel extends Role {

    /**
     * @return string
     */
    get label() {
        return "QUICKNPC.role.sentinel.name"
    }

    /**
     * @return {Record<Attribute, AttributeDice>}
     */
    get baseAttributes() {
        return {
            dex: "d8",
            ins: "d8",
            mig: "d8",
            wlp: "d8"
        }
    }

    /**
     * @return {[AttributeChange, AttributeChange, AttributeChange]}
     */
    get attributeChanges() {
        return [{mig: "d10"}, {wlp: "d10"}, {dex: "d10"}]
    }

    /**
     * An array with 6 functions, corresponding to level 10 through 60.
     * @return {[ApplySkill, ApplySkill, ApplySkill, ApplySkill, ApplySkill, ApplySkill]}
     */
    get skillsByLevel() {
        return [
            CommonSkills.twoResistancesExceptPhysical.apply,
            CommonSkills.additionalRoleSkill.apply,
            model => {
                model.bonuses.def += 2;
                model.bonuses.mDef += 1;
            },
            CommonSkills.additionalRoleSkill.apply,
            (model, context) => {
                AssignStatusImmunityStep.addStatusImmunity(context, ["shaken", "weak", "poisoned"])
                AssignStatusImmunityStep.addStatusImmunity(context, ["shaken", "weak", "poisoned"])
            },
            CommonSkills.additionalRoleSkill.apply
        ]
    }

    /**
     * @param {NpcModel} model
     * @param context
     * @return void
     */
    applyBaseline(model, context) {
        AssignVulnerabilityStep.addVulnerability(context)
        AssignVulnerabilityStep.addVulnerability(context)

        model.attacks = {
            normal: {
                name: game.i18n.localize("QUICKNPC.attacks.normal"),
                attributes: ["dex", "mig"],
                accuracy: 0,
                targetDefense: "def",
                baseDamage: 5,
                damage: 0,
                damageType: "",
                special: []
            },
            strong: {
                name: game.i18n.localize("QUICKNPC.attacks.strong"),
                attributes: ["dex", "mig"],
                accuracy: 0,
                targetDefense: "def",
                baseDamage: 10,
                damage: 0,
                damageType: "",
                special: []
            }
        }

        ConfigureAttackStep.configureRange(context, "normal")
        ConfigureAttackStep.configureDamageTypeChoice(context, "normal")
        ConfigureAttackStep.configureSpecialChoice(context, "normal", normalAttackSpecialChoices)

        ConfigureAttackStep.configureRange(context, "strong")
        ConfigureAttackStep.configureDamageTypeChoice(context, "strong")
    }

    /**
     * @return SkillOptions
     */
    get roleSkills() {
        return {
            twoResistances: CommonSkills.twoResistances,
            normalAttackMulti2: {
                ...CommonSkills.normalAttackMulti2,
                require: CommonRequirements.eliteOrChampion,
            },
            normalAttackMagic: CommonSkills.normalAttackMagic,
            strongAttackDispel: {
                label: "QUICKNPC.role.sentinel.strongAttackDispel.name",
                description: "QUICKNPC.role.sentinel.strongAttackDispel.description",
                choices: {
                    status: {
                        label: "QUICKNPC.commonChoices.status",
                        options: CONSTANTS.statusEffects
                    }
                },
                apply: (model, context, {status}) => {
                    model.attacks.strong.special.push(game.i18n.format("QUICKNPC.role.sentinel.strongAttackDispel.specialText", {
                        status: game.i18n.localize(CONSTANTS.statusEffects[status])
                    }))
                }
            },
            spell: {
                label: "QUICKNPC.role.sentinel.spell.name",
                description: "QUICKNPC.role.sentinel.spell.description",
                apply: (model, context) => {
                    ChooseSpellStep.addSpell(context, sentinelSpellList)
                    model.bonuses.mp += 10
                }
            },
            barricadeOneType: {
                label: "QUICKNPC.role.sentinel.barricade.name.oneType",
                description: "QUICKNPC.role.sentinel.barricade.description.oneType",
                choices: {
                    damageType: {
                        label: "QUICKNPC.commonChoices.damageType",
                        options: CONSTANTS.damageTypes
                    }
                },
                disallow: {
                    anyAction: ["barricade"]
                },
                apply: (model, context, {damageType}) => {
                    model.actions.barricade = {
                        name: game.i18n.localize("QUICKNPC.role.sentinel.barricade.name.rule"),
                        summary: game.i18n.localize("QUICKNPC.role.sentinel.barricade.description.oneType"),
                        description: game.i18n.format("QUICKNPC.role.sentinel.barricade.actionText.oneType", {
                            damageType: game.i18n.localize(CONSTANTS.damageTypes[damageType])
                        }),
                    }
                }
            },
            barricadeTwoTypes: {
                label: "QUICKNPC.role.sentinel.barricade.name.twoTypes",
                description: "QUICKNPC.role.sentinel.barricade.description.twoTypes",
                choices: {
                    damageType1: {
                        label: "QUICKNPC.commonChoices.damageType",
                        options: CONSTANTS.damageTypes
                    },
                    damageType2: {
                        label: "QUICKNPC.commonChoices.damageType",
                        options: CONSTANTS.damageTypes
                    }
                },
                disallow: {
                    anyAction: ["barricade"]
                },
                apply: (model, context, {damageType1, damageType2}) => {
                    if (damageType1 === damageType2) {
                        return false;
                    }
                    model.actions.barricade = {
                        name: game.i18n.localize("QUICKNPC.role.sentinel.barricade.name.rule"),
                        summary: game.i18n.localize("QUICKNPC.role.sentinel.barricade.description.twoTypes"),
                        description: game.i18n.format("QUICKNPC.role.sentinel.barricade.actionText.twoTypes", {
                            damageType1: game.i18n.localize(CONSTANTS.damageTypes[damageType1]),
                            damageType2: game.i18n.localize(CONSTANTS.damageTypes[damageType2])
                        }),
                    }
                }
            },
            avengeOneAction: {
                label: "QUICKNPC.role.sentinel.avenge.name.oneAction",
                description: "QUICKNPC.role.sentinel.avenge.description.oneAction",
                choices: {
                    action: {
                        label: "QUICKNPC.role.sentinel.avenge.action.label",
                        options: {
                            melee: "QUICKNPC.role.sentinel.avenge.action.melee",
                            ranged: "QUICKNPC.role.sentinel.avenge.action.ranged",
                            spell: "QUICKNPC.role.sentinel.avenge.action.spell"
                        }
                    }
                },
                disallow: {
                    anyRule: ["avenge"]
                },
                apply: (model, context, {action}) => {
                    model.rules.avenge = {
                        name: game.i18n.localize("QUICKNPC.role.sentinel.avenge.name.rule"),
                        summary: game.i18n.localize("QUICKNPC.role.sentinel.avenge.description.oneAction"),
                        description: game.i18n.format("QUICKNPC.role.sentinel.avenge.ruleText.oneAction", {
                            action: game.i18n.localize(`QUICKNPC.role.sentinel.avenge.action.${action}`)
                        }),
                    }
                }
            },
            avengeTwoAction: {
                label: "QUICKNPC.role.sentinel.avenge.name.twoActions",
                description: "QUICKNPC.role.sentinel.avenge.description.twoActions",
                choices: {
                    action1: {
                        label: "QUICKNPC.role.sentinel.avenge.action.label",
                        options: {
                            melee: "QUICKNPC.role.sentinel.avenge.action.melee",
                            ranged: "QUICKNPC.role.sentinel.avenge.action.ranged",
                            spell: "QUICKNPC.role.sentinel.avenge.action.spell"
                        }
                    },
                    action2: {
                        label: "QUICKNPC.role.sentinel.avenge.action.label",
                        options: {
                            melee: "QUICKNPC.role.sentinel.avenge.action.melee",
                            ranged: "QUICKNPC.role.sentinel.avenge.action.ranged",
                            spell: "QUICKNPC.role.sentinel.avenge.action.spell"
                        }
                    }
                },
                disallow: {
                    anyRule: ["avenge"]
                },
                apply: (model, context, {action1, action2}) => {
                    if (action1 === action2) {
                        return false
                    }
                    model.rules.avenge = {
                        name: game.i18n.localize("QUICKNPC.role.sentinel.avenge.name.rule"),
                        summary: game.i18n.localize("QUICKNPC.role.sentinel.avenge.description.twoActions"),
                        description: game.i18n.format("QUICKNPC.role.sentinel.avenge.ruleText.twoActions", {
                            action1: game.i18n.localize(`QUICKNPC.role.sentinel.avenge.action.${action1}`),
                            action2: game.i18n.localize(`QUICKNPC.role.sentinel.avenge.action.${action2}`)
                        }),
                    }
                }
            },
            reassuringAura: {
                label: "QUICKNPC.role.sentinel.reassuringAura.name",
                description: "QUICKNPC.role.sentinel.reassuringAura.description",
                choices: {
                    status: {
                        label: "QUICKNPC.commonChoices.status",
                        options: pick(CONSTANTS.statusEffects, "dazed", "shaken", "slow", "weak")
                    },
                },
                apply: (model, context, {status}) => {
                    model.rules.reassuringAura = Rules.simpleRule("QUICKNPC.role.sentinel.reassuringAura", {
                        status: game.i18n.localize(CONSTANTS.statusEffects[status])
                    })
                }
            },
            reduceProgress: {
                label: "QUICKNPC.role.sentinel.reduceProgress.name",
                description: "QUICKNPC.role.sentinel.reduceProgress.description",
                choices: {
                    status1: {
                        label: "QUICKNPC.commonChoices.status",
                        options: CONSTANTS.statusEffects
                    },
                    status2: {
                        label: "QUICKNPC.commonChoices.status",
                        options: CONSTANTS.statusEffects
                    },
                },
                apply: (model, context, {status1, status2}) => {
                    if (status1 === status2) {
                        return false;
                    }
                    model.rules.reduceProgress = Rules.simpleRule("QUICKNPC.role.sentinel.reduceProgress", {
                        status1: game.i18n.localize(CONSTANTS.statusEffects[status1]),
                        status2: game.i18n.localize(CONSTANTS.statusEffects[status1])
                    })
                }
            }
        }
    }

    /**
     * @return SkillOptions
     */
    get customizations() {
        return {
            additionalRoleSkill: CommonSkills.additionalRoleSkill,
            intercept: {
                label: "QUICKNPC.role.sentinel.intercept.name",
                description: "QUICKNPC.role.sentinel.intercept.description",
                apply: model => {
                    model.rules.intercept = Rules.simpleRule("QUICKNPC.role.sentinel.intercept");
                }
            },
            threaten: {
                label: "QUICKNPC.role.sentinel.threaten.name",
                description: "QUICKNPC.role.sentinel.threaten.description",
                apply: model => {
                    model.rules.threaten = Rules.simpleRule("QUICKNPC.role.sentinel.threaten");
                }
            },
            vulnerabilityBlock: {
                label: "QUICKNPC.role.sentinel.vulnerabilityBlock.name",
                description: "QUICKNPC.role.sentinel.vulnerabilityBlock.description",
                apply: model => {
                    model.rules.vulnerabilityBlock = Rules.simpleRule("QUICKNPC.role.sentinel.vulnerabilityBlock");
                }
            },
            unwaveringSupport: {
                label: "QUICKNPC.role.sentinel.unwaveringSupport.name",
                description: "QUICKNPC.role.sentinel.unwaveringSupport.description",
                apply: model => {
                    model.rules.unwaveringSupport = Rules.simpleRule("QUICKNPC.role.sentinel.unwaveringSupport");
                }
            }
        }
    }
}

export const sentinel = new Sentinel();