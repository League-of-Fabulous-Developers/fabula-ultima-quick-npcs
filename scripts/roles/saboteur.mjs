import {Role} from "./role.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {ConfigureAttackStep} from "../steps/configure-attack-step.mjs";
import {CONSTANTS} from "../constants.mjs";
import {Rules} from "../common/rules.mjs";
import {Spells} from "../common/spells.mjs";
import {pick} from "../common/utils.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";
import {Actions} from "../common/actions.mjs";
import {CommonRequirements} from "../common/requirements.mjs";

const saboteurSpellList = pick(Spells.asSkills, "areaStatus", "curseXL", "dispel", "drainSpirit", "poison", "rage", "stop", "weaken")

/**
 * @type {SkillOptions}
 */
const accuracyMagicChoice = {
    accuracyCheckBonus: {
        label: "QUICKNPC.role.saboteur.accuracyCheckBonus.name",
        description: "QUICKNPC.role.saboteur.accuracyCheckBonus.description",
        apply: model => model.bonuses.accuracy += 3
    },
    magicCheckBonus: {
        label: "QUICKNPC.role.saboteur.magicCheckBonus.name",
        description: "QUICKNPC.role.saboteur.magicCheckBonus.description",
        apply: model => model.bonuses.magic += 3
    }
}

/**
 * @type {SkillOptions}
 */
const normalAttackChoices = {
    normalAttackDrainMp: {
        label: "QUICKNPC.role.saboteur.normalAttackDrainMp.name",
        description: "QUICKNPC.role.saboteur.normalAttackDrainMp.description",
        apply: model => model.attacks.normal.special.push(game.i18n.localize("QUICKNPC.role.saboteur.normalAttackDrainMp.specialText"))
    },
    normalAttackDrainIp: {
        label: "QUICKNPC.role.saboteur.normalAttackDrainIp.name",
        description: "QUICKNPC.role.saboteur.normalAttackDrainIp.description",
        apply: model => model.attacks.normal.special.push(game.i18n.localize("QUICKNPC.role.saboteur.normalAttackDrainIp.specialText"))
    },
    normalAttackStatus: {
        label: "QUICKNPC.role.saboteur.normalAttackStatus.name",
        description: "QUICKNPC.role.saboteur.normalAttackStatus.description",
        choices: {
            status: {
                label: "QUICKNPC.commonChoices.status",
                options: CONSTANTS.statusEffects
            }
        },
        apply: (model, context, {status}) => {
            model.attacks.normal.special.push(game.i18n.format("QUICKNPC.role.saboteur.normalAttackStatus.specialText", {status}));
            if (["enraged", "poisoned"].includes(status)) {
                AssignVulnerabilityStep.addVulnerability(context)
            }
        }
    }
}

/**
 * @type {SkillOptions}
 */
const strongAttackSpecialCount = {
    oneSpecial: {
        label: "QUICKNPC.role.saboteur.strongAttack.oneSpecial.name",
        description: "QUICKNPC.role.saboteur.strongAttack.oneSpecial.description",
        apply: (model, context) => {
            ChooseCustomizationStep.addCustomization(context, strongAttackChoices)
        }
    },
    twoSpecials: {
        label: "QUICKNPC.role.saboteur.strongAttack.twoSpecials.name",
        description: "QUICKNPC.role.saboteur.strongAttack.twoSpecials.description",
        apply: (model, context) => {
            ChooseCustomizationStep.addCustomization(context, strongAttackChoices)
            ChooseCustomizationStep.addCustomization(context, strongAttackChoices)
        }
    }
}

/**
 * @type {SkillOptions}
 */
