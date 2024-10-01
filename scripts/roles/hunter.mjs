import {Role} from "./role.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {ConfigureAttackStep} from "../steps/configure-attack-step.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {Rules} from "../common/rules.mjs";
import {Spells} from "../common/spells.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";
import {pick} from "../common/utils.mjs";
import {CONSTANTS} from "../constants.mjs";

/**
 * @type {SkillOptions}
 */
const hunterSpellList = pick(Spells.asSkills, "breath", "cursedBreath", "lickWounds", "lifeTheft", "mirror");

/**
 * @type SkillOptions
 */
const normalAttackOptions = {
    lifeSteal: {
        label: "QUICKNPC.role.hunter.lifeSteal.name",
        description: "QUICKNPC.role.hunter.lifeSteal.description",
        apply: model => {
            model.attacks.normal.special.push(game.i18n.localize("QUICKNPC.role.hunter.lifeSteal.specialText"))
        }
    },
    extraDamage: {
        label: "QUICKNPC.role.hunter.extraDamage.name",
        description: "QUICKNPC.role.hunter.extraDamage.description",
        choices: {
            condition: {
                label: "QUICKNPC.role.hunter.extraDamage.condition",
                options: {
                    specificStatus: "QUICKNPC.role.hunter.extraDamage.specificStatusLabel",
                    multipleStatuses: "QUICKNPC.role.hunter.extraDamage.multipleStatuses",
                    crisis: "QUICKNPC.role.hunter.extraDamage.crisis",
                    notCrisis: "QUICKNPC.role.hunter.extraDamage.notCrisis",
                    turnTaken: "QUICKNPC.role.hunter.extraDamage.turnTaken",
                    spell: "QUICKNPC.role.hunter.extraDamage.spell",
                    martialArmor: "QUICKNPC.role.hunter.extraDamage.martialArmor",
                    noMartialArmor: "QUICKNPC.role.hunter.extraDamage.noMartialArmor",
                }
            },
            status: {
                label: "QUICKNPC.commonChoices.status",
                options: CONSTANTS.statusEffects,
                conditional: {
                    condition: "specificStatus"
                }
            }
        },
        apply: (model, context, {condition, status}) => {
            model.attacks.normal.special.push(game.i18n.format("QUICKNPC.role.hunter.extraDamage.specialText", {
                condition: game.i18n.format(`QUICKNPC.role.hunter.extraDamage.${condition}`, {
                    status: game.i18n.localize(CONSTANTS.statusEffects[status])
                })
            }))
        }
    }
};


class Hunter extends Role {

    get label() {
        return "QUICKNPC.role.hunter.name";
    }

    get baseAttributes() {
        return {
            dex: "d10",
            ins: "d8",
            mig: "d8",
            wlp: "d6"
        };
    }

    get magicAttributes() {
        return ["ins", "wlp"];
    }

    get attributeChanges() {
        return [{wlp: "d8"}, {dex: "d12"}, {ins: "d10"}];
    }

    get skillsByLevel() {
        return [
            (model) => {
                model.bonuses.accuracy += 3
            },
            CommonSkills.additionalRoleSkill.apply,
            CommonSkills.normalAttackIgnoreResistance.apply,
            CommonSkills.additionalRoleSkill.apply,
            CommonSkills.twoResistances.apply,
            CommonSkills.additionalRoleSkill.apply,
        ];
    }

    applyBaseline(model, context) {
        AssignVulnerabilityStep.addVulnerability(context)

        model.attacks = {
            normal: {
                name: game.i18n.localize("QUICKNPC.attacks.normal"),
                accuracy: 0,
                targetDefense: "def",
                baseDamage: 10,
                damage: 0,
                damageType: "",
                special: []
            },
        }
        ConfigureAttackStep.configureAttributeChoice(context, "normal", [["dex", "ins"], ["dex", "mig"]])
        ConfigureAttackStep.configureDamageTypeChoice(context, "normal")
        ConfigureAttackStep.configureRange(context, "normal")
        ConfigureAttackStep.configureSpecialChoice(context, "normal", normalAttackOptions)

    }

