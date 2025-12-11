import {AbstractStep} from "../../stepper/abstract-step.mjs";
import {Role} from "../roles/role.mjs";
import {database} from "../../database.mjs";

const roleSelectDone = "roleSelectDone"

const roleDatabase = "roleDatabase"

export class SelectRoleStep extends AbstractStep {

    #role

    constructor(formValues) {
        super(formValues);
        this.#role = formValues.selected;
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    static getTemplateData(formValues, current, context) {
        return {
            step: "QUICKNPC.step.selectRole.name",
            options: Object.fromEntries(Object.entries(context[roleDatabase]).map(([key, value]) => [key, value.label])),
            selected: formValues.selected,
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
        model.updateSource({
            name: game.i18n.localize(selectedRole.label),
            attributes: selectedRole.baseAttributes
        })
        selectedRole.applyBaseline(model, context)
        return model;
    }
}