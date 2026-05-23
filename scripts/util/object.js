

// Source - https://stackoverflow.com/a
// Posted by Christoph, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-26, License - CC BY-SA 4.0
export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Return the sorted index to insert a number in an array of numbers.
 * 
 * Source - https://stackoverflow.com/a/21822316
 * Posted by Web_Designer, modified by community. See post 'Timeline' for change history
 * Retrieved 2026-03-08, License - CC BY-SA 3.0
 * 
 * @param {array} array array to insert into.
 * @param {number} value value to insert.
 * @return {number} the index to insert value into array.
 */
export function sortedIndex(array, value) {
  let low = 0;
  let high = array.length;

  while (low < high) {
    let mid = (low + high) >>> 1;
    if (array[mid].distance < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

// Source - https://stackoverflow.com/a/39914235
// Posted by Dan Dascalescu, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-22, License - CC BY-SA 4.0
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Source - https://stackoverflow.com/a/2117523
// Posted by broofa, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-13, License - CC BY-SA 4.0
export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
  );
}