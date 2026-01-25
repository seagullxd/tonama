import { countryColours } from "./models/colours.js";

// https://stackoverflow.com/a/196991
export function toTitleCase(str) {
  return str.replace(
  /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

// Source - https://stackoverflow.com/a/2117523
// Posted by broofa, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-13, License - CC BY-SA 4.0
export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

function hasAppropriateGuessLength(guess) {
  const minGuessLength = 4; // based on the shortest country name
  const maxGuessLength = 56; // based on the longest country name
  return minGuessLength < guess.length && guess.length < maxGuessLength;
}

export function isGuessValid(guess) {
  return (
    hasAppropriateGuessLength(guess) &&
    hasOnlyLetterAndSpaces(guess) &&
    toTitleCase(guess) in countryColours &&
    !hasMisplacedCapital(guess)
  );
}

function hasOnlyLetterAndSpaces(str) {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(str);
}

// https://plainenglish.io/blog/javascript-check-if-string-contains-uppercase-letters-9a78b69739f6
function containsUppercase(str) {
  return /[A-Z]/.test(str);
}

function hasMisplacedCapital(str) {
  let words = str.split(' ');
  let hasMisplacedCapital = false;
  for (const word of words) {
    let charsToTest = word.slice(1);
    hasMisplacedCapital = containsUppercase(charsToTest);
    if (hasMisplacedCapital) return true;
  }
}