import {AbstractStep} from "./abstract-step.mjs";
import {NpcModel} from "../common/npc-model.mjs";
import {Role} from "../roles/role.mjs";
import {database} from "../database.mjs";

const roleSelectDone = "roleSelectDone"

const roleDatabase = "roleDatabase"

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
            options: Object.fromEntries(Object.entries(context[roleDatabase]).map(([key, value]) => [key, value.label])),
            selected: formData.get("selected"),
            emptyOption: "QUICKNPC.step.selectRole.blank"
        };
    }

    static shouldActivate(current, value, context) {
        return !context[roleSelectDone]
    }

    static initContext(context) {
        context[roleDatabase] = database.typeData.role ?? {};
    }

    apply(model, context) {
        if (!(this.#role in context[roleDatabase])) {
            return false
        }
        context[roleSelectDone] = true;
        const selectedRole = context[roleDatabase][this.#role];
        Role.setRole(context, selectedRole)
        model.name = game.i18n.localize(selectedRole.label);
        model.attributes = selectedRole.baseAttributes;
        selectedRole.applyBaseline(model, context)
        NpcModel.updateDerivedValues(model)
        return model;
    }
}