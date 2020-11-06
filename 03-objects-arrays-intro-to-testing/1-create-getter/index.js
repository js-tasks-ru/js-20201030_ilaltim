/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function (obj) {
    if (isObjectEmpty(obj)) {
      return;
    }
    const array = path.split('.');
    let tempkey = null;
    let restObj = obj;

    for (let i = 0; i < array.length; i++) {
      tempkey = String(array[i]);
      restObj = restObj[tempkey];

    }
    return restObj;
  };
}
export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