    /**
     * @return {SkillOptions}
     */
    get roleSkills() {
        return {
            normalAttackMagic: CommonSkills.normalAttackMagic,
            strongAttack: {
                label: "QUICKNPC.role.hunter.strongAttack.name",
                description: "QUICKNPC.role.hunter.strongAttack.description",
                apply: (model, context) => {
                    model.attacks.strong = {
                        name: game.i18n.localize("QUICKNPC.attacks.strong"),
                        accuracy: 0,
                        targetDefense: "def",
                        baseDamage: 15,
                        damage: 0,
                        damageType: "",
                        special: [
                            game.i18n.localize("QUICKNPC.attacks.special.multi2"),
                            game.i18n.localize("QUICKNPC.role.hunter.strongAttack.special")
                        ]
                    }
                    ConfigureAttackStep.configureAttributeChoice(context, "strong", [["dex", "ins"], ["dex", "mig"]])
                    ConfigureAttackStep.configureDamageTypeChoice(context, "strong")
                    ConfigureAttackStep.configureRange(context, "strong")
                }
            },
            strongAttackMagic: CommonSkills.strongAttackMagic,
            spells: {
                label: "QUICKNPC.role.hunter.spells.name",
                description: "QUICKNPC.role.hunter.spells.description",
                apply: (model, context) => {
                    ChooseSpellStep.addSpell(context, hunterSpellList);
                    ChooseSpellStep.addSpell(context, hunterSpellList);
                }
            },
            ambush: {
                label: "QUICKNPC.role.hunter.ambush.name",
                description: "QUICKNPC.role.hunter.ambush.description",
                choices: {
                    attribute: {
                        label: "QUICKNPC.commonChoices.attribute",
                        options: CONSTANTS.attributes
                    }
                },
                apply: (model, context, {attribute}) => {
                    model.rules.ambush = Rules.simpleRule("QUICKNPC.role.hunter.ambush", {
                        attribute: game.i18n.localize(`QUICKNPC.attributes.${attribute}`)
                    })
                }
            },
            elusive: {
                label: "QUICKNPC.role.hunter.elusive.name",
                description: "QUICKNPC.role.hunter.elusive.description",
                apply: (model) => {
                    model.rules.elusive = Rules.simpleRule("QUICKNPC.role.hunter.elusive")
                }
            },
            huntersBait: {
                label: "QUICKNPC.role.hunter.huntersBait.name",
                description: "QUICKNPC.role.hunter.huntersBait.description",
                choices: {
                    action: {
                        label: "QUICKNPC.role.hunter.huntersBait.action",
                        options: {
                            melee: "QUICKNPC.role.hunter.huntersBait.melee",
                            ranged: "QUICKNPC.role.hunter.huntersBait.ranged",
                            spell: "QUICKNPC.role.hunter.huntersBait.spell",
                        }
                    }
                },
                apply: (model, context, {action}) => {
                    model.rules.huntersBait = Rules.simpleRule("QUICKNPC.role.hunter.huntersBait", {
                        action: game.i18n.localize(`QUICKNPC.role.hunter.huntersBait.${action}`)
                    })
                }
            },
            opportunist: {
                label: "QUICKNPC.role.hunter.opportunist.name",
                description: "QUICKNPC.role.hunter.opportunist.description",
                apply: (model) => {
                    model.rules.opportunist = Rules.simpleRule("QUICKNPC.role.hunter.opportunist")
                }
            },
            targetLock: {
                label: "QUICKNPC.role.hunter.targetLock.name",
                description: "QUICKNPC.role.hunter.targetLock.description",
                apply: (model) => {
                    model.rules.targetLock = Rules.simpleRule("QUICKNPC.role.hunter.targetLock")
                }
            }
        }
    }

    /**
     * @return SkillOptions
     */
    get customizations() {
        return {
            hunterAdditionalRoleSkill: CommonSkills.additionalRoleSkill,
            emergencyCamouflage: {
                label: "QUICKNPC.role.hunter.emergencyCamouflage.name",
                description: "QUICKNPC.role.hunter.emergencyCamouflage.description",
                apply: model => {model.rules.emergencyCamouflage = Rules.simpleRule("QUICKNPC.role.hunter.emergencyCamouflage")}
            },
            falseSenseOfSecurity: {
                label: "QUICKNPC.role.hunter.falseSenseOfSecurity.name",
                description: "QUICKNPC.role.hunter.falseSenseOfSecurity.description",
                apply: model => {model.rules.falseSenseOfSecurity = Rules.simpleRule("QUICKNPC.role.hunter.falseSenseOfSecurity")}
            },
            lightningFast: {
                label: "QUICKNPC.role.hunter.lightningFast.name",
                description: "QUICKNPC.role.hunter.lightningFast.description",
                apply: model => {model.rules.lightningFast = Rules.simpleRule("QUICKNPC.role.hunter.lightningFast")}
            },
            specialResistance: {
                label: "QUICKNPC.role.hunter.specialResistance.name",
                description: "QUICKNPC.role.hunter.specialResistance.description",
                choices: {
                    targets: {
                        label: "QUICKNPC.role.hunter.specialResistance.targets",
                        options: {
                            single: "QUICKNPC.role.hunter.specialResistance.single",
                            multi: "QUICKNPC.role.hunter.specialResistance.multi"
                        }
                    }
                },
                apply: (model, context, {targets}) => {
                    model.rules.specialResistance = Rules.simpleRule("QUICKNPC.role.hunter.specialResistance", {
                        targets: game.i18n.localize(`QUICKNPC.role.hunter.specialResistance.${targets}`)
                    })
                }
            }
        }
    }
}

export const hunter = new Hunter()