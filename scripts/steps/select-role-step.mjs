import {AbstractStep} from "./abstract-step.mjs";
import {brute} from "../roles/brute.mjs";
import {NpcModel} from "../common/npc-model.mjs";
import {Role} from "../roles/role.mjs";
import {hunter} from "../roles/hunter.mjs";
import {mage} from "../roles/mage.mjs";
import {saboteur} from "../roles/saboteur.mjs";
import {sentinel} from "../roles/sentinel.mjs";
import {support} from "../roles/support.mjs";


/**
 * @type {Record<string, Role>}
 */
const roles = {
    brute,
    hunter,
    mage,
    saboteur,
    sentinel,
    support
}

const roleSelectDone = "roleSelectDone"

export class SelectRoleStep extends AbstractStep {

    #role

    constructor(formData) {
        super(formData);
        this.#role = formData.get("selected");
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    static getTemplateData(formData, current, context) {
        return {
            step: "QUICKNPC.step.selectRole.name",
            options: Object.fromEntries(Object.keys(roles).map(key => [key, `QUICKNPC.role.${key}.name`])),
            selected: formData.get("selected"),
            emptyOption: "QUICKNPC.step.selectRole.blank"
        };
    }

    static shouldActivate(current, value, context) {
        return !context[roleSelectDone]
    }

    apply(model, context) {
        if (!(this.#role in roles)) {
            return false
        }
        context[roleSelectDone] = true;
        const selectedRole = roles[this.#role];
        Role.setRole(context, selectedRole)
        model.name = game.i18n.localize(selectedRole.label);
        model.attributes = selectedRole.baseAttributes;
        selectedRole.applyBaseline(model, context)
        NpcModel.updateDerivedValues(model)
        return model;
    }
}