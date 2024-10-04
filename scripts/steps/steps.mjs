import {SelectRoleStep} from "./select-role-step.mjs";
import {SelectSpeciesStep} from "./select-species-step.mjs";
import {SelectRankStep} from "./select-rank-step.mjs";
import {SelectLevelStep} from "./select-level-step.mjs";
import {AssignImmunityStep} from "./assign-immunity-step.mjs";
import {AssignResistanceStep} from "./assign-resistance-step.mjs";
import {AssignVulnerabilityStep} from "./assign-vulnerability-step.mjs";
import {ConfigureAttackStep} from "./configure-attack-step.mjs";
import {ChooseCustomizationStep} from "./choose-customization-step.mjs";
import {ChooseRoleSkillStep} from "./choose-role-skill-step.mjs";
import {ChooseBossSkillStep} from "./choose-boss-skill-step.mjs";
import {UpgradeResToAbsStep} from "./upgrade-res-abs-step.mjs";
import {UpgradeImmToAbsStep} from "./upgrade-imm-abs-step.mjs";
import {ConditionalBonusSkillStep} from "./conditional-bonus-skill-step.mjs";
import {ChooseTraitsStep} from "./choose-traits-step.mjs";
import {FinishStep} from "./finish-step.mjs";
import {ChooseSpellStep} from "./choose-spell-step.mjs";
import {AssignStatusImmunityStep} from "./assign-status-immunity-step.mjs";
import {ChooseNegativeSkillStep} from "./choose-negative-skill-step.mjs";
import {ChooseMagicAttributesStep} from "./choose-magic-attributes-step.mjs";

/**
 * @type {typeof AbstractStep[]}
 */
export const npcCreationSteps = [
    SelectRoleStep,
    SelectSpeciesStep,
    SelectLevelStep,
    SelectRankStep,
    AssignImmunityStep,
    AssignResistanceStep,
    AssignVulnerabilityStep,
    UpgradeResToAbsStep,
    UpgradeImmToAbsStep,
    AssignStatusImmunityStep,
    ConditionalBonusSkillStep,
    ChooseCustomizationStep,
    ConfigureAttackStep,
    ChooseMagicAttributesStep,
    ChooseSpellStep,
    ChooseRoleSkillStep,
    ChooseBossSkillStep,
    ChooseNegativeSkillStep,
    ChooseTraitsStep,
    FinishStep
]
