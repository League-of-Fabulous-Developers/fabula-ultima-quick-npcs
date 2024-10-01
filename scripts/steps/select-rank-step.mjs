import {AbstractStep} from "./abstract-step.mjs";
import {Role} from "../roles/role.mjs";
import {NpcModel} from "../common/npc-model.mjs";
import {ChooseRoleSkillStep} from "./choose-role-skill-step.mjs";
import {ChooseBossSkillStep} from "./choose-boss-skill-step.mjs";
import {BossSkills} from "../common/boss-skills.mjs";
import {ChooseCustomizationStep} from "./choose-customization-step.mjs";
import {ChooseNegativeSkillStep} from "./choose-negative-skill-step.mjs";
import {NegativeSkills} from "../common/negative-skills.mjs";

const ranks = {
    soldier: "QUICKNPC.rank.soldier",
    elite: "QUICKNPC.rank.elite",
    champion1: "QUICKNPC.rank.champion1",
    champion2: "QUICKNPC.rank.champion2",
    champion3: "QUICKNPC.rank.champion3",
    champion4: "QUICKNPC.rank.champion4",
    champion5: "QUICKNPC.rank.champion5",
    champion6: "QUICKNPC.rank.champion6",
}

const rankSelectDone = "rankSelectDone"

export class SelectRankStep extends AbstractStep {

    #rank

    constructor(formData) {
        super(formData);
        this.#rank = formData.get("selected")
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    static getTemplateData(formData, current, context) {
        return {
            step: "QUICKNPC.step.selectRank.name",
            options: ranks,
            selected: formData.get("selected"),
            emptyOption: "QUICKNPC.step.selectRank.blank"
        }
    }

    static shouldActivate(current, value, context) {
        return !context[rankSelectDone]
    }

    apply(model, context) {
        if (!Object.keys(ranks).includes(this.#rank)) {
            return false
        } else {
            context[rankSelectDone] = true
            model.rank = this.#rank
            const role = Role.getRole(context);

            if (model.rank === "elite") {
                model.bonuses.init += 2
                ChooseRoleSkillStep.addRoleSkill(context, role.roleSkills)
            }

            if (model.rank.startsWith("champion")) {
                const replacedSoldiers = Number(model.rank.substring(8))

                model.bonuses.init += replacedSoldiers
                Array.from({length: replacedSoldiers}, () => {
                    ChooseRoleSkillStep.addRoleSkill(context, role.roleSkills)
                })
                ChooseBossSkillStep.addBossSkill(context, BossSkills.list)
            }

            if (["soldier", "elite"].includes(model.rank)) {
                ChooseCustomizationStep.addCustomization(context, role.customizations)
            }

            ChooseNegativeSkillStep.addNegativeSkill(context, NegativeSkills.list)

            NpcModel.updateDerivedValues(model)

            return model
        }
    }
}