import {Species} from "./species.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {Spells} from "../common/spells.mjs";

/**
 * @type SkillOptions
 */
const customizations = {
    monsterHpPlus10: CommonSkills.hpPlus10,
    twoResistances: CommonSkills.twoResistancesExceptPhysical,
    breath: Spells.asSkills.breath,
    flying: CommonSkills.flying,
    monsterAdditionalRoleSkill: CommonSkills.additionalRoleSkill
}

class Monster extends Species {

    get label() {
        return "QUICKNPC.species.monster.name";
    }

    apply(model, context) {
        ChooseCustomizationStep.addCustomization(context, customizations)
        ChooseCustomizationStep.addCustomization(context, customizations)
    }
}

export const monster = new Monster();
