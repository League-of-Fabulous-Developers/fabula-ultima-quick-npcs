import {Species} from "./species.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {Rules} from "../common/rules.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {pick} from "../common/utils.mjs";
import {Spells} from "../common/spells.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";

const beastSpellList = pick(Spells.asSkills, "lickWounds", "shell", "warCry")

/**
 * @type SkillOptions
 */
const customizations = {
    beastHpPlus10: CommonSkills.hpPlus10,
    beastSpell: {
        label: "QUICKNPC.species.beast.spell.name",
        description: "QUICKNPC.species.beast.spell.description",
        apply: (model, context) => {
            ChooseSpellStep.addSpell(context, beastSpellList);
            model.bonuses.mp += 10;
        }
    },
    opposedCheckBonus: {
        label: "QUICKNPC.species.beast.opposedCheckBonus.name",
        description: "QUICKNPC.species.beast.opposedCheckBonus.description",
        apply: model => {
            model.rules.opposedCheckBonus = Rules.simpleRule("QUICKNPC.species.beast.opposedCheckBonus")
        }
    },
    flying: CommonSkills.flying,
    beastAdditionalRoleSkill1: CommonSkills.additionalRoleSkill,
    beastAdditionalRoleSkill2: {
        ...CommonSkills.additionalRoleSkill,
        require: {
            anyCustomization: ["beastAdditionalRoleSkill1"]
        }
    }
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