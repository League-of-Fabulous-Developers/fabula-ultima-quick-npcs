/**
 * @param {string} baseKey
 * @param {Record} [data]
 * @return Action
 */
function simpleAction(baseKey, data) {
  return {
    name: game.i18n.localize(`${baseKey}.name`),
    summary: game.i18n.localize(`${baseKey}.description`),
    description: data ? game.i18n.format(`${baseKey}.actionText`, data) : game.i18n.localize(`${baseKey}.actionText`),
  };
}

export const Actions = {
  simpleAction,
};
