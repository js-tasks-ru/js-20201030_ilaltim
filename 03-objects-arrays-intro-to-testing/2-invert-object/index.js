/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
import {isObjectEmpty} from "../1-create-getter";

export function invertObj(obj) {
  if (arguments.length === 0) {
    return ;
  }
  if (isObjectEmpty(obj)) {
    return {} ;
  }
  const result = {};

  for (let [key, value] of Object.entries(obj)) {
    result[value] = key;
  }
  return result;
}
