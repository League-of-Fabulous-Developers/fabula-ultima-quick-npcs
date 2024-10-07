import {Species} from "./species.mjs";
import {Rules} from "../common/rules.mjs";
import {ConditionalBonusSkillStep} from "../steps/conditional-bonus-skill-step.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {AssignStatusImmunityStep} from "../steps/assign-status-immunity-step.mjs";
import {CommonSkills} from "../common/skills.mjs";

/**
 * @type {ConditionalBonusSkill}
 */
const conditionalConstructSkills = {
    drawback: {
        label: "QUICKNPC.species.construct.additionalVulnerability.name",
        description: "QUICKNPC.species.construct.additionalVulnerability.description",
        apply: (model, context) => {
            AssignVulnerabilityStep.addVulnerability(context, ["air", "bolt", "fire", "ice"])
        }
    },
    options: {
        constructStatusImmunities: {
            label: "QUICKNPC.species.construct.statusImmunities.name",
            description: "QUICKNPC.species.construct.statusImmunities.name",
            apply: (model, context) => {
                AssignStatusImmunityStep.addStatusImmunity(context)
                AssignStatusImmunityStep.addStatusImmunity(context)
            }
        },
        opposedCheckBonus: {
            label: "QUICKNPC.species.construct.opposedCheckBonus.name",
            description: "QUICKNPC.species.construct.opposedCheckBonus.description",
            apply: (model) => {
                model.rules.opposedCheckBonus = Rules.simpleRule("QUICKNPC.species.construct.opposedCheckBonus")
            }
        },
        flying: CommonSkills.flying,
        constructAdditionalRoleSkill: CommonSkills.additionalRoleSkill
    }
}

class Construct extends Species {

    get label() {
        return "QUICKNPC.species.construct.name";
    }

    apply(model, context) {
        model.affinities.earth.res = true;
        model.affinities.poison.imm = true;
        model.statusImmunities.poisoned = true;

        ConditionalBonusSkillStep.addConditionalBonusSkill(context, conditionalConstructSkills)
    }
}

export const construct = new Construct();