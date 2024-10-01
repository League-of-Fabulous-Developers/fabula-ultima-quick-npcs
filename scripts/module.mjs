import {LOG_MESSAGE} from "./constants.mjs";
import {QuickNpcWizardV11} from "./quick-npc-wizard-v11.mjs";

const templates = {
    "QUICKNPC.step.chooseSkill": "/modules/fabula-ultima-quick-npcs/templates/steps/choose-skill.hbs",
    "QUICKNPC.step.chooseTraits": "/modules/fabula-ultima-quick-npcs/templates/steps/choose-traits.hbs",
    "QUICKNPC.step.conditionalBonusSkill": "/modules/fabula-ultima-quick-npcs/templates/steps/conditional-bonus-skill.hbs",
    "QUICKNPC.step.configureAttack": "/modules/fabula-ultima-quick-npcs/templates/steps/configure-attack.hbs",
    "QUICKNPC.step.finish": "/modules/fabula-ultima-quick-npcs/templates/steps/finish.hbs",
    "QUICKNPC.step.singleSelect": "/modules/fabula-ultima-quick-npcs/templates/steps/single-select.hbs",
    "QUICKNPC.wizard.preview": "/modules/fabula-ultima-quick-npcs/templates/preview.hbs",
    "QUICKNPC.wizard.stepper": "/modules/fabula-ultima-quick-npcs/templates/stepper.hbs",
    'QUICKNPC.wizard.v11compat': "/modules/fabula-ultima-quick-npcs/templates/v11compat.hbs",
    'QUICKNPC.preview.header': "/modules/fabula-ultima-quick-npcs/templates/preview/header.hbs",
    'QUICKNPC.preview.subHeader': "/modules/fabula-ultima-quick-npcs/templates/preview/sub-header.hbs",
    'QUICKNPC.preview.statistics': "/modules/fabula-ultima-quick-npcs/templates/preview/statistics.hbs",
    'QUICKNPC.preview.affinities': "/modules/fabula-ultima-quick-npcs/templates/preview/affinities.hbs",
    'QUICKNPC.preview.statusImmunities': "/modules/fabula-ultima-quick-npcs/templates/preview/status-immunities.hbs",
    'QUICKNPC.preview.attacks': "/modules/fabula-ultima-quick-npcs/templates/preview/attacks.hbs",
    'QUICKNPC.preview.spells': "/modules/fabula-ultima-quick-npcs/templates/preview/spells.hbs",
    'QUICKNPC.preview.actions': "/modules/fabula-ultima-quick-npcs/templates/preview/actions.hbs",
    'QUICKNPC.preview.rules': "/modules/fabula-ultima-quick-npcs/templates/preview/rules.hbs",
}


Hooks.once('init', async function () {
    console.log(LOG_MESSAGE, "Initialization started")

    console.log(LOG_MESSAGE, "Registering settings")

    await loadTemplates(templates)

    let WizardV12;
    if (game.release.isNewer("12")) {
        WizardV12 = await import("./quick-npc-wizard-v12.mjs").then(value => value.QuickNpcWizardV12);
    }

    globalThis.quickNpc = {
        WizardV12: WizardV12,
        WizardV11: QuickNpcWizardV11,
        Wizard: WizardV12 ?? QuickNpcWizardV11,
    }

    Handlebars.registerHelper({
        empty: (arg) => {
            if (Array.isArray(arg)) {
                return arg.length === 0;
            }
            if (typeof arg === "object") {
                return Object.entries(arg).length === 0
            }
            if (typeof arg === "string") {
                return arg.length === 0
            }
            return false
        }
    })

    console.log(LOG_MESSAGE, "Initialized")
});


let app;
let cleanUpApplication = (application) => {
    if (application === app) {
        app = null;
    }
};
Hooks.on("closeApplication", cleanUpApplication)
Hooks.on("closeApplicationV2", cleanUpApplication)

/**
 * @param {SceneControlTool[]} tools
 */
const registerTool = function (tools) {
    tools.push({
        name: globalThis.quickNpc.Wizard.name,
        icon: "fa-solid fa-file-circle-plus",
        title: "QUICKNPC.wizard.title",
        button: true,
        onClick: () => (app ??= new globalThis.quickNpc.Wizard()).render(true),
        visible: game.user.isGM
    })
};

Hooks.on(globalThis.projectfu.SystemControls.HOOK_GET_SYSTEM_TOOLS, registerTool)
