import { SelectRoleStep } from './steps/select-role-step.mjs';
import { SelectSpeciesStep } from './steps/select-species-step.mjs';
import { SelectRankStep } from './steps/select-rank-step.mjs';
import { SelectLevelStep } from './steps/select-level-step.mjs';
import { AssignImmunityStep } from './steps/assign-immunity-step.mjs';
import { AssignResistanceStep } from './steps/assign-resistance-step.mjs';
import { AssignVulnerabilityStep } from './steps/assign-vulnerability-step.mjs';
import { ConfigureAttackStep } from './steps/configure-attack-step.mjs';
import { ChooseCustomizationStep } from './steps/choose-customization-step.mjs';
import { ChooseRoleSkillStep } from './steps/choose-role-skill-step.mjs';
import { ChooseBossSkillStep } from './steps/choose-boss-skill-step.mjs';
import { UpgradeResToAbsStep } from './steps/upgrade-res-abs-step.mjs';
import { UpgradeImmToAbsStep } from './steps/upgrade-imm-abs-step.mjs';
import { ConditionalBonusSkillStep } from './steps/conditional-bonus-skill-step.mjs';
import { ChooseTraitsStep } from './steps/choose-traits-step.mjs';
import { FinishStep } from './steps/finish-step.mjs';
import { ChooseSpellStep } from './steps/choose-spell-step.mjs';
import { AssignStatusImmunityStep } from './steps/assign-status-immunity-step.mjs';
import { ChooseNegativeSkillStep } from './steps/choose-negative-skill-step.mjs';
import { ChooseMagicAttributesStep } from './steps/choose-magic-attributes-step.mjs';
import { AssignSpeciesVulnerabilityStep } from './steps/assign-species-vulnerability-step.mjs';

/**
 * @type {typeof AbstractStep[]}
 */
export const npcWizardSteps = [
  SelectRoleStep,
  SelectSpeciesStep,
  SelectLevelStep,
  SelectRankStep,
  AssignSpeciesVulnerabilityStep,
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
  FinishStep,
];
