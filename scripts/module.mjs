import {LOG_MESSAGE, MODULE} from "./constants.mjs";
import {QuickNpcWizardV11} from "./quick-npc-wizard-v11.mjs";
import {SETTINGS} from "./settings.mjs";

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
}


Hooks.once('init', async function () {
    console.log(LOG_MESSAGE, "Initialization started")

    console.log(LOG_MESSAGE, "Registering settings")

    initSettings();

    console.log(LOG_MESSAGE, "Loading templates")

    await loadTemplates(templates)

    console.log(LOG_MESSAGE, "Initializing UI")

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
        onChange: () => ui.sidebar.tabs.actors.render()
    })

    game.settings.register(MODULE, SETTINGS.showInSystemTools, {
        name: game.i18n.localize("QUICKNPC.settings.showInSystemTools.name"),
        type: Boolean,
        default: true,
        scope: "world",
        config: true,
        requiresReload: false,
        onChange: () => ui.controls.initialize()
    })
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
        console.log(app, html)
        const placement = game.settings.get(MODULE, SETTINGS.actorsTabButtonPlacement);
        const template = document.createElement("template");
        template.innerHTML = `
        <div class="action-buttons flexrow">
            <button type="button" data-action="openQuickNpcWizard">
                <i class="fa-solid fa-hat-wizard"></i>
                ${game.i18n.localize("QUICKNPC.wizard.open")}
            </button>
        </div>
        `;
        $(template.content).find("[data-action=openQuickNpcWizard]").on("click", renderWizard)
        if (placement === "top") {
            html.find(".header-actions.action-buttons").after(template.content)
        }
        if (placement === "bottom") {
            html.find(".directory-footer.action-buttons").append(template.content)
        }

    })


    /**
     * @param {SceneControlTool[]} tools
     */
    const registerTool = function (tools) {
        tools.push({
            name: globalThis.quickNpc.Wizard.name,
            icon: "fa-solid fa-hat-wizard",
            title: "QUICKNPC.wizard.open",
            button: true,
            onClick: renderWizard,
            visible: game.user.isGM && game.settings.get(MODULE, SETTINGS.showInSystemTools)
        })
    };

    Hooks.on(globalThis.projectfu.SystemControls.HOOK_GET_SYSTEM_TOOLS, registerTool)
}