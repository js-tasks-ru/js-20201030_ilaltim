/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const array = path.split('.');
  return (obj) => {
    if (isObjectEmpty(obj)) {
      return;
    }

    let tempkey = null;
    let restObj = obj;
    for (let el of array){
      tempkey = el;
      restObj = restObj[tempkey];
    }
    return restObj;
  };
}
export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
