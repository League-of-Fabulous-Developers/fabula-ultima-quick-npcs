import {Species} from "./species.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {UpgradeResToAbsStep} from "../steps/upgrade-res-abs-step.mjs";
import {Spells} from "../common/spells.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {CommonRequirements} from "../common/requirements.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";
import {pick} from "../common/utils.mjs";

const demonSpellList = pick(Spells.asSkills, "breath", "curseXL", "mindTheft", "weaken")

/**
 * @type SkillOptions
 */
const customizations = {
    upgradeResToAbs: {
        label: "QUICKNPC.species.demon.upgradeResToAbs.name",
        description: "QUICKNPC.species.demon.upgradeResToAbs.description",
        require: CommonRequirements.anyResistance,
        apply: (model, context) => {
            UpgradeResToAbsStep.addUpgrade(context)
        }
    },
    demonSpell: {
        label: "QUICKNPC.species.demon.spell.name",
        description: "QUICKNPC.species.demon.spell.description",
        apply: (model, context) => {
            ChooseSpellStep.addSpell(context, demonSpellList)
            model.bonuses.mp += 10
        }
    },
    flying: CommonSkills.flying,
    demonAdditionalRoleSkill: CommonSkills.additionalRoleSkill
}

class Demon extends Species {

    get label() {
        return "QUICKNPC.species.demon.name";
    }

    apply(model, context) {
        CommonSkills.twoResistances.apply(model, context);
        ChooseCustomizationStep.addCustomization(context, customizations)
    }
}

export const demon = new Demon();