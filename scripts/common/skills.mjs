import {Rules} from "./rules.mjs";
import {ChooseRoleSkillStep} from "../steps/choose-role-skill-step.mjs";
import {Role} from "../roles/role.mjs";
import {AssignResistanceStep} from "../steps/assign-resistance-step.mjs";
import {CommonRequirements} from "./requirements.mjs";
import {AssignImmunityStep} from "../steps/assign-immunity-step.mjs";
import {pick} from "./utils.mjs";
import {CONSTANTS} from "../constants.mjs";

const damageTypesExceptPhysical = ["air", "bolt", "dark", "earth", "fire", "ice", "light", "poison"];
/**
 * @type {Record<string, Skill>}
 */
export const CommonSkills = {
    none: {
        label: "QUICKNPC.commonSkills.none.name",
        description: "QUICKNPC.commonSkills.none.description",
        apply: () => {
        }
    }
}
