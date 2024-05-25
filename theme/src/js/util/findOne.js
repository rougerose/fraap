/**
 * @description determine if an array contains one or more items from another array.
 * @link https://stackoverflow.com/a/25926600
 * @param {array} haystack the array to search.
 * @param {array} arr the array providing items to check for in the haystack.
 * @return {boolean} true|false if haystack contains at least one item from arr.
 */
export const findOne = (haystack, arr) => {
    return arr.some(v => haystack.includes(v));
};
