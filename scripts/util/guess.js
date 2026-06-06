import { ENTITY_COLOURS } from "../models/entity-colours.js";
import { getLevel, getLevels } from "../local-storage.js"
import { displayNewError } from "../errors.js";
import { createCardElement, removeAllCards } from "../svg.js";
import {
  GUESSED_ERROR_MESSAGES,
  GUESSED_CARD_ATTRIBUTES
} from "../constants.js";

// https://stackoverflow.com/a/196991
export function toTitleCase(str) {
  return str.replace(
  /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

/**
 * Returns whether the input is valid. 
 * A valid input should meet the below conditions:
 * - minLength <= input <= maxLenght 
 * - Alphabetical character(s) with a space - see index.html for full regex
 * - capital letter is only at the start of a word
 * 
 * @param {object} input The user's input.
 * @return {boolean} only true if the input is valid.
 */
export function isInputValid(input) {
  let error = { "type": GUESSED_ERROR_MESSAGES.INVALID.id };
  input.validity.misplacedCapital = hasMisplacedCapital(input.value);
  switch (true) {
    case input.validity.valueMissing:
      error.message = GUESSED_ERROR_MESSAGES.INVALID.message2;
      break;
    case input.validity.tooShort:
      error.message = GUESSED_ERROR_MESSAGES.INVALID.message3;
      break;
    case input.validity.tooLong:
      error.message = GUESSED_ERROR_MESSAGES.INVALID.message4;
      break;
    case input.validity.patternMismatch:
      error.message = GUESSED_ERROR_MESSAGES.INVALID.message5;
      break;
    case input.validity.misplacedCapital:
      error.message = GUESSED_ERROR_MESSAGES.INVALID.message6;
      break;
    default:
      return true;
  }
  displayNewError(error.message);
  return false
}

/**
 * Returns whether a guess is valid. 
 * A valid guess should meet the below conditions:
 * - guess ∈ acceptable countries
 * - guess ∉ already guessed countries
 *
 * @param {object} guess The guess made.
 * @param {countryData} countryData contains all acceptable the countries.
 * @param {number} levelId Level identifier.
 * @return {boolean} only true if the guess is valid.
 */
export function isGuessValidNew(guess, countryData, levelId) {
  let error = { "type": GUESSED_ERROR_MESSAGES.INVALID.id };
  switch (true) {
    case !(guess.country in countryData.distances):
      error.message = `${guess.country} ${GUESSED_ERROR_MESSAGES.INVALID.message}`;
      break;
    case isGuessADuplicate(guess, levelId):
      error.type = GUESSED_ERROR_MESSAGES.DUPLICATE.id;
      error.message = `${guess.country} ${GUESSED_ERROR_MESSAGES.DUPLICATE.message}`;
      scrollToCard(guess.id);
      displayNewCardEffect(guess.id);
      break;
    default:
      return true;
  }
  displayNewError(error.message);
  return false; 
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


// todo: goal is to make a card.js file, acknowledge this is very similar to 
// createGuessedCardElements and have them next to each other so the developer knows
// OR make a level.js file (rename the one in models/)
/**
 * Display country cards for a target level.
 * 
 * @param {number} levelId The level identifier to generate guessed cards for.
 * @param {object} dynamicLevels The levels to load guessed cards from.
 * @return {undefined} 
 */
export function createGuessedCardElements(guesses) {
  guesses?.forEach((guess) => {
    const newCardContents = { title: guess.country, measurement: `${guess.distance} km` };
    GUESSED_CARD_ATTRIBUTES.COLOUR = ENTITY_COLOURS[guess.country];
    createCardElement(GUESSED_CARD_ATTRIBUTES, newCardContents);
  });
}

export function insertSortGuessedCards(levelId) {
  if (getLevel(levelId)) {
    removeAllCards(`.${GUESSED_CARD_ATTRIBUTES.CLASS}`);
    const level = getLevels()?.find((l) => l.id == levelId);
    createGuessedCardElements(level?.guesses);
  }
}

export function scrollToCard(id) {
  const card = document.getElementById(id);
  card.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'   
  });
}

export function displayNewCardEffect(id) {
  const newCard = document.getElementById(id);
  newCard.style.filter = `drop-shadow(0 -1mm 2mm ${ENTITY_COLOURS[id]})`;
  setTimeout(function () {
    newCard.style.filter = "";
  }, 3000);
}