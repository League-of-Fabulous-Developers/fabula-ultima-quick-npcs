const appliedCustomizationsKey = 'appliedCustomizations';

/**
 * @param context
 * @param {string} key
 * @return {boolean}
 */
function checkApplied(context, key) {
  return (context[appliedCustomizationsKey] ??= []).includes(key);
}

function markApplied(context, key) {
  (context[appliedCustomizationsKey] ??= []).push(key);
}

export const Customizations = {
  checkApplied,
  markApplied,
};