const strongAttackChoices = {
    strongAttackBlockHpRecovery: {
        label: "QUICKNPC.role.saboteur.strongAttackBlockHpRecovery.name",
        description: "QUICKNPC.role.saboteur.strongAttackBlockHpRecovery.description",
        apply: model => {
            model.attacks.strong.special.push(game.i18n.localize("QUICKNPC.role.saboteur.strongAttackBlockHpRecovery.specialText"));
        }
    },
    strongAttackBlockMpRecovery: {
        label: "QUICKNPC.role.saboteur.strongAttackBlockMpRecovery.name",
        description: "QUICKNPC.role.saboteur.strongAttackBlockMpRecovery.description",
        apply: model => {
            model.attacks.strong.special.push(game.i18n.localize("QUICKNPC.role.saboteur.strongAttackBlockMpRecovery.specialText"));
        }
    },
    strongAttackBlockAction: {
        label: "QUICKNPC.role.saboteur.strongAttackBlockAction.name",
        description: "QUICKNPC.role.saboteur.strongAttackBlockAction.description",
        choices: {
            action: {
                label: "QUICKNPC.role.saboteur.strongAttackBlockAction.action",
                options: CONSTANTS.actions
            }
        },
        apply: (model, context, {action}) => {
            model.attacks.strong.special.push(game.i18n.format("QUICKNPC.role.saboteur.strongAttackBlockAction.specialText", {
                action: game.i18n.localize(CONSTANTS.actions[action])
            }));
        }
    },
    strongAttackBlockFreeAttacks: {
        label: "QUICKNPC.role.saboteur.strongAttackBlockFreeAttacks.name",
        description: "QUICKNPC.role.saboteur.strongAttackBlockFreeAttacks.description",
        apply: model => model.attacks.strong.special.push(game.i18n.localize("QUICKNPC.role.saboteur.strongAttackBlockFreeAttacks.specialText"))
    },
    strongAttackBlockSelfVision: {
        label: "QUICKNPC.role.saboteur.strongAttackBlockSelfVision.name",
        description: "QUICKNPC.role.saboteur.strongAttackBlockSelfVision.description",
        apply: model => model.attacks.strong.special.push(game.i18n.localize("QUICKNPC.role.saboteur.strongAttackBlockSelfVision.specialText"))
    },
    strongAttackBlockAllyVision: {
        label: "QUICKNPC.role.saboteur.strongAttackBlockAllyVision.name",
        description: "QUICKNPC.role.saboteur.strongAttackBlockAllyVision.description",
        apply: model => model.attacks.strong.special.push(game.i18n.localize("QUICKNPC.role.saboteur.strongAttackBlockAllyVision.specialText"))
    },
    strongAttackStripResAndImm: {
        label: "QUICKNPC.role.saboteur.strongAttackStripResAndImm.name",
        description: "QUICKNPC.role.saboteur.strongAttackStripResAndImm.description",
        apply: model => model.attacks.strong.special.push(game.i18n.localize("QUICKNPC.role.saboteur.strongAttackStripResAndImm.specialText"))
    },
}


class Saboteur extends Role {

    /**
     * @return {string}
     */
    get label() {
        return "QUICKNPC.role.saboteur.name";
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
        return [{wlp: "d10"}, {ins: "d10"}, {dex: "d10"}];
    }

    /**
     * An array with 6 functions, corresponding to level 10 through 60.
     * @return {[ApplySkill, ApplySkill, ApplySkill, ApplySkill, ApplySkill, ApplySkill]}
     */
    get skillsByLevel() {
        return [
            (model, context) => ChooseCustomizationStep.addCustomization(context, accuracyMagicChoice),
            CommonSkills.additionalRoleSkill.apply,
            CommonSkills.normalAttackIgnoreResistance.apply,
            CommonSkills.additionalRoleSkill.apply,
            CommonSkills.oneImmunity.apply,
            CommonSkills.additionalRoleSkill.apply
        ];
    }

    /**
     * @param {NpcModel} model
     * @param context
     */
    applyBaseline(model, context) {
        AssignVulnerabilityStep.addVulnerability(context)

        model.bonuses.def += 1;
        model.bonuses.mDef += 2;

        model.attacks.normal = {
            name: game.i18n.localize("QUICKNPC.attacks.normal"),
            accuracy: 0,
            targetDefense: "def",
            baseDamage: 5,
            damage: 0,
            damageType: "",
            special: []
        }

        ConfigureAttackStep.configureAttributeChoice(context, "normal", [["dex", "ins"], ["dex", "wlp"]])
        ConfigureAttackStep.configureDamageTypeChoice(context, "normal")
        ConfigureAttackStep.configureRange(context, "normal")
        ConfigureAttackStep.configureSpecialChoice(context, "normal", normalAttackChoices)
    }

