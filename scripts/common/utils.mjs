/**
 * @param object
 * @param keys
 * @return
 */
export function pick(object, ...keys) {
    return Object.fromEntries(keys.filter(key => key in object).map(key => [key, object[key]])
    )
}

/**
 * @param {FormData} fd1
 * @param {FormData} fd2
 * @return {boolean}
 */
export function formDataEquals(fd1, fd2) {
    let keyEqual = (formData, otherFormData) => key => {
        const v1 = formData.getAll(key);
        const v2 = otherFormData.getAll(key);
        return v1.length === v2.length && v1.every(value => v2.includes(value));
    };

    return [...fd1.keys()].every(keyEqual(fd1, fd2)) && [...fd2.keys()].every(keyEqual(fd2, fd1));
}

/**
 * @param {FormData} formData
 * @return {FormData}
 */
export function copyFormData(formData) {
    const copy = new FormData();

    for (let [key, value] of formData.entries()) {
        copy.append(key, value)
    }

    return copy;
}