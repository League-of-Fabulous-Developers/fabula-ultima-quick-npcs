import {Species} from "./species.mjs";
import {AssignImmunityStep} from "../steps/assign-immunity-step.mjs";
import {ConditionalBonusSkillStep} from "../steps/conditional-bonus-skill-step.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {Spells} from "../common/spells.mjs";
import {UpgradeImmToAbsStep} from "../steps/upgrade-imm-abs-step.mjs";
import {CommonSkills} from "../common/skills.mjs";

/**
 * @type {ConditionalBonusSkill}
 */
const elementalConditionalBonus = {
    drawback: {
        label: "QUICKNPC.species.elemental.additionalVulnerability.name",
        description: "QUICKNPC.species.elemental.additionalVulnerability.description",
        apply: (model, context) => {
            AssignVulnerabilityStep.addVulnerability(context)
        }
    },
    options: {
        upgradeImmToAbs: {
            label: "QUICKNPC.species.elemental.upgradeImmToAbs.name",
            description: "QUICKNPC.species.elemental.upgradeImmToAbs.description",
            apply: (model, context) => {
                UpgradeImmToAbsStep.addUpgrade(context)
            }
        },
        breath: {
            ...Spells.asSkills.breath,
            apply: (model, context, choices) => {
                Spells.asSkills.breath.apply(model, context, choices);
                model.bonuses.mp += 10;
            }
        },
        flying: CommonSkills.flying,
        elementalAdditionalRoleSkill: CommonSkills.additionalRoleSkill
    }
}


class Elemental extends Species {

    get label() {
        return "QUICKNPC.species.elemental.name";
    }

    apply(model, context) {
        model.affinities.poison = "imm";
        model.statusImmunities.poisoned = true;

        AssignImmunityStep.addImmunity(context)

        ConditionalBonusSkillStep.addConditionalBonusSkill(context, elementalConditionalBonus)
    }
}

export const elemental = new Elemental();