import {AbstractStep} from "../../stepper/abstract-step.mjs";

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

const rankNames = {
    soldier: "QUICKNPC.rank.soldier",
    elite: "QUICKNPC.rank.elite",
    champion1: "QUICKNPC.rank.champion",
    champion2: "QUICKNPC.rank.champion",
    champion3: "QUICKNPC.rank.champion",
    champion4: "QUICKNPC.rank.champion",
    champion5: "QUICKNPC.rank.champion",
    champion6: "QUICKNPC.rank.champion",
}

const rankSelectDone = "rankSelectDone"

export class SelectRankStep extends AbstractStep {

    #rank

    constructor(formValues) {
        super(formValues);
        this.#rank = formValues.selected;
    }

    static get template() {
        return "QUICKNPC.step.singleSelect";
    }

    static getTemplateData(formValues, current, context) {
        return {
            step: "QUICKNPC.step.selectRank.name",
            options: ranks,
            selected: formValues.selected,
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
            const changes = {
                rank: this.#rank,
                name: `${game.i18n.localize(rankNames[this.#rank])} ${model.name}`,
            };

            if (changes.rank === "elite") {
                changes["bonuses.init"] = model.bonuses.init + 2;
            }

            if (changes.rank.startsWith("champion")) {
                const replacedSoldiers = Number(changes.rank.substring(8))

                changes["bonuses.init"] = model.bonuses.init + replacedSoldiers;
            }

            model.updateSource(changes);
            return model
        }
    }
}