import {Species} from "./species.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {UpgradeResToAbsStep} from "../steps/upgrade-res-abs-step.mjs";
import {Spells} from "../common/spells.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {CommonRequirements} from "../common/requirements.mjs";

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
    weaken: {
        ...Spells.asSkills.weaken,
        apply: (model, context, choices) => {
            Spells.asSkills.weaken.apply(model, context, choices);
            model.bonuses.mp += 10;
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