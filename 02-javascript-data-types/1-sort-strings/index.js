/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const result = new Array(...arr);
  switch (param) {
  case 'asc':
    return result.sort((a, b) => sortOrder(a, b));
  case 'desc':
    return result.sort((a, b) => sortOrder(b, a));

  }
}

function sortOrder(a, b) {
  return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
}

