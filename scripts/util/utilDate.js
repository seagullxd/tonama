/**
 * Classify the ones in a date into the correct superscript i.e., 1st, 2nd, 3rd or 4th.
 * 
 * @param {string} date The ones in a date e.g., the 4 in 24/01/1970.
 * @return {string} the correct superscript. 
 */
export function classifyDate(date) {
  let superscript = "th";
  switch (date) {
    case "1":
      superscript = "st";
      break;
    case "2":
      superscript = "nd";
      break;
    case "3":
      superscript = "rd";
      break;
  }
  return superscript;
}