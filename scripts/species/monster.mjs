import {Species} from "./species.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {Spells} from "../common/spells.mjs";
import {pick} from "../common/utils.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";

const monsterSpellList = pick(Spells.asSkills, "breath", "cursedBreath", "lickWounds")

/**
 * @type SkillOptions
 */
const customizations = {
    monsterHpPlus10: CommonSkills.hpPlus10,
    monsterTwoResistancesExceptPhysical: CommonSkills.twoResistancesExceptPhysical,
    monsterSpell: {
        label: "QUICKNPC.species.monster.spell.name",
        description: "QUICKNPC.species.monster.spell.description",
        apply: (model, context) => {
            ChooseSpellStep.addSpell(context, monsterSpellList)
            model.bonuses.mp += 10
        }
    },
    flying: CommonSkills.flying,
    monsterAdditionalRoleSkill1: CommonSkills.additionalRoleSkill,
    monsterAdditionalRoleSkill2: {
        ...CommonSkills.additionalRoleSkill,
        require: {
            anyCustomization: ["monsterAdditionalRoleSkill1"]
        }
    }
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
