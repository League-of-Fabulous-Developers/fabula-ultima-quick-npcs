import {Rules} from "./rules.mjs";
import {ChooseRoleSkillStep} from "../steps/choose-role-skill-step.mjs";
import {Role} from "../roles/role.mjs";
import {AssignResistanceStep} from "../steps/assign-resistance-step.mjs";
import {CommonRequirements} from "./requirements.mjs";
import {AssignImmunityStep} from "../steps/assign-immunity-step.mjs";
import {pick} from "./utils.mjs";
import {CONSTANTS} from "../constants.mjs";

const damageTypesExceptPhysical = ["air", "bolt", "dark", "earth", "fire", "ice", "light", "poison"];
/**
 * @type {Record<string, Skill>}
 */
export const CommonSkills = {
    none: {
        label: "QUICKNPC.commonSkills.none.name",
        description: "QUICKNPC.commonSkills.none.description",
        apply: () => {
        }
    },
    hpPlus10: {
        label: "QUICKNPC.commonSkills.bonusHp.name",
        description: "QUICKNPC.commonSkills.bonusHp.description",
        apply: model => {
            model.bonuses.hp += 10
        }
    },
    flying: {
        label: "QUICKNPC.commonSkills.flying.name",
        description: "QUICKNPC.commonSkills.flying.description",
        apply: (model) => {
            model.rules.flying = Rules.simpleRule("QUICKNPC.commonSkills.flying")
        }
    },
    additionalRoleSkill: {
        label: "QUICKNPC.commonSkills.additionalRoleSkill.name",
        description: "QUICKNPC.commonSkills.additionalRoleSkill.description",
        apply: (model, context) => {
            ChooseRoleSkillStep.addRoleSkill(context, Role.getRole(context).roleSkills)
        }
    },
    twoResistances: {
        label: "QUICKNPC.commonSkills.twoResistances.name",
        description: "QUICKNPC.commonSkills.twoResistances.description",
        apply: (model, context) => {
            AssignResistanceStep.addResistance(context)
            AssignResistanceStep.addResistance(context)
        }
    },
    twoResistancesExceptPhysical: {
        label: "QUICKNPC.commonSkills.twoResistancesExceptPhysical.name",
        description: "QUICKNPC.commonSkills.twoResistancesExceptPhysical.description",
        apply: (model, context) => {
            AssignResistanceStep.addResistance(context, damageTypesExceptPhysical)
            AssignResistanceStep.addResistance(context, damageTypesExceptPhysical)
        }
    },
    normalAttackMagic: {
        label: "QUICKNPC.commonSkills.normalAttackMagic.name",
        description: "QUICKNPC.commonSkills.normalAttackMagic.description",
        require: CommonRequirements.normalAttack,
        apply: (model) => {
            model.attacks.normal.targetDefense = "mDef"
            model.attacks.normal.special.push(game.i18n.localize("QUICKNPC.attacks.special.targetsMDef"))
        }
    },
    strongAttackMagic: {
        label: "QUICKNPC.commonSkills.strongAttackMagic.name",
        description: "QUICKNPC.commonSkills.strongAttackMagic.description",
        require: CommonRequirements.strongAttack,
        apply: (model) => {
            model.attacks.strong.targetDefense = "mDef"
            model.attacks.strong.special.push(game.i18n.localize("QUICKNPC.attacks.special.targetsMDef"))
        }
    },
    oneImmunity: {
        label: "QUICKNPC.commonSkills.oneImmunity.name",
        description: "QUICKNPC.commonSkills.oneImmunity.description",
        apply: (model, context) => {
            AssignImmunityStep.addImmunity(context)
        }
    },
    normalAttackIgnoreResistance: {
        label: "QUICKNPC.commonSkills.normalAttackIgnoreResistance.name",
        description: "QUICKNPC.commonSkills.normalAttackIgnoreResistance.description",
        require: CommonRequirements.normalAttack,
        apply: (model) => {
            model.attacks.normal.special.push(game.i18n.localize("QUICKNPC.attacks.special.ignoreResistance"))
        }
    },
    normalAttackMulti2: {
        label: "QUICKNPC.commonSkills.normalAttackMulti2.name",
        description: "QUICKNPC.commonSkills.normalAttackMulti2.description",
        require: CommonRequirements.normalAttack,
        apply: (model) => {
            model.attacks.normal.special.push(game.i18n.localize("QUICKNPC.attacks.special.multi2"))
        }
    },
    oneImmunityExceptPhysical: {
        label: "QUICKNPC.commonSkills.oneImmunityExceptPhysical.name",
        description: "QUICKNPC.commonSkills.oneImmunityExceptPhysical.description",
        apply: (model, context) => {
            AssignImmunityStep.addImmunity(context, damageTypesExceptPhysical)
        }
    },
    normalAttackMpRecovery: {
        label: "QUICKNPC.commonSkills.normalAttackMpRecovery.name",
        description: "QUICKNPC.commonSkills.normalAttackMpRecovery.description",
        require: {
            attack: "normal"
        },
        apply: (model) => {
            model.attacks.normal.special.push(game.i18n.format("QUICKNPC.commonSkills.normalAttackMpRecovery.specialText", {amount: model.level < 30 ? 10 : 20}))
        }
    },
    normalAttackStatus: {
        label: "QUICKNPC.commonSkills.normalAttackStatus.name",
        description: "QUICKNPC.commonSkills.normalAttackStatus.description",
        choices: {
            status: {
                label: "QUICKNPC.commonChoices.status",
                options: pick(CONSTANTS.statusEffects, "dazed", "shaken", "slow", "weak")
            }
        },
        apply: (model, context, choices) => {
            model.attacks.normal.special.push(game.i18n.format("QUICKNPC.attacks.special.causesStatus", {status: game.i18n.localize(CONSTANTS.statusEffects[choices.status])}))
        }
    }
}
