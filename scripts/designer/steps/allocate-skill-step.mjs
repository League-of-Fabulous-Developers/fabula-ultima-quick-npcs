import {AbstractChooseSkillStep} from "./abstract-choose-skill-step.mjs";
import {unallocatedSkills} from "../designer-steps.mjs";
import {designerSkillList} from "../designer-skill-list.mjs";

const appliedSkillsKey = "appliedSkills";

export class AllocateSkillStep extends AbstractChooseSkillStep {

    static get stepName() {
        return "QUICKNPC.step.chooseSkill.skill"
    }

    static getOptions(model, context) {
        return designerSkillList;
    }

    static shouldActivate(current, value, context) {
        return context[unallocatedSkills] > 0;
    }

    static markApplied(context, selected) {
        (context[appliedSkillsKey] ??= []).push(selected);
        context[unallocatedSkills] -= 1;
    }

}