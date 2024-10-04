import {Species} from "./species.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {Rules} from "../common/rules.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {pick} from "../common/utils.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";
import {Spells} from "../common/spells.mjs";

const humanoidSpellList = pick(Spells.asSkills, "lickWounds", "shell", "warCry")

/**
 * @type SkillOptions
 */
const customizations = {
    humanoidTwoResistancesExceptPhysical: CommonSkills.twoResistancesExceptPhysical,
    humanoidSpell: {
        label: "QUICKNPC.species.humanoid.spell.name",
        description: "QUICKNPC.species.humanoid.spell.description",
        apply: (model, context) => {
            ChooseSpellStep.addSpell(context, humanoidSpellList)
            model.bonuses.mp += 10
        }
    },
    opposedCheckBonus: {
        label: "QUICKNPC.species.humanoid.opposedCheckBonus.name",
        description: "QUICKNPC.species.humanoid.opposedCheckBonus.description",
        apply: model => {
            model.rules.opposedCheckBonus = Rules.simpleRule("QUICKNPC.species.humanoid.opposedCheckBonus")
        }
    },
    flying: CommonSkills.flying,
    humanoidAdditionalRoleSkill: CommonSkills.additionalRoleSkill
}

class Humanoid extends Species {

    get label() {
        return "QUICKNPC.species.humanoid.name";
    }

    apply(model, context) {
        AssignVulnerabilityStep.addVulnerability(context, ["dark", "light", "physical", "poison"])

        ChooseCustomizationStep.addCustomization(context, customizations)
        ChooseCustomizationStep.addCustomization(context, customizations)
        ChooseCustomizationStep.addCustomization(context, customizations)
    }
}

export const humanoid = new Humanoid();