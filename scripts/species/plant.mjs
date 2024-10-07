import {Species} from "./species.mjs";
import {ChooseCustomizationStep} from "../steps/choose-customization-step.mjs";
import {Rules} from "../common/rules.mjs";
import {CommonSkills as commonSkills, CommonSkills} from "../common/skills.mjs";
import {pick} from "../common/utils.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";
import {Spells} from "../common/spells.mjs";
import {AssignSpeciesVulnerabilityStep} from "../steps/assign-species-vulnerability-step.mjs";

const plantSpellList = pick(Spells.asSkills,"breath", "cursedBreath", "lifeTheft", "poison")

/**
 * @type SkillOptions
 */
const customizations = {
    plantHpPlus10: CommonSkills.hpPlus10,
    plantTwoResistancesExceptPhysical: CommonSkills.twoResistancesExceptPhysical,
    plantSpell: {
        label: "QUICKNPC.species.plant.spell.name",
        description: "QUICKNPC.species.plant.spell.description",
        apply: (model, context) => {
            ChooseSpellStep.addSpell(context, plantSpellList)
            model.bonuses.mp += 10;
        }
    },
    thorns: {
        label: "QUICKNPC.species.plant.thorns.name",
        description: "QUICKNPC.species.plant.thorns.description",
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

        AssignSpeciesVulnerabilityStep.addSpeciesVulnerability(context, ["air", "bolt", "fire", "ice"])

        ChooseCustomizationStep.addCustomization(context, customizations)
    }
}

export const plant = new Plant();