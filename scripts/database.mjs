import validate from './generated/schema-validator.mjs';
import { JsonRole } from './wizard/roles/json-role.mjs';
import { JsonSpecies } from './wizard/species/json-species.mjs';
import { MODULE } from './constants.mjs';
import { SETTINGS } from './settings.mjs';
import { DesignerSpellList } from './designer/designer-spell-list.mjs';
import { BossSkillList } from './wizard/boss-skill-list.mjs';
import { NegativeSkillList } from './wizard/negative-skill-list.mjs';

const defaultRoles = [
  '/modules/fabula-ultima-quick-npcs/data/wizard/roles/brute.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/roles/hunter.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/roles/mage.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/roles/saboteur.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/roles/sentinel.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/roles/support.json',
];

const defaultSpecies = [
  '/modules/fabula-ultima-quick-npcs/data/wizard/species/beast.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/species/construct.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/species/demon.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/species/elemental.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/species/humanoid.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/species/monster.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/species/plant.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/species/undead.json',
];

const defaultBossSkills = [
  '/modules/fabula-ultima-quick-npcs/data/wizard/boss-skill-list-battlefield.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/boss-skill-list-control.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/boss-skill-list-destructive.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/boss-skill-list-elemental.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/boss-skill-list-objective.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/boss-skill-list-summoner.json',
  '/modules/fabula-ultima-quick-npcs/data/wizard/boss-skill-list-survival.json',
];

const defaultWizardData = [
  ...defaultRoles,
  ...defaultSpecies,
  ...defaultBossSkills,
  '/modules/fabula-ultima-quick-npcs/data/wizard/negative-skill-list.json',
];

const defaultDesignerData = [
  '/modules/fabula-ultima-quick-npcs/data/designer/npc-spell-list.json',
  '/modules/fabula-ultima-quick-npcs/data/designer/elementalist-spell-list.json',
  '/modules/fabula-ultima-quick-npcs/data/designer/entropist-spell-list.json',
  '/modules/fabula-ultima-quick-npcs/data/designer/spiritist-spell-list.json',
];

const defaultDataSources = [...defaultWizardData, ...defaultDesignerData];

const types = {
  role: JsonRole,
  species: JsonSpecies,
  'designer-spell-list': DesignerSpellList,
  'boss-skill-list': BossSkillList,
  'negative-skill-list': NegativeSkillList,
};

class Database {
  #typeData;

  /**
   * @param {Record<string, object>} data record containing file paths mapped to their data content
   */
  constructor(data) {
    const typeData = {};

    for (const [file, fileData] of Object.entries(data)) {
      if (validate(fileData)) {
        (typeData[fileData.type] ??= {})[file] = new types[fileData.type](fileData, file);
      } else {
        ui.notifications?.warn(game.i18n.format('QUICKNPC.error.invalidDataFile', { file: file }));
        console.error('Data file is invalid', file, [...validate.errors]);
      }
    }

    this.#typeData = Object.freeze(typeData);
  }

  static async createDatabase() {
    const datasources = new Set(defaultDataSources);

    /** @type {Set<string>}*/
    const userDataFiles = game.settings.get(MODULE, SETTINGS.userDataFiles) ?? new Set();
    userDataFiles.forEach((file) => datasources.add(file));

    const data = {};
    for (const file of [...datasources]) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          data[file] = await response.json();
        } else {
          throw new Error(`Unable to load ${file}`);
        }
      } catch (error) {
        console.error('Error loading data file', file, error);
        ui.notifications?.error(
          game.i18n.format('QUICKNPC.error.unableToLoadDataFile', {
            file: file,
          }),
        );
      }
    }

    return new Database(data);
  }

  get typeData() {
    return this.#typeData;
  }
}

Hooks.once('ready', reloadDatabase);

export async function reloadDatabase() {
  console.log('Reloading QuickNPC database...');
  database = await Database.createDatabase();
  console.log('Database loaded', database);
}

export let database = new Database({});
