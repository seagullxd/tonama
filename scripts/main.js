import { LevelStatus } from "./models/levels.js";
import { COLOUR, ENTITY_COLOURS } from "./models/entity-colours.js";
import { COUNTRY_CARD, LEVEL_CARD, LEVEL_CLASS, DIALOG_CONFIG } from "./constants.js";
import { toTitleCase, isGuessValid, isGuessADuplicate } from "./util/guess.js";
import { createCardElement } from "./svg.js";
import { handleDialogEvent } from "./menu.js";
import { isLevelInProgress } from "./util/object.js";
import {
  saveLocalStorage,
  getUserId,
  loadGuessCards,
  loadLevelTitleElement,
  loadCurrentLevelProperties,
  loadLevelStorage,
  removeOnScreenGuessCards
} from "./local-storage.js";
import {
  duplicateGuessErrorMessage,
  invalidCountryErrorMessage,
  duplicateGuessTag,
  invalidCountryTag,
  displayErrorMessage,
} from "./errors.js";

export async function fetchJsonFile(filename) {
  const response = await fetch(filename);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data;
}

function validateGuess(guess, allLevelsData, currentLevel) {
  fetchJsonFile("data/comprehensive_country_distances.json").then((data) => {
    if (!isGuessValid(guess.country, data.distances)) {
      displayErrorMessage(
        `${guess.country} ${invalidCountryErrorMessage}`,
        invalidCountryTag
      );
    } else {
      loadCurrentLevelProperties(allLevelsData, currentLevel);
      if (isGuessADuplicate(guess, currentLevel.id)) {
        displayErrorMessage(
          `${guess.country} ${duplicateGuessErrorMessage}`,
          duplicateGuessTag
        );
      } else {
        guess.country = toTitleCase(guess.country);
        if (guess.country == currentLevel.origin) {
          guess.distance = 0;
          currentLevel.status = LevelStatus.completed;
        } else {
          guess.distance = Math.round(data.distances[guess.country][currentLevel.origin]);
          currentLevel.status = LevelStatus.inProgress;
        }
        saveLocalStorage(currentLevel, guess);
        insertSortInProgressLevelGuessCard(currentLevel.id);
        if (guess.country == currentLevel.origin) endLevel(currentLevel.id);
      }
    }
  });
}

function endLevel(levelId) {
  // set level state to completed

  // display endLevel dialog 
  // prevent any further guessings by removing formInput
}

function insertSortInProgressLevelGuessCard(currentLevelId) {
  if (isLevelInProgress(currentLevelId)) {
    removeOnScreenGuessCards();
    loadGuessCards(currentLevelId);
  }
}

function handleFormSubmitEvent(formElem) {
  formElem.addEventListener("submit", (e) => {
    // on form submission, prevent default
    e.preventDefault();

    // construct a FormData object, which fires the formdata event
    new FormData(formElem);
  });
}

function handleFormDataEvent(formElem, allLevelsData, currentLevel) {
  let guess = {
    country: undefined,
    distance: undefined,
  };
  formElem.addEventListener("formdata", (e) => {
    for (const value of e.formData.values()) {
      guess.country = value;
    }

    validateGuess(guess, allLevelsData, currentLevel);
  });
}

function loadLevelCards(allLevelsData) {
  // todo: compare with user data to see if level.status is not started, in-progress or completed
  for (const l of allLevelsData) {
    createCardElement(
      {
        title: l.title,
        difficulty: l.difficulty,
        ...LEVEL_CARD,
        colour: COLOUR.FRESH_SKY,
      },
      l
    );
  }
}

function main() {
  let currentLevel = {};
  // initial level load in
  fetchJsonFile("data/levels.json").then((rawLevelsData) => {
    const allLevelsData = rawLevelsData.levels;
    loadLevelCards(allLevelsData);
    loadCurrentLevelProperties(allLevelsData, currentLevel, true);
    handleFormDataEvent(formElem, allLevelsData, currentLevel);
    loadLevelTitleElement(currentLevel);
  });

  handleDialogEvent();
  const formElem = document.querySelector("form");
  handleFormSubmitEvent(formElem);
}

main();
