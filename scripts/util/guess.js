import { ENTITY_COLOURS } from "../models/entity-colours.js";
import { getLevel, getLevels } from "../local-storage.js"
import { displayErrorMessage } from "../errors.js";
import { createCardElement, removeAllCards } from "../svg.js";
import {
  GUESSED_ERROR_MESSAGES,
  LEVEL_CARD,
  COUNTRY_CARD
} from "../constants.js";

// https://stackoverflow.com/a/196991
export function toTitleCase(str) {
  return str.replace(
  /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

function hasAppropriateGuessLength(guess) {
  const minGuessLength = 4; // based on the shortest country name
  const maxGuessLength = 56; // based on the longest country name
  return minGuessLength <= guess.length && guess.length < maxGuessLength;
}

function isGuessSpellingValid(guess) {
  return (
    hasAppropriateGuessLength(guess) &&
    hasOnlyLetterAndSpaces(guess) &&
    !hasMisplacedCapital(guess)
  );
}

/**
 * Returns whether a guess is an acceptable country guess 
 * i.e., it is the correct name of a country.
 *
 * @param {object} guess The guess made.
 * @param {countryData} countryData contains all acceptable the country names
 * @param {number} levelId Level identifier
 * @return {boolean} only true if the guess already exists.
 */
export function isGuessValid(guess, countryData, levelId) {
  let error = {};
  if (!isGuessSpellingValid(guess.country)) {
    error.type = GUESSED_ERROR_MESSAGES.INVALID.id;
    error.message = `${guess.country} ${GUESSED_ERROR_MESSAGES.INVALID.message}`;
  }
  if (!(guess.country in countryData.distances)) {
    error.type = GUESSED_ERROR_MESSAGES.INVALID.id;
    error.message = `${guess.country} ${GUESSED_ERROR_MESSAGES.INVALID.message}`;
  }
  if (isGuessADuplicate(guess, levelId)) {
    error.type = GUESSED_ERROR_MESSAGES.DUPLICATE.id;
    error.message = `${guess.country} ${GUESSED_ERROR_MESSAGES.DUPLICATE.message}`;
  }
  if ('type' in error) {
    displayErrorMessage(error.type, error.message);
    return false;
  }
  return true;
}

// remove me - just to remember it's here
export function isGuessInCountryData(guess, countryData) {
  return toTitleCase(guess) in countryData;
}

/**
 * Returns whether the same valid guess has already been made.
 *
 * @param {object} guess The guess made.
 * @param {number} levelId Level identifier
 * @return {boolean} only true if the guess already exists.
 */
function isGuessADuplicate(guess, levelId) {
  let foundDuplicateGuess = false;
  const level = getLevels().find((l) => l.id == levelId);
  return level?.guesses.find((g) => g.country == guess.country) ? true : false;
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

/**
 * Display country cards for a target level.
 * 
 * @param {number} levelId The level identifier to generate guessed cards for.
 * @param {object} dynamicLevels The levels to load guessed cards from.
 * @return {undefined} 
 */
export function createGuessedCardElements(levelId, dynamicLevels) {
  if (dynamicLevels) {
    const level = dynamicLevels.find((l) => l.id == levelId);
    level?.guesses.forEach((guess) => {
      const card = { title: guess.country, grade: `${guess.distance}km` };
      COUNTRY_CARD.COLOUR = ENTITY_COLOURS[guess.country];
      createCardElement(COUNTRY_CARD, card);
    });
  }
}

export function insertSortGuessedCards(levelId) {
  if (getLevel(levelId)) {
    removeAllCards(`.${COUNTRY_CARD.ID}`);
    let dynamicLevels = getLevels();
    createGuessedCardElements(levelId, dynamicLevels);
  }
}