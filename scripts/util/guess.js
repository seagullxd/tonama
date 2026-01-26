import { countryColours } from "../models/colours.js";

// https://stackoverflow.com/a/196991
export function toTitleCase(str) {
  return str.replace(
  /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
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