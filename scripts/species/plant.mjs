import {Species} from "./species.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {Rules} from "../common/rules.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {CommonSkills as commonSkills, CommonSkills} from "../common/skills.mjs";
import {Spells} from "../common/spells.mjs";

/**
 * @type SkillOptions
 */
const customizations = {
    hpPlus10: CommonSkills.hpPlus10,
    twoResistances: CommonSkills.twoResistancesExceptPhysical,
    poison: {
        ...Spells.asSkills.poison,
        apply: (model, context) => {
            Spells.asSkills.poison.apply(model, context);
            model.bonuses.mp += 10;
        }
    },
    thorns: {
        label: "QUICKNPC.species.plant.thorns.name",
        description: "QUICKNPC.species.beast.thorns.name",
        apply: model => {
            model.rules.thorns = Rules.simpleRule("QUICKNPC.species.plant.thorns")
        }
    },
    flying: CommonSkills.flying,
    plantAdditionalRoleSkill: commonSkills.additionalRoleSkill
}

class Plant extends Species {

    get label() {
        return "QUICKNPC.species.plant.name";
    }

    apply(model, context) {
        model.statusImmunities.dazed = true;
        model.statusImmunities.enraged = true;
        model.statusImmunities.shaken = true;

        AssignVulnerabilityStep.addVulnerability(context, ["air", "bolt", "fire", "ice"])

        ChooseCustomizationStep.addCustomization(context, customizations)
    }
}

export const plant = new Plant();