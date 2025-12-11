export class ActionDataModel extends foundry.abstract.DataModel {

    static defineSchema() {
        const {StringField} = foundry.data.fields;
        return {
            name: new StringField({blank: true, nullable: false}),
            summary: new StringField({blank: false, nullable: false}),
            description: new StringField({blank: false, nullable: false}),
        }
    }

    toItemData() {
        return {
            name: this.name,
            type: "miscAbility",
            system: {
                isFavored: {value: true},
                summary: {value: this.summary,},
                description: this.description
            }
        }
    }
}