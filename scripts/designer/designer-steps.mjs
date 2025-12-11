import {SelectLevelStep} from "./steps/select-level-step.mjs";
import {SelectSpeciesStep} from "./steps/select-species-step.mjs";
import {SelectRankStep} from "./steps/select-rank-step.mjs";
import {AssignImmunityStep} from "./steps/assign-immunity-step.mjs";
import {AssignResistanceStep} from "./steps/assign-resistance-step.mjs";
import {AssignSpeciesVulnerabilityStep} from "./steps/assign-species-vulnerability-step.mjs";
import {FinishStep} from "./steps/finish-step.mjs";
import {ConfigureAttributesStep} from "./steps/configure-attributes-step.mjs";
import {SelectAttributeDistributionStep} from "./steps/select-attribute-distribution.mjs";
import {UpgradeAttributeStep} from "./steps/upgrade-attribute-step.mjs";
import {DesignAttackStep} from "./steps/design-attack-step.mjs";
import {AllocateSkillStep} from "./steps/allocate-skill-step.mjs";
import {ChooseSpellStep} from "./steps/choose-spell-step.mjs";
import {ChooseMagicAttributesStep} from "./steps/choose-magic-attributes-step.mjs";
import {ChooseTraitsStep} from "./steps/choose-traits-step.mjs";

export const unallocatedSkills = "unallocatedSkills";

export const npcDesignerSteps = [
    SelectLevelStep,
    SelectSpeciesStep,
    SelectRankStep,
    SelectAttributeDistributionStep,
    ConfigureAttributesStep,
    UpgradeAttributeStep,
    AssignSpeciesVulnerabilityStep,
    AssignImmunityStep,
    AssignResistanceStep,
    DesignAttackStep,
    ChooseMagicAttributesStep,
    ChooseSpellStep,
    AllocateSkillStep,
    ChooseTraitsStep,
    FinishStep
]