/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  if (arguments.length === 0 || arr.length === 0) {
    return [];
  }
  return [...new Set(arr)];
}
