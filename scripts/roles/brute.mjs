import {CONSTANTS} from "../constants.mjs";
import {Role} from "./role.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {ConfigureAttackStep} from "../steps/configure-attack-step.mjs";
import {AssignStatusImmunityStep} from "../steps/assign-status-immunity-step.mjs";
import {Spells} from "../common/spells.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";
import {Rules} from "../common/rules.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {CommonRequirements} from "../common/requirements.mjs";
import {pick} from "../common/utils.mjs";

const bruteSpellList = pick(Spells.asSkills, "areaStatus", "curseXL", "cursedBreath", "enrage", "lickWounds", "lifeTheft", "poison", "reinforce");

class Brute extends Role {

    get label() {
        return "QUICKNPC.role.brute.name";
    }

    get baseAttributes() {
        return {
            dex: "d8",
            ins: "d6",
            mig: "d10",
            wlp: "d8",
        }
    }

    get attributeChanges() {
        return [{ins: "d8"}, {mig: "d12"}, {wlp: "d10"}]
    }

    get skillsByLevel() {
        return [
            CommonSkills.twoResistancesExceptPhysical.apply,
            CommonSkills.additionalRoleSkill.apply,
            CommonSkills.oneImmunity.apply,
            CommonSkills.additionalRoleSkill.apply,
            CommonSkills.hpPlus10.apply,
            CommonSkills.additionalRoleSkill.apply,
        ];
    }

