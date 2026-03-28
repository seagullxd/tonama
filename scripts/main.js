import { LevelStatus } from "./models/levels.js";
import { COLOUR, ENTITY_COLOURS } from "./models/entity-colours.js";
import { toTitleCase, isGuessValid, isGuessADuplicate } from "./util/guess.js";
import { createCardElement } from "./svg.js";
import { handleDialogEvent, handleEndLevelEvent } from "./menu.js";
import { isLevelInProgress } from "./util/object.js";
import { displayErrorMessage } from "./errors.js";
import {
  COUNTRY_CARD,
  LEVEL_CARD,
  LEVEL_CLASS,
  DIALOG_CONFIG,
  END_LEVEL,
  ERROR_MESSAGES,
} from "./constants.js";
import {
  saveLocalStorage,
  getUserId,
  loadGuessedCards,
  loadLevelTitleElement,
  loadCurrentLevelProperties,
  loadLevelStorage,
  removeOnScreenGuessCards,
  removeLocalStorageLevelProperties,
} from "./local-storage.js";


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
        `${guess.country} ${ERROR_MESSAGES.INVALID.message}`,
        ERROR_MESSAGES.INVALID.id
      );
    } else {
      loadCurrentLevelProperties(allLevelsData, currentLevel);
      if (isGuessADuplicate(guess, currentLevel.id)) {
        displayErrorMessage(
          `${guess.country} ${ERROR_MESSAGES.DUPLICATE.message}`,
          ERROR_MESSAGES.DUPLICATE.message
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
  console.log("end level f()");
  const endLevelDialogElement = document.getElementById(END_LEVEL.DIALOG);
  const endLevelEvent = new CustomEvent(END_LEVEL.EVENT, {
    detail: "End level event message",
  });
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
    loadGuessedCards(currentLevelId);
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
    const levelSubset = { title: l.title, measure: l.difficulty };
    createCardElement(LEVEL_CARD, levelSubset, l);
  }
}

function getNextLevel(allLevelsData, currentLevel) {
  let nextLevel;
  removeLocalStorageLevelProperties(currentLevel);
  for (let index = 0; index < allLevelsData.length; index++) {
    console.log(
      `comparison: ${JSON.stringify(allLevelsData[index])} ${JSON.stringify(currentLevel)}`
    );
    console.log(
      `${JSON.stringify(allLevelsData[index]) === JSON.stringify(currentLevel)}`
    );
    console.log(`${index + 1} ${allLevelsData.length}`);
    if (JSON.stringify(allLevelsData[index]) === JSON.stringify(currentLevel)) {
      if (index + 1 < allLevelsData.length) {
        nextLevel = allLevelsData[index + 1];
        break;
      }
    }
  }
  console.log(`newLevel ${nextLevel}`);
  return nextLevel;
}

function main() {
  let currentLevel = {};
  // initial level load in
  fetchJsonFile("data/levels.json").then((rawLevelsData) => {
    const allLevelsData = rawLevelsData.levels;

    loadLevelCards(allLevelsData);
    loadCurrentLevelProperties(allLevelsData, currentLevel, true);
    loadLevelTitleElement(currentLevel);
    handleFormDataEvent(formElem, allLevelsData, currentLevel);
    const newLevel = getNextLevel(allLevelsData, currentLevel);
    handleEndLevelEvent(allLevelsData, currentLevel, newLevel);
  });

  handleDialogEvent();
  const formElem = document.querySelector("form");
  handleFormSubmitEvent(formElem);
}

main();
