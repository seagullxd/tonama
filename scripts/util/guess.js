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

export function isGuessValid(guess, countryData) {
  console.log(`${guess} in ${countryData}: ${toTitleCase(guess) in countryData}`);
  console.log(`${hasAppropriateGuessLength(guess)} ${hasOnlyLetterAndSpaces(guess)} ${toTitleCase(guess) in countryData} ${!hasMisplacedCapital(guess)} `)
  return (
    hasAppropriateGuessLength(guess) &&
    hasOnlyLetterAndSpaces(guess) &&
    toTitleCase(guess) in countryData &&
    !hasMisplacedCapital(guess)
  );
}

/**
 * Returns whether a valid guess has already been made.
 *
 * @param {object} guess The guess made.
 * @param {number} currentLevelId Level identifier
 * @return {boolean} only true if the guess already exists.
 */
export function isGuessADuplicate(guess, currentLevelId) {
  let id = localStorage.getItem("id");
  let foundDuplicateGuess = false;
  if (id) {
    // handle duplicate guess
    let storedLevels = JSON.parse(localStorage.getItem("levels"));
    console.log(`storedLevels is ${storedLevels}`);
    if (storedLevels) {
      const level = storedLevels.find((l) => l.id == currentLevelId);
      if (level) {
        foundDuplicateGuess = level.guesses.find((g) => g.country == toTitleCase(guess.country));
      }
    }
  }
  return foundDuplicateGuess;
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