    applyBaseline(model, context) {
        model.bonuses.hp = 10

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
                special: [game.i18n.localize("QUICKNPC.attacks.special.multi2")]
            },
            strong: {
                name: game.i18n.localize("QUICKNPC.attacks.strong"),
                attributes: ["mig", "mig"],
                accuracy: 0,
                range: "melee",
                targetDefense: "def",
                baseDamage: 10,
                damage: 0,
                damageType: "",
                special: []
            }
        }

        ConfigureAttackStep.configureDamageTypeChoice(context, "normal")
        ConfigureAttackStep.configureRange(context, "normal")

        ConfigureAttackStep.configureDamageTypeChoice(context, "strong")
    }

    /**
     * @return {SkillOptions}
     */
    get roleSkills() {
        return {
            statusImmunities: {
                label: "QUICKNPC.role.brute.statusImmunities.name",
                description: "QUICKNPC.role.brute.statusImmunities.description",
                apply: (model, context) => {
                    AssignStatusImmunityStep.addStatusImmunity(context, ["shaken", "slow", "poisoned"])
                    AssignStatusImmunityStep.addStatusImmunity(context, ["shaken", "slow", "poisoned"])
                }
            },
            normalAttackMagic: CommonSkills.normalAttackMagic,
            strongAttackRanged: {
                label: "QUICKNPC.role.brute.strongAttackRanged.name",
                description: "QUICKNPC.role.brute.strongAttackRanged.description",
                choices: {
                    status: {
                        label: "QUICKNPC.commonChoices.status",
                        options: {
                            dazed: CONSTANTS.statusEffects.dazed,
                            shaken: CONSTANTS.statusEffects.shaken,
                            slow: CONSTANTS.statusEffects.slow,
                            weak: CONSTANTS.statusEffects.weak
                        }
                    }
                },
                apply: (model, context, choices) => {
                    const attack = model.attacks.strong;
                    attack.range = "ranged"
                    attack.attributes = ["dex", "mig"]
                    attack.special.push(game.i18n.format("QUICKNPC.attacks.special.causesStatus", {status: game.i18n.localize(CONSTANTS.statusEffects[choices.status])}))
                }
            },
            collapse: {
                label: "QUICKNPC.role.brute.collapse.name",
                description: "QUICKNPC.role.brute.collapse.description",
                choices: {
                    damageType: {
                        label: "QUICKNPC.commonChoices.damageType",
                        options: CONSTANTS.damageTypes
                    }
                },
                require: CommonRequirements.eliteOrChampion,
                apply: (model, context, choices) => {
                    model.rules.collapse = Rules.simpleRule("QUICKNPC.role.brute.collapse", {damageType: game.i18n.localize(CONSTANTS.damageTypes[choices.damageType])})
                }
            },
            spells: {
                label: "QUICKNPC.role.brute.spells.name",
                description: "QUICKNPC.role.brute.spells.description",
                require: CommonRequirements.eliteOrChampion,
                apply: (model, context) => {
                    ChooseSpellStep.addSpell(context, bruteSpellList);
                    ChooseSpellStep.addSpell(context, bruteSpellList);
                }
            },
            crush: {
                label: "QUICKNPC.role.brute.crush.name",
                description: "QUICKNPC.role.brute.crush.description",
                apply: (model) => {
                    model.actions.crush = Rules.simpleRule("QUICKNPC.role.brute.crush")
                    model.attacks.strong.special.push(game.i18n.localize("QUICKNPC.role.brute.crush.attackSpecialText"));
                }
            },
            enhancingGuard: {
                label: "QUICKNPC.role.brute.enhancingGuard.name",
                description: "QUICKNPC.role.brute.enhancingGuard.description",
                apply: (model) => {
                    model.rules.enhancingGuard = Rules.simpleRule("QUICKNPC.role.brute.enhancingGuard")
                }
            },
            soreLoser: {
                label: "QUICKNPC.role.brute.soreLoser.name",
                description: "QUICKNPC.role.brute.soreLoser.description",
                apply: (model) => {
                    model.rules.soreLoser = Rules.simpleRule("QUICKNPC.role.brute.soreLoser");
                }
            },
            steadyRecovery: {
                label: "QUICKNPC.role.brute.steadyRecovery.name",
                description: "QUICKNPC.role.brute.steadyRecovery.description",
                apply: (model) => {
                    model.rules.steadyRecovery = Rules.simpleRule("QUICKNPC.role.brute.steadyRecovery")
                }
            }
        };
    }

    /**
     * @return {SkillOptions}
     */
    get customizations() {
        return {
            hpPlus10: CommonSkills.hpPlus10,
            badTemper: {
                label: "QUICKNPC.role.brute.badTemper.name",
                description: "QUICKNPC.role.brute.badTemper.description",
                apply: model => {
                    model.rules.badTemper = Rules.simpleRule("QUICKNPC.role.brute.badTemper")
                }
            },
            collateralDamage: {
                label: "QUICKNPC.role.brute.collateralDamage.name",
                description: "QUICKNPC.role.brute.collateralDamage.description",
                choices: {
                    damageType: {
                        label: "QUICKNPC.commonChoices.damageType",
                        options: CONSTANTS.damageTypes
                    }
                },
                apply: (model, context, {damageType}) => {
                    model.rules.collateralDamage = Rules.simpleRule("QUICKNPC.role.brute.collateralDamage", {
                        damageType: game.i18n.localize(CONSTANTS.damageTypes[damageType])
                    })
                }
            },
            dieHard: {
                label: "QUICKNPC.role.brute.dieHard.name",
                description: "QUICKNPC.role.brute.dieHard.description",
                apply: model => {
                    model.rules.dieHard = Rules.simpleRule("QUICKNPC.role.brute.dieHard")
                }
            },
            specialArmor: {
                label: "QUICKNPC.role.brute.specialArmor.name",
                description: "QUICKNPC.role.brute.specialArmor.description",
                choices: {
                    type: {
                        label: "QUICKNPC.role.brute.specialArmor.type",
                        options: {
                            attacks: "QUICKNPC.role.brute.specialArmor.attacks",
                            spells: "QUICKNPC.role.brute.specialArmor.spells",
                            skills: "QUICKNPC.role.brute.specialArmor.skills",
                        }
                    }
                },
                apply: (model, context, choices) => {
                    model.rules.specialArmor = Rules.simpleRule("QUICKNPC.role.brute.specialArmor", {
                        type: game.i18n.localize(`QUICKNPC.role.brute.specialArmor.${choices.type}`)
                    })
                }
            },
            vengefulAttack: {
                label: "QUICKNPC.role.brute.vengefulAttack.name",
                description: "QUICKNPC.role.brute.vengefulAttack.description",
                apply: model => {
                    model.rules.vengefulAttack = Rules.simpleRule("QUICKNPC.role.brute.vengefulAttack")
                }
            }
        };
    }
}

export const brute = new Brute();