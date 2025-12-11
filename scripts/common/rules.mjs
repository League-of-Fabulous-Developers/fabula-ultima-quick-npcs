/**
 * @param {string} baseKey
 * @param {Record} [data]
 * @return Rule
 */
function simpleRule(baseKey, data) {
  return {
    name: game.i18n.localize(`${baseKey}.name`),
    summary: game.i18n.localize(`${baseKey}.description`),
    description: data ? game.i18n.format(`${baseKey}.ruleText`, data) : game.i18n.localize(`${baseKey}.ruleText`),
  };
}

export const Rules = {
  simpleRule,
};
