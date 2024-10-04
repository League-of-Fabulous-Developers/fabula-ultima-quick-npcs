import {Role} from "./role.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {ConfigureAttackStep} from "../steps/configure-attack-step.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";
import {pick} from "../common/utils.mjs";
import {Spells} from "../common/spells.mjs";
import {Actions} from "../common/actions.mjs";
import {Rules} from "../common/rules.mjs";
import {CONSTANTS} from "../constants.mjs";
import {CommonRequirements} from "../common/requirements.mjs";

const supportSpellList = pick(Spells.asSkills,
    "aura",
    "awaken",
    "barrier",
    "cleanse",
    "divination",
    "elementalShroud",
    "heal",
    "mirror",
    "reinforce",
    "quicken",
    "warCry")

class Support extends Role {

    /**
     * @return string
     */
    get label() {
        return "QUICKNPC.role.support.name"
    }

    /**
     * @return {Record<Attribute, AttributeDice>}
     */
    get baseAttributes() {
        return {
            dex: "d8",
            ins: "d8",
            mig: "d6",
            wlp: "d10"
        }
    }

    /**
     * @return {[AttributeChange, AttributeChange, AttributeChange]}
     */
    get attributeChanges() {
        return [{ins: "d10"}, {mig: "d8"}, {ins: "d12"}]
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
                model.bonuses.def += 1;
                model.bonuses.mDef += 1;
            },
            CommonSkills.additionalRoleSkill.apply,
            CommonSkills.oneImmunityExceptPhysical.apply,
            CommonSkills.additionalRoleSkill.apply,
        ]
    }

    /**
     * @param {NpcModel} model
     * @param context
     * @return void
     */
    applyBaseline(model, context) {
        model.bonuses.hp += 10;

        AssignVulnerabilityStep.addVulnerability(context)

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
        ConfigureAttackStep.configureAttributeChoice(context, "normal", [["dex", "wlp"], ["ins", "wlp"]])
        ConfigureAttackStep.configureDamageTypeChoice(context, "normal")
        ConfigureAttackStep.configureRange(context, "normal")

        ChooseCustomizationStep.addCustomization(context, {
            twoSpells: {
                label: "QUICKNPC.role.support.twoSpells.name",
                description: "QUICKNPC.role.support.twoSpells.description",
                apply: (model, context) => {
                    ChooseSpellStep.addSpell(context, supportSpellList);
                    ChooseSpellStep.addSpell(context, supportSpellList);
                }
            },
            oneSpellMpBonus: {
                label: "QUICKNPC.role.support.oneSpellMpBonus.name",
                description: "QUICKNPC.role.support.oneSpellMpBonus.description",
                apply: (model, context) => {
                    ChooseSpellStep.addSpell(context, supportSpellList);
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
            normalAttackMulti2: CommonSkills.normalAttackMulti2,
            normalAttackMagic: CommonSkills.normalAttackMagic,
            normalAttackStatus: CommonSkills.normalAttackStatus,
            normalAttackMpRecovery: CommonSkills.normalAttackMpRecovery,
            improvedAdvise: {
                label: "QUICKNPC.role.support.improvedAdvise.name",
                description: "QUICKNPC.role.support.improvedAdvise.description",
                require: {
                    anyAction: ["advise"]
                },
                apply: model => {
                    model.actions.advise.description = game.i18n.localize("QUICKNPC.role.support.improvedAdvise.actionText")
                }
            },
            strategicCommand: {
                label: "QUICKNPC.role.support.strategicCommand.name",
                description: "QUICKNPC.role.support.strategicCommand.description",
                require: CommonRequirements.eliteOrChampion,
                apply: model => {
                    model.actions.strategicCommand = Actions.simpleAction("QUICKNPC.role.support.strategicCommand")
                }
            },
            followUpAttack: {
                label: "QUICKNPC.role.support.followUpAttack.name",
                description: "QUICKNPC.role.support.followUpAttack.description",
                apply: model => {
                    model.rules.followUpAttack = Rules.simpleRule("QUICKNPC.role.support.followUpAttack")
                }
            },
            healingAura: {
                label: "QUICKNPC.role.support.healingAura.name",
                description: "QUICKNPC.role.support.healingAura.description",
                apply: model => {
                    model.rules.healingAura = Rules.simpleRule("QUICKNPC.role.support.healingAura")
                }
            },
            mpBattery: {
                label: "QUICKNPC.role.support.mpBattery.name",
                description: "QUICKNPC.role.support.mpBattery.description",
                apply: model => {
                    model.rules.mpBattery = Rules.simpleRule("QUICKNPC.role.support.mpBattery")
                }
            },
            oneLastCommand: {
                label: "QUICKNPC.role.support.oneLastCommand.name",
                description: "QUICKNPC.role.support.oneLastCommand.description",
                require: {
                    anyAction: ["advise", "inspire", "strategicCommand"]
                },
                apply: model => {
                    model.rules.oneLastCommand = Rules.simpleRule("QUICKNPC.role.support.oneLastCommand")
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
            advise: {
                label: "QUICKNPC.role.support.advise.name",
                description: "QUICKNPC.role.support.advise.description",
                apply: (model) => {
                    model.actions.advise = Actions.simpleAction("QUICKNPC.role.support.advise")
                }
            },
            inspire: {
                label: "QUICKNPC.role.support.inspire.name",
                description: "QUICKNPC.role.support.inspire.description",
                choices: {
                    resource: {
                        label: "QUICKNPC.commonChoices.resource",
                        options: pick(CONSTANTS.resources, "hp", "mp")
                    },
                    attribute: {
                        label: "QUICKNPC.commonChoices.attribute",
                        options: CONSTANTS.attributes
                    }
                },
                apply: (model, context, {resource, attribute}) => {
                    model.actions.inspire = Actions.simpleAction("QUICKNPC.role.support.inspire", {
                        resource: game.i18n.localize(`QUICKNPC.preview.${resource}`),
                        attribute: game.i18n.localize(CONSTANTS.attributes[attribute])
                    })
                }
            },
            vulnerabilityBlock: {
                label: "QUICKNPC.role.support.vulnerabilityBlock.name",
                description: "QUICKNPC.role.support.vulnerabilityBlock.description",
                apply: (model) => {
                    model.rules.vulnerabilityBlock = Rules.simpleRule("QUICKNPC.role.support.vulnerabilityBlock")
                }
            }
        }
    }
}

export const support = new Support();