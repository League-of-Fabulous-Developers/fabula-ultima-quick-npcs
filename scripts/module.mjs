import {LOG_MESSAGE, MODULE} from "./constants.mjs";
import {SETTINGS} from "./settings.mjs";
import {reloadDatabase} from "./database.mjs";
import {UserDataConfig} from "./user-data-config.mjs";
import {QuickNpcWizard} from "./quick-npc-wizard.mjs";

const templates = {
    "QUICKNPC.step.chooseSkill": "/modules/fabula-ultima-quick-npcs/templates/steps/choose-skill.hbs",
    "QUICKNPC.step.chooseTraits": "/modules/fabula-ultima-quick-npcs/templates/steps/choose-traits.hbs",
    "QUICKNPC.step.conditionalBonusSkill": "/modules/fabula-ultima-quick-npcs/templates/steps/conditional-bonus-skill.hbs",
    "QUICKNPC.step.configureAttack": "/modules/fabula-ultima-quick-npcs/templates/steps/configure-attack.hbs",
    "QUICKNPC.step.finish": "/modules/fabula-ultima-quick-npcs/templates/steps/finish.hbs",
    "QUICKNPC.step.singleSelect": "/modules/fabula-ultima-quick-npcs/templates/steps/single-select.hbs",
    "QUICKNPC.wizard.preview": "/modules/fabula-ultima-quick-npcs/templates/preview.hbs",
    "QUICKNPC.wizard.stepper": "/modules/fabula-ultima-quick-npcs/templates/stepper.hbs",
    'QUICKNPC.preview.header': "/modules/fabula-ultima-quick-npcs/templates/preview/header.hbs",
    'QUICKNPC.preview.subHeader': "/modules/fabula-ultima-quick-npcs/templates/preview/sub-header.hbs",
    'QUICKNPC.preview.statistics': "/modules/fabula-ultima-quick-npcs/templates/preview/statistics.hbs",
    'QUICKNPC.preview.affinities': "/modules/fabula-ultima-quick-npcs/templates/preview/affinities.hbs",
    'QUICKNPC.preview.statusImmunities': "/modules/fabula-ultima-quick-npcs/templates/preview/status-immunities.hbs",
    'QUICKNPC.preview.attacks': "/modules/fabula-ultima-quick-npcs/templates/preview/attacks.hbs",
    'QUICKNPC.preview.spells': "/modules/fabula-ultima-quick-npcs/templates/preview/spells.hbs",
    'QUICKNPC.preview.actions': "/modules/fabula-ultima-quick-npcs/templates/preview/actions.hbs",
    'QUICKNPC.preview.rules': "/modules/fabula-ultima-quick-npcs/templates/preview/rules.hbs",
    'QUICKNPC.settings.userDataConfig': "/modules/fabula-ultima-quick-npcs/templates/user-data-config.hbs",
}


Hooks.once('init', async function () {
    console.log(LOG_MESSAGE, "Initialization started")

    console.log(LOG_MESSAGE, "Registering settings")

    initSettings();

    console.log(LOG_MESSAGE, "Loading templates")

    await loadTemplates(templates)

    console.log(LOG_MESSAGE, "Initializing UI")

    globalThis.quickNpc = {
        WizardV12: QuickNpcWizard,
        Wizard: QuickNpcWizard,
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

    initUi()

    console.log(LOG_MESSAGE, "Initialized")
});


function initSettings() {
    game.settings.register(MODULE, SETTINGS.actorsTabButtonPlacement, {
        name: game.i18n.localize("QUICKNPC.settings.actorsTabButtonPlacement.name"),
        hint: game.i18n.localize("QUICKNPC.settings.actorsTabButtonPlacement.hint"),
        type: String,
        choices: {
            none: game.i18n.localize("QUICKNPC.settings.actorsTabButtonPlacement.none"),
            top: game.i18n.localize("QUICKNPC.settings.actorsTabButtonPlacement.top"),
            bottom: game.i18n.localize("QUICKNPC.settings.actorsTabButtonPlacement.bottom"),
        },
        default: "top",
        scope: "world",
        config: true,
        requiresReload: false,
        onChange: () => foundry.ui.actors.render()
    })

    game.settings.register(MODULE, SETTINGS.showInSystemTools, {
        name: game.i18n.localize("QUICKNPC.settings.showInSystemTools.name"),
        type: Boolean,
        default: true,
        scope: "world",
        config: true,
        requiresReload: false,
        onChange: () => foundry.ui.players.render()
    })

    game.settings.register(MODULE, SETTINGS.userDataFiles, {
        name: game.i18n.localize("QUICKNPC.settings.userDataFiles"),
        type: new foundry.data.fields.SetField(new foundry.data.fields.FilePathField({
            categories: ["TEXT"]
        })),
        default: [],
        scope: "world",
        config: false,
        requiresReload: false,
        onChange: reloadDatabase
    })

    game.settings.registerMenu(MODULE, SETTINGS.userDataFiles, {
        name: game.i18n.localize('QUICKNPC.settings.userDataFiles.name'),
        label: game.i18n.localize('QUICKNPC.settings.userDataFiles.label'),
        hint: game.i18n.localize('QUICKNPC.settings.userDataFiles.hint'),
        icon: 'fas fa-book',
        type: UserDataConfig,
        restricted: true,
    });
}


function initUi() {

    let app;
    const renderWizard = () => (app ??= new globalThis.quickNpc.Wizard()).render(true);
    const cleanUpApplication = (application) => {
        if (application === app) {
            app = null;
        }
    };
    Hooks.on("closeApplication", cleanUpApplication)
    Hooks.on("closeApplicationV2", cleanUpApplication)

    Hooks.on("renderActorDirectory", (app, html) => {
        if (!game.user.can("ACTOR_CREATE")) {
            return;
        }

        const placement = game.settings.get(MODULE, SETTINGS.actorsTabButtonPlacement);
        const template = document.createElement("template");
        template.innerHTML = `
            <button type="button" data-action="openQuickNpcWizard" style="width: 100%; flex-basis: 100%">
                <i class="fa-solid fa-hat-wizard"></i>
                ${game.i18n.localize("QUICKNPC.wizard.open")}
            </button>
        `;
        template.content.querySelector("[data-action=openQuickNpcWizard]").addEventListener("click", renderWizard)
        if (placement === "top") {
            html.querySelector(".header-actions.action-buttons").appendChild(template.content)
        }
        if (placement === "bottom") {
            html.querySelector(".directory-footer.action-buttons").appendChild(template.content)
        }

    })

    const registerTool = function (tools) {
        tools.push({
            name: "QUICKNPC.wizard.open",
            icon: "fa-solid fa-hat-wizard",
            button: true,
            onClick: renderWizard,
            visible: game.settings.get(MODULE, SETTINGS.showInSystemTools) && game.user.can("ACTOR_CREATE")
        })
    };

    Hooks.on(globalThis.projectfu.SystemControls.HOOK_GET_SYSTEM_TOOLS, registerTool)
}