'use strict';
export const validate = validate20;
export default validate20;
const schema31 = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  oneOf: [{ $ref: '#/$defs/Species' }, { $ref: '#/$defs/Role' }, { $ref: '#/$defs/DesignerSpellList' }],
  $defs: {
    Species: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'species' },
        species: {
          type: 'object',
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            npcSpecies: {
              enum: ['beast', 'construct', 'demon', 'elemental', 'humanoid', 'monster', 'plant', 'undead'],
            },
            changes: { $ref: '#/$defs/Changes' },
            customizationCount: { type: 'number' },
            customizationOptions: {
              type: 'object',
              additionalProperties: false,
              patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
            },
            spellLists: {
              type: 'object',
              additionalProperties: false,
              patternProperties: {
                '.+': {
                  type: 'object',
                  additionalProperties: false,
                  patternProperties: {
                    '.+': { $ref: '#/$defs/UnconfiguredSpell' },
                  },
                  minProperties: 1,
                },
              },
            },
          },
          required: ['name', 'npcSpecies', 'changes', 'customizationCount', 'customizationOptions'],
        },
      },
      required: ['type', 'species'],
    },
    Changes: {
      type: 'object',
      additionalProperties: false,
      properties: {
        model: { $ref: '#/$defs/Model' },
        steps: { type: 'array', items: { $ref: '#/$defs/Step' } },
        conditional: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              choice: { type: 'string' },
              values: { type: 'array', items: { type: 'string' }, minItems: 1 },
              changes: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  model: { $ref: '#/$defs/Model' },
                  steps: { type: 'array', items: { $ref: '#/$defs/Step' } },
                },
              },
            },
            required: ['choice', 'values', 'changes'],
          },
        },
      },
    },
    Model: {
      type: 'object',
      additionalProperties: false,
      properties: {
        bonuses: {
          type: 'object',
          additionalProperties: false,
          properties: {
            hp: { type: 'integer' },
            mp: { type: 'integer' },
            def: { type: 'integer' },
            mDef: { type: 'integer' },
            init: { type: 'integer' },
            accuracy: { type: 'integer' },
            magic: { type: 'integer' },
          },
        },
        affinities: {
          type: 'object',
          additionalProperties: false,
          properties: {
            physical: { $ref: '#/$defs/Affinity' },
            air: { $ref: '#/$defs/Affinity' },
            bolt: { $ref: '#/$defs/Affinity' },
            dark: { $ref: '#/$defs/Affinity' },
            earth: { $ref: '#/$defs/Affinity' },
            fire: { $ref: '#/$defs/Affinity' },
            ice: { $ref: '#/$defs/Affinity' },
            light: { $ref: '#/$defs/Affinity' },
            poison: { $ref: '#/$defs/Affinity' },
          },
        },
        statusImmunities: {
          type: 'object',
          additionalProperties: false,
          properties: {
            dazed: { const: true },
            shaken: { const: true },
            slow: { const: true },
            weak: { const: true },
            enraged: { const: true },
            poisoned: { const: true },
          },
        },
        attacks: {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/Attack' } },
        },
        actions: {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/Action' } },
        },
        spells: {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/Spell' } },
        },
        rules: {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/Rule' } },
        },
      },
    },
    AttributeDice: { enum: ['d6', 'd8', 'd10', 'd12'] },
    Affinity: { enum: ['vul', '', 'res', 'imm', 'abs'] },
    DamageType: {
      enum: ['physical', 'air', 'bolt', 'dark', 'earth', 'fire', 'ice', 'light', 'poison'],
    },
    Rank: {
      enum: ['soldier', 'elite', 'champion1', 'champion2', 'champion3', 'champion4', 'champion5', 'champion6'],
    },
    Attack: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        baseDamage: { type: 'integer' },
        range: { enum: ['melee', 'ranged'] },
        attributes: { $ref: '#/$defs/Attributes' },
        damageType: { $ref: '#/$defs/DamageType' },
        targetDefense: { enum: ['def', 'mDef'] },
        special: { type: 'array', items: { type: 'string' } },
      },
    },
    Action: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        summary: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['name', 'summary', 'description'],
    },
    Spell: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        summary: { type: 'string' },
        cost: { type: 'integer' },
        target: { enum: ['self', 'single', 'upToThree', 'special', 'weapon'] },
        costType: { enum: ['total', 'perTarget'] },
        duration: { enum: ['instant', 'scene'] },
        opportunity: { type: 'string' },
        offensive: {
          type: 'object',
          additionalProperties: false,
          properties: {
            attributes: { $ref: '#/$defs/Attributes' },
            accuracy: { type: 'integer' },
            damage: {
              type: 'object',
              additionalProperties: false,
              properties: {
                base: { type: 'integer' },
                type: { $ref: '#/$defs/DamageType' },
              },
              required: ['base', 'type'],
            },
          },
          required: ['attributes', 'accuracy'],
        },
      },
      required: ['name', 'summary', 'cost', 'costType', 'target', 'duration'],
    },
    Rule: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        summary: { type: 'string' },
      },
      required: ['name', 'description'],
    },
    Attributes: {
      type: 'array',
      items: { enum: ['dex', 'ins', 'mig', 'wlp'] },
      minItems: 2,
      maxItems: 2,
    },
    Step: {
      anyOf: [
        { $ref: '#/$defs/AssignSpeciesVulnerability' },
        { $ref: '#/$defs/AssignImmunity' },
        { $ref: '#/$defs/AssignResistance' },
        { $ref: '#/$defs/AssignVulnerability' },
        { $ref: '#/$defs/UpgradeResToAbs' },
        { $ref: '#/$defs/UpgradeImmToAbs' },
        { $ref: '#/$defs/AssignStatusImmunity' },
        { $ref: '#/$defs/ConditionalBonusSkill' },
        { $ref: '#/$defs/ChooseCustomization' },
        { $ref: '#/$defs/ConfigureAttack' },
        { $ref: '#/$defs/ChooseSpell' },
        { $ref: '#/$defs/ChooseRoleSkill' },
      ],
    },
    AssignSpeciesVulnerability: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'AssignSpeciesVulnerability' },
        options: { type: 'array', items: { $ref: '#/$defs/DamageType' } },
      },
      required: ['type'],
    },
    AssignImmunity: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'AssignImmunity' },
        options: { type: 'array', items: { $ref: '#/$defs/DamageType' } },
      },
      required: ['type'],
    },
    AssignResistance: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'AssignResistance' },
        options: { type: 'array', items: { $ref: '#/$defs/DamageType' } },
      },
      required: ['type'],
    },
    AssignVulnerability: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'AssignVulnerability' },
        options: { type: 'array', items: { $ref: '#/$defs/DamageType' } },
      },
      required: ['type'],
    },
    UpgradeResToAbs: {
      type: 'object',
      additionalProperties: false,
      properties: { type: { const: 'UpgradeResToAbs' } },
      required: ['type'],
    },
    UpgradeImmToAbs: {
      type: 'object',
      additionalProperties: false,
      properties: { type: { const: 'UpgradeImmToAbs' } },
      required: ['type'],
    },
    AssignStatusImmunity: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'AssignStatusImmunity' },
        options: {
          type: 'array',
          items: {
            enum: ['dazed', 'shaken', 'slow', 'weak', 'enraged', 'poisoned'],
          },
        },
      },
      required: ['type'],
    },
    ConditionalBonusSkill: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'ConditionalBonusSkill' },
        drawback: { $ref: '#/$defs/Skill' },
        options: {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
          minProperties: 1,
        },
      },
      required: ['type', 'drawback', 'options'],
    },
    ChooseCustomization: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'ChooseCustomization' },
        options: {
          type: 'object',
          patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
          minProperties: 1,
        },
      },
      required: ['type', 'options'],
    },
    ConfigureAttack: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'ConfigureAttack' },
        attack: { type: 'string' },
        configure: {
          type: 'object',
          properties: {
            attributes: {
              type: 'array',
              items: { $ref: '#/$defs/Attributes' },
              minItems: 2,
            },
            damageType: {
              oneOf: [
                { const: true },
                {
                  type: 'array',
                  items: { $ref: '#/$defs/DamageType' },
                  minItems: 2,
                },
              ],
            },
            range: { const: true },
            special: {
              type: 'object',
              additionalProperties: false,
              patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
              minProperties: 2,
            },
          },
        },
      },
      required: ['type', 'attack', 'configure'],
    },
    ChooseSpell: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'ChooseSpell' },
        spells: {
          oneOf: [
            { type: 'string' },
            {
              type: 'object',
              additionalProperties: false,
              patternProperties: {
                '.+': { $ref: '#/$defs/UnconfiguredSpell' },
              },
              minProperties: 1,
            },
          ],
        },
      },
      required: ['type', 'spells'],
    },
    ChooseRoleSkill: {
      type: 'object',
      additionalProperties: false,
      properties: { type: { const: 'ChooseRoleSkill' } },
      required: ['type'],
    },
    Skill: {
      type: 'object',
      additionalProperties: false,
      properties: {
        label: { type: 'string' },
        description: { type: 'string' },
        changes: { $ref: '#/$defs/Changes' },
        choices: {
          type: 'object',
          additionalProperties: false,
          patternProperties: {
            '.+': {
              type: 'object',
              additionalProperties: false,
              properties: {
                label: { type: 'string' },
                options: {
                  type: 'object',
                  additionalProperties: false,
                  patternProperties: { '.+': { type: 'string' } },
                },
                conditional: {
                  type: 'object',
                  additionalProperties: false,
                  patternProperties: { '.+': { type: 'string' } },
                },
                group: { type: 'string' },
              },
            },
          },
        },
        require: { $ref: '#/$defs/Requirements' },
        disallow: { $ref: '#/$defs/Requirements' },
      },
      required: ['label', 'description', 'changes'],
    },
    Requirements: {
      type: 'object',
      additionalProperties: false,
      properties: {
        anyResistance: { type: 'boolean' },
        anyImmunity: { type: 'boolean' },
        rank: { type: 'array', items: { $ref: '#/$defs/Rank' }, minItems: 1 },
        attack: { type: 'string' },
        anyRule: { type: 'array', items: { type: 'string' }, minItems: 1 },
        anyAction: { type: 'array', items: { type: 'string' }, minItems: 1 },
        anyCustomization: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
        },
        level: { enum: [10, 20, 30, 40, 50] },
      },
    },
    Role: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'role' },
        role: {
          type: 'object',
          additionalProperties: false,
          properties: {
            label: { type: 'string' },
            baseAttributes: {
              type: 'object',
              additionalProperties: false,
              properties: {
                dex: { $ref: '#/$defs/AttributeDice' },
                ins: { $ref: '#/$defs/AttributeDice' },
                mig: { $ref: '#/$defs/AttributeDice' },
                wlp: { $ref: '#/$defs/AttributeDice' },
              },
              required: ['dex', 'ins', 'mig', 'wlp'],
            },
            attributeChanges: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  dex: { $ref: '#/$defs/AttributeDice' },
                  ins: { $ref: '#/$defs/AttributeDice' },
                  mig: { $ref: '#/$defs/AttributeDice' },
                  wlp: { $ref: '#/$defs/AttributeDice' },
                },
                minProperties: 1,
                maxProperties: 1,
              },
              minItems: 3,
              maxItems: 3,
            },
            skillsByLevel: {
              type: 'array',
              items: { $ref: '#/$defs/Changes' },
              minItems: 6,
              maxItems: 6,
            },
            baseline: {
              allOf: [
                { $ref: '#/$defs/Changes' },
                {
                  type: 'object',
                  properties: {
                    model: {
                      type: 'object',
                      properties: {
                        attacks: {
                          type: 'object',
                          patternProperties: {
                            '.+': {
                              type: 'object',
                              properties: { name: true, baseDamage: true },
                              required: ['name', 'baseDamage'],
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
            roleSkills: {
              type: 'object',
              additionalProperties: false,
              patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
            },
            customizations: {
              type: 'object',
              additionalProperties: false,
              patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
            },
            spellLists: {
              type: 'object',
              additionalProperties: false,
              patternProperties: {
                '.+': {
                  type: 'object',
                  additionalProperties: false,
                  patternProperties: {
                    '.+': { $ref: '#/$defs/UnconfiguredSpell' },
                  },
                  minProperties: 1,
                },
              },
            },
          },
          required: [
            'attributeChanges',
            'baseAttributes',
            'baseline',
            'label',
            'customizations',
            'roleSkills',
            'skillsByLevel',
          ],
        },
      },
      required: ['type', 'role'],
    },
    UnconfiguredSpell: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        summary: { type: 'string' },
        description: { type: 'string' },
        cost: { type: 'integer' },
        target: { enum: ['self', 'single', 'upToThree', 'special', 'weapon'] },
        costType: { enum: ['total', 'perTarget'] },
        duration: { enum: ['instant', 'scene'] },
        opportunity: { type: 'string' },
        offensive: {
          oneOf: [
            { const: true },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                baseDamage: { type: 'integer' },
                damageType: {
                  oneOf: [
                    { $ref: '#/$defs/DamageType' },
                    { const: true },
                    {
                      type: 'array',
                      items: { $ref: '#/$defs/DamageType' },
                      minItems: 2,
                    },
                  ],
                },
              },
              required: ['baseDamage', 'damageType'],
            },
          ],
        },
        choices: {
          type: 'object',
          additionalProperties: false,
          patternProperties: {
            '.+': {
              type: 'object',
              additionalProperties: false,
              properties: {
                label: { type: 'string' },
                options: {
                  type: 'object',
                  additionalProperties: false,
                  patternProperties: { '.+': { type: 'string' } },
                },
                conditional: {
                  type: 'object',
                  additionalProperties: false,
                  patternProperties: { '.+': { type: 'string' } },
                },
                group: { type: 'string' },
              },
            },
          },
        },
        require: { $ref: '#/$defs/Requirements' },
        disallow: { $ref: '#/$defs/Requirements' },
      },
      required: ['name', 'summary', 'description', 'cost', 'costType', 'target', 'duration'],
    },
    DesignerSpellList: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { const: 'designer-spell-list' },
        name: { type: 'string' },
        spellList: {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/UnconfiguredSpell' } },
          minProperties: 1,
        },
      },
      required: ['type', 'name', 'spellList'],
    },
  },
};
const schema32 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'species' },
    species: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        npcSpecies: {
          enum: ['beast', 'construct', 'demon', 'elemental', 'humanoid', 'monster', 'plant', 'undead'],
        },
        changes: { $ref: '#/$defs/Changes' },
        customizationCount: { type: 'number' },
        customizationOptions: {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
        },
        spellLists: {
          type: 'object',
          additionalProperties: false,
          patternProperties: {
            '.+': {
              type: 'object',
              additionalProperties: false,
              patternProperties: {
                '.+': { $ref: '#/$defs/UnconfiguredSpell' },
              },
              minProperties: 1,
            },
          },
        },
      },
      required: ['name', 'npcSpecies', 'changes', 'customizationCount', 'customizationOptions'],
    },
  },
  required: ['type', 'species'],
};
const schema33 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    model: { $ref: '#/$defs/Model' },
    steps: { type: 'array', items: { $ref: '#/$defs/Step' } },
    conditional: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          choice: { type: 'string' },
          values: { type: 'array', items: { type: 'string' }, minItems: 1 },
          changes: {
            type: 'object',
            additionalProperties: false,
            properties: {
              model: { $ref: '#/$defs/Model' },
              steps: { type: 'array', items: { $ref: '#/$defs/Step' } },
            },
          },
        },
        required: ['choice', 'values', 'changes'],
      },
    },
  },
};
const schema34 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    bonuses: {
      type: 'object',
      additionalProperties: false,
      properties: {
        hp: { type: 'integer' },
        mp: { type: 'integer' },
        def: { type: 'integer' },
        mDef: { type: 'integer' },
        init: { type: 'integer' },
        accuracy: { type: 'integer' },
        magic: { type: 'integer' },
      },
    },
    affinities: {
      type: 'object',
      additionalProperties: false,
      properties: {
        physical: { $ref: '#/$defs/Affinity' },
        air: { $ref: '#/$defs/Affinity' },
        bolt: { $ref: '#/$defs/Affinity' },
        dark: { $ref: '#/$defs/Affinity' },
        earth: { $ref: '#/$defs/Affinity' },
        fire: { $ref: '#/$defs/Affinity' },
        ice: { $ref: '#/$defs/Affinity' },
        light: { $ref: '#/$defs/Affinity' },
        poison: { $ref: '#/$defs/Affinity' },
      },
    },
    statusImmunities: {
      type: 'object',
      additionalProperties: false,
      properties: {
        dazed: { const: true },
        shaken: { const: true },
        slow: { const: true },
        weak: { const: true },
        enraged: { const: true },
        poisoned: { const: true },
      },
    },
    attacks: {
      type: 'object',
      additionalProperties: false,
      patternProperties: { '.+': { $ref: '#/$defs/Attack' } },
    },
    actions: {
      type: 'object',
      additionalProperties: false,
      patternProperties: { '.+': { $ref: '#/$defs/Action' } },
    },
    spells: {
      type: 'object',
      additionalProperties: false,
      patternProperties: { '.+': { $ref: '#/$defs/Spell' } },
    },
    rules: {
      type: 'object',
      additionalProperties: false,
      patternProperties: { '.+': { $ref: '#/$defs/Rule' } },
    },
  },
};
const schema35 = { enum: ['vul', '', 'res', 'imm', 'abs'] };
const schema47 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    summary: { type: 'string' },
    description: { type: 'string' },
  },
  required: ['name', 'summary', 'description'],
};
const schema51 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    summary: { type: 'string' },
  },
  required: ['name', 'description'],
};
const func1 = Object.prototype.hasOwnProperty;
const pattern4 = new RegExp('.+', 'u');
const schema44 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    baseDamage: { type: 'integer' },
    range: { enum: ['melee', 'ranged'] },
    attributes: { $ref: '#/$defs/Attributes' },
    damageType: { $ref: '#/$defs/DamageType' },
    targetDefense: { enum: ['def', 'mDef'] },
    special: { type: 'array', items: { type: 'string' } },
  },
};
const schema45 = {
  type: 'array',
  items: { enum: ['dex', 'ins', 'mig', 'wlp'] },
  minItems: 2,
  maxItems: 2,
};
const schema46 = {
  enum: ['physical', 'air', 'bolt', 'dark', 'earth', 'fire', 'ice', 'light', 'poison'],
};
function validate24(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate24.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      const _errs1 = errors;
      for (const key0 in data) {
        if (
          !(
            key0 === 'name' ||
            key0 === 'baseDamage' ||
            key0 === 'range' ||
            key0 === 'attributes' ||
            key0 === 'damageType' ||
            key0 === 'targetDefense' ||
            key0 === 'special'
          )
        ) {
          validate24.errors = [
            {
              instancePath,
              schemaPath: '#/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key0 },
              message: 'must NOT have additional properties',
            },
          ];
          return false;
          break;
        }
      }
      if (_errs1 === errors) {
        if (data.name !== undefined) {
          const _errs2 = errors;
          if (typeof data.name !== 'string') {
            validate24.errors = [
              {
                instancePath: instancePath + '/name',
                schemaPath: '#/properties/name/type',
                keyword: 'type',
                params: { type: 'string' },
                message: 'must be string',
              },
            ];
            return false;
          }
          var valid0 = _errs2 === errors;
        } else {
          var valid0 = true;
        }
        if (valid0) {
          if (data.baseDamage !== undefined) {
            let data1 = data.baseDamage;
            const _errs4 = errors;
            if (!(typeof data1 == 'number' && !(data1 % 1) && !isNaN(data1) && isFinite(data1))) {
              validate24.errors = [
                {
                  instancePath: instancePath + '/baseDamage',
                  schemaPath: '#/properties/baseDamage/type',
                  keyword: 'type',
                  params: { type: 'integer' },
                  message: 'must be integer',
                },
              ];
              return false;
            }
            var valid0 = _errs4 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.range !== undefined) {
              let data2 = data.range;
              const _errs6 = errors;
              if (!(data2 === 'melee' || data2 === 'ranged')) {
                validate24.errors = [
                  {
                    instancePath: instancePath + '/range',
                    schemaPath: '#/properties/range/enum',
                    keyword: 'enum',
                    params: { allowedValues: schema44.properties.range.enum },
                    message: 'must be equal to one of the allowed values',
                  },
                ];
                return false;
              }
              var valid0 = _errs6 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.attributes !== undefined) {
                let data3 = data.attributes;
                const _errs7 = errors;
                const _errs8 = errors;
                if (errors === _errs8) {
                  if (Array.isArray(data3)) {
                    if (data3.length > 2) {
                      validate24.errors = [
                        {
                          instancePath: instancePath + '/attributes',
                          schemaPath: '#/$defs/Attributes/maxItems',
                          keyword: 'maxItems',
                          params: { limit: 2 },
                          message: 'must NOT have more than 2 items',
                        },
                      ];
                      return false;
                    } else {
                      if (data3.length < 2) {
                        validate24.errors = [
                          {
                            instancePath: instancePath + '/attributes',
                            schemaPath: '#/$defs/Attributes/minItems',
                            keyword: 'minItems',
                            params: { limit: 2 },
                            message: 'must NOT have fewer than 2 items',
                          },
                        ];
                        return false;
                      } else {
                        var valid2 = true;
                        const len0 = data3.length;
                        for (let i0 = 0; i0 < len0; i0++) {
                          let data4 = data3[i0];
                          const _errs10 = errors;
                          if (!(data4 === 'dex' || data4 === 'ins' || data4 === 'mig' || data4 === 'wlp')) {
                            validate24.errors = [
                              {
                                instancePath: instancePath + '/attributes/' + i0,
                                schemaPath: '#/$defs/Attributes/items/enum',
                                keyword: 'enum',
                                params: { allowedValues: schema45.items.enum },
                                message: 'must be equal to one of the allowed values',
                              },
                            ];
                            return false;
                          }
                          var valid2 = _errs10 === errors;
                          if (!valid2) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate24.errors = [
                      {
                        instancePath: instancePath + '/attributes',
                        schemaPath: '#/$defs/Attributes/type',
                        keyword: 'type',
                        params: { type: 'array' },
                        message: 'must be array',
                      },
                    ];
                    return false;
                  }
                }
                var valid0 = _errs7 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.damageType !== undefined) {
                  let data5 = data.damageType;
                  const _errs11 = errors;
                  if (
                    !(
                      data5 === 'physical' ||
                      data5 === 'air' ||
                      data5 === 'bolt' ||
                      data5 === 'dark' ||
                      data5 === 'earth' ||
                      data5 === 'fire' ||
                      data5 === 'ice' ||
                      data5 === 'light' ||
                      data5 === 'poison'
                    )
                  ) {
                    validate24.errors = [
                      {
                        instancePath: instancePath + '/damageType',
                        schemaPath: '#/$defs/DamageType/enum',
                        keyword: 'enum',
                        params: { allowedValues: schema46.enum },
                        message: 'must be equal to one of the allowed values',
                      },
                    ];
                    return false;
                  }
                  var valid0 = _errs11 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.targetDefense !== undefined) {
                    let data6 = data.targetDefense;
                    const _errs13 = errors;
                    if (!(data6 === 'def' || data6 === 'mDef')) {
                      validate24.errors = [
                        {
                          instancePath: instancePath + '/targetDefense',
                          schemaPath: '#/properties/targetDefense/enum',
                          keyword: 'enum',
                          params: {
                            allowedValues: schema44.properties.targetDefense.enum,
                          },
                          message: 'must be equal to one of the allowed values',
                        },
                      ];
                      return false;
                    }
                    var valid0 = _errs13 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.special !== undefined) {
                      let data7 = data.special;
                      const _errs14 = errors;
                      if (errors === _errs14) {
                        if (Array.isArray(data7)) {
                          var valid4 = true;
                          const len1 = data7.length;
                          for (let i1 = 0; i1 < len1; i1++) {
                            const _errs16 = errors;
                            if (typeof data7[i1] !== 'string') {
                              validate24.errors = [
                                {
                                  instancePath: instancePath + '/special/' + i1,
                                  schemaPath: '#/properties/special/items/type',
                                  keyword: 'type',
                                  params: { type: 'string' },
                                  message: 'must be string',
                                },
                              ];
                              return false;
                            }
                            var valid4 = _errs16 === errors;
                            if (!valid4) {
                              break;
                            }
                          }
                        } else {
                          validate24.errors = [
                            {
                              instancePath: instancePath + '/special',
                              schemaPath: '#/properties/special/type',
                              keyword: 'type',
                              params: { type: 'array' },
                              message: 'must be array',
                            },
                          ];
                          return false;
                        }
                      }
                      var valid0 = _errs14 === errors;
                    } else {
                      var valid0 = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate24.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate24.errors = vErrors;
  return errors === 0;
}
validate24.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema48 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    summary: { type: 'string' },
    cost: { type: 'integer' },
    target: { enum: ['self', 'single', 'upToThree', 'special', 'weapon'] },
    costType: { enum: ['total', 'perTarget'] },
    duration: { enum: ['instant', 'scene'] },
    opportunity: { type: 'string' },
    offensive: {
      type: 'object',
      additionalProperties: false,
      properties: {
        attributes: { $ref: '#/$defs/Attributes' },
        accuracy: { type: 'integer' },
        damage: {
          type: 'object',
          additionalProperties: false,
          properties: {
            base: { type: 'integer' },
            type: { $ref: '#/$defs/DamageType' },
          },
          required: ['base', 'type'],
        },
      },
      required: ['attributes', 'accuracy'],
    },
  },
  required: ['name', 'summary', 'cost', 'costType', 'target', 'duration'],
};
function validate26(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate26.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (
        (data.name === undefined && (missing0 = 'name')) ||
        (data.summary === undefined && (missing0 = 'summary')) ||
        (data.cost === undefined && (missing0 = 'cost')) ||
        (data.costType === undefined && (missing0 = 'costType')) ||
        (data.target === undefined && (missing0 = 'target')) ||
        (data.duration === undefined && (missing0 = 'duration'))
      ) {
        validate26.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (
            !(
              key0 === 'name' ||
              key0 === 'summary' ||
              key0 === 'cost' ||
              key0 === 'target' ||
              key0 === 'costType' ||
              key0 === 'duration' ||
              key0 === 'opportunity' ||
              key0 === 'offensive'
            )
          ) {
            validate26.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.name !== undefined) {
            const _errs2 = errors;
            if (typeof data.name !== 'string') {
              validate26.errors = [
                {
                  instancePath: instancePath + '/name',
                  schemaPath: '#/properties/name/type',
                  keyword: 'type',
                  params: { type: 'string' },
                  message: 'must be string',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.summary !== undefined) {
              const _errs4 = errors;
              if (typeof data.summary !== 'string') {
                validate26.errors = [
                  {
                    instancePath: instancePath + '/summary',
                    schemaPath: '#/properties/summary/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  },
                ];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.cost !== undefined) {
                let data2 = data.cost;
                const _errs6 = errors;
                if (!(typeof data2 == 'number' && !(data2 % 1) && !isNaN(data2) && isFinite(data2))) {
                  validate26.errors = [
                    {
                      instancePath: instancePath + '/cost',
                      schemaPath: '#/properties/cost/type',
                      keyword: 'type',
                      params: { type: 'integer' },
                      message: 'must be integer',
                    },
                  ];
                  return false;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.target !== undefined) {
                  let data3 = data.target;
                  const _errs8 = errors;
                  if (
                    !(
                      data3 === 'self' ||
                      data3 === 'single' ||
                      data3 === 'upToThree' ||
                      data3 === 'special' ||
                      data3 === 'weapon'
                    )
                  ) {
                    validate26.errors = [
                      {
                        instancePath: instancePath + '/target',
                        schemaPath: '#/properties/target/enum',
                        keyword: 'enum',
                        params: {
                          allowedValues: schema48.properties.target.enum,
                        },
                        message: 'must be equal to one of the allowed values',
                      },
                    ];
                    return false;
                  }
                  var valid0 = _errs8 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.costType !== undefined) {
                    let data4 = data.costType;
                    const _errs9 = errors;
                    if (!(data4 === 'total' || data4 === 'perTarget')) {
                      validate26.errors = [
                        {
                          instancePath: instancePath + '/costType',
                          schemaPath: '#/properties/costType/enum',
                          keyword: 'enum',
                          params: {
                            allowedValues: schema48.properties.costType.enum,
                          },
                          message: 'must be equal to one of the allowed values',
                        },
                      ];
                      return false;
                    }
                    var valid0 = _errs9 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.duration !== undefined) {
                      let data5 = data.duration;
                      const _errs10 = errors;
                      if (!(data5 === 'instant' || data5 === 'scene')) {
                        validate26.errors = [
                          {
                            instancePath: instancePath + '/duration',
                            schemaPath: '#/properties/duration/enum',
                            keyword: 'enum',
                            params: {
                              allowedValues: schema48.properties.duration.enum,
                            },
                            message: 'must be equal to one of the allowed values',
                          },
                        ];
                        return false;
                      }
                      var valid0 = _errs10 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.opportunity !== undefined) {
                        const _errs11 = errors;
                        if (typeof data.opportunity !== 'string') {
                          validate26.errors = [
                            {
                              instancePath: instancePath + '/opportunity',
                              schemaPath: '#/properties/opportunity/type',
                              keyword: 'type',
                              params: { type: 'string' },
                              message: 'must be string',
                            },
                          ];
                          return false;
                        }
                        var valid0 = _errs11 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.offensive !== undefined) {
                          let data7 = data.offensive;
                          const _errs13 = errors;
                          if (errors === _errs13) {
                            if (data7 && typeof data7 == 'object' && !Array.isArray(data7)) {
                              let missing1;
                              if (
                                (data7.attributes === undefined && (missing1 = 'attributes')) ||
                                (data7.accuracy === undefined && (missing1 = 'accuracy'))
                              ) {
                                validate26.errors = [
                                  {
                                    instancePath: instancePath + '/offensive',
                                    schemaPath: '#/properties/offensive/required',
                                    keyword: 'required',
                                    params: { missingProperty: missing1 },
                                    message: "must have required property '" + missing1 + "'",
                                  },
                                ];
                                return false;
                              } else {
                                const _errs15 = errors;
                                for (const key1 in data7) {
                                  if (!(key1 === 'attributes' || key1 === 'accuracy' || key1 === 'damage')) {
                                    validate26.errors = [
                                      {
                                        instancePath: instancePath + '/offensive',
                                        schemaPath: '#/properties/offensive/additionalProperties',
                                        keyword: 'additionalProperties',
                                        params: { additionalProperty: key1 },
                                        message: 'must NOT have additional properties',
                                      },
                                    ];
                                    return false;
                                    break;
                                  }
                                }
                                if (_errs15 === errors) {
                                  if (data7.attributes !== undefined) {
                                    let data8 = data7.attributes;
                                    const _errs16 = errors;
                                    const _errs17 = errors;
                                    if (errors === _errs17) {
                                      if (Array.isArray(data8)) {
                                        if (data8.length > 2) {
                                          validate26.errors = [
                                            {
                                              instancePath: instancePath + '/offensive/attributes',
                                              schemaPath: '#/$defs/Attributes/maxItems',
                                              keyword: 'maxItems',
                                              params: { limit: 2 },
                                              message: 'must NOT have more than 2 items',
                                            },
                                          ];
                                          return false;
                                        } else {
                                          if (data8.length < 2) {
                                            validate26.errors = [
                                              {
                                                instancePath: instancePath + '/offensive/attributes',
                                                schemaPath: '#/$defs/Attributes/minItems',
                                                keyword: 'minItems',
                                                params: { limit: 2 },
                                                message: 'must NOT have fewer than 2 items',
                                              },
                                            ];
                                            return false;
                                          } else {
                                            var valid3 = true;
                                            const len0 = data8.length;
                                            for (let i0 = 0; i0 < len0; i0++) {
                                              let data9 = data8[i0];
                                              const _errs19 = errors;
                                              if (
                                                !(
                                                  data9 === 'dex' ||
                                                  data9 === 'ins' ||
                                                  data9 === 'mig' ||
                                                  data9 === 'wlp'
                                                )
                                              ) {
                                                validate26.errors = [
                                                  {
                                                    instancePath: instancePath + '/offensive/attributes/' + i0,
                                                    schemaPath: '#/$defs/Attributes/items/enum',
                                                    keyword: 'enum',
                                                    params: {
                                                      allowedValues: schema45.items.enum,
                                                    },
                                                    message: 'must be equal to one of the allowed values',
                                                  },
                                                ];
                                                return false;
                                              }
                                              var valid3 = _errs19 === errors;
                                              if (!valid3) {
                                                break;
                                              }
                                            }
                                          }
                                        }
                                      } else {
                                        validate26.errors = [
                                          {
                                            instancePath: instancePath + '/offensive/attributes',
                                            schemaPath: '#/$defs/Attributes/type',
                                            keyword: 'type',
                                            params: { type: 'array' },
                                            message: 'must be array',
                                          },
                                        ];
                                        return false;
                                      }
                                    }
                                    var valid1 = _errs16 === errors;
                                  } else {
                                    var valid1 = true;
                                  }
                                  if (valid1) {
                                    if (data7.accuracy !== undefined) {
                                      let data10 = data7.accuracy;
                                      const _errs20 = errors;
                                      if (
                                        !(
                                          typeof data10 == 'number' &&
                                          !(data10 % 1) &&
                                          !isNaN(data10) &&
                                          isFinite(data10)
                                        )
                                      ) {
                                        validate26.errors = [
                                          {
                                            instancePath: instancePath + '/offensive/accuracy',
                                            schemaPath: '#/properties/offensive/properties/accuracy/type',
                                            keyword: 'type',
                                            params: { type: 'integer' },
                                            message: 'must be integer',
                                          },
                                        ];
                                        return false;
                                      }
                                      var valid1 = _errs20 === errors;
                                    } else {
                                      var valid1 = true;
                                    }
                                    if (valid1) {
                                      if (data7.damage !== undefined) {
                                        let data11 = data7.damage;
                                        const _errs22 = errors;
                                        if (errors === _errs22) {
                                          if (data11 && typeof data11 == 'object' && !Array.isArray(data11)) {
                                            let missing2;
                                            if (
                                              (data11.base === undefined && (missing2 = 'base')) ||
                                              (data11.type === undefined && (missing2 = 'type'))
                                            ) {
                                              validate26.errors = [
                                                {
                                                  instancePath: instancePath + '/offensive/damage',
                                                  schemaPath: '#/properties/offensive/properties/damage/required',
                                                  keyword: 'required',
                                                  params: {
                                                    missingProperty: missing2,
                                                  },
                                                  message: "must have required property '" + missing2 + "'",
                                                },
                                              ];
                                              return false;
                                            } else {
                                              const _errs24 = errors;
                                              for (const key2 in data11) {
                                                if (!(key2 === 'base' || key2 === 'type')) {
                                                  validate26.errors = [
                                                    {
                                                      instancePath: instancePath + '/offensive/damage',
                                                      schemaPath:
                                                        '#/properties/offensive/properties/damage/additionalProperties',
                                                      keyword: 'additionalProperties',
                                                      params: {
                                                        additionalProperty: key2,
                                                      },
                                                      message: 'must NOT have additional properties',
                                                    },
                                                  ];
                                                  return false;
                                                  break;
                                                }
                                              }
                                              if (_errs24 === errors) {
                                                if (data11.base !== undefined) {
                                                  let data12 = data11.base;
                                                  const _errs25 = errors;
                                                  if (
                                                    !(
                                                      typeof data12 == 'number' &&
                                                      !(data12 % 1) &&
                                                      !isNaN(data12) &&
                                                      isFinite(data12)
                                                    )
                                                  ) {
                                                    validate26.errors = [
                                                      {
                                                        instancePath: instancePath + '/offensive/damage/base',
                                                        schemaPath:
                                                          '#/properties/offensive/properties/damage/properties/base/type',
                                                        keyword: 'type',
                                                        params: {
                                                          type: 'integer',
                                                        },
                                                        message: 'must be integer',
                                                      },
                                                    ];
                                                    return false;
                                                  }
                                                  var valid4 = _errs25 === errors;
                                                } else {
                                                  var valid4 = true;
                                                }
                                                if (valid4) {
                                                  if (data11.type !== undefined) {
                                                    let data13 = data11.type;
                                                    const _errs27 = errors;
                                                    if (
                                                      !(
                                                        data13 === 'physical' ||
                                                        data13 === 'air' ||
                                                        data13 === 'bolt' ||
                                                        data13 === 'dark' ||
                                                        data13 === 'earth' ||
                                                        data13 === 'fire' ||
                                                        data13 === 'ice' ||
                                                        data13 === 'light' ||
                                                        data13 === 'poison'
                                                      )
                                                    ) {
                                                      validate26.errors = [
                                                        {
                                                          instancePath: instancePath + '/offensive/damage/type',
                                                          schemaPath: '#/$defs/DamageType/enum',
                                                          keyword: 'enum',
                                                          params: {
                                                            allowedValues: schema46.enum,
                                                          },
                                                          message: 'must be equal to one of the allowed values',
                                                        },
                                                      ];
                                                      return false;
                                                    }
                                                    var valid4 = _errs27 === errors;
                                                  } else {
                                                    var valid4 = true;
                                                  }
                                                }
                                              }
                                            }
                                          } else {
                                            validate26.errors = [
                                              {
                                                instancePath: instancePath + '/offensive/damage',
                                                schemaPath: '#/properties/offensive/properties/damage/type',
                                                keyword: 'type',
                                                params: { type: 'object' },
                                                message: 'must be object',
                                              },
                                            ];
                                            return false;
                                          }
                                        }
                                        var valid1 = _errs22 === errors;
                                      } else {
                                        var valid1 = true;
                                      }
                                    }
                                  }
                                }
                              }
                            } else {
                              validate26.errors = [
                                {
                                  instancePath: instancePath + '/offensive',
                                  schemaPath: '#/properties/offensive/type',
                                  keyword: 'type',
                                  params: { type: 'object' },
                                  message: 'must be object',
                                },
                              ];
                              return false;
                            }
                          }
                          var valid0 = _errs13 === errors;
                        } else {
                          var valid0 = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate26.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate26.errors = vErrors;
  return errors === 0;
}
validate26.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
function validate23(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate23.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      const _errs1 = errors;
      for (const key0 in data) {
        if (
          !(
            key0 === 'bonuses' ||
            key0 === 'affinities' ||
            key0 === 'statusImmunities' ||
            key0 === 'attacks' ||
            key0 === 'actions' ||
            key0 === 'spells' ||
            key0 === 'rules'
          )
        ) {
          validate23.errors = [
            {
              instancePath,
              schemaPath: '#/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key0 },
              message: 'must NOT have additional properties',
            },
          ];
          return false;
          break;
        }
      }
      if (_errs1 === errors) {
        if (data.bonuses !== undefined) {
          let data0 = data.bonuses;
          const _errs2 = errors;
          if (errors === _errs2) {
            if (data0 && typeof data0 == 'object' && !Array.isArray(data0)) {
              const _errs4 = errors;
              for (const key1 in data0) {
                if (
                  !(
                    key1 === 'hp' ||
                    key1 === 'mp' ||
                    key1 === 'def' ||
                    key1 === 'mDef' ||
                    key1 === 'init' ||
                    key1 === 'accuracy' ||
                    key1 === 'magic'
                  )
                ) {
                  validate23.errors = [
                    {
                      instancePath: instancePath + '/bonuses',
                      schemaPath: '#/properties/bonuses/additionalProperties',
                      keyword: 'additionalProperties',
                      params: { additionalProperty: key1 },
                      message: 'must NOT have additional properties',
                    },
                  ];
                  return false;
                  break;
                }
              }
              if (_errs4 === errors) {
                if (data0.hp !== undefined) {
                  let data1 = data0.hp;
                  const _errs5 = errors;
                  if (!(typeof data1 == 'number' && !(data1 % 1) && !isNaN(data1) && isFinite(data1))) {
                    validate23.errors = [
                      {
                        instancePath: instancePath + '/bonuses/hp',
                        schemaPath: '#/properties/bonuses/properties/hp/type',
                        keyword: 'type',
                        params: { type: 'integer' },
                        message: 'must be integer',
                      },
                    ];
                    return false;
                  }
                  var valid1 = _errs5 === errors;
                } else {
                  var valid1 = true;
                }
                if (valid1) {
                  if (data0.mp !== undefined) {
                    let data2 = data0.mp;
                    const _errs7 = errors;
                    if (!(typeof data2 == 'number' && !(data2 % 1) && !isNaN(data2) && isFinite(data2))) {
                      validate23.errors = [
                        {
                          instancePath: instancePath + '/bonuses/mp',
                          schemaPath: '#/properties/bonuses/properties/mp/type',
                          keyword: 'type',
                          params: { type: 'integer' },
                          message: 'must be integer',
                        },
                      ];
                      return false;
                    }
                    var valid1 = _errs7 === errors;
                  } else {
                    var valid1 = true;
                  }
                  if (valid1) {
                    if (data0.def !== undefined) {
                      let data3 = data0.def;
                      const _errs9 = errors;
                      if (!(typeof data3 == 'number' && !(data3 % 1) && !isNaN(data3) && isFinite(data3))) {
                        validate23.errors = [
                          {
                            instancePath: instancePath + '/bonuses/def',
                            schemaPath: '#/properties/bonuses/properties/def/type',
                            keyword: 'type',
                            params: { type: 'integer' },
                            message: 'must be integer',
                          },
                        ];
                        return false;
                      }
                      var valid1 = _errs9 === errors;
                    } else {
                      var valid1 = true;
                    }
                    if (valid1) {
                      if (data0.mDef !== undefined) {
                        let data4 = data0.mDef;
                        const _errs11 = errors;
                        if (!(typeof data4 == 'number' && !(data4 % 1) && !isNaN(data4) && isFinite(data4))) {
                          validate23.errors = [
                            {
                              instancePath: instancePath + '/bonuses/mDef',
                              schemaPath: '#/properties/bonuses/properties/mDef/type',
                              keyword: 'type',
                              params: { type: 'integer' },
                              message: 'must be integer',
                            },
                          ];
                          return false;
                        }
                        var valid1 = _errs11 === errors;
                      } else {
                        var valid1 = true;
                      }
                      if (valid1) {
                        if (data0.init !== undefined) {
                          let data5 = data0.init;
                          const _errs13 = errors;
                          if (!(typeof data5 == 'number' && !(data5 % 1) && !isNaN(data5) && isFinite(data5))) {
                            validate23.errors = [
                              {
                                instancePath: instancePath + '/bonuses/init',
                                schemaPath: '#/properties/bonuses/properties/init/type',
                                keyword: 'type',
                                params: { type: 'integer' },
                                message: 'must be integer',
                              },
                            ];
                            return false;
                          }
                          var valid1 = _errs13 === errors;
                        } else {
                          var valid1 = true;
                        }
                        if (valid1) {
                          if (data0.accuracy !== undefined) {
                            let data6 = data0.accuracy;
                            const _errs15 = errors;
                            if (!(typeof data6 == 'number' && !(data6 % 1) && !isNaN(data6) && isFinite(data6))) {
                              validate23.errors = [
                                {
                                  instancePath: instancePath + '/bonuses/accuracy',
                                  schemaPath: '#/properties/bonuses/properties/accuracy/type',
                                  keyword: 'type',
                                  params: { type: 'integer' },
                                  message: 'must be integer',
                                },
                              ];
                              return false;
                            }
                            var valid1 = _errs15 === errors;
                          } else {
                            var valid1 = true;
                          }
                          if (valid1) {
                            if (data0.magic !== undefined) {
                              let data7 = data0.magic;
                              const _errs17 = errors;
                              if (!(typeof data7 == 'number' && !(data7 % 1) && !isNaN(data7) && isFinite(data7))) {
                                validate23.errors = [
                                  {
                                    instancePath: instancePath + '/bonuses/magic',
                                    schemaPath: '#/properties/bonuses/properties/magic/type',
                                    keyword: 'type',
                                    params: { type: 'integer' },
                                    message: 'must be integer',
                                  },
                                ];
                                return false;
                              }
                              var valid1 = _errs17 === errors;
                            } else {
                              var valid1 = true;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              validate23.errors = [
                {
                  instancePath: instancePath + '/bonuses',
                  schemaPath: '#/properties/bonuses/type',
                  keyword: 'type',
                  params: { type: 'object' },
                  message: 'must be object',
                },
              ];
              return false;
            }
          }
          var valid0 = _errs2 === errors;
        } else {
          var valid0 = true;
        }
        if (valid0) {
          if (data.affinities !== undefined) {
            let data8 = data.affinities;
            const _errs19 = errors;
            if (errors === _errs19) {
              if (data8 && typeof data8 == 'object' && !Array.isArray(data8)) {
                const _errs21 = errors;
                for (const key2 in data8) {
                  if (!func1.call(schema34.properties.affinities.properties, key2)) {
                    validate23.errors = [
                      {
                        instancePath: instancePath + '/affinities',
                        schemaPath: '#/properties/affinities/additionalProperties',
                        keyword: 'additionalProperties',
                        params: { additionalProperty: key2 },
                        message: 'must NOT have additional properties',
                      },
                    ];
                    return false;
                    break;
                  }
                }
                if (_errs21 === errors) {
                  if (data8.physical !== undefined) {
                    let data9 = data8.physical;
                    const _errs22 = errors;
                    if (!(data9 === 'vul' || data9 === '' || data9 === 'res' || data9 === 'imm' || data9 === 'abs')) {
                      validate23.errors = [
                        {
                          instancePath: instancePath + '/affinities/physical',
                          schemaPath: '#/$defs/Affinity/enum',
                          keyword: 'enum',
                          params: { allowedValues: schema35.enum },
                          message: 'must be equal to one of the allowed values',
                        },
                      ];
                      return false;
                    }
                    var valid2 = _errs22 === errors;
                  } else {
                    var valid2 = true;
                  }
                  if (valid2) {
                    if (data8.air !== undefined) {
                      let data10 = data8.air;
                      const _errs24 = errors;
                      if (
                        !(data10 === 'vul' || data10 === '' || data10 === 'res' || data10 === 'imm' || data10 === 'abs')
                      ) {
                        validate23.errors = [
                          {
                            instancePath: instancePath + '/affinities/air',
                            schemaPath: '#/$defs/Affinity/enum',
                            keyword: 'enum',
                            params: { allowedValues: schema35.enum },
                            message: 'must be equal to one of the allowed values',
                          },
                        ];
                        return false;
                      }
                      var valid2 = _errs24 === errors;
                    } else {
                      var valid2 = true;
                    }
                    if (valid2) {
                      if (data8.bolt !== undefined) {
                        let data11 = data8.bolt;
                        const _errs26 = errors;
                        if (
                          !(
                            data11 === 'vul' ||
                            data11 === '' ||
                            data11 === 'res' ||
                            data11 === 'imm' ||
                            data11 === 'abs'
                          )
                        ) {
                          validate23.errors = [
                            {
                              instancePath: instancePath + '/affinities/bolt',
                              schemaPath: '#/$defs/Affinity/enum',
                              keyword: 'enum',
                              params: { allowedValues: schema35.enum },
                              message: 'must be equal to one of the allowed values',
                            },
                          ];
                          return false;
                        }
                        var valid2 = _errs26 === errors;
                      } else {
                        var valid2 = true;
                      }
                      if (valid2) {
                        if (data8.dark !== undefined) {
                          let data12 = data8.dark;
                          const _errs28 = errors;
                          if (
                            !(
                              data12 === 'vul' ||
                              data12 === '' ||
                              data12 === 'res' ||
                              data12 === 'imm' ||
                              data12 === 'abs'
                            )
                          ) {
                            validate23.errors = [
                              {
                                instancePath: instancePath + '/affinities/dark',
                                schemaPath: '#/$defs/Affinity/enum',
                                keyword: 'enum',
                                params: { allowedValues: schema35.enum },
                                message: 'must be equal to one of the allowed values',
                              },
                            ];
                            return false;
                          }
                          var valid2 = _errs28 === errors;
                        } else {
                          var valid2 = true;
                        }
                        if (valid2) {
                          if (data8.earth !== undefined) {
                            let data13 = data8.earth;
                            const _errs30 = errors;
                            if (
                              !(
                                data13 === 'vul' ||
                                data13 === '' ||
                                data13 === 'res' ||
                                data13 === 'imm' ||
                                data13 === 'abs'
                              )
                            ) {
                              validate23.errors = [
                                {
                                  instancePath: instancePath + '/affinities/earth',
                                  schemaPath: '#/$defs/Affinity/enum',
                                  keyword: 'enum',
                                  params: { allowedValues: schema35.enum },
                                  message: 'must be equal to one of the allowed values',
                                },
                              ];
                              return false;
                            }
                            var valid2 = _errs30 === errors;
                          } else {
                            var valid2 = true;
                          }
                          if (valid2) {
                            if (data8.fire !== undefined) {
                              let data14 = data8.fire;
                              const _errs32 = errors;
                              if (
                                !(
                                  data14 === 'vul' ||
                                  data14 === '' ||
                                  data14 === 'res' ||
                                  data14 === 'imm' ||
                                  data14 === 'abs'
                                )
                              ) {
                                validate23.errors = [
                                  {
                                    instancePath: instancePath + '/affinities/fire',
                                    schemaPath: '#/$defs/Affinity/enum',
                                    keyword: 'enum',
                                    params: { allowedValues: schema35.enum },
                                    message: 'must be equal to one of the allowed values',
                                  },
                                ];
                                return false;
                              }
                              var valid2 = _errs32 === errors;
                            } else {
                              var valid2 = true;
                            }
                            if (valid2) {
                              if (data8.ice !== undefined) {
                                let data15 = data8.ice;
                                const _errs34 = errors;
                                if (
                                  !(
                                    data15 === 'vul' ||
                                    data15 === '' ||
                                    data15 === 'res' ||
                                    data15 === 'imm' ||
                                    data15 === 'abs'
                                  )
                                ) {
                                  validate23.errors = [
                                    {
                                      instancePath: instancePath + '/affinities/ice',
                                      schemaPath: '#/$defs/Affinity/enum',
                                      keyword: 'enum',
                                      params: { allowedValues: schema35.enum },
                                      message: 'must be equal to one of the allowed values',
                                    },
                                  ];
                                  return false;
                                }
                                var valid2 = _errs34 === errors;
                              } else {
                                var valid2 = true;
                              }
                              if (valid2) {
                                if (data8.light !== undefined) {
                                  let data16 = data8.light;
                                  const _errs36 = errors;
                                  if (
                                    !(
                                      data16 === 'vul' ||
                                      data16 === '' ||
                                      data16 === 'res' ||
                                      data16 === 'imm' ||
                                      data16 === 'abs'
                                    )
                                  ) {
                                    validate23.errors = [
                                      {
                                        instancePath: instancePath + '/affinities/light',
                                        schemaPath: '#/$defs/Affinity/enum',
                                        keyword: 'enum',
                                        params: {
                                          allowedValues: schema35.enum,
                                        },
                                        message: 'must be equal to one of the allowed values',
                                      },
                                    ];
                                    return false;
                                  }
                                  var valid2 = _errs36 === errors;
                                } else {
                                  var valid2 = true;
                                }
                                if (valid2) {
                                  if (data8.poison !== undefined) {
                                    let data17 = data8.poison;
                                    const _errs38 = errors;
                                    if (
                                      !(
                                        data17 === 'vul' ||
                                        data17 === '' ||
                                        data17 === 'res' ||
                                        data17 === 'imm' ||
                                        data17 === 'abs'
                                      )
                                    ) {
                                      validate23.errors = [
                                        {
                                          instancePath: instancePath + '/affinities/poison',
                                          schemaPath: '#/$defs/Affinity/enum',
                                          keyword: 'enum',
                                          params: {
                                            allowedValues: schema35.enum,
                                          },
                                          message: 'must be equal to one of the allowed values',
                                        },
                                      ];
                                      return false;
                                    }
                                    var valid2 = _errs38 === errors;
                                  } else {
                                    var valid2 = true;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                validate23.errors = [
                  {
                    instancePath: instancePath + '/affinities',
                    schemaPath: '#/properties/affinities/type',
                    keyword: 'type',
                    params: { type: 'object' },
                    message: 'must be object',
                  },
                ];
                return false;
              }
            }
            var valid0 = _errs19 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.statusImmunities !== undefined) {
              let data18 = data.statusImmunities;
              const _errs40 = errors;
              if (errors === _errs40) {
                if (data18 && typeof data18 == 'object' && !Array.isArray(data18)) {
                  const _errs42 = errors;
                  for (const key3 in data18) {
                    if (
                      !(
                        key3 === 'dazed' ||
                        key3 === 'shaken' ||
                        key3 === 'slow' ||
                        key3 === 'weak' ||
                        key3 === 'enraged' ||
                        key3 === 'poisoned'
                      )
                    ) {
                      validate23.errors = [
                        {
                          instancePath: instancePath + '/statusImmunities',
                          schemaPath: '#/properties/statusImmunities/additionalProperties',
                          keyword: 'additionalProperties',
                          params: { additionalProperty: key3 },
                          message: 'must NOT have additional properties',
                        },
                      ];
                      return false;
                      break;
                    }
                  }
                  if (_errs42 === errors) {
                    if (data18.dazed !== undefined) {
                      const _errs43 = errors;
                      if (true !== data18.dazed) {
                        validate23.errors = [
                          {
                            instancePath: instancePath + '/statusImmunities/dazed',
                            schemaPath: '#/properties/statusImmunities/properties/dazed/const',
                            keyword: 'const',
                            params: { allowedValue: true },
                            message: 'must be equal to constant',
                          },
                        ];
                        return false;
                      }
                      var valid12 = _errs43 === errors;
                    } else {
                      var valid12 = true;
                    }
                    if (valid12) {
                      if (data18.shaken !== undefined) {
                        const _errs44 = errors;
                        if (true !== data18.shaken) {
                          validate23.errors = [
                            {
                              instancePath: instancePath + '/statusImmunities/shaken',
                              schemaPath: '#/properties/statusImmunities/properties/shaken/const',
                              keyword: 'const',
                              params: { allowedValue: true },
                              message: 'must be equal to constant',
                            },
                          ];
                          return false;
                        }
                        var valid12 = _errs44 === errors;
                      } else {
                        var valid12 = true;
                      }
                      if (valid12) {
                        if (data18.slow !== undefined) {
                          const _errs45 = errors;
                          if (true !== data18.slow) {
                            validate23.errors = [
                              {
                                instancePath: instancePath + '/statusImmunities/slow',
                                schemaPath: '#/properties/statusImmunities/properties/slow/const',
                                keyword: 'const',
                                params: { allowedValue: true },
                                message: 'must be equal to constant',
                              },
                            ];
                            return false;
                          }
                          var valid12 = _errs45 === errors;
                        } else {
                          var valid12 = true;
                        }
                        if (valid12) {
                          if (data18.weak !== undefined) {
                            const _errs46 = errors;
                            if (true !== data18.weak) {
                              validate23.errors = [
                                {
                                  instancePath: instancePath + '/statusImmunities/weak',
                                  schemaPath: '#/properties/statusImmunities/properties/weak/const',
                                  keyword: 'const',
                                  params: { allowedValue: true },
                                  message: 'must be equal to constant',
                                },
                              ];
                              return false;
                            }
                            var valid12 = _errs46 === errors;
                          } else {
                            var valid12 = true;
                          }
                          if (valid12) {
                            if (data18.enraged !== undefined) {
                              const _errs47 = errors;
                              if (true !== data18.enraged) {
                                validate23.errors = [
                                  {
                                    instancePath: instancePath + '/statusImmunities/enraged',
                                    schemaPath: '#/properties/statusImmunities/properties/enraged/const',
                                    keyword: 'const',
                                    params: { allowedValue: true },
                                    message: 'must be equal to constant',
                                  },
                                ];
                                return false;
                              }
                              var valid12 = _errs47 === errors;
                            } else {
                              var valid12 = true;
                            }
                            if (valid12) {
                              if (data18.poisoned !== undefined) {
                                const _errs48 = errors;
                                if (true !== data18.poisoned) {
                                  validate23.errors = [
                                    {
                                      instancePath: instancePath + '/statusImmunities/poisoned',
                                      schemaPath: '#/properties/statusImmunities/properties/poisoned/const',
                                      keyword: 'const',
                                      params: { allowedValue: true },
                                      message: 'must be equal to constant',
                                    },
                                  ];
                                  return false;
                                }
                                var valid12 = _errs48 === errors;
                              } else {
                                var valid12 = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  validate23.errors = [
                    {
                      instancePath: instancePath + '/statusImmunities',
                      schemaPath: '#/properties/statusImmunities/type',
                      keyword: 'type',
                      params: { type: 'object' },
                      message: 'must be object',
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs40 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.attacks !== undefined) {
                let data25 = data.attacks;
                const _errs49 = errors;
                if (errors === _errs49) {
                  if (data25 && typeof data25 == 'object' && !Array.isArray(data25)) {
                    const _errs51 = errors;
                    for (const key4 in data25) {
                      if (!pattern4.test(key4)) {
                        validate23.errors = [
                          {
                            instancePath: instancePath + '/attacks',
                            schemaPath: '#/properties/attacks/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key4 },
                            message: 'must NOT have additional properties',
                          },
                        ];
                        return false;
                        break;
                      }
                    }
                    if (_errs51 === errors) {
                      var valid13 = true;
                      for (const key5 in data25) {
                        if (pattern4.test(key5)) {
                          const _errs52 = errors;
                          if (
                            !validate24(data25[key5], {
                              instancePath: instancePath + '/attacks/' + key5.replace(/~/g, '~0').replace(/\//g, '~1'),
                              parentData: data25,
                              parentDataProperty: key5,
                              rootData,
                              dynamicAnchors,
                            })
                          ) {
                            vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
                            errors = vErrors.length;
                          }
                          var valid13 = _errs52 === errors;
                          if (!valid13) {
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    validate23.errors = [
                      {
                        instancePath: instancePath + '/attacks',
                        schemaPath: '#/properties/attacks/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      },
                    ];
                    return false;
                  }
                }
                var valid0 = _errs49 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.actions !== undefined) {
                  let data27 = data.actions;
                  const _errs53 = errors;
                  if (errors === _errs53) {
                    if (data27 && typeof data27 == 'object' && !Array.isArray(data27)) {
                      const _errs55 = errors;
                      for (const key6 in data27) {
                        if (!pattern4.test(key6)) {
                          validate23.errors = [
                            {
                              instancePath: instancePath + '/actions',
                              schemaPath: '#/properties/actions/additionalProperties',
                              keyword: 'additionalProperties',
                              params: { additionalProperty: key6 },
                              message: 'must NOT have additional properties',
                            },
                          ];
                          return false;
                          break;
                        }
                      }
                      if (_errs55 === errors) {
                        var valid14 = true;
                        for (const key7 in data27) {
                          if (pattern4.test(key7)) {
                            let data28 = data27[key7];
                            const _errs56 = errors;
                            const _errs57 = errors;
                            if (errors === _errs57) {
                              if (data28 && typeof data28 == 'object' && !Array.isArray(data28)) {
                                let missing0;
                                if (
                                  (data28.name === undefined && (missing0 = 'name')) ||
                                  (data28.summary === undefined && (missing0 = 'summary')) ||
                                  (data28.description === undefined && (missing0 = 'description'))
                                ) {
                                  validate23.errors = [
                                    {
                                      instancePath:
                                        instancePath + '/actions/' + key7.replace(/~/g, '~0').replace(/\//g, '~1'),
                                      schemaPath: '#/$defs/Action/required',
                                      keyword: 'required',
                                      params: { missingProperty: missing0 },
                                      message: "must have required property '" + missing0 + "'",
                                    },
                                  ];
                                  return false;
                                } else {
                                  const _errs59 = errors;
                                  for (const key8 in data28) {
                                    if (!(key8 === 'name' || key8 === 'summary' || key8 === 'description')) {
                                      validate23.errors = [
                                        {
                                          instancePath:
                                            instancePath + '/actions/' + key7.replace(/~/g, '~0').replace(/\//g, '~1'),
                                          schemaPath: '#/$defs/Action/additionalProperties',
                                          keyword: 'additionalProperties',
                                          params: { additionalProperty: key8 },
                                          message: 'must NOT have additional properties',
                                        },
                                      ];
                                      return false;
                                      break;
                                    }
                                  }
                                  if (_errs59 === errors) {
                                    if (data28.name !== undefined) {
                                      const _errs60 = errors;
                                      if (typeof data28.name !== 'string') {
                                        validate23.errors = [
                                          {
                                            instancePath:
                                              instancePath +
                                              '/actions/' +
                                              key7.replace(/~/g, '~0').replace(/\//g, '~1') +
                                              '/name',
                                            schemaPath: '#/$defs/Action/properties/name/type',
                                            keyword: 'type',
                                            params: { type: 'string' },
                                            message: 'must be string',
                                          },
                                        ];
                                        return false;
                                      }
                                      var valid16 = _errs60 === errors;
                                    } else {
                                      var valid16 = true;
                                    }
                                    if (valid16) {
                                      if (data28.summary !== undefined) {
                                        const _errs62 = errors;
                                        if (typeof data28.summary !== 'string') {
                                          validate23.errors = [
                                            {
                                              instancePath:
                                                instancePath +
                                                '/actions/' +
                                                key7.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                '/summary',
                                              schemaPath: '#/$defs/Action/properties/summary/type',
                                              keyword: 'type',
                                              params: { type: 'string' },
                                              message: 'must be string',
                                            },
                                          ];
                                          return false;
                                        }
                                        var valid16 = _errs62 === errors;
                                      } else {
                                        var valid16 = true;
                                      }
                                      if (valid16) {
                                        if (data28.description !== undefined) {
                                          const _errs64 = errors;
                                          if (typeof data28.description !== 'string') {
                                            validate23.errors = [
                                              {
                                                instancePath:
                                                  instancePath +
                                                  '/actions/' +
                                                  key7.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                  '/description',
                                                schemaPath: '#/$defs/Action/properties/description/type',
                                                keyword: 'type',
                                                params: { type: 'string' },
                                                message: 'must be string',
                                              },
                                            ];
                                            return false;
                                          }
                                          var valid16 = _errs64 === errors;
                                        } else {
                                          var valid16 = true;
                                        }
                                      }
                                    }
                                  }
                                }
                              } else {
                                validate23.errors = [
                                  {
                                    instancePath:
                                      instancePath + '/actions/' + key7.replace(/~/g, '~0').replace(/\//g, '~1'),
                                    schemaPath: '#/$defs/Action/type',
                                    keyword: 'type',
                                    params: { type: 'object' },
                                    message: 'must be object',
                                  },
                                ];
                                return false;
                              }
                            }
                            var valid14 = _errs56 === errors;
                            if (!valid14) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      validate23.errors = [
                        {
                          instancePath: instancePath + '/actions',
                          schemaPath: '#/properties/actions/type',
                          keyword: 'type',
                          params: { type: 'object' },
                          message: 'must be object',
                        },
                      ];
                      return false;
                    }
                  }
                  var valid0 = _errs53 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.spells !== undefined) {
                    let data32 = data.spells;
                    const _errs66 = errors;
                    if (errors === _errs66) {
                      if (data32 && typeof data32 == 'object' && !Array.isArray(data32)) {
                        const _errs68 = errors;
                        for (const key9 in data32) {
                          if (!pattern4.test(key9)) {
                            validate23.errors = [
                              {
                                instancePath: instancePath + '/spells',
                                schemaPath: '#/properties/spells/additionalProperties',
                                keyword: 'additionalProperties',
                                params: { additionalProperty: key9 },
                                message: 'must NOT have additional properties',
                              },
                            ];
                            return false;
                            break;
                          }
                        }
                        if (_errs68 === errors) {
                          var valid17 = true;
                          for (const key10 in data32) {
                            if (pattern4.test(key10)) {
                              const _errs69 = errors;
                              if (
                                !validate26(data32[key10], {
                                  instancePath:
                                    instancePath + '/spells/' + key10.replace(/~/g, '~0').replace(/\//g, '~1'),
                                  parentData: data32,
                                  parentDataProperty: key10,
                                  rootData,
                                  dynamicAnchors,
                                })
                              ) {
                                vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
                                errors = vErrors.length;
                              }
                              var valid17 = _errs69 === errors;
                              if (!valid17) {
                                break;
                              }
                            }
                          }
                        }
                      } else {
                        validate23.errors = [
                          {
                            instancePath: instancePath + '/spells',
                            schemaPath: '#/properties/spells/type',
                            keyword: 'type',
                            params: { type: 'object' },
                            message: 'must be object',
                          },
                        ];
                        return false;
                      }
                    }
                    var valid0 = _errs66 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.rules !== undefined) {
                      let data34 = data.rules;
                      const _errs70 = errors;
                      if (errors === _errs70) {
                        if (data34 && typeof data34 == 'object' && !Array.isArray(data34)) {
                          const _errs72 = errors;
                          for (const key11 in data34) {
                            if (!pattern4.test(key11)) {
                              validate23.errors = [
                                {
                                  instancePath: instancePath + '/rules',
                                  schemaPath: '#/properties/rules/additionalProperties',
                                  keyword: 'additionalProperties',
                                  params: { additionalProperty: key11 },
                                  message: 'must NOT have additional properties',
                                },
                              ];
                              return false;
                              break;
                            }
                          }
                          if (_errs72 === errors) {
                            var valid18 = true;
                            for (const key12 in data34) {
                              if (pattern4.test(key12)) {
                                let data35 = data34[key12];
                                const _errs73 = errors;
                                const _errs74 = errors;
                                if (errors === _errs74) {
                                  if (data35 && typeof data35 == 'object' && !Array.isArray(data35)) {
                                    let missing1;
                                    if (
                                      (data35.name === undefined && (missing1 = 'name')) ||
                                      (data35.description === undefined && (missing1 = 'description'))
                                    ) {
                                      validate23.errors = [
                                        {
                                          instancePath:
                                            instancePath + '/rules/' + key12.replace(/~/g, '~0').replace(/\//g, '~1'),
                                          schemaPath: '#/$defs/Rule/required',
                                          keyword: 'required',
                                          params: { missingProperty: missing1 },
                                          message: "must have required property '" + missing1 + "'",
                                        },
                                      ];
                                      return false;
                                    } else {
                                      const _errs76 = errors;
                                      for (const key13 in data35) {
                                        if (!(key13 === 'name' || key13 === 'description' || key13 === 'summary')) {
                                          validate23.errors = [
                                            {
                                              instancePath:
                                                instancePath +
                                                '/rules/' +
                                                key12.replace(/~/g, '~0').replace(/\//g, '~1'),
                                              schemaPath: '#/$defs/Rule/additionalProperties',
                                              keyword: 'additionalProperties',
                                              params: {
                                                additionalProperty: key13,
                                              },
                                              message: 'must NOT have additional properties',
                                            },
                                          ];
                                          return false;
                                          break;
                                        }
                                      }
                                      if (_errs76 === errors) {
                                        if (data35.name !== undefined) {
                                          const _errs77 = errors;
                                          if (typeof data35.name !== 'string') {
                                            validate23.errors = [
                                              {
                                                instancePath:
                                                  instancePath +
                                                  '/rules/' +
                                                  key12.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                  '/name',
                                                schemaPath: '#/$defs/Rule/properties/name/type',
                                                keyword: 'type',
                                                params: { type: 'string' },
                                                message: 'must be string',
                                              },
                                            ];
                                            return false;
                                          }
                                          var valid20 = _errs77 === errors;
                                        } else {
                                          var valid20 = true;
                                        }
                                        if (valid20) {
                                          if (data35.description !== undefined) {
                                            const _errs79 = errors;
                                            if (typeof data35.description !== 'string') {
                                              validate23.errors = [
                                                {
                                                  instancePath:
                                                    instancePath +
                                                    '/rules/' +
                                                    key12.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                    '/description',
                                                  schemaPath: '#/$defs/Rule/properties/description/type',
                                                  keyword: 'type',
                                                  params: { type: 'string' },
                                                  message: 'must be string',
                                                },
                                              ];
                                              return false;
                                            }
                                            var valid20 = _errs79 === errors;
                                          } else {
                                            var valid20 = true;
                                          }
                                          if (valid20) {
                                            if (data35.summary !== undefined) {
                                              const _errs81 = errors;
                                              if (typeof data35.summary !== 'string') {
                                                validate23.errors = [
                                                  {
                                                    instancePath:
                                                      instancePath +
                                                      '/rules/' +
                                                      key12.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                      '/summary',
                                                    schemaPath: '#/$defs/Rule/properties/summary/type',
                                                    keyword: 'type',
                                                    params: { type: 'string' },
                                                    message: 'must be string',
                                                  },
                                                ];
                                                return false;
                                              }
                                              var valid20 = _errs81 === errors;
                                            } else {
                                              var valid20 = true;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    validate23.errors = [
                                      {
                                        instancePath:
                                          instancePath + '/rules/' + key12.replace(/~/g, '~0').replace(/\//g, '~1'),
                                        schemaPath: '#/$defs/Rule/type',
                                        keyword: 'type',
                                        params: { type: 'object' },
                                        message: 'must be object',
                                      },
                                    ];
                                    return false;
                                  }
                                }
                                var valid18 = _errs73 === errors;
                                if (!valid18) {
                                  break;
                                }
                              }
                            }
                          }
                        } else {
                          validate23.errors = [
                            {
                              instancePath: instancePath + '/rules',
                              schemaPath: '#/properties/rules/type',
                              keyword: 'type',
                              params: { type: 'object' },
                              message: 'must be object',
                            },
                          ];
                          return false;
                        }
                      }
                      var valid0 = _errs70 === errors;
                    } else {
                      var valid0 = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate23.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate23.errors = vErrors;
  return errors === 0;
}
validate23.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema52 = {
  anyOf: [
    { $ref: '#/$defs/AssignSpeciesVulnerability' },
    { $ref: '#/$defs/AssignImmunity' },
    { $ref: '#/$defs/AssignResistance' },
    { $ref: '#/$defs/AssignVulnerability' },
    { $ref: '#/$defs/UpgradeResToAbs' },
    { $ref: '#/$defs/UpgradeImmToAbs' },
    { $ref: '#/$defs/AssignStatusImmunity' },
    { $ref: '#/$defs/ConditionalBonusSkill' },
    { $ref: '#/$defs/ChooseCustomization' },
    { $ref: '#/$defs/ConfigureAttack' },
    { $ref: '#/$defs/ChooseSpell' },
    { $ref: '#/$defs/ChooseRoleSkill' },
  ],
};
const schema61 = {
  type: 'object',
  additionalProperties: false,
  properties: { type: { const: 'UpgradeResToAbs' } },
  required: ['type'],
};
const schema62 = {
  type: 'object',
  additionalProperties: false,
  properties: { type: { const: 'UpgradeImmToAbs' } },
  required: ['type'],
};
const schema63 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'AssignStatusImmunity' },
    options: {
      type: 'array',
      items: {
        enum: ['dazed', 'shaken', 'slow', 'weak', 'enraged', 'poisoned'],
      },
    },
  },
  required: ['type'],
};
const schema76 = {
  type: 'object',
  additionalProperties: false,
  properties: { type: { const: 'ChooseRoleSkill' } },
  required: ['type'],
};
const schema53 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'AssignSpeciesVulnerability' },
    options: { type: 'array', items: { $ref: '#/$defs/DamageType' } },
  },
  required: ['type'],
};
function validate30(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate30.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (data.type === undefined && (missing0 = 'type')) {
        validate30.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'options')) {
            validate30.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('AssignSpeciesVulnerability' !== data.type) {
              validate30.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'AssignSpeciesVulnerability' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.options !== undefined) {
              let data1 = data.options;
              const _errs3 = errors;
              if (errors === _errs3) {
                if (Array.isArray(data1)) {
                  var valid1 = true;
                  const len0 = data1.length;
                  for (let i0 = 0; i0 < len0; i0++) {
                    let data2 = data1[i0];
                    const _errs5 = errors;
                    if (
                      !(
                        data2 === 'physical' ||
                        data2 === 'air' ||
                        data2 === 'bolt' ||
                        data2 === 'dark' ||
                        data2 === 'earth' ||
                        data2 === 'fire' ||
                        data2 === 'ice' ||
                        data2 === 'light' ||
                        data2 === 'poison'
                      )
                    ) {
                      validate30.errors = [
                        {
                          instancePath: instancePath + '/options/' + i0,
                          schemaPath: '#/$defs/DamageType/enum',
                          keyword: 'enum',
                          params: { allowedValues: schema46.enum },
                          message: 'must be equal to one of the allowed values',
                        },
                      ];
                      return false;
                    }
                    var valid1 = _errs5 === errors;
                    if (!valid1) {
                      break;
                    }
                  }
                } else {
                  validate30.errors = [
                    {
                      instancePath: instancePath + '/options',
                      schemaPath: '#/properties/options/type',
                      keyword: 'type',
                      params: { type: 'array' },
                      message: 'must be array',
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate30.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate30.errors = vErrors;
  return errors === 0;
}
validate30.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema55 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'AssignImmunity' },
    options: { type: 'array', items: { $ref: '#/$defs/DamageType' } },
  },
  required: ['type'],
};
function validate32(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate32.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (data.type === undefined && (missing0 = 'type')) {
        validate32.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'options')) {
            validate32.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('AssignImmunity' !== data.type) {
              validate32.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'AssignImmunity' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.options !== undefined) {
              let data1 = data.options;
              const _errs3 = errors;
              if (errors === _errs3) {
                if (Array.isArray(data1)) {
                  var valid1 = true;
                  const len0 = data1.length;
                  for (let i0 = 0; i0 < len0; i0++) {
                    let data2 = data1[i0];
                    const _errs5 = errors;
                    if (
                      !(
                        data2 === 'physical' ||
                        data2 === 'air' ||
                        data2 === 'bolt' ||
                        data2 === 'dark' ||
                        data2 === 'earth' ||
                        data2 === 'fire' ||
                        data2 === 'ice' ||
                        data2 === 'light' ||
                        data2 === 'poison'
                      )
                    ) {
                      validate32.errors = [
                        {
                          instancePath: instancePath + '/options/' + i0,
                          schemaPath: '#/$defs/DamageType/enum',
                          keyword: 'enum',
                          params: { allowedValues: schema46.enum },
                          message: 'must be equal to one of the allowed values',
                        },
                      ];
                      return false;
                    }
                    var valid1 = _errs5 === errors;
                    if (!valid1) {
                      break;
                    }
                  }
                } else {
                  validate32.errors = [
                    {
                      instancePath: instancePath + '/options',
                      schemaPath: '#/properties/options/type',
                      keyword: 'type',
                      params: { type: 'array' },
                      message: 'must be array',
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate32.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate32.errors = vErrors;
  return errors === 0;
}
validate32.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema57 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'AssignResistance' },
    options: { type: 'array', items: { $ref: '#/$defs/DamageType' } },
  },
  required: ['type'],
};
function validate34(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate34.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (data.type === undefined && (missing0 = 'type')) {
        validate34.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'options')) {
            validate34.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('AssignResistance' !== data.type) {
              validate34.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'AssignResistance' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.options !== undefined) {
              let data1 = data.options;
              const _errs3 = errors;
              if (errors === _errs3) {
                if (Array.isArray(data1)) {
                  var valid1 = true;
                  const len0 = data1.length;
                  for (let i0 = 0; i0 < len0; i0++) {
                    let data2 = data1[i0];
                    const _errs5 = errors;
                    if (
                      !(
                        data2 === 'physical' ||
                        data2 === 'air' ||
                        data2 === 'bolt' ||
                        data2 === 'dark' ||
                        data2 === 'earth' ||
                        data2 === 'fire' ||
                        data2 === 'ice' ||
                        data2 === 'light' ||
                        data2 === 'poison'
                      )
                    ) {
                      validate34.errors = [
                        {
                          instancePath: instancePath + '/options/' + i0,
                          schemaPath: '#/$defs/DamageType/enum',
                          keyword: 'enum',
                          params: { allowedValues: schema46.enum },
                          message: 'must be equal to one of the allowed values',
                        },
                      ];
                      return false;
                    }
                    var valid1 = _errs5 === errors;
                    if (!valid1) {
                      break;
                    }
                  }
                } else {
                  validate34.errors = [
                    {
                      instancePath: instancePath + '/options',
                      schemaPath: '#/properties/options/type',
                      keyword: 'type',
                      params: { type: 'array' },
                      message: 'must be array',
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate34.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate34.errors = vErrors;
  return errors === 0;
}
validate34.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema59 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'AssignVulnerability' },
    options: { type: 'array', items: { $ref: '#/$defs/DamageType' } },
  },
  required: ['type'],
};
function validate36(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate36.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (data.type === undefined && (missing0 = 'type')) {
        validate36.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'options')) {
            validate36.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('AssignVulnerability' !== data.type) {
              validate36.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'AssignVulnerability' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.options !== undefined) {
              let data1 = data.options;
              const _errs3 = errors;
              if (errors === _errs3) {
                if (Array.isArray(data1)) {
                  var valid1 = true;
                  const len0 = data1.length;
                  for (let i0 = 0; i0 < len0; i0++) {
                    let data2 = data1[i0];
                    const _errs5 = errors;
                    if (
                      !(
                        data2 === 'physical' ||
                        data2 === 'air' ||
                        data2 === 'bolt' ||
                        data2 === 'dark' ||
                        data2 === 'earth' ||
                        data2 === 'fire' ||
                        data2 === 'ice' ||
                        data2 === 'light' ||
                        data2 === 'poison'
                      )
                    ) {
                      validate36.errors = [
                        {
                          instancePath: instancePath + '/options/' + i0,
                          schemaPath: '#/$defs/DamageType/enum',
                          keyword: 'enum',
                          params: { allowedValues: schema46.enum },
                          message: 'must be equal to one of the allowed values',
                        },
                      ];
                      return false;
                    }
                    var valid1 = _errs5 === errors;
                    if (!valid1) {
                      break;
                    }
                  }
                } else {
                  validate36.errors = [
                    {
                      instancePath: instancePath + '/options',
                      schemaPath: '#/properties/options/type',
                      keyword: 'type',
                      params: { type: 'array' },
                      message: 'must be array',
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate36.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate36.errors = vErrors;
  return errors === 0;
}
validate36.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema64 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'ConditionalBonusSkill' },
    drawback: { $ref: '#/$defs/Skill' },
    options: {
      type: 'object',
      additionalProperties: false,
      patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
      minProperties: 1,
    },
  },
  required: ['type', 'drawback', 'options'],
};
const schema65 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    label: { type: 'string' },
    description: { type: 'string' },
    changes: { $ref: '#/$defs/Changes' },
    choices: {
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '.+': {
          type: 'object',
          additionalProperties: false,
          properties: {
            label: { type: 'string' },
            options: {
              type: 'object',
              additionalProperties: false,
              patternProperties: { '.+': { type: 'string' } },
            },
            conditional: {
              type: 'object',
              additionalProperties: false,
              patternProperties: { '.+': { type: 'string' } },
            },
            group: { type: 'string' },
          },
        },
      },
    },
    require: { $ref: '#/$defs/Requirements' },
    disallow: { $ref: '#/$defs/Requirements' },
  },
  required: ['label', 'description', 'changes'],
};
const wrapper0 = { validate: validate22 };
const schema66 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    anyResistance: { type: 'boolean' },
    anyImmunity: { type: 'boolean' },
    rank: { type: 'array', items: { $ref: '#/$defs/Rank' }, minItems: 1 },
    attack: { type: 'string' },
    anyRule: { type: 'array', items: { type: 'string' }, minItems: 1 },
    anyAction: { type: 'array', items: { type: 'string' }, minItems: 1 },
    anyCustomization: { type: 'array', items: { type: 'string' }, minItems: 1 },
    level: { enum: [10, 20, 30, 40, 50] },
  },
};
const schema67 = {
  enum: ['soldier', 'elite', 'champion1', 'champion2', 'champion3', 'champion4', 'champion5', 'champion6'],
};
function validate40(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate40.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      const _errs1 = errors;
      for (const key0 in data) {
        if (
          !(
            key0 === 'anyResistance' ||
            key0 === 'anyImmunity' ||
            key0 === 'rank' ||
            key0 === 'attack' ||
            key0 === 'anyRule' ||
            key0 === 'anyAction' ||
            key0 === 'anyCustomization' ||
            key0 === 'level'
          )
        ) {
          validate40.errors = [
            {
              instancePath,
              schemaPath: '#/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key0 },
              message: 'must NOT have additional properties',
            },
          ];
          return false;
          break;
        }
      }
      if (_errs1 === errors) {
        if (data.anyResistance !== undefined) {
          const _errs2 = errors;
          if (typeof data.anyResistance !== 'boolean') {
            validate40.errors = [
              {
                instancePath: instancePath + '/anyResistance',
                schemaPath: '#/properties/anyResistance/type',
                keyword: 'type',
                params: { type: 'boolean' },
                message: 'must be boolean',
              },
            ];
            return false;
          }
          var valid0 = _errs2 === errors;
        } else {
          var valid0 = true;
        }
        if (valid0) {
          if (data.anyImmunity !== undefined) {
            const _errs4 = errors;
            if (typeof data.anyImmunity !== 'boolean') {
              validate40.errors = [
                {
                  instancePath: instancePath + '/anyImmunity',
                  schemaPath: '#/properties/anyImmunity/type',
                  keyword: 'type',
                  params: { type: 'boolean' },
                  message: 'must be boolean',
                },
              ];
              return false;
            }
            var valid0 = _errs4 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.rank !== undefined) {
              let data2 = data.rank;
              const _errs6 = errors;
              if (errors === _errs6) {
                if (Array.isArray(data2)) {
                  if (data2.length < 1) {
                    validate40.errors = [
                      {
                        instancePath: instancePath + '/rank',
                        schemaPath: '#/properties/rank/minItems',
                        keyword: 'minItems',
                        params: { limit: 1 },
                        message: 'must NOT have fewer than 1 items',
                      },
                    ];
                    return false;
                  } else {
                    var valid1 = true;
                    const len0 = data2.length;
                    for (let i0 = 0; i0 < len0; i0++) {
                      let data3 = data2[i0];
                      const _errs8 = errors;
                      if (
                        !(
                          data3 === 'soldier' ||
                          data3 === 'elite' ||
                          data3 === 'champion1' ||
                          data3 === 'champion2' ||
                          data3 === 'champion3' ||
                          data3 === 'champion4' ||
                          data3 === 'champion5' ||
                          data3 === 'champion6'
                        )
                      ) {
                        validate40.errors = [
                          {
                            instancePath: instancePath + '/rank/' + i0,
                            schemaPath: '#/$defs/Rank/enum',
                            keyword: 'enum',
                            params: { allowedValues: schema67.enum },
                            message: 'must be equal to one of the allowed values',
                          },
                        ];
                        return false;
                      }
                      var valid1 = _errs8 === errors;
                      if (!valid1) {
                        break;
                      }
                    }
                  }
                } else {
                  validate40.errors = [
                    {
                      instancePath: instancePath + '/rank',
                      schemaPath: '#/properties/rank/type',
                      keyword: 'type',
                      params: { type: 'array' },
                      message: 'must be array',
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs6 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.attack !== undefined) {
                const _errs10 = errors;
                if (typeof data.attack !== 'string') {
                  validate40.errors = [
                    {
                      instancePath: instancePath + '/attack',
                      schemaPath: '#/properties/attack/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    },
                  ];
                  return false;
                }
                var valid0 = _errs10 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.anyRule !== undefined) {
                  let data5 = data.anyRule;
                  const _errs12 = errors;
                  if (errors === _errs12) {
                    if (Array.isArray(data5)) {
                      if (data5.length < 1) {
                        validate40.errors = [
                          {
                            instancePath: instancePath + '/anyRule',
                            schemaPath: '#/properties/anyRule/minItems',
                            keyword: 'minItems',
                            params: { limit: 1 },
                            message: 'must NOT have fewer than 1 items',
                          },
                        ];
                        return false;
                      } else {
                        var valid3 = true;
                        const len1 = data5.length;
                        for (let i1 = 0; i1 < len1; i1++) {
                          const _errs14 = errors;
                          if (typeof data5[i1] !== 'string') {
                            validate40.errors = [
                              {
                                instancePath: instancePath + '/anyRule/' + i1,
                                schemaPath: '#/properties/anyRule/items/type',
                                keyword: 'type',
                                params: { type: 'string' },
                                message: 'must be string',
                              },
                            ];
                            return false;
                          }
                          var valid3 = _errs14 === errors;
                          if (!valid3) {
                            break;
                          }
                        }
                      }
                    } else {
                      validate40.errors = [
                        {
                          instancePath: instancePath + '/anyRule',
                          schemaPath: '#/properties/anyRule/type',
                          keyword: 'type',
                          params: { type: 'array' },
                          message: 'must be array',
                        },
                      ];
                      return false;
                    }
                  }
                  var valid0 = _errs12 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.anyAction !== undefined) {
                    let data7 = data.anyAction;
                    const _errs16 = errors;
                    if (errors === _errs16) {
                      if (Array.isArray(data7)) {
                        if (data7.length < 1) {
                          validate40.errors = [
                            {
                              instancePath: instancePath + '/anyAction',
                              schemaPath: '#/properties/anyAction/minItems',
                              keyword: 'minItems',
                              params: { limit: 1 },
                              message: 'must NOT have fewer than 1 items',
                            },
                          ];
                          return false;
                        } else {
                          var valid4 = true;
                          const len2 = data7.length;
                          for (let i2 = 0; i2 < len2; i2++) {
                            const _errs18 = errors;
                            if (typeof data7[i2] !== 'string') {
                              validate40.errors = [
                                {
                                  instancePath: instancePath + '/anyAction/' + i2,
                                  schemaPath: '#/properties/anyAction/items/type',
                                  keyword: 'type',
                                  params: { type: 'string' },
                                  message: 'must be string',
                                },
                              ];
                              return false;
                            }
                            var valid4 = _errs18 === errors;
                            if (!valid4) {
                              break;
                            }
                          }
                        }
                      } else {
                        validate40.errors = [
                          {
                            instancePath: instancePath + '/anyAction',
                            schemaPath: '#/properties/anyAction/type',
                            keyword: 'type',
                            params: { type: 'array' },
                            message: 'must be array',
                          },
                        ];
                        return false;
                      }
                    }
                    var valid0 = _errs16 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.anyCustomization !== undefined) {
                      let data9 = data.anyCustomization;
                      const _errs20 = errors;
                      if (errors === _errs20) {
                        if (Array.isArray(data9)) {
                          if (data9.length < 1) {
                            validate40.errors = [
                              {
                                instancePath: instancePath + '/anyCustomization',
                                schemaPath: '#/properties/anyCustomization/minItems',
                                keyword: 'minItems',
                                params: { limit: 1 },
                                message: 'must NOT have fewer than 1 items',
                              },
                            ];
                            return false;
                          } else {
                            var valid5 = true;
                            const len3 = data9.length;
                            for (let i3 = 0; i3 < len3; i3++) {
                              const _errs22 = errors;
                              if (typeof data9[i3] !== 'string') {
                                validate40.errors = [
                                  {
                                    instancePath: instancePath + '/anyCustomization/' + i3,
                                    schemaPath: '#/properties/anyCustomization/items/type',
                                    keyword: 'type',
                                    params: { type: 'string' },
                                    message: 'must be string',
                                  },
                                ];
                                return false;
                              }
                              var valid5 = _errs22 === errors;
                              if (!valid5) {
                                break;
                              }
                            }
                          }
                        } else {
                          validate40.errors = [
                            {
                              instancePath: instancePath + '/anyCustomization',
                              schemaPath: '#/properties/anyCustomization/type',
                              keyword: 'type',
                              params: { type: 'array' },
                              message: 'must be array',
                            },
                          ];
                          return false;
                        }
                      }
                      var valid0 = _errs20 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.level !== undefined) {
                        let data11 = data.level;
                        const _errs24 = errors;
                        if (!(data11 === 10 || data11 === 20 || data11 === 30 || data11 === 40 || data11 === 50)) {
                          validate40.errors = [
                            {
                              instancePath: instancePath + '/level',
                              schemaPath: '#/properties/level/enum',
                              keyword: 'enum',
                              params: {
                                allowedValues: schema66.properties.level.enum,
                              },
                              message: 'must be equal to one of the allowed values',
                            },
                          ];
                          return false;
                        }
                        var valid0 = _errs24 === errors;
                      } else {
                        var valid0 = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate40.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate40.errors = vErrors;
  return errors === 0;
}
validate40.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
function validate39(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate39.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (
        (data.label === undefined && (missing0 = 'label')) ||
        (data.description === undefined && (missing0 = 'description')) ||
        (data.changes === undefined && (missing0 = 'changes'))
      ) {
        validate39.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (
            !(
              key0 === 'label' ||
              key0 === 'description' ||
              key0 === 'changes' ||
              key0 === 'choices' ||
              key0 === 'require' ||
              key0 === 'disallow'
            )
          ) {
            validate39.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.label !== undefined) {
            const _errs2 = errors;
            if (typeof data.label !== 'string') {
              validate39.errors = [
                {
                  instancePath: instancePath + '/label',
                  schemaPath: '#/properties/label/type',
                  keyword: 'type',
                  params: { type: 'string' },
                  message: 'must be string',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.description !== undefined) {
              const _errs4 = errors;
              if (typeof data.description !== 'string') {
                validate39.errors = [
                  {
                    instancePath: instancePath + '/description',
                    schemaPath: '#/properties/description/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  },
                ];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.changes !== undefined) {
                const _errs6 = errors;
                if (
                  !wrapper0.validate(data.changes, {
                    instancePath: instancePath + '/changes',
                    parentData: data,
                    parentDataProperty: 'changes',
                    rootData,
                    dynamicAnchors,
                  })
                ) {
                  vErrors = vErrors === null ? wrapper0.validate.errors : vErrors.concat(wrapper0.validate.errors);
                  errors = vErrors.length;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.choices !== undefined) {
                  let data3 = data.choices;
                  const _errs7 = errors;
                  if (errors === _errs7) {
                    if (data3 && typeof data3 == 'object' && !Array.isArray(data3)) {
                      const _errs9 = errors;
                      for (const key1 in data3) {
                        if (!pattern4.test(key1)) {
                          validate39.errors = [
                            {
                              instancePath: instancePath + '/choices',
                              schemaPath: '#/properties/choices/additionalProperties',
                              keyword: 'additionalProperties',
                              params: { additionalProperty: key1 },
                              message: 'must NOT have additional properties',
                            },
                          ];
                          return false;
                          break;
                        }
                      }
                      if (_errs9 === errors) {
                        var valid1 = true;
                        for (const key2 in data3) {
                          if (pattern4.test(key2)) {
                            let data4 = data3[key2];
                            const _errs10 = errors;
                            if (errors === _errs10) {
                              if (data4 && typeof data4 == 'object' && !Array.isArray(data4)) {
                                const _errs12 = errors;
                                for (const key3 in data4) {
                                  if (
                                    !(
                                      key3 === 'label' ||
                                      key3 === 'options' ||
                                      key3 === 'conditional' ||
                                      key3 === 'group'
                                    )
                                  ) {
                                    validate39.errors = [
                                      {
                                        instancePath:
                                          instancePath + '/choices/' + key2.replace(/~/g, '~0').replace(/\//g, '~1'),
                                        schemaPath: '#/properties/choices/patternProperties/.%2B/additionalProperties',
                                        keyword: 'additionalProperties',
                                        params: { additionalProperty: key3 },
                                        message: 'must NOT have additional properties',
                                      },
                                    ];
                                    return false;
                                    break;
                                  }
                                }
                                if (_errs12 === errors) {
                                  if (data4.label !== undefined) {
                                    const _errs13 = errors;
                                    if (typeof data4.label !== 'string') {
                                      validate39.errors = [
                                        {
                                          instancePath:
                                            instancePath +
                                            '/choices/' +
                                            key2.replace(/~/g, '~0').replace(/\//g, '~1') +
                                            '/label',
                                          schemaPath:
                                            '#/properties/choices/patternProperties/.%2B/properties/label/type',
                                          keyword: 'type',
                                          params: { type: 'string' },
                                          message: 'must be string',
                                        },
                                      ];
                                      return false;
                                    }
                                    var valid2 = _errs13 === errors;
                                  } else {
                                    var valid2 = true;
                                  }
                                  if (valid2) {
                                    if (data4.options !== undefined) {
                                      let data6 = data4.options;
                                      const _errs15 = errors;
                                      if (errors === _errs15) {
                                        if (data6 && typeof data6 == 'object' && !Array.isArray(data6)) {
                                          const _errs17 = errors;
                                          for (const key4 in data6) {
                                            if (!pattern4.test(key4)) {
                                              validate39.errors = [
                                                {
                                                  instancePath:
                                                    instancePath +
                                                    '/choices/' +
                                                    key2.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                    '/options',
                                                  schemaPath:
                                                    '#/properties/choices/patternProperties/.%2B/properties/options/additionalProperties',
                                                  keyword: 'additionalProperties',
                                                  params: {
                                                    additionalProperty: key4,
                                                  },
                                                  message: 'must NOT have additional properties',
                                                },
                                              ];
                                              return false;
                                              break;
                                            }
                                          }
                                          if (_errs17 === errors) {
                                            var valid3 = true;
                                            for (const key5 in data6) {
                                              if (pattern4.test(key5)) {
                                                const _errs18 = errors;
                                                if (typeof data6[key5] !== 'string') {
                                                  validate39.errors = [
                                                    {
                                                      instancePath:
                                                        instancePath +
                                                        '/choices/' +
                                                        key2.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                        '/options/' +
                                                        key5.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                      schemaPath:
                                                        '#/properties/choices/patternProperties/.%2B/properties/options/patternProperties/.%2B/type',
                                                      keyword: 'type',
                                                      params: {
                                                        type: 'string',
                                                      },
                                                      message: 'must be string',
                                                    },
                                                  ];
                                                  return false;
                                                }
                                                var valid3 = _errs18 === errors;
                                                if (!valid3) {
                                                  break;
                                                }
                                              }
                                            }
                                          }
                                        } else {
                                          validate39.errors = [
                                            {
                                              instancePath:
                                                instancePath +
                                                '/choices/' +
                                                key2.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                '/options',
                                              schemaPath:
                                                '#/properties/choices/patternProperties/.%2B/properties/options/type',
                                              keyword: 'type',
                                              params: { type: 'object' },
                                              message: 'must be object',
                                            },
                                          ];
                                          return false;
                                        }
                                      }
                                      var valid2 = _errs15 === errors;
                                    } else {
                                      var valid2 = true;
                                    }
                                    if (valid2) {
                                      if (data4.conditional !== undefined) {
                                        let data8 = data4.conditional;
                                        const _errs20 = errors;
                                        if (errors === _errs20) {
                                          if (data8 && typeof data8 == 'object' && !Array.isArray(data8)) {
                                            const _errs22 = errors;
                                            for (const key6 in data8) {
                                              if (!pattern4.test(key6)) {
                                                validate39.errors = [
                                                  {
                                                    instancePath:
                                                      instancePath +
                                                      '/choices/' +
                                                      key2.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                      '/conditional',
                                                    schemaPath:
                                                      '#/properties/choices/patternProperties/.%2B/properties/conditional/additionalProperties',
                                                    keyword: 'additionalProperties',
                                                    params: {
                                                      additionalProperty: key6,
                                                    },
                                                    message: 'must NOT have additional properties',
                                                  },
                                                ];
                                                return false;
                                                break;
                                              }
                                            }
                                            if (_errs22 === errors) {
                                              var valid4 = true;
                                              for (const key7 in data8) {
                                                if (pattern4.test(key7)) {
                                                  const _errs23 = errors;
                                                  if (typeof data8[key7] !== 'string') {
                                                    validate39.errors = [
                                                      {
                                                        instancePath:
                                                          instancePath +
                                                          '/choices/' +
                                                          key2.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                          '/conditional/' +
                                                          key7.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                        schemaPath:
                                                          '#/properties/choices/patternProperties/.%2B/properties/conditional/patternProperties/.%2B/type',
                                                        keyword: 'type',
                                                        params: {
                                                          type: 'string',
                                                        },
                                                        message: 'must be string',
                                                      },
                                                    ];
                                                    return false;
                                                  }
                                                  var valid4 = _errs23 === errors;
                                                  if (!valid4) {
                                                    break;
                                                  }
                                                }
                                              }
                                            }
                                          } else {
                                            validate39.errors = [
                                              {
                                                instancePath:
                                                  instancePath +
                                                  '/choices/' +
                                                  key2.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                  '/conditional',
                                                schemaPath:
                                                  '#/properties/choices/patternProperties/.%2B/properties/conditional/type',
                                                keyword: 'type',
                                                params: { type: 'object' },
                                                message: 'must be object',
                                              },
                                            ];
                                            return false;
                                          }
                                        }
                                        var valid2 = _errs20 === errors;
                                      } else {
                                        var valid2 = true;
                                      }
                                      if (valid2) {
                                        if (data4.group !== undefined) {
                                          const _errs25 = errors;
                                          if (typeof data4.group !== 'string') {
                                            validate39.errors = [
                                              {
                                                instancePath:
                                                  instancePath +
                                                  '/choices/' +
                                                  key2.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                  '/group',
                                                schemaPath:
                                                  '#/properties/choices/patternProperties/.%2B/properties/group/type',
                                                keyword: 'type',
                                                params: { type: 'string' },
                                                message: 'must be string',
                                              },
                                            ];
                                            return false;
                                          }
                                          var valid2 = _errs25 === errors;
                                        } else {
                                          var valid2 = true;
                                        }
                                      }
                                    }
                                  }
                                }
                              } else {
                                validate39.errors = [
                                  {
                                    instancePath:
                                      instancePath + '/choices/' + key2.replace(/~/g, '~0').replace(/\//g, '~1'),
                                    schemaPath: '#/properties/choices/patternProperties/.%2B/type',
                                    keyword: 'type',
                                    params: { type: 'object' },
                                    message: 'must be object',
                                  },
                                ];
                                return false;
                              }
                            }
                            var valid1 = _errs10 === errors;
                            if (!valid1) {
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      validate39.errors = [
                        {
                          instancePath: instancePath + '/choices',
                          schemaPath: '#/properties/choices/type',
                          keyword: 'type',
                          params: { type: 'object' },
                          message: 'must be object',
                        },
                      ];
                      return false;
                    }
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.require !== undefined) {
                    const _errs27 = errors;
                    if (
                      !validate40(data.require, {
                        instancePath: instancePath + '/require',
                        parentData: data,
                        parentDataProperty: 'require',
                        rootData,
                        dynamicAnchors,
                      })
                    ) {
                      vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
                      errors = vErrors.length;
                    }
                    var valid0 = _errs27 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.disallow !== undefined) {
                      const _errs28 = errors;
                      if (
                        !validate40(data.disallow, {
                          instancePath: instancePath + '/disallow',
                          parentData: data,
                          parentDataProperty: 'disallow',
                          rootData,
                          dynamicAnchors,
                        })
                      ) {
                        vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
                        errors = vErrors.length;
                      }
                      var valid0 = _errs28 === errors;
                    } else {
                      var valid0 = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate39.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate39.errors = vErrors;
  return errors === 0;
}
validate39.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
function validate38(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate38.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (
        (data.type === undefined && (missing0 = 'type')) ||
        (data.drawback === undefined && (missing0 = 'drawback')) ||
        (data.options === undefined && (missing0 = 'options'))
      ) {
        validate38.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'drawback' || key0 === 'options')) {
            validate38.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('ConditionalBonusSkill' !== data.type) {
              validate38.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'ConditionalBonusSkill' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.drawback !== undefined) {
              const _errs3 = errors;
              if (
                !validate39(data.drawback, {
                  instancePath: instancePath + '/drawback',
                  parentData: data,
                  parentDataProperty: 'drawback',
                  rootData,
                  dynamicAnchors,
                })
              ) {
                vErrors = vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
                errors = vErrors.length;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.options !== undefined) {
                let data2 = data.options;
                const _errs4 = errors;
                if (errors === _errs4) {
                  if (data2 && typeof data2 == 'object' && !Array.isArray(data2)) {
                    if (Object.keys(data2).length < 1) {
                      validate38.errors = [
                        {
                          instancePath: instancePath + '/options',
                          schemaPath: '#/properties/options/minProperties',
                          keyword: 'minProperties',
                          params: { limit: 1 },
                          message: 'must NOT have fewer than 1 properties',
                        },
                      ];
                      return false;
                    } else {
                      const _errs6 = errors;
                      for (const key1 in data2) {
                        if (!pattern4.test(key1)) {
                          validate38.errors = [
                            {
                              instancePath: instancePath + '/options',
                              schemaPath: '#/properties/options/additionalProperties',
                              keyword: 'additionalProperties',
                              params: { additionalProperty: key1 },
                              message: 'must NOT have additional properties',
                            },
                          ];
                          return false;
                          break;
                        }
                      }
                      if (_errs6 === errors) {
                        var valid1 = true;
                        for (const key2 in data2) {
                          if (pattern4.test(key2)) {
                            const _errs7 = errors;
                            if (
                              !validate39(data2[key2], {
                                instancePath:
                                  instancePath + '/options/' + key2.replace(/~/g, '~0').replace(/\//g, '~1'),
                                parentData: data2,
                                parentDataProperty: key2,
                                rootData,
                                dynamicAnchors,
                              })
                            ) {
                              vErrors = vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
                              errors = vErrors.length;
                            }
                            var valid1 = _errs7 === errors;
                            if (!valid1) {
                              break;
                            }
                          }
                        }
                      }
                    }
                  } else {
                    validate38.errors = [
                      {
                        instancePath: instancePath + '/options',
                        schemaPath: '#/properties/options/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      },
                    ];
                    return false;
                  }
                }
                var valid0 = _errs4 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate38.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate38.errors = vErrors;
  return errors === 0;
}
validate38.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema68 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'ChooseCustomization' },
    options: {
      type: 'object',
      patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
      minProperties: 1,
    },
  },
  required: ['type', 'options'],
};
function validate46(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate46.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if ((data.type === undefined && (missing0 = 'type')) || (data.options === undefined && (missing0 = 'options'))) {
        validate46.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'options')) {
            validate46.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('ChooseCustomization' !== data.type) {
              validate46.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'ChooseCustomization' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.options !== undefined) {
              let data1 = data.options;
              const _errs3 = errors;
              if (errors === _errs3) {
                if (data1 && typeof data1 == 'object' && !Array.isArray(data1)) {
                  if (Object.keys(data1).length < 1) {
                    validate46.errors = [
                      {
                        instancePath: instancePath + '/options',
                        schemaPath: '#/properties/options/minProperties',
                        keyword: 'minProperties',
                        params: { limit: 1 },
                        message: 'must NOT have fewer than 1 properties',
                      },
                    ];
                    return false;
                  } else {
                    var props0 = {};
                    for (const key1 in data1) {
                      if (pattern4.test(key1)) {
                        if (
                          !validate39(data1[key1], {
                            instancePath: instancePath + '/options/' + key1.replace(/~/g, '~0').replace(/\//g, '~1'),
                            parentData: data1,
                            parentDataProperty: key1,
                            rootData,
                            dynamicAnchors,
                          })
                        ) {
                          vErrors = vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
                          errors = vErrors.length;
                        }
                        props0[key1] = true;
                      }
                    }
                  }
                } else {
                  validate46.errors = [
                    {
                      instancePath: instancePath + '/options',
                      schemaPath: '#/properties/options/type',
                      keyword: 'type',
                      params: { type: 'object' },
                      message: 'must be object',
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate46.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate46.errors = vErrors;
  return errors === 0;
}
validate46.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema69 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'ConfigureAttack' },
    attack: { type: 'string' },
    configure: {
      type: 'object',
      properties: {
        attributes: {
          type: 'array',
          items: { $ref: '#/$defs/Attributes' },
          minItems: 2,
        },
        damageType: {
          oneOf: [
            { const: true },
            {
              type: 'array',
              items: { $ref: '#/$defs/DamageType' },
              minItems: 2,
            },
          ],
        },
        range: { const: true },
        special: {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
          minProperties: 2,
        },
      },
    },
  },
  required: ['type', 'attack', 'configure'],
};
function validate49(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate49.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (
        (data.type === undefined && (missing0 = 'type')) ||
        (data.attack === undefined && (missing0 = 'attack')) ||
        (data.configure === undefined && (missing0 = 'configure'))
      ) {
        validate49.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'attack' || key0 === 'configure')) {
            validate49.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('ConfigureAttack' !== data.type) {
              validate49.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'ConfigureAttack' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.attack !== undefined) {
              const _errs3 = errors;
              if (typeof data.attack !== 'string') {
                validate49.errors = [
                  {
                    instancePath: instancePath + '/attack',
                    schemaPath: '#/properties/attack/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  },
                ];
                return false;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.configure !== undefined) {
                let data2 = data.configure;
                const _errs5 = errors;
                if (errors === _errs5) {
                  if (data2 && typeof data2 == 'object' && !Array.isArray(data2)) {
                    if (data2.attributes !== undefined) {
                      let data3 = data2.attributes;
                      const _errs7 = errors;
                      if (errors === _errs7) {
                        if (Array.isArray(data3)) {
                          if (data3.length < 2) {
                            validate49.errors = [
                              {
                                instancePath: instancePath + '/configure/attributes',
                                schemaPath: '#/properties/configure/properties/attributes/minItems',
                                keyword: 'minItems',
                                params: { limit: 2 },
                                message: 'must NOT have fewer than 2 items',
                              },
                            ];
                            return false;
                          } else {
                            var valid2 = true;
                            const len0 = data3.length;
                            for (let i0 = 0; i0 < len0; i0++) {
                              let data4 = data3[i0];
                              const _errs9 = errors;
                              const _errs10 = errors;
                              if (errors === _errs10) {
                                if (Array.isArray(data4)) {
                                  if (data4.length > 2) {
                                    validate49.errors = [
                                      {
                                        instancePath: instancePath + '/configure/attributes/' + i0,
                                        schemaPath: '#/$defs/Attributes/maxItems',
                                        keyword: 'maxItems',
                                        params: { limit: 2 },
                                        message: 'must NOT have more than 2 items',
                                      },
                                    ];
                                    return false;
                                  } else {
                                    if (data4.length < 2) {
                                      validate49.errors = [
                                        {
                                          instancePath: instancePath + '/configure/attributes/' + i0,
                                          schemaPath: '#/$defs/Attributes/minItems',
                                          keyword: 'minItems',
                                          params: { limit: 2 },
                                          message: 'must NOT have fewer than 2 items',
                                        },
                                      ];
                                      return false;
                                    } else {
                                      var valid4 = true;
                                      const len1 = data4.length;
                                      for (let i1 = 0; i1 < len1; i1++) {
                                        let data5 = data4[i1];
                                        const _errs12 = errors;
                                        if (
                                          !(data5 === 'dex' || data5 === 'ins' || data5 === 'mig' || data5 === 'wlp')
                                        ) {
                                          validate49.errors = [
                                            {
                                              instancePath: instancePath + '/configure/attributes/' + i0 + '/' + i1,
                                              schemaPath: '#/$defs/Attributes/items/enum',
                                              keyword: 'enum',
                                              params: {
                                                allowedValues: schema45.items.enum,
                                              },
                                              message: 'must be equal to one of the allowed values',
                                            },
                                          ];
                                          return false;
                                        }
                                        var valid4 = _errs12 === errors;
                                        if (!valid4) {
                                          break;
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  validate49.errors = [
                                    {
                                      instancePath: instancePath + '/configure/attributes/' + i0,
                                      schemaPath: '#/$defs/Attributes/type',
                                      keyword: 'type',
                                      params: { type: 'array' },
                                      message: 'must be array',
                                    },
                                  ];
                                  return false;
                                }
                              }
                              var valid2 = _errs9 === errors;
                              if (!valid2) {
                                break;
                              }
                            }
                          }
                        } else {
                          validate49.errors = [
                            {
                              instancePath: instancePath + '/configure/attributes',
                              schemaPath: '#/properties/configure/properties/attributes/type',
                              keyword: 'type',
                              params: { type: 'array' },
                              message: 'must be array',
                            },
                          ];
                          return false;
                        }
                      }
                      var valid1 = _errs7 === errors;
                    } else {
                      var valid1 = true;
                    }
                    if (valid1) {
                      if (data2.damageType !== undefined) {
                        let data6 = data2.damageType;
                        const _errs13 = errors;
                        const _errs14 = errors;
                        let valid5 = false;
                        let passing0 = null;
                        const _errs15 = errors;
                        if (true !== data6) {
                          const err0 = {
                            instancePath: instancePath + '/configure/damageType',
                            schemaPath: '#/properties/configure/properties/damageType/oneOf/0/const',
                            keyword: 'const',
                            params: { allowedValue: true },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err0];
                          } else {
                            vErrors.push(err0);
                          }
                          errors++;
                        }
                        var _valid0 = _errs15 === errors;
                        if (_valid0) {
                          valid5 = true;
                          passing0 = 0;
                        }
                        const _errs16 = errors;
                        if (errors === _errs16) {
                          if (Array.isArray(data6)) {
                            if (data6.length < 2) {
                              const err1 = {
                                instancePath: instancePath + '/configure/damageType',
                                schemaPath: '#/properties/configure/properties/damageType/oneOf/1/minItems',
                                keyword: 'minItems',
                                params: { limit: 2 },
                                message: 'must NOT have fewer than 2 items',
                              };
                              if (vErrors === null) {
                                vErrors = [err1];
                              } else {
                                vErrors.push(err1);
                              }
                              errors++;
                            } else {
                              var valid6 = true;
                              const len2 = data6.length;
                              for (let i2 = 0; i2 < len2; i2++) {
                                let data7 = data6[i2];
                                const _errs18 = errors;
                                if (
                                  !(
                                    data7 === 'physical' ||
                                    data7 === 'air' ||
                                    data7 === 'bolt' ||
                                    data7 === 'dark' ||
                                    data7 === 'earth' ||
                                    data7 === 'fire' ||
                                    data7 === 'ice' ||
                                    data7 === 'light' ||
                                    data7 === 'poison'
                                  )
                                ) {
                                  const err2 = {
                                    instancePath: instancePath + '/configure/damageType/' + i2,
                                    schemaPath: '#/$defs/DamageType/enum',
                                    keyword: 'enum',
                                    params: { allowedValues: schema46.enum },
                                    message: 'must be equal to one of the allowed values',
                                  };
                                  if (vErrors === null) {
                                    vErrors = [err2];
                                  } else {
                                    vErrors.push(err2);
                                  }
                                  errors++;
                                }
                                var valid6 = _errs18 === errors;
                                if (!valid6) {
                                  break;
                                }
                              }
                            }
                          } else {
                            const err3 = {
                              instancePath: instancePath + '/configure/damageType',
                              schemaPath: '#/properties/configure/properties/damageType/oneOf/1/type',
                              keyword: 'type',
                              params: { type: 'array' },
                              message: 'must be array',
                            };
                            if (vErrors === null) {
                              vErrors = [err3];
                            } else {
                              vErrors.push(err3);
                            }
                            errors++;
                          }
                        }
                        var _valid0 = _errs16 === errors;
                        if (_valid0 && valid5) {
                          valid5 = false;
                          passing0 = [passing0, 1];
                        } else {
                          if (_valid0) {
                            valid5 = true;
                            passing0 = 1;
                          }
                        }
                        if (!valid5) {
                          const err4 = {
                            instancePath: instancePath + '/configure/damageType',
                            schemaPath: '#/properties/configure/properties/damageType/oneOf',
                            keyword: 'oneOf',
                            params: { passingSchemas: passing0 },
                            message: 'must match exactly one schema in oneOf',
                          };
                          if (vErrors === null) {
                            vErrors = [err4];
                          } else {
                            vErrors.push(err4);
                          }
                          errors++;
                          validate49.errors = vErrors;
                          return false;
                        } else {
                          errors = _errs14;
                          if (vErrors !== null) {
                            if (_errs14) {
                              vErrors.length = _errs14;
                            } else {
                              vErrors = null;
                            }
                          }
                        }
                        var valid1 = _errs13 === errors;
                      } else {
                        var valid1 = true;
                      }
                      if (valid1) {
                        if (data2.range !== undefined) {
                          const _errs20 = errors;
                          if (true !== data2.range) {
                            validate49.errors = [
                              {
                                instancePath: instancePath + '/configure/range',
                                schemaPath: '#/properties/configure/properties/range/const',
                                keyword: 'const',
                                params: { allowedValue: true },
                                message: 'must be equal to constant',
                              },
                            ];
                            return false;
                          }
                          var valid1 = _errs20 === errors;
                        } else {
                          var valid1 = true;
                        }
                        if (valid1) {
                          if (data2.special !== undefined) {
                            let data9 = data2.special;
                            const _errs21 = errors;
                            if (errors === _errs21) {
                              if (data9 && typeof data9 == 'object' && !Array.isArray(data9)) {
                                if (Object.keys(data9).length < 2) {
                                  validate49.errors = [
                                    {
                                      instancePath: instancePath + '/configure/special',
                                      schemaPath: '#/properties/configure/properties/special/minProperties',
                                      keyword: 'minProperties',
                                      params: { limit: 2 },
                                      message: 'must NOT have fewer than 2 properties',
                                    },
                                  ];
                                  return false;
                                } else {
                                  const _errs23 = errors;
                                  for (const key1 in data9) {
                                    if (!pattern4.test(key1)) {
                                      validate49.errors = [
                                        {
                                          instancePath: instancePath + '/configure/special',
                                          schemaPath: '#/properties/configure/properties/special/additionalProperties',
                                          keyword: 'additionalProperties',
                                          params: { additionalProperty: key1 },
                                          message: 'must NOT have additional properties',
                                        },
                                      ];
                                      return false;
                                      break;
                                    }
                                  }
                                  if (_errs23 === errors) {
                                    var valid8 = true;
                                    for (const key2 in data9) {
                                      if (pattern4.test(key2)) {
                                        const _errs24 = errors;
                                        if (
                                          !validate39(data9[key2], {
                                            instancePath:
                                              instancePath +
                                              '/configure/special/' +
                                              key2.replace(/~/g, '~0').replace(/\//g, '~1'),
                                            parentData: data9,
                                            parentDataProperty: key2,
                                            rootData,
                                            dynamicAnchors,
                                          })
                                        ) {
                                          vErrors =
                                            vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
                                          errors = vErrors.length;
                                        }
                                        var valid8 = _errs24 === errors;
                                        if (!valid8) {
                                          break;
                                        }
                                      }
                                    }
                                  }
                                }
                              } else {
                                validate49.errors = [
                                  {
                                    instancePath: instancePath + '/configure/special',
                                    schemaPath: '#/properties/configure/properties/special/type',
                                    keyword: 'type',
                                    params: { type: 'object' },
                                    message: 'must be object',
                                  },
                                ];
                                return false;
                              }
                            }
                            var valid1 = _errs21 === errors;
                          } else {
                            var valid1 = true;
                          }
                        }
                      }
                    }
                  } else {
                    validate49.errors = [
                      {
                        instancePath: instancePath + '/configure',
                        schemaPath: '#/properties/configure/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      },
                    ];
                    return false;
                  }
                }
                var valid0 = _errs5 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate49.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate49.errors = vErrors;
  return errors === 0;
}
validate49.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema72 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'ChooseSpell' },
    spells: {
      oneOf: [
        { type: 'string' },
        {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/UnconfiguredSpell' } },
          minProperties: 1,
        },
      ],
    },
  },
  required: ['type', 'spells'],
};
const schema73 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    summary: { type: 'string' },
    description: { type: 'string' },
    cost: { type: 'integer' },
    target: { enum: ['self', 'single', 'upToThree', 'special', 'weapon'] },
    costType: { enum: ['total', 'perTarget'] },
    duration: { enum: ['instant', 'scene'] },
    opportunity: { type: 'string' },
    offensive: {
      oneOf: [
        { const: true },
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            baseDamage: { type: 'integer' },
            damageType: {
              oneOf: [
                { $ref: '#/$defs/DamageType' },
                { const: true },
                {
                  type: 'array',
                  items: { $ref: '#/$defs/DamageType' },
                  minItems: 2,
                },
              ],
            },
          },
          required: ['baseDamage', 'damageType'],
        },
      ],
    },
    choices: {
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '.+': {
          type: 'object',
          additionalProperties: false,
          properties: {
            label: { type: 'string' },
            options: {
              type: 'object',
              additionalProperties: false,
              patternProperties: { '.+': { type: 'string' } },
            },
            conditional: {
              type: 'object',
              additionalProperties: false,
              patternProperties: { '.+': { type: 'string' } },
            },
            group: { type: 'string' },
          },
        },
      },
    },
    require: { $ref: '#/$defs/Requirements' },
    disallow: { $ref: '#/$defs/Requirements' },
  },
  required: ['name', 'summary', 'description', 'cost', 'costType', 'target', 'duration'],
};
function validate53(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate53.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (
        (data.name === undefined && (missing0 = 'name')) ||
        (data.summary === undefined && (missing0 = 'summary')) ||
        (data.description === undefined && (missing0 = 'description')) ||
        (data.cost === undefined && (missing0 = 'cost')) ||
        (data.costType === undefined && (missing0 = 'costType')) ||
        (data.target === undefined && (missing0 = 'target')) ||
        (data.duration === undefined && (missing0 = 'duration'))
      ) {
        validate53.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!func1.call(schema73.properties, key0)) {
            validate53.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.name !== undefined) {
            const _errs2 = errors;
            if (typeof data.name !== 'string') {
              validate53.errors = [
                {
                  instancePath: instancePath + '/name',
                  schemaPath: '#/properties/name/type',
                  keyword: 'type',
                  params: { type: 'string' },
                  message: 'must be string',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.summary !== undefined) {
              const _errs4 = errors;
              if (typeof data.summary !== 'string') {
                validate53.errors = [
                  {
                    instancePath: instancePath + '/summary',
                    schemaPath: '#/properties/summary/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  },
                ];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.description !== undefined) {
                const _errs6 = errors;
                if (typeof data.description !== 'string') {
                  validate53.errors = [
                    {
                      instancePath: instancePath + '/description',
                      schemaPath: '#/properties/description/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    },
                  ];
                  return false;
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.cost !== undefined) {
                  let data3 = data.cost;
                  const _errs8 = errors;
                  if (!(typeof data3 == 'number' && !(data3 % 1) && !isNaN(data3) && isFinite(data3))) {
                    validate53.errors = [
                      {
                        instancePath: instancePath + '/cost',
                        schemaPath: '#/properties/cost/type',
                        keyword: 'type',
                        params: { type: 'integer' },
                        message: 'must be integer',
                      },
                    ];
                    return false;
                  }
                  var valid0 = _errs8 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.target !== undefined) {
                    let data4 = data.target;
                    const _errs10 = errors;
                    if (
                      !(
                        data4 === 'self' ||
                        data4 === 'single' ||
                        data4 === 'upToThree' ||
                        data4 === 'special' ||
                        data4 === 'weapon'
                      )
                    ) {
                      validate53.errors = [
                        {
                          instancePath: instancePath + '/target',
                          schemaPath: '#/properties/target/enum',
                          keyword: 'enum',
                          params: {
                            allowedValues: schema73.properties.target.enum,
                          },
                          message: 'must be equal to one of the allowed values',
                        },
                      ];
                      return false;
                    }
                    var valid0 = _errs10 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.costType !== undefined) {
                      let data5 = data.costType;
                      const _errs11 = errors;
                      if (!(data5 === 'total' || data5 === 'perTarget')) {
                        validate53.errors = [
                          {
                            instancePath: instancePath + '/costType',
                            schemaPath: '#/properties/costType/enum',
                            keyword: 'enum',
                            params: {
                              allowedValues: schema73.properties.costType.enum,
                            },
                            message: 'must be equal to one of the allowed values',
                          },
                        ];
                        return false;
                      }
                      var valid0 = _errs11 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.duration !== undefined) {
                        let data6 = data.duration;
                        const _errs12 = errors;
                        if (!(data6 === 'instant' || data6 === 'scene')) {
                          validate53.errors = [
                            {
                              instancePath: instancePath + '/duration',
                              schemaPath: '#/properties/duration/enum',
                              keyword: 'enum',
                              params: {
                                allowedValues: schema73.properties.duration.enum,
                              },
                              message: 'must be equal to one of the allowed values',
                            },
                          ];
                          return false;
                        }
                        var valid0 = _errs12 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.opportunity !== undefined) {
                          const _errs13 = errors;
                          if (typeof data.opportunity !== 'string') {
                            validate53.errors = [
                              {
                                instancePath: instancePath + '/opportunity',
                                schemaPath: '#/properties/opportunity/type',
                                keyword: 'type',
                                params: { type: 'string' },
                                message: 'must be string',
                              },
                            ];
                            return false;
                          }
                          var valid0 = _errs13 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.offensive !== undefined) {
                            let data8 = data.offensive;
                            const _errs15 = errors;
                            const _errs16 = errors;
                            let valid1 = false;
                            let passing0 = null;
                            const _errs17 = errors;
                            if (true !== data8) {
                              const err0 = {
                                instancePath: instancePath + '/offensive',
                                schemaPath: '#/properties/offensive/oneOf/0/const',
                                keyword: 'const',
                                params: { allowedValue: true },
                                message: 'must be equal to constant',
                              };
                              if (vErrors === null) {
                                vErrors = [err0];
                              } else {
                                vErrors.push(err0);
                              }
                              errors++;
                            }
                            var _valid0 = _errs17 === errors;
                            if (_valid0) {
                              valid1 = true;
                              passing0 = 0;
                            }
                            const _errs18 = errors;
                            if (errors === _errs18) {
                              if (data8 && typeof data8 == 'object' && !Array.isArray(data8)) {
                                let missing1;
                                if (
                                  (data8.baseDamage === undefined && (missing1 = 'baseDamage')) ||
                                  (data8.damageType === undefined && (missing1 = 'damageType'))
                                ) {
                                  const err1 = {
                                    instancePath: instancePath + '/offensive',
                                    schemaPath: '#/properties/offensive/oneOf/1/required',
                                    keyword: 'required',
                                    params: { missingProperty: missing1 },
                                    message: "must have required property '" + missing1 + "'",
                                  };
                                  if (vErrors === null) {
                                    vErrors = [err1];
                                  } else {
                                    vErrors.push(err1);
                                  }
                                  errors++;
                                } else {
                                  const _errs20 = errors;
                                  for (const key1 in data8) {
                                    if (!(key1 === 'baseDamage' || key1 === 'damageType')) {
                                      const err2 = {
                                        instancePath: instancePath + '/offensive',
                                        schemaPath: '#/properties/offensive/oneOf/1/additionalProperties',
                                        keyword: 'additionalProperties',
                                        params: { additionalProperty: key1 },
                                        message: 'must NOT have additional properties',
                                      };
                                      if (vErrors === null) {
                                        vErrors = [err2];
                                      } else {
                                        vErrors.push(err2);
                                      }
                                      errors++;
                                      break;
                                    }
                                  }
                                  if (_errs20 === errors) {
                                    if (data8.baseDamage !== undefined) {
                                      let data9 = data8.baseDamage;
                                      const _errs21 = errors;
                                      if (
                                        !(typeof data9 == 'number' && !(data9 % 1) && !isNaN(data9) && isFinite(data9))
                                      ) {
                                        const err3 = {
                                          instancePath: instancePath + '/offensive/baseDamage',
                                          schemaPath: '#/properties/offensive/oneOf/1/properties/baseDamage/type',
                                          keyword: 'type',
                                          params: { type: 'integer' },
                                          message: 'must be integer',
                                        };
                                        if (vErrors === null) {
                                          vErrors = [err3];
                                        } else {
                                          vErrors.push(err3);
                                        }
                                        errors++;
                                      }
                                      var valid2 = _errs21 === errors;
                                    } else {
                                      var valid2 = true;
                                    }
                                    if (valid2) {
                                      if (data8.damageType !== undefined) {
                                        let data10 = data8.damageType;
                                        const _errs23 = errors;
                                        const _errs24 = errors;
                                        let valid3 = false;
                                        let passing1 = null;
                                        const _errs25 = errors;
                                        if (
                                          !(
                                            data10 === 'physical' ||
                                            data10 === 'air' ||
                                            data10 === 'bolt' ||
                                            data10 === 'dark' ||
                                            data10 === 'earth' ||
                                            data10 === 'fire' ||
                                            data10 === 'ice' ||
                                            data10 === 'light' ||
                                            data10 === 'poison'
                                          )
                                        ) {
                                          const err4 = {
                                            instancePath: instancePath + '/offensive/damageType',
                                            schemaPath: '#/$defs/DamageType/enum',
                                            keyword: 'enum',
                                            params: {
                                              allowedValues: schema46.enum,
                                            },
                                            message: 'must be equal to one of the allowed values',
                                          };
                                          if (vErrors === null) {
                                            vErrors = [err4];
                                          } else {
                                            vErrors.push(err4);
                                          }
                                          errors++;
                                        }
                                        var _valid1 = _errs25 === errors;
                                        if (_valid1) {
                                          valid3 = true;
                                          passing1 = 0;
                                        }
                                        const _errs27 = errors;
                                        if (true !== data10) {
                                          const err5 = {
                                            instancePath: instancePath + '/offensive/damageType',
                                            schemaPath:
                                              '#/properties/offensive/oneOf/1/properties/damageType/oneOf/1/const',
                                            keyword: 'const',
                                            params: { allowedValue: true },
                                            message: 'must be equal to constant',
                                          };
                                          if (vErrors === null) {
                                            vErrors = [err5];
                                          } else {
                                            vErrors.push(err5);
                                          }
                                          errors++;
                                        }
                                        var _valid1 = _errs27 === errors;
                                        if (_valid1 && valid3) {
                                          valid3 = false;
                                          passing1 = [passing1, 1];
                                        } else {
                                          if (_valid1) {
                                            valid3 = true;
                                            passing1 = 1;
                                          }
                                          const _errs28 = errors;
                                          if (errors === _errs28) {
                                            if (Array.isArray(data10)) {
                                              if (data10.length < 2) {
                                                const err6 = {
                                                  instancePath: instancePath + '/offensive/damageType',
                                                  schemaPath:
                                                    '#/properties/offensive/oneOf/1/properties/damageType/oneOf/2/minItems',
                                                  keyword: 'minItems',
                                                  params: { limit: 2 },
                                                  message: 'must NOT have fewer than 2 items',
                                                };
                                                if (vErrors === null) {
                                                  vErrors = [err6];
                                                } else {
                                                  vErrors.push(err6);
                                                }
                                                errors++;
                                              } else {
                                                var valid5 = true;
                                                const len0 = data10.length;
                                                for (let i0 = 0; i0 < len0; i0++) {
                                                  let data11 = data10[i0];
                                                  const _errs30 = errors;
                                                  if (
                                                    !(
                                                      data11 === 'physical' ||
                                                      data11 === 'air' ||
                                                      data11 === 'bolt' ||
                                                      data11 === 'dark' ||
                                                      data11 === 'earth' ||
                                                      data11 === 'fire' ||
                                                      data11 === 'ice' ||
                                                      data11 === 'light' ||
                                                      data11 === 'poison'
                                                    )
                                                  ) {
                                                    const err7 = {
                                                      instancePath: instancePath + '/offensive/damageType/' + i0,
                                                      schemaPath: '#/$defs/DamageType/enum',
                                                      keyword: 'enum',
                                                      params: {
                                                        allowedValues: schema46.enum,
                                                      },
                                                      message: 'must be equal to one of the allowed values',
                                                    };
                                                    if (vErrors === null) {
                                                      vErrors = [err7];
                                                    } else {
                                                      vErrors.push(err7);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid5 = _errs30 === errors;
                                                  if (!valid5) {
                                                    break;
                                                  }
                                                }
                                              }
                                            } else {
                                              const err8 = {
                                                instancePath: instancePath + '/offensive/damageType',
                                                schemaPath:
                                                  '#/properties/offensive/oneOf/1/properties/damageType/oneOf/2/type',
                                                keyword: 'type',
                                                params: { type: 'array' },
                                                message: 'must be array',
                                              };
                                              if (vErrors === null) {
                                                vErrors = [err8];
                                              } else {
                                                vErrors.push(err8);
                                              }
                                              errors++;
                                            }
                                          }
                                          var _valid1 = _errs28 === errors;
                                          if (_valid1 && valid3) {
                                            valid3 = false;
                                            passing1 = [passing1, 2];
                                          } else {
                                            if (_valid1) {
                                              valid3 = true;
                                              passing1 = 2;
                                            }
                                          }
                                        }
                                        if (!valid3) {
                                          const err9 = {
                                            instancePath: instancePath + '/offensive/damageType',
                                            schemaPath: '#/properties/offensive/oneOf/1/properties/damageType/oneOf',
                                            keyword: 'oneOf',
                                            params: {
                                              passingSchemas: passing1,
                                            },
                                            message: 'must match exactly one schema in oneOf',
                                          };
                                          if (vErrors === null) {
                                            vErrors = [err9];
                                          } else {
                                            vErrors.push(err9);
                                          }
                                          errors++;
                                        } else {
                                          errors = _errs24;
                                          if (vErrors !== null) {
                                            if (_errs24) {
                                              vErrors.length = _errs24;
                                            } else {
                                              vErrors = null;
                                            }
                                          }
                                        }
                                        var valid2 = _errs23 === errors;
                                      } else {
                                        var valid2 = true;
                                      }
                                    }
                                  }
                                }
                              } else {
                                const err10 = {
                                  instancePath: instancePath + '/offensive',
                                  schemaPath: '#/properties/offensive/oneOf/1/type',
                                  keyword: 'type',
                                  params: { type: 'object' },
                                  message: 'must be object',
                                };
                                if (vErrors === null) {
                                  vErrors = [err10];
                                } else {
                                  vErrors.push(err10);
                                }
                                errors++;
                              }
                            }
                            var _valid0 = _errs18 === errors;
                            if (_valid0 && valid1) {
                              valid1 = false;
                              passing0 = [passing0, 1];
                            } else {
                              if (_valid0) {
                                valid1 = true;
                                passing0 = 1;
                              }
                            }
                            if (!valid1) {
                              const err11 = {
                                instancePath: instancePath + '/offensive',
                                schemaPath: '#/properties/offensive/oneOf',
                                keyword: 'oneOf',
                                params: { passingSchemas: passing0 },
                                message: 'must match exactly one schema in oneOf',
                              };
                              if (vErrors === null) {
                                vErrors = [err11];
                              } else {
                                vErrors.push(err11);
                              }
                              errors++;
                              validate53.errors = vErrors;
                              return false;
                            } else {
                              errors = _errs16;
                              if (vErrors !== null) {
                                if (_errs16) {
                                  vErrors.length = _errs16;
                                } else {
                                  vErrors = null;
                                }
                              }
                            }
                            var valid0 = _errs15 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.choices !== undefined) {
                              let data12 = data.choices;
                              const _errs32 = errors;
                              if (errors === _errs32) {
                                if (data12 && typeof data12 == 'object' && !Array.isArray(data12)) {
                                  const _errs34 = errors;
                                  for (const key2 in data12) {
                                    if (!pattern4.test(key2)) {
                                      validate53.errors = [
                                        {
                                          instancePath: instancePath + '/choices',
                                          schemaPath: '#/properties/choices/additionalProperties',
                                          keyword: 'additionalProperties',
                                          params: { additionalProperty: key2 },
                                          message: 'must NOT have additional properties',
                                        },
                                      ];
                                      return false;
                                      break;
                                    }
                                  }
                                  if (_errs34 === errors) {
                                    var valid7 = true;
                                    for (const key3 in data12) {
                                      if (pattern4.test(key3)) {
                                        let data13 = data12[key3];
                                        const _errs35 = errors;
                                        if (errors === _errs35) {
                                          if (data13 && typeof data13 == 'object' && !Array.isArray(data13)) {
                                            const _errs37 = errors;
                                            for (const key4 in data13) {
                                              if (
                                                !(
                                                  key4 === 'label' ||
                                                  key4 === 'options' ||
                                                  key4 === 'conditional' ||
                                                  key4 === 'group'
                                                )
                                              ) {
                                                validate53.errors = [
                                                  {
                                                    instancePath:
                                                      instancePath +
                                                      '/choices/' +
                                                      key3.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                    schemaPath:
                                                      '#/properties/choices/patternProperties/.%2B/additionalProperties',
                                                    keyword: 'additionalProperties',
                                                    params: {
                                                      additionalProperty: key4,
                                                    },
                                                    message: 'must NOT have additional properties',
                                                  },
                                                ];
                                                return false;
                                                break;
                                              }
                                            }
                                            if (_errs37 === errors) {
                                              if (data13.label !== undefined) {
                                                const _errs38 = errors;
                                                if (typeof data13.label !== 'string') {
                                                  validate53.errors = [
                                                    {
                                                      instancePath:
                                                        instancePath +
                                                        '/choices/' +
                                                        key3.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                        '/label',
                                                      schemaPath:
                                                        '#/properties/choices/patternProperties/.%2B/properties/label/type',
                                                      keyword: 'type',
                                                      params: {
                                                        type: 'string',
                                                      },
                                                      message: 'must be string',
                                                    },
                                                  ];
                                                  return false;
                                                }
                                                var valid8 = _errs38 === errors;
                                              } else {
                                                var valid8 = true;
                                              }
                                              if (valid8) {
                                                if (data13.options !== undefined) {
                                                  let data15 = data13.options;
                                                  const _errs40 = errors;
                                                  if (errors === _errs40) {
                                                    if (data15 && typeof data15 == 'object' && !Array.isArray(data15)) {
                                                      const _errs42 = errors;
                                                      for (const key5 in data15) {
                                                        if (!pattern4.test(key5)) {
                                                          validate53.errors = [
                                                            {
                                                              instancePath:
                                                                instancePath +
                                                                '/choices/' +
                                                                key3.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                                '/options',
                                                              schemaPath:
                                                                '#/properties/choices/patternProperties/.%2B/properties/options/additionalProperties',
                                                              keyword: 'additionalProperties',
                                                              params: {
                                                                additionalProperty: key5,
                                                              },
                                                              message: 'must NOT have additional properties',
                                                            },
                                                          ];
                                                          return false;
                                                          break;
                                                        }
                                                      }
                                                      if (_errs42 === errors) {
                                                        var valid9 = true;
                                                        for (const key6 in data15) {
                                                          if (pattern4.test(key6)) {
                                                            const _errs43 = errors;
                                                            if (typeof data15[key6] !== 'string') {
                                                              validate53.errors = [
                                                                {
                                                                  instancePath:
                                                                    instancePath +
                                                                    '/choices/' +
                                                                    key3.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                                    '/options/' +
                                                                    key6.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                                  schemaPath:
                                                                    '#/properties/choices/patternProperties/.%2B/properties/options/patternProperties/.%2B/type',
                                                                  keyword: 'type',
                                                                  params: {
                                                                    type: 'string',
                                                                  },
                                                                  message: 'must be string',
                                                                },
                                                              ];
                                                              return false;
                                                            }
                                                            var valid9 = _errs43 === errors;
                                                            if (!valid9) {
                                                              break;
                                                            }
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      validate53.errors = [
                                                        {
                                                          instancePath:
                                                            instancePath +
                                                            '/choices/' +
                                                            key3.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                            '/options',
                                                          schemaPath:
                                                            '#/properties/choices/patternProperties/.%2B/properties/options/type',
                                                          keyword: 'type',
                                                          params: {
                                                            type: 'object',
                                                          },
                                                          message: 'must be object',
                                                        },
                                                      ];
                                                      return false;
                                                    }
                                                  }
                                                  var valid8 = _errs40 === errors;
                                                } else {
                                                  var valid8 = true;
                                                }
                                                if (valid8) {
                                                  if (data13.conditional !== undefined) {
                                                    let data17 = data13.conditional;
                                                    const _errs45 = errors;
                                                    if (errors === _errs45) {
                                                      if (
                                                        data17 &&
                                                        typeof data17 == 'object' &&
                                                        !Array.isArray(data17)
                                                      ) {
                                                        const _errs47 = errors;
                                                        for (const key7 in data17) {
                                                          if (!pattern4.test(key7)) {
                                                            validate53.errors = [
                                                              {
                                                                instancePath:
                                                                  instancePath +
                                                                  '/choices/' +
                                                                  key3.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                                  '/conditional',
                                                                schemaPath:
                                                                  '#/properties/choices/patternProperties/.%2B/properties/conditional/additionalProperties',
                                                                keyword: 'additionalProperties',
                                                                params: {
                                                                  additionalProperty: key7,
                                                                },
                                                                message: 'must NOT have additional properties',
                                                              },
                                                            ];
                                                            return false;
                                                            break;
                                                          }
                                                        }
                                                        if (_errs47 === errors) {
                                                          var valid10 = true;
                                                          for (const key8 in data17) {
                                                            if (pattern4.test(key8)) {
                                                              const _errs48 = errors;
                                                              if (typeof data17[key8] !== 'string') {
                                                                validate53.errors = [
                                                                  {
                                                                    instancePath:
                                                                      instancePath +
                                                                      '/choices/' +
                                                                      key3.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                                      '/conditional/' +
                                                                      key8.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                                    schemaPath:
                                                                      '#/properties/choices/patternProperties/.%2B/properties/conditional/patternProperties/.%2B/type',
                                                                    keyword: 'type',
                                                                    params: {
                                                                      type: 'string',
                                                                    },
                                                                    message: 'must be string',
                                                                  },
                                                                ];
                                                                return false;
                                                              }
                                                              var valid10 = _errs48 === errors;
                                                              if (!valid10) {
                                                                break;
                                                              }
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        validate53.errors = [
                                                          {
                                                            instancePath:
                                                              instancePath +
                                                              '/choices/' +
                                                              key3.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                              '/conditional',
                                                            schemaPath:
                                                              '#/properties/choices/patternProperties/.%2B/properties/conditional/type',
                                                            keyword: 'type',
                                                            params: {
                                                              type: 'object',
                                                            },
                                                            message: 'must be object',
                                                          },
                                                        ];
                                                        return false;
                                                      }
                                                    }
                                                    var valid8 = _errs45 === errors;
                                                  } else {
                                                    var valid8 = true;
                                                  }
                                                  if (valid8) {
                                                    if (data13.group !== undefined) {
                                                      const _errs50 = errors;
                                                      if (typeof data13.group !== 'string') {
                                                        validate53.errors = [
                                                          {
                                                            instancePath:
                                                              instancePath +
                                                              '/choices/' +
                                                              key3.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                              '/group',
                                                            schemaPath:
                                                              '#/properties/choices/patternProperties/.%2B/properties/group/type',
                                                            keyword: 'type',
                                                            params: {
                                                              type: 'string',
                                                            },
                                                            message: 'must be string',
                                                          },
                                                        ];
                                                        return false;
                                                      }
                                                      var valid8 = _errs50 === errors;
                                                    } else {
                                                      var valid8 = true;
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          } else {
                                            validate53.errors = [
                                              {
                                                instancePath:
                                                  instancePath +
                                                  '/choices/' +
                                                  key3.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                schemaPath: '#/properties/choices/patternProperties/.%2B/type',
                                                keyword: 'type',
                                                params: { type: 'object' },
                                                message: 'must be object',
                                              },
                                            ];
                                            return false;
                                          }
                                        }
                                        var valid7 = _errs35 === errors;
                                        if (!valid7) {
                                          break;
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  validate53.errors = [
                                    {
                                      instancePath: instancePath + '/choices',
                                      schemaPath: '#/properties/choices/type',
                                      keyword: 'type',
                                      params: { type: 'object' },
                                      message: 'must be object',
                                    },
                                  ];
                                  return false;
                                }
                              }
                              var valid0 = _errs32 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.require !== undefined) {
                                const _errs52 = errors;
                                if (
                                  !validate40(data.require, {
                                    instancePath: instancePath + '/require',
                                    parentData: data,
                                    parentDataProperty: 'require',
                                    rootData,
                                    dynamicAnchors,
                                  })
                                ) {
                                  vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
                                  errors = vErrors.length;
                                }
                                var valid0 = _errs52 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.disallow !== undefined) {
                                  const _errs53 = errors;
                                  if (
                                    !validate40(data.disallow, {
                                      instancePath: instancePath + '/disallow',
                                      parentData: data,
                                      parentDataProperty: 'disallow',
                                      rootData,
                                      dynamicAnchors,
                                    })
                                  ) {
                                    vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
                                    errors = vErrors.length;
                                  }
                                  var valid0 = _errs53 === errors;
                                } else {
                                  var valid0 = true;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate53.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate53.errors = vErrors;
  return errors === 0;
}
validate53.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
function validate52(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate52.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if ((data.type === undefined && (missing0 = 'type')) || (data.spells === undefined && (missing0 = 'spells'))) {
        validate52.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'spells')) {
            validate52.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('ChooseSpell' !== data.type) {
              validate52.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'ChooseSpell' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.spells !== undefined) {
              let data1 = data.spells;
              const _errs3 = errors;
              const _errs4 = errors;
              let valid1 = false;
              let passing0 = null;
              const _errs5 = errors;
              if (typeof data1 !== 'string') {
                const err0 = {
                  instancePath: instancePath + '/spells',
                  schemaPath: '#/properties/spells/oneOf/0/type',
                  keyword: 'type',
                  params: { type: 'string' },
                  message: 'must be string',
                };
                if (vErrors === null) {
                  vErrors = [err0];
                } else {
                  vErrors.push(err0);
                }
                errors++;
              }
              var _valid0 = _errs5 === errors;
              if (_valid0) {
                valid1 = true;
                passing0 = 0;
              }
              const _errs7 = errors;
              if (errors === _errs7) {
                if (data1 && typeof data1 == 'object' && !Array.isArray(data1)) {
                  if (Object.keys(data1).length < 1) {
                    const err1 = {
                      instancePath: instancePath + '/spells',
                      schemaPath: '#/properties/spells/oneOf/1/minProperties',
                      keyword: 'minProperties',
                      params: { limit: 1 },
                      message: 'must NOT have fewer than 1 properties',
                    };
                    if (vErrors === null) {
                      vErrors = [err1];
                    } else {
                      vErrors.push(err1);
                    }
                    errors++;
                  } else {
                    const _errs9 = errors;
                    for (const key1 in data1) {
                      if (!pattern4.test(key1)) {
                        const err2 = {
                          instancePath: instancePath + '/spells',
                          schemaPath: '#/properties/spells/oneOf/1/additionalProperties',
                          keyword: 'additionalProperties',
                          params: { additionalProperty: key1 },
                          message: 'must NOT have additional properties',
                        };
                        if (vErrors === null) {
                          vErrors = [err2];
                        } else {
                          vErrors.push(err2);
                        }
                        errors++;
                        break;
                      }
                    }
                    if (_errs9 === errors) {
                      var valid2 = true;
                      for (const key2 in data1) {
                        if (pattern4.test(key2)) {
                          const _errs10 = errors;
                          if (
                            !validate53(data1[key2], {
                              instancePath: instancePath + '/spells/' + key2.replace(/~/g, '~0').replace(/\//g, '~1'),
                              parentData: data1,
                              parentDataProperty: key2,
                              rootData,
                              dynamicAnchors,
                            })
                          ) {
                            vErrors = vErrors === null ? validate53.errors : vErrors.concat(validate53.errors);
                            errors = vErrors.length;
                          }
                          var valid2 = _errs10 === errors;
                          if (!valid2) {
                            break;
                          }
                        }
                      }
                    }
                  }
                } else {
                  const err3 = {
                    instancePath: instancePath + '/spells',
                    schemaPath: '#/properties/spells/oneOf/1/type',
                    keyword: 'type',
                    params: { type: 'object' },
                    message: 'must be object',
                  };
                  if (vErrors === null) {
                    vErrors = [err3];
                  } else {
                    vErrors.push(err3);
                  }
                  errors++;
                }
              }
              var _valid0 = _errs7 === errors;
              if (_valid0 && valid1) {
                valid1 = false;
                passing0 = [passing0, 1];
              } else {
                if (_valid0) {
                  valid1 = true;
                  passing0 = 1;
                }
              }
              if (!valid1) {
                const err4 = {
                  instancePath: instancePath + '/spells',
                  schemaPath: '#/properties/spells/oneOf',
                  keyword: 'oneOf',
                  params: { passingSchemas: passing0 },
                  message: 'must match exactly one schema in oneOf',
                };
                if (vErrors === null) {
                  vErrors = [err4];
                } else {
                  vErrors.push(err4);
                }
                errors++;
                validate52.errors = vErrors;
                return false;
              } else {
                errors = _errs4;
                if (vErrors !== null) {
                  if (_errs4) {
                    vErrors.length = _errs4;
                  } else {
                    vErrors = null;
                  }
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate52.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate52.errors = vErrors;
  return errors === 0;
}
validate52.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
function validate29(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate29.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  const _errs0 = errors;
  let valid0 = false;
  const _errs1 = errors;
  if (
    !validate30(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
      dynamicAnchors,
    })
  ) {
    vErrors = vErrors === null ? validate30.errors : vErrors.concat(validate30.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs1 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    var props0 = true;
  }
  const _errs2 = errors;
  if (
    !validate32(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
      dynamicAnchors,
    })
  ) {
    vErrors = vErrors === null ? validate32.errors : vErrors.concat(validate32.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  const _errs3 = errors;
  if (
    !validate34(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
      dynamicAnchors,
    })
  ) {
    vErrors = vErrors === null ? validate34.errors : vErrors.concat(validate34.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs3 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  const _errs4 = errors;
  if (
    !validate36(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
      dynamicAnchors,
    })
  ) {
    vErrors = vErrors === null ? validate36.errors : vErrors.concat(validate36.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs4 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  const _errs5 = errors;
  const _errs6 = errors;
  if (errors === _errs6) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (data.type === undefined && (missing0 = 'type')) {
        const err0 = {
          instancePath,
          schemaPath: '#/$defs/UpgradeResToAbs/required',
          keyword: 'required',
          params: { missingProperty: missing0 },
          message: "must have required property '" + missing0 + "'",
        };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      } else {
        const _errs8 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type')) {
            const err1 = {
              instancePath,
              schemaPath: '#/$defs/UpgradeResToAbs/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key0 },
              message: 'must NOT have additional properties',
            };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
            break;
          }
        }
        if (_errs8 === errors) {
          if (data.type !== undefined) {
            if ('UpgradeResToAbs' !== data.type) {
              const err2 = {
                instancePath: instancePath + '/type',
                schemaPath: '#/$defs/UpgradeResToAbs/properties/type/const',
                keyword: 'const',
                params: { allowedValue: 'UpgradeResToAbs' },
                message: 'must be equal to constant',
              };
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
          }
        }
      }
    } else {
      const err3 = {
        instancePath,
        schemaPath: '#/$defs/UpgradeResToAbs/type',
        keyword: 'type',
        params: { type: 'object' },
        message: 'must be object',
      };
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
  }
  var _valid0 = _errs5 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  const _errs10 = errors;
  const _errs11 = errors;
  if (errors === _errs11) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing1;
      if (data.type === undefined && (missing1 = 'type')) {
        const err4 = {
          instancePath,
          schemaPath: '#/$defs/UpgradeImmToAbs/required',
          keyword: 'required',
          params: { missingProperty: missing1 },
          message: "must have required property '" + missing1 + "'",
        };
        if (vErrors === null) {
          vErrors = [err4];
        } else {
          vErrors.push(err4);
        }
        errors++;
      } else {
        const _errs13 = errors;
        for (const key1 in data) {
          if (!(key1 === 'type')) {
            const err5 = {
              instancePath,
              schemaPath: '#/$defs/UpgradeImmToAbs/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key1 },
              message: 'must NOT have additional properties',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
            break;
          }
        }
        if (_errs13 === errors) {
          if (data.type !== undefined) {
            if ('UpgradeImmToAbs' !== data.type) {
              const err6 = {
                instancePath: instancePath + '/type',
                schemaPath: '#/$defs/UpgradeImmToAbs/properties/type/const',
                keyword: 'const',
                params: { allowedValue: 'UpgradeImmToAbs' },
                message: 'must be equal to constant',
              };
              if (vErrors === null) {
                vErrors = [err6];
              } else {
                vErrors.push(err6);
              }
              errors++;
            }
          }
        }
      }
    } else {
      const err7 = {
        instancePath,
        schemaPath: '#/$defs/UpgradeImmToAbs/type',
        keyword: 'type',
        params: { type: 'object' },
        message: 'must be object',
      };
      if (vErrors === null) {
        vErrors = [err7];
      } else {
        vErrors.push(err7);
      }
      errors++;
    }
  }
  var _valid0 = _errs10 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  const _errs15 = errors;
  const _errs16 = errors;
  if (errors === _errs16) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing2;
      if (data.type === undefined && (missing2 = 'type')) {
        const err8 = {
          instancePath,
          schemaPath: '#/$defs/AssignStatusImmunity/required',
          keyword: 'required',
          params: { missingProperty: missing2 },
          message: "must have required property '" + missing2 + "'",
        };
        if (vErrors === null) {
          vErrors = [err8];
        } else {
          vErrors.push(err8);
        }
        errors++;
      } else {
        const _errs18 = errors;
        for (const key2 in data) {
          if (!(key2 === 'type' || key2 === 'options')) {
            const err9 = {
              instancePath,
              schemaPath: '#/$defs/AssignStatusImmunity/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key2 },
              message: 'must NOT have additional properties',
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
            break;
          }
        }
        if (_errs18 === errors) {
          if (data.type !== undefined) {
            const _errs19 = errors;
            if ('AssignStatusImmunity' !== data.type) {
              const err10 = {
                instancePath: instancePath + '/type',
                schemaPath: '#/$defs/AssignStatusImmunity/properties/type/const',
                keyword: 'const',
                params: { allowedValue: 'AssignStatusImmunity' },
                message: 'must be equal to constant',
              };
              if (vErrors === null) {
                vErrors = [err10];
              } else {
                vErrors.push(err10);
              }
              errors++;
            }
            var valid6 = _errs19 === errors;
          } else {
            var valid6 = true;
          }
          if (valid6) {
            if (data.options !== undefined) {
              let data3 = data.options;
              const _errs20 = errors;
              if (errors === _errs20) {
                if (Array.isArray(data3)) {
                  var valid7 = true;
                  const len0 = data3.length;
                  for (let i0 = 0; i0 < len0; i0++) {
                    let data4 = data3[i0];
                    const _errs22 = errors;
                    if (
                      !(
                        data4 === 'dazed' ||
                        data4 === 'shaken' ||
                        data4 === 'slow' ||
                        data4 === 'weak' ||
                        data4 === 'enraged' ||
                        data4 === 'poisoned'
                      )
                    ) {
                      const err11 = {
                        instancePath: instancePath + '/options/' + i0,
                        schemaPath: '#/$defs/AssignStatusImmunity/properties/options/items/enum',
                        keyword: 'enum',
                        params: {
                          allowedValues: schema63.properties.options.items.enum,
                        },
                        message: 'must be equal to one of the allowed values',
                      };
                      if (vErrors === null) {
                        vErrors = [err11];
                      } else {
                        vErrors.push(err11);
                      }
                      errors++;
                    }
                    var valid7 = _errs22 === errors;
                    if (!valid7) {
                      break;
                    }
                  }
                } else {
                  const err12 = {
                    instancePath: instancePath + '/options',
                    schemaPath: '#/$defs/AssignStatusImmunity/properties/options/type',
                    keyword: 'type',
                    params: { type: 'array' },
                    message: 'must be array',
                  };
                  if (vErrors === null) {
                    vErrors = [err12];
                  } else {
                    vErrors.push(err12);
                  }
                  errors++;
                }
              }
              var valid6 = _errs20 === errors;
            } else {
              var valid6 = true;
            }
          }
        }
      }
    } else {
      const err13 = {
        instancePath,
        schemaPath: '#/$defs/AssignStatusImmunity/type',
        keyword: 'type',
        params: { type: 'object' },
        message: 'must be object',
      };
      if (vErrors === null) {
        vErrors = [err13];
      } else {
        vErrors.push(err13);
      }
      errors++;
    }
  }
  var _valid0 = _errs15 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  const _errs23 = errors;
  if (
    !validate38(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
      dynamicAnchors,
    })
  ) {
    vErrors = vErrors === null ? validate38.errors : vErrors.concat(validate38.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs23 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  const _errs24 = errors;
  if (
    !validate46(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
      dynamicAnchors,
    })
  ) {
    vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs24 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  const _errs25 = errors;
  if (
    !validate49(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
      dynamicAnchors,
    })
  ) {
    vErrors = vErrors === null ? validate49.errors : vErrors.concat(validate49.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs25 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  const _errs26 = errors;
  if (
    !validate52(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
      dynamicAnchors,
    })
  ) {
    vErrors = vErrors === null ? validate52.errors : vErrors.concat(validate52.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs26 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  const _errs27 = errors;
  const _errs28 = errors;
  if (errors === _errs28) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing3;
      if (data.type === undefined && (missing3 = 'type')) {
        const err14 = {
          instancePath,
          schemaPath: '#/$defs/ChooseRoleSkill/required',
          keyword: 'required',
          params: { missingProperty: missing3 },
          message: "must have required property '" + missing3 + "'",
        };
        if (vErrors === null) {
          vErrors = [err14];
        } else {
          vErrors.push(err14);
        }
        errors++;
      } else {
        const _errs30 = errors;
        for (const key3 in data) {
          if (!(key3 === 'type')) {
            const err15 = {
              instancePath,
              schemaPath: '#/$defs/ChooseRoleSkill/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key3 },
              message: 'must NOT have additional properties',
            };
            if (vErrors === null) {
              vErrors = [err15];
            } else {
              vErrors.push(err15);
            }
            errors++;
            break;
          }
        }
        if (_errs30 === errors) {
          if (data.type !== undefined) {
            if ('ChooseRoleSkill' !== data.type) {
              const err16 = {
                instancePath: instancePath + '/type',
                schemaPath: '#/$defs/ChooseRoleSkill/properties/type/const',
                keyword: 'const',
                params: { allowedValue: 'ChooseRoleSkill' },
                message: 'must be equal to constant',
              };
              if (vErrors === null) {
                vErrors = [err16];
              } else {
                vErrors.push(err16);
              }
              errors++;
            }
          }
        }
      }
    } else {
      const err17 = {
        instancePath,
        schemaPath: '#/$defs/ChooseRoleSkill/type',
        keyword: 'type',
        params: { type: 'object' },
        message: 'must be object',
      };
      if (vErrors === null) {
        vErrors = [err17];
      } else {
        vErrors.push(err17);
      }
      errors++;
    }
  }
  var _valid0 = _errs27 === errors;
  valid0 = valid0 || _valid0;
  if (_valid0) {
    if (props0 !== true) {
      props0 = true;
    }
  }
  if (!valid0) {
    const err18 = {
      instancePath,
      schemaPath: '#/anyOf',
      keyword: 'anyOf',
      params: {},
      message: 'must match a schema in anyOf',
    };
    if (vErrors === null) {
      vErrors = [err18];
    } else {
      vErrors.push(err18);
    }
    errors++;
    validate29.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate29.errors = vErrors;
  evaluated0.props = props0;
  return errors === 0;
}
validate29.evaluated = { dynamicProps: true, dynamicItems: false };
function validate22(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate22.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      const _errs1 = errors;
      for (const key0 in data) {
        if (!(key0 === 'model' || key0 === 'steps' || key0 === 'conditional')) {
          validate22.errors = [
            {
              instancePath,
              schemaPath: '#/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key0 },
              message: 'must NOT have additional properties',
            },
          ];
          return false;
          break;
        }
      }
      if (_errs1 === errors) {
        if (data.model !== undefined) {
          const _errs2 = errors;
          if (
            !validate23(data.model, {
              instancePath: instancePath + '/model',
              parentData: data,
              parentDataProperty: 'model',
              rootData,
              dynamicAnchors,
            })
          ) {
            vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
            errors = vErrors.length;
          }
          var valid0 = _errs2 === errors;
        } else {
          var valid0 = true;
        }
        if (valid0) {
          if (data.steps !== undefined) {
            let data1 = data.steps;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (Array.isArray(data1)) {
                var valid1 = true;
                const len0 = data1.length;
                for (let i0 = 0; i0 < len0; i0++) {
                  const _errs5 = errors;
                  if (
                    !validate29(data1[i0], {
                      instancePath: instancePath + '/steps/' + i0,
                      parentData: data1,
                      parentDataProperty: i0,
                      rootData,
                      dynamicAnchors,
                    })
                  ) {
                    vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
                    errors = vErrors.length;
                  }
                  var valid1 = _errs5 === errors;
                  if (!valid1) {
                    break;
                  }
                }
              } else {
                validate22.errors = [
                  {
                    instancePath: instancePath + '/steps',
                    schemaPath: '#/properties/steps/type',
                    keyword: 'type',
                    params: { type: 'array' },
                    message: 'must be array',
                  },
                ];
                return false;
              }
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.conditional !== undefined) {
              let data3 = data.conditional;
              const _errs6 = errors;
              if (errors === _errs6) {
                if (Array.isArray(data3)) {
                  var valid2 = true;
                  const len1 = data3.length;
                  for (let i1 = 0; i1 < len1; i1++) {
                    let data4 = data3[i1];
                    const _errs8 = errors;
                    if (errors === _errs8) {
                      if (data4 && typeof data4 == 'object' && !Array.isArray(data4)) {
                        let missing0;
                        if (
                          (data4.choice === undefined && (missing0 = 'choice')) ||
                          (data4.values === undefined && (missing0 = 'values')) ||
                          (data4.changes === undefined && (missing0 = 'changes'))
                        ) {
                          validate22.errors = [
                            {
                              instancePath: instancePath + '/conditional/' + i1,
                              schemaPath: '#/properties/conditional/items/required',
                              keyword: 'required',
                              params: { missingProperty: missing0 },
                              message: "must have required property '" + missing0 + "'",
                            },
                          ];
                          return false;
                        } else {
                          const _errs10 = errors;
                          for (const key1 in data4) {
                            if (!(key1 === 'choice' || key1 === 'values' || key1 === 'changes')) {
                              validate22.errors = [
                                {
                                  instancePath: instancePath + '/conditional/' + i1,
                                  schemaPath: '#/properties/conditional/items/additionalProperties',
                                  keyword: 'additionalProperties',
                                  params: { additionalProperty: key1 },
                                  message: 'must NOT have additional properties',
                                },
                              ];
                              return false;
                              break;
                            }
                          }
                          if (_errs10 === errors) {
                            if (data4.choice !== undefined) {
                              const _errs11 = errors;
                              if (typeof data4.choice !== 'string') {
                                validate22.errors = [
                                  {
                                    instancePath: instancePath + '/conditional/' + i1 + '/choice',
                                    schemaPath: '#/properties/conditional/items/properties/choice/type',
                                    keyword: 'type',
                                    params: { type: 'string' },
                                    message: 'must be string',
                                  },
                                ];
                                return false;
                              }
                              var valid3 = _errs11 === errors;
                            } else {
                              var valid3 = true;
                            }
                            if (valid3) {
                              if (data4.values !== undefined) {
                                let data6 = data4.values;
                                const _errs13 = errors;
                                if (errors === _errs13) {
                                  if (Array.isArray(data6)) {
                                    if (data6.length < 1) {
                                      validate22.errors = [
                                        {
                                          instancePath: instancePath + '/conditional/' + i1 + '/values',
                                          schemaPath: '#/properties/conditional/items/properties/values/minItems',
                                          keyword: 'minItems',
                                          params: { limit: 1 },
                                          message: 'must NOT have fewer than 1 items',
                                        },
                                      ];
                                      return false;
                                    } else {
                                      var valid4 = true;
                                      const len2 = data6.length;
                                      for (let i2 = 0; i2 < len2; i2++) {
                                        const _errs15 = errors;
                                        if (typeof data6[i2] !== 'string') {
                                          validate22.errors = [
                                            {
                                              instancePath: instancePath + '/conditional/' + i1 + '/values/' + i2,
                                              schemaPath: '#/properties/conditional/items/properties/values/items/type',
                                              keyword: 'type',
                                              params: { type: 'string' },
                                              message: 'must be string',
                                            },
                                          ];
                                          return false;
                                        }
                                        var valid4 = _errs15 === errors;
                                        if (!valid4) {
                                          break;
                                        }
                                      }
                                    }
                                  } else {
                                    validate22.errors = [
                                      {
                                        instancePath: instancePath + '/conditional/' + i1 + '/values',
                                        schemaPath: '#/properties/conditional/items/properties/values/type',
                                        keyword: 'type',
                                        params: { type: 'array' },
                                        message: 'must be array',
                                      },
                                    ];
                                    return false;
                                  }
                                }
                                var valid3 = _errs13 === errors;
                              } else {
                                var valid3 = true;
                              }
                              if (valid3) {
                                if (data4.changes !== undefined) {
                                  let data8 = data4.changes;
                                  const _errs17 = errors;
                                  if (errors === _errs17) {
                                    if (data8 && typeof data8 == 'object' && !Array.isArray(data8)) {
                                      const _errs19 = errors;
                                      for (const key2 in data8) {
                                        if (!(key2 === 'model' || key2 === 'steps')) {
                                          validate22.errors = [
                                            {
                                              instancePath: instancePath + '/conditional/' + i1 + '/changes',
                                              schemaPath:
                                                '#/properties/conditional/items/properties/changes/additionalProperties',
                                              keyword: 'additionalProperties',
                                              params: {
                                                additionalProperty: key2,
                                              },
                                              message: 'must NOT have additional properties',
                                            },
                                          ];
                                          return false;
                                          break;
                                        }
                                      }
                                      if (_errs19 === errors) {
                                        if (data8.model !== undefined) {
                                          const _errs20 = errors;
                                          if (
                                            !validate23(data8.model, {
                                              instancePath: instancePath + '/conditional/' + i1 + '/changes/model',
                                              parentData: data8,
                                              parentDataProperty: 'model',
                                              rootData,
                                              dynamicAnchors,
                                            })
                                          ) {
                                            vErrors =
                                              vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
                                            errors = vErrors.length;
                                          }
                                          var valid5 = _errs20 === errors;
                                        } else {
                                          var valid5 = true;
                                        }
                                        if (valid5) {
                                          if (data8.steps !== undefined) {
                                            let data10 = data8.steps;
                                            const _errs21 = errors;
                                            if (errors === _errs21) {
                                              if (Array.isArray(data10)) {
                                                var valid6 = true;
                                                const len3 = data10.length;
                                                for (let i3 = 0; i3 < len3; i3++) {
                                                  const _errs23 = errors;
                                                  if (
                                                    !validate29(data10[i3], {
                                                      instancePath:
                                                        instancePath + '/conditional/' + i1 + '/changes/steps/' + i3,
                                                      parentData: data10,
                                                      parentDataProperty: i3,
                                                      rootData,
                                                      dynamicAnchors,
                                                    })
                                                  ) {
                                                    vErrors =
                                                      vErrors === null
                                                        ? validate29.errors
                                                        : vErrors.concat(validate29.errors);
                                                    errors = vErrors.length;
                                                  }
                                                  var valid6 = _errs23 === errors;
                                                  if (!valid6) {
                                                    break;
                                                  }
                                                }
                                              } else {
                                                validate22.errors = [
                                                  {
                                                    instancePath:
                                                      instancePath + '/conditional/' + i1 + '/changes/steps',
                                                    schemaPath:
                                                      '#/properties/conditional/items/properties/changes/properties/steps/type',
                                                    keyword: 'type',
                                                    params: { type: 'array' },
                                                    message: 'must be array',
                                                  },
                                                ];
                                                return false;
                                              }
                                            }
                                            var valid5 = _errs21 === errors;
                                          } else {
                                            var valid5 = true;
                                          }
                                        }
                                      }
                                    } else {
                                      validate22.errors = [
                                        {
                                          instancePath: instancePath + '/conditional/' + i1 + '/changes',
                                          schemaPath: '#/properties/conditional/items/properties/changes/type',
                                          keyword: 'type',
                                          params: { type: 'object' },
                                          message: 'must be object',
                                        },
                                      ];
                                      return false;
                                    }
                                  }
                                  var valid3 = _errs17 === errors;
                                } else {
                                  var valid3 = true;
                                }
                              }
                            }
                          }
                        }
                      } else {
                        validate22.errors = [
                          {
                            instancePath: instancePath + '/conditional/' + i1,
                            schemaPath: '#/properties/conditional/items/type',
                            keyword: 'type',
                            params: { type: 'object' },
                            message: 'must be object',
                          },
                        ];
                        return false;
                      }
                    }
                    var valid2 = _errs8 === errors;
                    if (!valid2) {
                      break;
                    }
                  }
                } else {
                  validate22.errors = [
                    {
                      instancePath: instancePath + '/conditional',
                      schemaPath: '#/properties/conditional/type',
                      keyword: 'type',
                      params: { type: 'array' },
                      message: 'must be array',
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs6 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate22.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate22.errors = vErrors;
  return errors === 0;
}
validate22.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
function validate21(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate21.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if ((data.type === undefined && (missing0 = 'type')) || (data.species === undefined && (missing0 = 'species'))) {
        validate21.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'species')) {
            validate21.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('species' !== data.type) {
              validate21.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'species' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.species !== undefined) {
              let data1 = data.species;
              const _errs3 = errors;
              if (errors === _errs3) {
                if (data1 && typeof data1 == 'object' && !Array.isArray(data1)) {
                  let missing1;
                  if (
                    (data1.name === undefined && (missing1 = 'name')) ||
                    (data1.npcSpecies === undefined && (missing1 = 'npcSpecies')) ||
                    (data1.changes === undefined && (missing1 = 'changes')) ||
                    (data1.customizationCount === undefined && (missing1 = 'customizationCount')) ||
                    (data1.customizationOptions === undefined && (missing1 = 'customizationOptions'))
                  ) {
                    validate21.errors = [
                      {
                        instancePath: instancePath + '/species',
                        schemaPath: '#/properties/species/required',
                        keyword: 'required',
                        params: { missingProperty: missing1 },
                        message: "must have required property '" + missing1 + "'",
                      },
                    ];
                    return false;
                  } else {
                    const _errs5 = errors;
                    for (const key1 in data1) {
                      if (
                        !(
                          key1 === 'name' ||
                          key1 === 'npcSpecies' ||
                          key1 === 'changes' ||
                          key1 === 'customizationCount' ||
                          key1 === 'customizationOptions' ||
                          key1 === 'spellLists'
                        )
                      ) {
                        validate21.errors = [
                          {
                            instancePath: instancePath + '/species',
                            schemaPath: '#/properties/species/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key1 },
                            message: 'must NOT have additional properties',
                          },
                        ];
                        return false;
                        break;
                      }
                    }
                    if (_errs5 === errors) {
                      if (data1.name !== undefined) {
                        const _errs6 = errors;
                        if (typeof data1.name !== 'string') {
                          validate21.errors = [
                            {
                              instancePath: instancePath + '/species/name',
                              schemaPath: '#/properties/species/properties/name/type',
                              keyword: 'type',
                              params: { type: 'string' },
                              message: 'must be string',
                            },
                          ];
                          return false;
                        }
                        var valid1 = _errs6 === errors;
                      } else {
                        var valid1 = true;
                      }
                      if (valid1) {
                        if (data1.npcSpecies !== undefined) {
                          let data3 = data1.npcSpecies;
                          const _errs8 = errors;
                          if (
                            !(
                              data3 === 'beast' ||
                              data3 === 'construct' ||
                              data3 === 'demon' ||
                              data3 === 'elemental' ||
                              data3 === 'humanoid' ||
                              data3 === 'monster' ||
                              data3 === 'plant' ||
                              data3 === 'undead'
                            )
                          ) {
                            validate21.errors = [
                              {
                                instancePath: instancePath + '/species/npcSpecies',
                                schemaPath: '#/properties/species/properties/npcSpecies/enum',
                                keyword: 'enum',
                                params: {
                                  allowedValues: schema32.properties.species.properties.npcSpecies.enum,
                                },
                                message: 'must be equal to one of the allowed values',
                              },
                            ];
                            return false;
                          }
                          var valid1 = _errs8 === errors;
                        } else {
                          var valid1 = true;
                        }
                        if (valid1) {
                          if (data1.changes !== undefined) {
                            const _errs9 = errors;
                            if (
                              !validate22(data1.changes, {
                                instancePath: instancePath + '/species/changes',
                                parentData: data1,
                                parentDataProperty: 'changes',
                                rootData,
                                dynamicAnchors,
                              })
                            ) {
                              vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
                              errors = vErrors.length;
                            }
                            var valid1 = _errs9 === errors;
                          } else {
                            var valid1 = true;
                          }
                          if (valid1) {
                            if (data1.customizationCount !== undefined) {
                              let data5 = data1.customizationCount;
                              const _errs10 = errors;
                              if (!(typeof data5 == 'number' && isFinite(data5))) {
                                validate21.errors = [
                                  {
                                    instancePath: instancePath + '/species/customizationCount',
                                    schemaPath: '#/properties/species/properties/customizationCount/type',
                                    keyword: 'type',
                                    params: { type: 'number' },
                                    message: 'must be number',
                                  },
                                ];
                                return false;
                              }
                              var valid1 = _errs10 === errors;
                            } else {
                              var valid1 = true;
                            }
                            if (valid1) {
                              if (data1.customizationOptions !== undefined) {
                                let data6 = data1.customizationOptions;
                                const _errs12 = errors;
                                if (errors === _errs12) {
                                  if (data6 && typeof data6 == 'object' && !Array.isArray(data6)) {
                                    const _errs14 = errors;
                                    for (const key2 in data6) {
                                      if (!pattern4.test(key2)) {
                                        validate21.errors = [
                                          {
                                            instancePath: instancePath + '/species/customizationOptions',
                                            schemaPath:
                                              '#/properties/species/properties/customizationOptions/additionalProperties',
                                            keyword: 'additionalProperties',
                                            params: {
                                              additionalProperty: key2,
                                            },
                                            message: 'must NOT have additional properties',
                                          },
                                        ];
                                        return false;
                                        break;
                                      }
                                    }
                                    if (_errs14 === errors) {
                                      var valid2 = true;
                                      for (const key3 in data6) {
                                        if (pattern4.test(key3)) {
                                          const _errs15 = errors;
                                          if (
                                            !validate39(data6[key3], {
                                              instancePath:
                                                instancePath +
                                                '/species/customizationOptions/' +
                                                key3.replace(/~/g, '~0').replace(/\//g, '~1'),
                                              parentData: data6,
                                              parentDataProperty: key3,
                                              rootData,
                                              dynamicAnchors,
                                            })
                                          ) {
                                            vErrors =
                                              vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
                                            errors = vErrors.length;
                                          }
                                          var valid2 = _errs15 === errors;
                                          if (!valid2) {
                                            break;
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    validate21.errors = [
                                      {
                                        instancePath: instancePath + '/species/customizationOptions',
                                        schemaPath: '#/properties/species/properties/customizationOptions/type',
                                        keyword: 'type',
                                        params: { type: 'object' },
                                        message: 'must be object',
                                      },
                                    ];
                                    return false;
                                  }
                                }
                                var valid1 = _errs12 === errors;
                              } else {
                                var valid1 = true;
                              }
                              if (valid1) {
                                if (data1.spellLists !== undefined) {
                                  let data8 = data1.spellLists;
                                  const _errs16 = errors;
                                  if (errors === _errs16) {
                                    if (data8 && typeof data8 == 'object' && !Array.isArray(data8)) {
                                      const _errs18 = errors;
                                      for (const key4 in data8) {
                                        if (!pattern4.test(key4)) {
                                          validate21.errors = [
                                            {
                                              instancePath: instancePath + '/species/spellLists',
                                              schemaPath:
                                                '#/properties/species/properties/spellLists/additionalProperties',
                                              keyword: 'additionalProperties',
                                              params: {
                                                additionalProperty: key4,
                                              },
                                              message: 'must NOT have additional properties',
                                            },
                                          ];
                                          return false;
                                          break;
                                        }
                                      }
                                      if (_errs18 === errors) {
                                        var valid3 = true;
                                        for (const key5 in data8) {
                                          if (pattern4.test(key5)) {
                                            let data9 = data8[key5];
                                            const _errs19 = errors;
                                            if (errors === _errs19) {
                                              if (data9 && typeof data9 == 'object' && !Array.isArray(data9)) {
                                                if (Object.keys(data9).length < 1) {
                                                  validate21.errors = [
                                                    {
                                                      instancePath:
                                                        instancePath +
                                                        '/species/spellLists/' +
                                                        key5.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                      schemaPath:
                                                        '#/properties/species/properties/spellLists/patternProperties/.%2B/minProperties',
                                                      keyword: 'minProperties',
                                                      params: { limit: 1 },
                                                      message: 'must NOT have fewer than 1 properties',
                                                    },
                                                  ];
                                                  return false;
                                                } else {
                                                  const _errs21 = errors;
                                                  for (const key6 in data9) {
                                                    if (!pattern4.test(key6)) {
                                                      validate21.errors = [
                                                        {
                                                          instancePath:
                                                            instancePath +
                                                            '/species/spellLists/' +
                                                            key5.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                          schemaPath:
                                                            '#/properties/species/properties/spellLists/patternProperties/.%2B/additionalProperties',
                                                          keyword: 'additionalProperties',
                                                          params: {
                                                            additionalProperty: key6,
                                                          },
                                                          message: 'must NOT have additional properties',
                                                        },
                                                      ];
                                                      return false;
                                                      break;
                                                    }
                                                  }
                                                  if (_errs21 === errors) {
                                                    var valid4 = true;
                                                    for (const key7 in data9) {
                                                      if (pattern4.test(key7)) {
                                                        const _errs22 = errors;
                                                        if (
                                                          !validate53(data9[key7], {
                                                            instancePath:
                                                              instancePath +
                                                              '/species/spellLists/' +
                                                              key5.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                              '/' +
                                                              key7.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                            parentData: data9,
                                                            parentDataProperty: key7,
                                                            rootData,
                                                            dynamicAnchors,
                                                          })
                                                        ) {
                                                          vErrors =
                                                            vErrors === null
                                                              ? validate53.errors
                                                              : vErrors.concat(validate53.errors);
                                                          errors = vErrors.length;
                                                        }
                                                        var valid4 = _errs22 === errors;
                                                        if (!valid4) {
                                                          break;
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              } else {
                                                validate21.errors = [
                                                  {
                                                    instancePath:
                                                      instancePath +
                                                      '/species/spellLists/' +
                                                      key5.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                    schemaPath:
                                                      '#/properties/species/properties/spellLists/patternProperties/.%2B/type',
                                                    keyword: 'type',
                                                    params: { type: 'object' },
                                                    message: 'must be object',
                                                  },
                                                ];
                                                return false;
                                              }
                                            }
                                            var valid3 = _errs19 === errors;
                                            if (!valid3) {
                                              break;
                                            }
                                          }
                                        }
                                      }
                                    } else {
                                      validate21.errors = [
                                        {
                                          instancePath: instancePath + '/species/spellLists',
                                          schemaPath: '#/properties/species/properties/spellLists/type',
                                          keyword: 'type',
                                          params: { type: 'object' },
                                          message: 'must be object',
                                        },
                                      ];
                                      return false;
                                    }
                                  }
                                  var valid1 = _errs16 === errors;
                                } else {
                                  var valid1 = true;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  validate21.errors = [
                    {
                      instancePath: instancePath + '/species',
                      schemaPath: '#/properties/species/type',
                      keyword: 'type',
                      params: { type: 'object' },
                      message: 'must be object',
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate21.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate21.errors = vErrors;
  return errors === 0;
}
validate21.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema77 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'role' },
    role: {
      type: 'object',
      additionalProperties: false,
      properties: {
        label: { type: 'string' },
        baseAttributes: {
          type: 'object',
          additionalProperties: false,
          properties: {
            dex: { $ref: '#/$defs/AttributeDice' },
            ins: { $ref: '#/$defs/AttributeDice' },
            mig: { $ref: '#/$defs/AttributeDice' },
            wlp: { $ref: '#/$defs/AttributeDice' },
          },
          required: ['dex', 'ins', 'mig', 'wlp'],
        },
        attributeChanges: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              dex: { $ref: '#/$defs/AttributeDice' },
              ins: { $ref: '#/$defs/AttributeDice' },
              mig: { $ref: '#/$defs/AttributeDice' },
              wlp: { $ref: '#/$defs/AttributeDice' },
            },
            minProperties: 1,
            maxProperties: 1,
          },
          minItems: 3,
          maxItems: 3,
        },
        skillsByLevel: {
          type: 'array',
          items: { $ref: '#/$defs/Changes' },
          minItems: 6,
          maxItems: 6,
        },
        baseline: {
          allOf: [
            { $ref: '#/$defs/Changes' },
            {
              type: 'object',
              properties: {
                model: {
                  type: 'object',
                  properties: {
                    attacks: {
                      type: 'object',
                      patternProperties: {
                        '.+': {
                          type: 'object',
                          properties: { name: true, baseDamage: true },
                          required: ['name', 'baseDamage'],
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        roleSkills: {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
        },
        customizations: {
          type: 'object',
          additionalProperties: false,
          patternProperties: { '.+': { $ref: '#/$defs/Skill' } },
        },
        spellLists: {
          type: 'object',
          additionalProperties: false,
          patternProperties: {
            '.+': {
              type: 'object',
              additionalProperties: false,
              patternProperties: {
                '.+': { $ref: '#/$defs/UnconfiguredSpell' },
              },
              minProperties: 1,
            },
          },
        },
      },
      required: [
        'attributeChanges',
        'baseAttributes',
        'baseline',
        'label',
        'customizations',
        'roleSkills',
        'skillsByLevel',
      ],
    },
  },
  required: ['type', 'role'],
};
const schema78 = { enum: ['d6', 'd8', 'd10', 'd12'] };
function validate65(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate65.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if ((data.type === undefined && (missing0 = 'type')) || (data.role === undefined && (missing0 = 'role'))) {
        validate65.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'role')) {
            validate65.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('role' !== data.type) {
              validate65.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'role' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.role !== undefined) {
              let data1 = data.role;
              const _errs3 = errors;
              if (errors === _errs3) {
                if (data1 && typeof data1 == 'object' && !Array.isArray(data1)) {
                  let missing1;
                  if (
                    (data1.attributeChanges === undefined && (missing1 = 'attributeChanges')) ||
                    (data1.baseAttributes === undefined && (missing1 = 'baseAttributes')) ||
                    (data1.baseline === undefined && (missing1 = 'baseline')) ||
                    (data1.label === undefined && (missing1 = 'label')) ||
                    (data1.customizations === undefined && (missing1 = 'customizations')) ||
                    (data1.roleSkills === undefined && (missing1 = 'roleSkills')) ||
                    (data1.skillsByLevel === undefined && (missing1 = 'skillsByLevel'))
                  ) {
                    validate65.errors = [
                      {
                        instancePath: instancePath + '/role',
                        schemaPath: '#/properties/role/required',
                        keyword: 'required',
                        params: { missingProperty: missing1 },
                        message: "must have required property '" + missing1 + "'",
                      },
                    ];
                    return false;
                  } else {
                    const _errs5 = errors;
                    for (const key1 in data1) {
                      if (
                        !(
                          key1 === 'label' ||
                          key1 === 'baseAttributes' ||
                          key1 === 'attributeChanges' ||
                          key1 === 'skillsByLevel' ||
                          key1 === 'baseline' ||
                          key1 === 'roleSkills' ||
                          key1 === 'customizations' ||
                          key1 === 'spellLists'
                        )
                      ) {
                        validate65.errors = [
                          {
                            instancePath: instancePath + '/role',
                            schemaPath: '#/properties/role/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key1 },
                            message: 'must NOT have additional properties',
                          },
                        ];
                        return false;
                        break;
                      }
                    }
                    if (_errs5 === errors) {
                      if (data1.label !== undefined) {
                        const _errs6 = errors;
                        if (typeof data1.label !== 'string') {
                          validate65.errors = [
                            {
                              instancePath: instancePath + '/role/label',
                              schemaPath: '#/properties/role/properties/label/type',
                              keyword: 'type',
                              params: { type: 'string' },
                              message: 'must be string',
                            },
                          ];
                          return false;
                        }
                        var valid1 = _errs6 === errors;
                      } else {
                        var valid1 = true;
                      }
                      if (valid1) {
                        if (data1.baseAttributes !== undefined) {
                          let data3 = data1.baseAttributes;
                          const _errs8 = errors;
                          if (errors === _errs8) {
                            if (data3 && typeof data3 == 'object' && !Array.isArray(data3)) {
                              let missing2;
                              if (
                                (data3.dex === undefined && (missing2 = 'dex')) ||
                                (data3.ins === undefined && (missing2 = 'ins')) ||
                                (data3.mig === undefined && (missing2 = 'mig')) ||
                                (data3.wlp === undefined && (missing2 = 'wlp'))
                              ) {
                                validate65.errors = [
                                  {
                                    instancePath: instancePath + '/role/baseAttributes',
                                    schemaPath: '#/properties/role/properties/baseAttributes/required',
                                    keyword: 'required',
                                    params: { missingProperty: missing2 },
                                    message: "must have required property '" + missing2 + "'",
                                  },
                                ];
                                return false;
                              } else {
                                const _errs10 = errors;
                                for (const key2 in data3) {
                                  if (!(key2 === 'dex' || key2 === 'ins' || key2 === 'mig' || key2 === 'wlp')) {
                                    validate65.errors = [
                                      {
                                        instancePath: instancePath + '/role/baseAttributes',
                                        schemaPath: '#/properties/role/properties/baseAttributes/additionalProperties',
                                        keyword: 'additionalProperties',
                                        params: { additionalProperty: key2 },
                                        message: 'must NOT have additional properties',
                                      },
                                    ];
                                    return false;
                                    break;
                                  }
                                }
                                if (_errs10 === errors) {
                                  if (data3.dex !== undefined) {
                                    let data4 = data3.dex;
                                    const _errs11 = errors;
                                    if (!(data4 === 'd6' || data4 === 'd8' || data4 === 'd10' || data4 === 'd12')) {
                                      validate65.errors = [
                                        {
                                          instancePath: instancePath + '/role/baseAttributes/dex',
                                          schemaPath: '#/$defs/AttributeDice/enum',
                                          keyword: 'enum',
                                          params: {
                                            allowedValues: schema78.enum,
                                          },
                                          message: 'must be equal to one of the allowed values',
                                        },
                                      ];
                                      return false;
                                    }
                                    var valid2 = _errs11 === errors;
                                  } else {
                                    var valid2 = true;
                                  }
                                  if (valid2) {
                                    if (data3.ins !== undefined) {
                                      let data5 = data3.ins;
                                      const _errs13 = errors;
                                      if (!(data5 === 'd6' || data5 === 'd8' || data5 === 'd10' || data5 === 'd12')) {
                                        validate65.errors = [
                                          {
                                            instancePath: instancePath + '/role/baseAttributes/ins',
                                            schemaPath: '#/$defs/AttributeDice/enum',
                                            keyword: 'enum',
                                            params: {
                                              allowedValues: schema78.enum,
                                            },
                                            message: 'must be equal to one of the allowed values',
                                          },
                                        ];
                                        return false;
                                      }
                                      var valid2 = _errs13 === errors;
                                    } else {
                                      var valid2 = true;
                                    }
                                    if (valid2) {
                                      if (data3.mig !== undefined) {
                                        let data6 = data3.mig;
                                        const _errs15 = errors;
                                        if (!(data6 === 'd6' || data6 === 'd8' || data6 === 'd10' || data6 === 'd12')) {
                                          validate65.errors = [
                                            {
                                              instancePath: instancePath + '/role/baseAttributes/mig',
                                              schemaPath: '#/$defs/AttributeDice/enum',
                                              keyword: 'enum',
                                              params: {
                                                allowedValues: schema78.enum,
                                              },
                                              message: 'must be equal to one of the allowed values',
                                            },
                                          ];
                                          return false;
                                        }
                                        var valid2 = _errs15 === errors;
                                      } else {
                                        var valid2 = true;
                                      }
                                      if (valid2) {
                                        if (data3.wlp !== undefined) {
                                          let data7 = data3.wlp;
                                          const _errs17 = errors;
                                          if (
                                            !(data7 === 'd6' || data7 === 'd8' || data7 === 'd10' || data7 === 'd12')
                                          ) {
                                            validate65.errors = [
                                              {
                                                instancePath: instancePath + '/role/baseAttributes/wlp',
                                                schemaPath: '#/$defs/AttributeDice/enum',
                                                keyword: 'enum',
                                                params: {
                                                  allowedValues: schema78.enum,
                                                },
                                                message: 'must be equal to one of the allowed values',
                                              },
                                            ];
                                            return false;
                                          }
                                          var valid2 = _errs17 === errors;
                                        } else {
                                          var valid2 = true;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            } else {
                              validate65.errors = [
                                {
                                  instancePath: instancePath + '/role/baseAttributes',
                                  schemaPath: '#/properties/role/properties/baseAttributes/type',
                                  keyword: 'type',
                                  params: { type: 'object' },
                                  message: 'must be object',
                                },
                              ];
                              return false;
                            }
                          }
                          var valid1 = _errs8 === errors;
                        } else {
                          var valid1 = true;
                        }
                        if (valid1) {
                          if (data1.attributeChanges !== undefined) {
                            let data8 = data1.attributeChanges;
                            const _errs19 = errors;
                            if (errors === _errs19) {
                              if (Array.isArray(data8)) {
                                if (data8.length > 3) {
                                  validate65.errors = [
                                    {
                                      instancePath: instancePath + '/role/attributeChanges',
                                      schemaPath: '#/properties/role/properties/attributeChanges/maxItems',
                                      keyword: 'maxItems',
                                      params: { limit: 3 },
                                      message: 'must NOT have more than 3 items',
                                    },
                                  ];
                                  return false;
                                } else {
                                  if (data8.length < 3) {
                                    validate65.errors = [
                                      {
                                        instancePath: instancePath + '/role/attributeChanges',
                                        schemaPath: '#/properties/role/properties/attributeChanges/minItems',
                                        keyword: 'minItems',
                                        params: { limit: 3 },
                                        message: 'must NOT have fewer than 3 items',
                                      },
                                    ];
                                    return false;
                                  } else {
                                    var valid7 = true;
                                    const len0 = data8.length;
                                    for (let i0 = 0; i0 < len0; i0++) {
                                      let data9 = data8[i0];
                                      const _errs21 = errors;
                                      if (errors === _errs21) {
                                        if (data9 && typeof data9 == 'object' && !Array.isArray(data9)) {
                                          if (Object.keys(data9).length > 1) {
                                            validate65.errors = [
                                              {
                                                instancePath: instancePath + '/role/attributeChanges/' + i0,
                                                schemaPath:
                                                  '#/properties/role/properties/attributeChanges/items/maxProperties',
                                                keyword: 'maxProperties',
                                                params: { limit: 1 },
                                                message: 'must NOT have more than 1 properties',
                                              },
                                            ];
                                            return false;
                                          } else {
                                            if (Object.keys(data9).length < 1) {
                                              validate65.errors = [
                                                {
                                                  instancePath: instancePath + '/role/attributeChanges/' + i0,
                                                  schemaPath:
                                                    '#/properties/role/properties/attributeChanges/items/minProperties',
                                                  keyword: 'minProperties',
                                                  params: { limit: 1 },
                                                  message: 'must NOT have fewer than 1 properties',
                                                },
                                              ];
                                              return false;
                                            } else {
                                              const _errs23 = errors;
                                              for (const key3 in data9) {
                                                if (
                                                  !(
                                                    key3 === 'dex' ||
                                                    key3 === 'ins' ||
                                                    key3 === 'mig' ||
                                                    key3 === 'wlp'
                                                  )
                                                ) {
                                                  validate65.errors = [
                                                    {
                                                      instancePath: instancePath + '/role/attributeChanges/' + i0,
                                                      schemaPath:
                                                        '#/properties/role/properties/attributeChanges/items/additionalProperties',
                                                      keyword: 'additionalProperties',
                                                      params: {
                                                        additionalProperty: key3,
                                                      },
                                                      message: 'must NOT have additional properties',
                                                    },
                                                  ];
                                                  return false;
                                                  break;
                                                }
                                              }
                                              if (_errs23 === errors) {
                                                if (data9.dex !== undefined) {
                                                  let data10 = data9.dex;
                                                  const _errs24 = errors;
                                                  if (
                                                    !(
                                                      data10 === 'd6' ||
                                                      data10 === 'd8' ||
                                                      data10 === 'd10' ||
                                                      data10 === 'd12'
                                                    )
                                                  ) {
                                                    validate65.errors = [
                                                      {
                                                        instancePath:
                                                          instancePath + '/role/attributeChanges/' + i0 + '/dex',
                                                        schemaPath: '#/$defs/AttributeDice/enum',
                                                        keyword: 'enum',
                                                        params: {
                                                          allowedValues: schema78.enum,
                                                        },
                                                        message: 'must be equal to one of the allowed values',
                                                      },
                                                    ];
                                                    return false;
                                                  }
                                                  var valid8 = _errs24 === errors;
                                                } else {
                                                  var valid8 = true;
                                                }
                                                if (valid8) {
                                                  if (data9.ins !== undefined) {
                                                    let data11 = data9.ins;
                                                    const _errs26 = errors;
                                                    if (
                                                      !(
                                                        data11 === 'd6' ||
                                                        data11 === 'd8' ||
                                                        data11 === 'd10' ||
                                                        data11 === 'd12'
                                                      )
                                                    ) {
                                                      validate65.errors = [
                                                        {
                                                          instancePath:
                                                            instancePath + '/role/attributeChanges/' + i0 + '/ins',
                                                          schemaPath: '#/$defs/AttributeDice/enum',
                                                          keyword: 'enum',
                                                          params: {
                                                            allowedValues: schema78.enum,
                                                          },
                                                          message: 'must be equal to one of the allowed values',
                                                        },
                                                      ];
                                                      return false;
                                                    }
                                                    var valid8 = _errs26 === errors;
                                                  } else {
                                                    var valid8 = true;
                                                  }
                                                  if (valid8) {
                                                    if (data9.mig !== undefined) {
                                                      let data12 = data9.mig;
                                                      const _errs28 = errors;
                                                      if (
                                                        !(
                                                          data12 === 'd6' ||
                                                          data12 === 'd8' ||
                                                          data12 === 'd10' ||
                                                          data12 === 'd12'
                                                        )
                                                      ) {
                                                        validate65.errors = [
                                                          {
                                                            instancePath:
                                                              instancePath + '/role/attributeChanges/' + i0 + '/mig',
                                                            schemaPath: '#/$defs/AttributeDice/enum',
                                                            keyword: 'enum',
                                                            params: {
                                                              allowedValues: schema78.enum,
                                                            },
                                                            message: 'must be equal to one of the allowed values',
                                                          },
                                                        ];
                                                        return false;
                                                      }
                                                      var valid8 = _errs28 === errors;
                                                    } else {
                                                      var valid8 = true;
                                                    }
                                                    if (valid8) {
                                                      if (data9.wlp !== undefined) {
                                                        let data13 = data9.wlp;
                                                        const _errs30 = errors;
                                                        if (
                                                          !(
                                                            data13 === 'd6' ||
                                                            data13 === 'd8' ||
                                                            data13 === 'd10' ||
                                                            data13 === 'd12'
                                                          )
                                                        ) {
                                                          validate65.errors = [
                                                            {
                                                              instancePath:
                                                                instancePath + '/role/attributeChanges/' + i0 + '/wlp',
                                                              schemaPath: '#/$defs/AttributeDice/enum',
                                                              keyword: 'enum',
                                                              params: {
                                                                allowedValues: schema78.enum,
                                                              },
                                                              message: 'must be equal to one of the allowed values',
                                                            },
                                                          ];
                                                          return false;
                                                        }
                                                        var valid8 = _errs30 === errors;
                                                      } else {
                                                        var valid8 = true;
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        } else {
                                          validate65.errors = [
                                            {
                                              instancePath: instancePath + '/role/attributeChanges/' + i0,
                                              schemaPath: '#/properties/role/properties/attributeChanges/items/type',
                                              keyword: 'type',
                                              params: { type: 'object' },
                                              message: 'must be object',
                                            },
                                          ];
                                          return false;
                                        }
                                      }
                                      var valid7 = _errs21 === errors;
                                      if (!valid7) {
                                        break;
                                      }
                                    }
                                  }
                                }
                              } else {
                                validate65.errors = [
                                  {
                                    instancePath: instancePath + '/role/attributeChanges',
                                    schemaPath: '#/properties/role/properties/attributeChanges/type',
                                    keyword: 'type',
                                    params: { type: 'array' },
                                    message: 'must be array',
                                  },
                                ];
                                return false;
                              }
                            }
                            var valid1 = _errs19 === errors;
                          } else {
                            var valid1 = true;
                          }
                          if (valid1) {
                            if (data1.skillsByLevel !== undefined) {
                              let data14 = data1.skillsByLevel;
                              const _errs32 = errors;
                              if (errors === _errs32) {
                                if (Array.isArray(data14)) {
                                  if (data14.length > 6) {
                                    validate65.errors = [
                                      {
                                        instancePath: instancePath + '/role/skillsByLevel',
                                        schemaPath: '#/properties/role/properties/skillsByLevel/maxItems',
                                        keyword: 'maxItems',
                                        params: { limit: 6 },
                                        message: 'must NOT have more than 6 items',
                                      },
                                    ];
                                    return false;
                                  } else {
                                    if (data14.length < 6) {
                                      validate65.errors = [
                                        {
                                          instancePath: instancePath + '/role/skillsByLevel',
                                          schemaPath: '#/properties/role/properties/skillsByLevel/minItems',
                                          keyword: 'minItems',
                                          params: { limit: 6 },
                                          message: 'must NOT have fewer than 6 items',
                                        },
                                      ];
                                      return false;
                                    } else {
                                      var valid13 = true;
                                      const len1 = data14.length;
                                      for (let i1 = 0; i1 < len1; i1++) {
                                        const _errs34 = errors;
                                        if (
                                          !validate22(data14[i1], {
                                            instancePath: instancePath + '/role/skillsByLevel/' + i1,
                                            parentData: data14,
                                            parentDataProperty: i1,
                                            rootData,
                                            dynamicAnchors,
                                          })
                                        ) {
                                          vErrors =
                                            vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
                                          errors = vErrors.length;
                                        }
                                        var valid13 = _errs34 === errors;
                                        if (!valid13) {
                                          break;
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  validate65.errors = [
                                    {
                                      instancePath: instancePath + '/role/skillsByLevel',
                                      schemaPath: '#/properties/role/properties/skillsByLevel/type',
                                      keyword: 'type',
                                      params: { type: 'array' },
                                      message: 'must be array',
                                    },
                                  ];
                                  return false;
                                }
                              }
                              var valid1 = _errs32 === errors;
                            } else {
                              var valid1 = true;
                            }
                            if (valid1) {
                              if (data1.baseline !== undefined) {
                                let data16 = data1.baseline;
                                const _errs35 = errors;
                                const _errs36 = errors;
                                if (
                                  !validate22(data16, {
                                    instancePath: instancePath + '/role/baseline',
                                    parentData: data1,
                                    parentDataProperty: 'baseline',
                                    rootData,
                                    dynamicAnchors,
                                  })
                                ) {
                                  vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
                                  errors = vErrors.length;
                                }
                                var valid14 = _errs36 === errors;
                                if (valid14) {
                                  const _errs37 = errors;
                                  if (errors === _errs37) {
                                    if (data16 && typeof data16 == 'object' && !Array.isArray(data16)) {
                                      if (data16.model !== undefined) {
                                        let data17 = data16.model;
                                        const _errs39 = errors;
                                        if (errors === _errs39) {
                                          if (data17 && typeof data17 == 'object' && !Array.isArray(data17)) {
                                            if (data17.attacks !== undefined) {
                                              let data18 = data17.attacks;
                                              const _errs41 = errors;
                                              if (errors === _errs41) {
                                                if (data18 && typeof data18 == 'object' && !Array.isArray(data18)) {
                                                  var props0 = {};
                                                  for (const key4 in data18) {
                                                    if (pattern4.test(key4)) {
                                                      let data19 = data18[key4];
                                                      const _errs43 = errors;
                                                      if (errors === _errs43) {
                                                        if (
                                                          data19 &&
                                                          typeof data19 == 'object' &&
                                                          !Array.isArray(data19)
                                                        ) {
                                                          let missing3;
                                                          if (
                                                            (data19.name === undefined && (missing3 = 'name')) ||
                                                            (data19.baseDamage === undefined &&
                                                              (missing3 = 'baseDamage'))
                                                          ) {
                                                            validate65.errors = [
                                                              {
                                                                instancePath:
                                                                  instancePath +
                                                                  '/role/baseline/model/attacks/' +
                                                                  key4.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                                schemaPath:
                                                                  '#/properties/role/properties/baseline/allOf/1/properties/model/properties/attacks/patternProperties/.%2B/required',
                                                                keyword: 'required',
                                                                params: {
                                                                  missingProperty: missing3,
                                                                },
                                                                message:
                                                                  "must have required property '" + missing3 + "'",
                                                              },
                                                            ];
                                                            return false;
                                                          }
                                                        } else {
                                                          validate65.errors = [
                                                            {
                                                              instancePath:
                                                                instancePath +
                                                                '/role/baseline/model/attacks/' +
                                                                key4.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                              schemaPath:
                                                                '#/properties/role/properties/baseline/allOf/1/properties/model/properties/attacks/patternProperties/.%2B/type',
                                                              keyword: 'type',
                                                              params: {
                                                                type: 'object',
                                                              },
                                                              message: 'must be object',
                                                            },
                                                          ];
                                                          return false;
                                                        }
                                                      }
                                                      props0[key4] = true;
                                                    }
                                                  }
                                                } else {
                                                  validate65.errors = [
                                                    {
                                                      instancePath: instancePath + '/role/baseline/model/attacks',
                                                      schemaPath:
                                                        '#/properties/role/properties/baseline/allOf/1/properties/model/properties/attacks/type',
                                                      keyword: 'type',
                                                      params: {
                                                        type: 'object',
                                                      },
                                                      message: 'must be object',
                                                    },
                                                  ];
                                                  return false;
                                                }
                                              }
                                            }
                                          } else {
                                            validate65.errors = [
                                              {
                                                instancePath: instancePath + '/role/baseline/model',
                                                schemaPath:
                                                  '#/properties/role/properties/baseline/allOf/1/properties/model/type',
                                                keyword: 'type',
                                                params: { type: 'object' },
                                                message: 'must be object',
                                              },
                                            ];
                                            return false;
                                          }
                                        }
                                      }
                                    } else {
                                      validate65.errors = [
                                        {
                                          instancePath: instancePath + '/role/baseline',
                                          schemaPath: '#/properties/role/properties/baseline/allOf/1/type',
                                          keyword: 'type',
                                          params: { type: 'object' },
                                          message: 'must be object',
                                        },
                                      ];
                                      return false;
                                    }
                                  }
                                  var valid14 = _errs37 === errors;
                                }
                                var valid1 = _errs35 === errors;
                              } else {
                                var valid1 = true;
                              }
                              if (valid1) {
                                if (data1.roleSkills !== undefined) {
                                  let data20 = data1.roleSkills;
                                  const _errs45 = errors;
                                  if (errors === _errs45) {
                                    if (data20 && typeof data20 == 'object' && !Array.isArray(data20)) {
                                      const _errs47 = errors;
                                      for (const key5 in data20) {
                                        if (!pattern4.test(key5)) {
                                          validate65.errors = [
                                            {
                                              instancePath: instancePath + '/role/roleSkills',
                                              schemaPath:
                                                '#/properties/role/properties/roleSkills/additionalProperties',
                                              keyword: 'additionalProperties',
                                              params: {
                                                additionalProperty: key5,
                                              },
                                              message: 'must NOT have additional properties',
                                            },
                                          ];
                                          return false;
                                          break;
                                        }
                                      }
                                      if (_errs47 === errors) {
                                        var valid18 = true;
                                        for (const key6 in data20) {
                                          if (pattern4.test(key6)) {
                                            const _errs48 = errors;
                                            if (
                                              !validate39(data20[key6], {
                                                instancePath:
                                                  instancePath +
                                                  '/role/roleSkills/' +
                                                  key6.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                parentData: data20,
                                                parentDataProperty: key6,
                                                rootData,
                                                dynamicAnchors,
                                              })
                                            ) {
                                              vErrors =
                                                vErrors === null
                                                  ? validate39.errors
                                                  : vErrors.concat(validate39.errors);
                                              errors = vErrors.length;
                                            }
                                            var valid18 = _errs48 === errors;
                                            if (!valid18) {
                                              break;
                                            }
                                          }
                                        }
                                      }
                                    } else {
                                      validate65.errors = [
                                        {
                                          instancePath: instancePath + '/role/roleSkills',
                                          schemaPath: '#/properties/role/properties/roleSkills/type',
                                          keyword: 'type',
                                          params: { type: 'object' },
                                          message: 'must be object',
                                        },
                                      ];
                                      return false;
                                    }
                                  }
                                  var valid1 = _errs45 === errors;
                                } else {
                                  var valid1 = true;
                                }
                                if (valid1) {
                                  if (data1.customizations !== undefined) {
                                    let data22 = data1.customizations;
                                    const _errs49 = errors;
                                    if (errors === _errs49) {
                                      if (data22 && typeof data22 == 'object' && !Array.isArray(data22)) {
                                        const _errs51 = errors;
                                        for (const key7 in data22) {
                                          if (!pattern4.test(key7)) {
                                            validate65.errors = [
                                              {
                                                instancePath: instancePath + '/role/customizations',
                                                schemaPath:
                                                  '#/properties/role/properties/customizations/additionalProperties',
                                                keyword: 'additionalProperties',
                                                params: {
                                                  additionalProperty: key7,
                                                },
                                                message: 'must NOT have additional properties',
                                              },
                                            ];
                                            return false;
                                            break;
                                          }
                                        }
                                        if (_errs51 === errors) {
                                          var valid19 = true;
                                          for (const key8 in data22) {
                                            if (pattern4.test(key8)) {
                                              const _errs52 = errors;
                                              if (
                                                !validate39(data22[key8], {
                                                  instancePath:
                                                    instancePath +
                                                    '/role/customizations/' +
                                                    key8.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                  parentData: data22,
                                                  parentDataProperty: key8,
                                                  rootData,
                                                  dynamicAnchors,
                                                })
                                              ) {
                                                vErrors =
                                                  vErrors === null
                                                    ? validate39.errors
                                                    : vErrors.concat(validate39.errors);
                                                errors = vErrors.length;
                                              }
                                              var valid19 = _errs52 === errors;
                                              if (!valid19) {
                                                break;
                                              }
                                            }
                                          }
                                        }
                                      } else {
                                        validate65.errors = [
                                          {
                                            instancePath: instancePath + '/role/customizations',
                                            schemaPath: '#/properties/role/properties/customizations/type',
                                            keyword: 'type',
                                            params: { type: 'object' },
                                            message: 'must be object',
                                          },
                                        ];
                                        return false;
                                      }
                                    }
                                    var valid1 = _errs49 === errors;
                                  } else {
                                    var valid1 = true;
                                  }
                                  if (valid1) {
                                    if (data1.spellLists !== undefined) {
                                      let data24 = data1.spellLists;
                                      const _errs53 = errors;
                                      if (errors === _errs53) {
                                        if (data24 && typeof data24 == 'object' && !Array.isArray(data24)) {
                                          const _errs55 = errors;
                                          for (const key9 in data24) {
                                            if (!pattern4.test(key9)) {
                                              validate65.errors = [
                                                {
                                                  instancePath: instancePath + '/role/spellLists',
                                                  schemaPath:
                                                    '#/properties/role/properties/spellLists/additionalProperties',
                                                  keyword: 'additionalProperties',
                                                  params: {
                                                    additionalProperty: key9,
                                                  },
                                                  message: 'must NOT have additional properties',
                                                },
                                              ];
                                              return false;
                                              break;
                                            }
                                          }
                                          if (_errs55 === errors) {
                                            var valid20 = true;
                                            for (const key10 in data24) {
                                              if (pattern4.test(key10)) {
                                                let data25 = data24[key10];
                                                const _errs56 = errors;
                                                if (errors === _errs56) {
                                                  if (data25 && typeof data25 == 'object' && !Array.isArray(data25)) {
                                                    if (Object.keys(data25).length < 1) {
                                                      validate65.errors = [
                                                        {
                                                          instancePath:
                                                            instancePath +
                                                            '/role/spellLists/' +
                                                            key10.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                          schemaPath:
                                                            '#/properties/role/properties/spellLists/patternProperties/.%2B/minProperties',
                                                          keyword: 'minProperties',
                                                          params: { limit: 1 },
                                                          message: 'must NOT have fewer than 1 properties',
                                                        },
                                                      ];
                                                      return false;
                                                    } else {
                                                      const _errs58 = errors;
                                                      for (const key11 in data25) {
                                                        if (!pattern4.test(key11)) {
                                                          validate65.errors = [
                                                            {
                                                              instancePath:
                                                                instancePath +
                                                                '/role/spellLists/' +
                                                                key10.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                              schemaPath:
                                                                '#/properties/role/properties/spellLists/patternProperties/.%2B/additionalProperties',
                                                              keyword: 'additionalProperties',
                                                              params: {
                                                                additionalProperty: key11,
                                                              },
                                                              message: 'must NOT have additional properties',
                                                            },
                                                          ];
                                                          return false;
                                                          break;
                                                        }
                                                      }
                                                      if (_errs58 === errors) {
                                                        var valid21 = true;
                                                        for (const key12 in data25) {
                                                          if (pattern4.test(key12)) {
                                                            const _errs59 = errors;
                                                            if (
                                                              !validate53(data25[key12], {
                                                                instancePath:
                                                                  instancePath +
                                                                  '/role/spellLists/' +
                                                                  key10.replace(/~/g, '~0').replace(/\//g, '~1') +
                                                                  '/' +
                                                                  key12.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                                parentData: data25,
                                                                parentDataProperty: key12,
                                                                rootData,
                                                                dynamicAnchors,
                                                              })
                                                            ) {
                                                              vErrors =
                                                                vErrors === null
                                                                  ? validate53.errors
                                                                  : vErrors.concat(validate53.errors);
                                                              errors = vErrors.length;
                                                            }
                                                            var valid21 = _errs59 === errors;
                                                            if (!valid21) {
                                                              break;
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    validate65.errors = [
                                                      {
                                                        instancePath:
                                                          instancePath +
                                                          '/role/spellLists/' +
                                                          key10.replace(/~/g, '~0').replace(/\//g, '~1'),
                                                        schemaPath:
                                                          '#/properties/role/properties/spellLists/patternProperties/.%2B/type',
                                                        keyword: 'type',
                                                        params: {
                                                          type: 'object',
                                                        },
                                                        message: 'must be object',
                                                      },
                                                    ];
                                                    return false;
                                                  }
                                                }
                                                var valid20 = _errs56 === errors;
                                                if (!valid20) {
                                                  break;
                                                }
                                              }
                                            }
                                          }
                                        } else {
                                          validate65.errors = [
                                            {
                                              instancePath: instancePath + '/role/spellLists',
                                              schemaPath: '#/properties/role/properties/spellLists/type',
                                              keyword: 'type',
                                              params: { type: 'object' },
                                              message: 'must be object',
                                            },
                                          ];
                                          return false;
                                        }
                                      }
                                      var valid1 = _errs53 === errors;
                                    } else {
                                      var valid1 = true;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  validate65.errors = [
                    {
                      instancePath: instancePath + '/role',
                      schemaPath: '#/properties/role/type',
                      keyword: 'type',
                      params: { type: 'object' },
                      message: 'must be object',
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate65.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate65.errors = vErrors;
  return errors === 0;
}
validate65.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
const schema86 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { const: 'designer-spell-list' },
    name: { type: 'string' },
    spellList: {
      type: 'object',
      additionalProperties: false,
      patternProperties: { '.+': { $ref: '#/$defs/UnconfiguredSpell' } },
      minProperties: 1,
    },
  },
  required: ['type', 'name', 'spellList'],
};
function validate72(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate72.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (
        (data.type === undefined && (missing0 = 'type')) ||
        (data.name === undefined && (missing0 = 'name')) ||
        (data.spellList === undefined && (missing0 = 'spellList'))
      ) {
        validate72.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === 'type' || key0 === 'name' || key0 === 'spellList')) {
            validate72.errors = [
              {
                instancePath,
                schemaPath: '#/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.type !== undefined) {
            const _errs2 = errors;
            if ('designer-spell-list' !== data.type) {
              validate72.errors = [
                {
                  instancePath: instancePath + '/type',
                  schemaPath: '#/properties/type/const',
                  keyword: 'const',
                  params: { allowedValue: 'designer-spell-list' },
                  message: 'must be equal to constant',
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.name !== undefined) {
              const _errs3 = errors;
              if (typeof data.name !== 'string') {
                validate72.errors = [
                  {
                    instancePath: instancePath + '/name',
                    schemaPath: '#/properties/name/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  },
                ];
                return false;
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.spellList !== undefined) {
                let data2 = data.spellList;
                const _errs5 = errors;
                if (errors === _errs5) {
                  if (data2 && typeof data2 == 'object' && !Array.isArray(data2)) {
                    if (Object.keys(data2).length < 1) {
                      validate72.errors = [
                        {
                          instancePath: instancePath + '/spellList',
                          schemaPath: '#/properties/spellList/minProperties',
                          keyword: 'minProperties',
                          params: { limit: 1 },
                          message: 'must NOT have fewer than 1 properties',
                        },
                      ];
                      return false;
                    } else {
                      const _errs7 = errors;
                      for (const key1 in data2) {
                        if (!pattern4.test(key1)) {
                          validate72.errors = [
                            {
                              instancePath: instancePath + '/spellList',
                              schemaPath: '#/properties/spellList/additionalProperties',
                              keyword: 'additionalProperties',
                              params: { additionalProperty: key1 },
                              message: 'must NOT have additional properties',
                            },
                          ];
                          return false;
                          break;
                        }
                      }
                      if (_errs7 === errors) {
                        var valid1 = true;
                        for (const key2 in data2) {
                          if (pattern4.test(key2)) {
                            const _errs8 = errors;
                            if (
                              !validate53(data2[key2], {
                                instancePath:
                                  instancePath + '/spellList/' + key2.replace(/~/g, '~0').replace(/\//g, '~1'),
                                parentData: data2,
                                parentDataProperty: key2,
                                rootData,
                                dynamicAnchors,
                              })
                            ) {
                              vErrors = vErrors === null ? validate53.errors : vErrors.concat(validate53.errors);
                              errors = vErrors.length;
                            }
                            var valid1 = _errs8 === errors;
                            if (!valid1) {
                              break;
                            }
                          }
                        }
                      }
                    }
                  } else {
                    validate72.errors = [
                      {
                        instancePath: instancePath + '/spellList',
                        schemaPath: '#/properties/spellList/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      },
                    ];
                    return false;
                  }
                }
                var valid0 = _errs5 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate72.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate72.errors = vErrors;
  return errors === 0;
}
validate72.evaluated = {
  props: true,
  dynamicProps: false,
  dynamicItems: false,
};
function validate20(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data, dynamicAnchors = {} } = {},
) {
  let vErrors = null;
  let errors = 0;
  const evaluated0 = validate20.evaluated;
  if (evaluated0.dynamicProps) {
    evaluated0.props = undefined;
  }
  if (evaluated0.dynamicItems) {
    evaluated0.items = undefined;
  }
  if (!(data && typeof data == 'object' && !Array.isArray(data))) {
    validate20.errors = [
      {
        instancePath,
        schemaPath: '#/type',
        keyword: 'type',
        params: { type: 'object' },
        message: 'must be object',
      },
    ];
    return false;
  }
  const _errs1 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs2 = errors;
  if (
    !validate21(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
      dynamicAnchors,
    })
  ) {
    vErrors = vErrors === null ? validate21.errors : vErrors.concat(validate21.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs2 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
    var props0 = true;
  }
  const _errs3 = errors;
  if (
    !validate65(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
      dynamicAnchors,
    })
  ) {
    vErrors = vErrors === null ? validate65.errors : vErrors.concat(validate65.errors);
    errors = vErrors.length;
  }
  var _valid0 = _errs3 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
      if (props0 !== true) {
        props0 = true;
      }
    }
    const _errs4 = errors;
    if (
      !validate72(data, {
        instancePath,
        parentData,
        parentDataProperty,
        rootData,
        dynamicAnchors,
      })
    ) {
      vErrors = vErrors === null ? validate72.errors : vErrors.concat(validate72.errors);
      errors = vErrors.length;
    }
    var _valid0 = _errs4 === errors;
    if (_valid0 && valid0) {
      valid0 = false;
      passing0 = [passing0, 2];
    } else {
      if (_valid0) {
        valid0 = true;
        passing0 = 2;
        if (props0 !== true) {
          props0 = true;
        }
      }
    }
  }
  if (!valid0) {
    const err0 = {
      instancePath,
      schemaPath: '#/oneOf',
      keyword: 'oneOf',
      params: { passingSchemas: passing0 },
      message: 'must match exactly one schema in oneOf',
    };
    if (vErrors === null) {
      vErrors = [err0];
    } else {
      vErrors.push(err0);
    }
    errors++;
    validate20.errors = vErrors;
    return false;
  } else {
    errors = _errs1;
    if (vErrors !== null) {
      if (_errs1) {
        vErrors.length = _errs1;
      } else {
        vErrors = null;
      }
    }
  }
  validate20.errors = vErrors;
  evaluated0.props = props0;
  return errors === 0;
}
validate20.evaluated = { dynamicProps: true, dynamicItems: false };
