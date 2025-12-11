import validate from "./generated/schema-validator.mjs";
import {JsonRole} from "./wizard/roles/json-role.mjs";
import {JsonSpecies} from "./wizard/species/json-species.mjs";
import {MODULE} from "./constants.mjs";
import {SETTINGS} from "./settings.mjs";
import {DesignerSpellList} from "./designer/designer-spell-list.mjs";

const defaultRoles = [
    "/modules/fabula-ultima-quick-npcs/data/roles/brute.json",
    "/modules/fabula-ultima-quick-npcs/data/roles/hunter.json",
    "/modules/fabula-ultima-quick-npcs/data/roles/mage.json",
    "/modules/fabula-ultima-quick-npcs/data/roles/saboteur.json",
    "/modules/fabula-ultima-quick-npcs/data/roles/sentinel.json",
    "/modules/fabula-ultima-quick-npcs/data/roles/support.json"
]

const defaultSpecies = [
    "/modules/fabula-ultima-quick-npcs/data/species/beast.json",
    "/modules/fabula-ultima-quick-npcs/data/species/construct.json",
    "/modules/fabula-ultima-quick-npcs/data/species/demon.json",
    "/modules/fabula-ultima-quick-npcs/data/species/elemental.json",
    "/modules/fabula-ultima-quick-npcs/data/species/humanoid.json",
    "/modules/fabula-ultima-quick-npcs/data/species/monster.json",
    "/modules/fabula-ultima-quick-npcs/data/species/plant.json",
    "/modules/fabula-ultima-quick-npcs/data/species/undead.json"
]

const defaultDesignerData = [
    "/modules/fabula-ultima-quick-npcs/data/designer/npc-spell-list.json",
    "/modules/fabula-ultima-quick-npcs/data/designer/elementalist-spell-list.json",
    "/modules/fabula-ultima-quick-npcs/data/designer/entropist-spell-list.json",
    "/modules/fabula-ultima-quick-npcs/data/designer/spiritist-spell-list.json"
];

const defaultDataSources = [
    ...defaultRoles,
    ...defaultSpecies,
    ...defaultDesignerData
]

const types = {
    role: JsonRole,
    species: JsonSpecies,
    "designer-spell-list": DesignerSpellList
}

class Database {

    #typeData;

    /**
     * @param {Record<string, object>} data record containing file paths mapped to their data content
     */
    constructor(data) {
        const typeData = {};

        for (const [file, fileData] of Object.entries(data)) {
            if (validate(fileData)) {
                const value = new types[fileData.type](fileData, file);
                (typeData[fileData.type] ??= {})[file] = value;
            } else {
                ui.notifications?.warn(game.i18n.format("QUICKNPC.error.invalidDataFile", {file: file}))
                console.error("Data file is invalid", file, [...validate.errors])
            }
        }

        this.#typeData = Object.freeze(typeData);
    }

    static async createDatabase() {
        const datasources = new Set(defaultDataSources);

        /** @type {Set<string>}*/
        const userDataFiles = game.settings.get(MODULE, SETTINGS.userDataFiles) ?? new Set();
        userDataFiles.forEach((file) => datasources.add(file));

        const data = {}
        for (const file of [...datasources]) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    data[file] = await response.json();
                } else {
                    throw new Error(`Unable to load ${file}`);
                }
            } catch (error) {
                console.error("Error loading data file", file, error);
                ui.notifications?.error(game.i18n.format("QUICKNPC.error.unableToLoadDataFile", {file: file}))
            }
        }

        return new Database(data)
    }

    get typeData() {
        return this.#typeData;
    }
}

Hooks.once("ready", reloadDatabase)

export async function reloadDatabase() {
    console.log("Reloading QuickNPC database...");
    database = await Database.createDatabase();
    console.log("Database loaded", database);
}

export let database = new Database({});