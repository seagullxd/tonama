// https://stackoverflow.com/a/196991
export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export function doesNotContainOnlyLettersSpaces(str) {
  const regex = /^[A-Za-z\s]+$/;
  return !regex.test(str);
}

// https://plainenglish.io/blog/javascript-check-if-string-contains-uppercase-letters-9a78b69739f6
export function containsUppercase(str) {
  return /[A-Z]/.test(str);
}

export function doesNotContainMisplacedCapital(str) {
  let words = str.split(' ');
  let hasUppercase = false;
  for (const word of words) {
    let charsToTest = word.slice(1);
    hasUppercase = containsUppercase(charsToTest);
    if (hasUppercase) break 
  }
  return hasUppercase
}