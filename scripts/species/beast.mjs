import {Species} from "./species.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {Rules} from "../common/rules.mjs";
import {CommonSkills} from "../common/skills.mjs";

/**
 * @type SkillOptions
 */
const customizations = {
    beastHpPlus10: CommonSkills.hpPlus10,
    opposedCheckBonus: {
        label: "QUICKNPC.species.beast.opposedCheckBonus.name",
        description: "QUICKNPC.species.beast.opposedCheckBonus.description",
        apply: model => {
            model.rules.opposedCheckBonus = Rules.simpleRule("QUICKNPC.species.beast.opposedCheckBonus")
        }
    },
    flying: CommonSkills.flying,
    beastAdditionalRoleSkill: CommonSkills.additionalRoleSkill
}

class Beast extends Species {

    get label() {
        return "QUICKNPC.species.beast.name";
    }

    apply(model, context) {
        ChooseCustomizationStep.addCustomization(context, customizations)
        ChooseCustomizationStep.addCustomization(context, customizations)
    }
}

export const beast = new Beast();