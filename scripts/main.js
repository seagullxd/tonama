import { LevelStatus } from "./models/levels.js";
import { COLOUR, ENTITY_COLOURS } from "./models/entity-colours.js";
import { COUNTRY_CARD, LEVEL_CARD, LEVEL_CLASS, DIALOG_CONFIG, END_LEVEL } from "./constants.js";
import { toTitleCase, isGuessValid, isGuessADuplicate } from "./util/guess.js";
import { createCardElement } from "./svg.js";
import { handleDialogEvent, handleEndLevelEvent } from "./menu.js";
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
        if (guess.country == currentLevel.origin) endLevel();
      }
    }
  });
}

function endLevel(allLevelsData) {
  // prevent any further guessings by removing formInput box
  console.log('end level f()');
  const endLevelDialogElement = document.getElementById(END_LEVEL.DIALOG);
  const endLevelEvent = new CustomEvent(END_LEVEL.EVENT, { "detail": "End level event message" });
  endLevelDialogElement.dispatchEvent(endLevelEvent);

  // reload levels after level state set to completed
    // a custom event should be triggered to prompt a reload of the level cards
    // what does this new level state mean? level can't be edited, when you return to it you're automatically in review state, you may exit this review state with an exit button
  // removeOnScreenGuessCards();
  // loadLevelCards(allLevelsData);

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
  // idea sort localStorage levels in order, then compare each one in this for loop
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
  handleEndLevelEvent();
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
