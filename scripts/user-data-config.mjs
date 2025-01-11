import {MODULE} from "./constants.mjs";
import {SETTINGS} from "./settings.mjs";
import {validate} from "./generated/schema-validator.mjs";

/**
 * @property {Set<string>} object
 */
export class UserDataConfig extends FormApplication {

    #cache = {}

    /**
     * @return FormApplicationOptions
     */
    static get defaultOptions() {
        return Object.assign(super.defaultOptions, {
            id: "quick-npc-user-data-config",
            classes: ["quick-npc-user-data-config"],
            title: "QUICKNPC.settings.userDataFiles.name",
            width: 900,
            height: "auto",
            closeOnSubmit: false,
            submitOnChange: true,
        })
    }

    get template() {
        return "/modules/fabula-ultima-quick-npcs/templates/user-data-config.hbs";
    }

    constructor() {
        super(new Set([...game.settings.get(MODULE, SETTINGS.userDataFiles)]));
    }

    async _updateObject(event, formData) {
        if (event.type === "change" && formData.dataFile) {
            delete this.#cache[formData.dataFile];
            this.object.add(formData.dataFile);
            this.render();
        }
        if (event.type === "submit") {
            game.settings.set(MODULE, SETTINGS.userDataFiles, [...this.object]);
            this.close()
        }
    }

    async getData(options = {}) {
        const userDataFiles = []
        for (let file of this.object) {

            if (!(file in this.#cache)) {
                let fileFound = false;
                let fileValid = false;
                let type = "unknown"
                try {
                    const response = await fetch(file);
                    if (response.ok) {
                        fileFound = true;
                        const data = await response.json();
                        fileValid = validate(data);
                        type = fileValid ? game.i18n.localize(`QUICKNPC.dataType.${data.type}`) : game.i18n.localize(`QUICKNPC.dataType.unknown`);
                        if (!fileValid) {
                            console.log("Could not validate file", file, validate.errors)
                        }
                    }
                } catch (ignored) {
                }

                this.#cache[file] = {
                    fileName: file.substring(Math.max(file.lastIndexOf("/"), file.lastIndexOf("\\")) + 1),
                    filePath: file,
                    fileFound,
                    fileValid,
                    type
                };
            }

            userDataFiles.push(this.#cache[file]);
        }
        return Object.assign(await super.getData(options), {
            userDataFiles
        });
    }

    activateListeners(html) {
        super.activateListeners(html)
        html.find("[data-index] [data-action]").on("click", event => {
            const action = event.currentTarget.dataset.action;
            const idx = Number(event.currentTarget.closest("[data-index]").dataset.index);
            const filesAsArray = [...this.object];
            if (action === "delete") {
                delete this.#cache[filesAsArray[idx]]
                filesAsArray.splice(idx, 1);
                this.object = new Set(filesAsArray);
                this.render();
            } else if (action === "refresh") {
                delete this.#cache[filesAsArray[idx]];
                this.render();
            }
        })
    }
}