    /**
     * @return SkillOptions
     */
    get roleSkills() {
        return {
            normalAttackMulti2: CommonSkills.normalAttackMulti2,
            normalAttackMagic: CommonSkills.normalAttackMagic,
            strongAttack: {
                label: "QUICKNPC.role.saboteur.strongAttack.name",
                description: "QUICKNPC.role.saboteur.strongAttack.description",
                apply: (model, context) => {
                    model.attacks.strong = {
                        name: game.i18n.localize("QUICKNPC.attacks.strong"),
                        attributes: ["dex", "ins"],
                        accuracy: 0,
                        targetDefense: "def",
                        baseDamage: 5,
                        damage: 0,
                        damageType: "",
                        special: []
                    }

                    ConfigureAttackStep.configureDamageTypeChoice(context, "strong")
                    ConfigureAttackStep.configureRange(context, "strong")
                    ConfigureAttackStep.configureSpecialChoice(context, "strong", strongAttackSpecialCount)
                }
            },
            strongAttackMagic: CommonSkills.strongAttackMagic,
            spell: {
                label: "QUICKNPC.role.saboteur.spell.name",
                description: "QUICKNPC.role.saboteur.spell.description",
                apply: (model, context) => {
                    ChooseSpellStep.addSpell(context, saboteurSpellList);
                    model.bonuses.mp += 10
                }
            },
            cruelHypnosis: {
                label: "QUICKNPC.role.saboteur.cruelHypnosis.name",
                description: "QUICKNPC.role.saboteur.cruelHypnosis.description",
                choices: {
                    status: {
                        label: "QUICKNPC.commonChoices.status",
                        options: {
                            dazed: CONSTANTS.statusEffects.dazed,
                            shaken: CONSTANTS.statusEffects.shaken,
                            enraged: CONSTANTS.statusEffects.enraged,
                        }
                    }
                },
                require: CommonRequirements.eliteOrChampion,
                apply: (model, context, {status}) => model.actions.cruelHypnosis = Actions.simpleAction("QUICKNPC.role.saboteur.cruelHypnosis", {
                    status: game.i18n.localize(CONSTANTS.statusEffects[status])
                })
            },
            secretTechnique: {
                label: "QUICKNPC.role.saboteur.secretTechnique.name",
                description: "QUICKNPC.role.saboteur.secretTechnique.description",
                apply: model => model.rules.secretTechnique = Rules.simpleRule("QUICKNPC.role.saboteur.secretTechnique")
            },
            partingGift: {
                label: "QUICKNPC.role.saboteur.partingGift.name",
                description: "QUICKNPC.role.saboteur.partingGift.description",
                require: {
                    rank: ["soldier", "elite"]
                },
                apply: model => model.rules.partingGift = Rules.simpleRule("QUICKNPC.role.saboteur.partingGift")
            },
            shadowOfDoubt: {
                label: "QUICKNPC.role.saboteur.shadowOfDoubt.name",
                description: "QUICKNPC.role.saboteur.shadowOfDoubt.description",
                apply: model => model.rules.shadowOfDoubt = Rules.simpleRule("QUICKNPC.role.saboteur.shadowOfDoubt")
            },
        };
    }

    /**
     * @return SkillOptions
     */
    get customizations() {
        return {
            additionalRoleSkill: CommonSkills.additionalRoleSkill,
            auraOfUnease: {
                label: "QUICKNPC.role.saboteur.auraOfUnease.name",
                description: "QUICKNPC.role.saboteur.auraOfUnease.description",
                choices: {
                    status1: {
                        label: "QUICKNPC.role.saboteur.auraOfUnease.status1",
                        options: CONSTANTS.statusEffects
                    },
                    status2: {
                        label: "QUICKNPC.role.saboteur.auraOfUnease.status2",
                        options: CONSTANTS.statusEffects
                    }
                },
                apply: (model, context, {status1, status2}) => {
                    if (status1 === status2) {
                        return false;
                    }
                    model.rules.auraOfUnease = Rules.simpleRule("QUICKNPC.role.saboteur.auraOfUnease", {
                        status1: game.i18n.localize(CONSTANTS.statusEffects[status1]),
                        status2: game.i18n.localize(CONSTANTS.statusEffects[status2]),
                    })
                }
            },
            entangle: {
                label: "QUICKNPC.role.saboteur.entangle.name",
                description: "QUICKNPC.role.saboteur.entangle.description",
                apply: model => {
                    model.rules.entangle = Rules.simpleRule("QUICKNPC.role.saboteur.entangle");
                }
            },
            exhaustingCompromise: {
                label: "QUICKNPC.role.saboteur.exhaustingCompromise.name",
                description: "QUICKNPC.role.saboteur.exhaustingCompromise.description",
                apply: model => {
                    model.rules.exhaustingCompromise = Rules.simpleRule("QUICKNPC.role.saboteur.exhaustingCompromise");
                }
            },
            hinderingSpecialist: {
                label: "QUICKNPC.role.saboteur.hinderingSpecialist.name",
                description: "QUICKNPC.role.saboteur.hinderingSpecialist.description",
                apply: model => {
                    model.rules.hinderingSpecialist = Rules.simpleRule("QUICKNPC.role.saboteur.hinderingSpecialist");
                }
            },
            syphonMind: {
                label: "QUICKNPC.role.saboteur.syphonMind.name",
                description: "QUICKNPC.role.saboteur.syphonMind.description",
                apply: model => {
                    model.rules.syphonMind = Rules.simpleRule("QUICKNPC.role.saboteur.syphonMind");
                }
            }
        };
    }
}

export const saboteur = new Saboteur()