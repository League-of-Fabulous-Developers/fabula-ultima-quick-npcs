/**
 * @param object
 * @param keys
 * @return
 */
export function pick(object, ...keys) {
    return Object.fromEntries(keys.filter(key => key in object).map(key => [key, object[key]])
    )
}
