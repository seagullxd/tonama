import { LevelStatus } from "./models/levels.js";
import { toTitleCase, isGuessValid, isGuessADuplicate } from "./util/guess.js";
import { createCardElement, createCardElements } from "./svg.js";
import { isLevelInProgress } from "./util/object.js";
import { displayErrorMessage } from "./errors.js";
import {
  GUESSED_ERROR_MESSAGES,
  LEVEL_CARD
} from "./constants.js";
import { 
  handleDialogEvent,
  attachEndLevelEvent,
  createEndLevelDialog,
  dispatchEndLevelEvent
} from "./menu.js";
import {
  setLocalStorageLevels,
  getLocalStorageLevels
} from "./local-storage.js";
import { 
  loadLevelAttributes,
  setLatestLevel,
  loadGuessedCards,
  filterIncompleteLevels,
  removeOnScreenGuessCards
} from "./util/utilLevels.js";


export async function fetchJsonFile(filename) {
  const response = await fetch(filename);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data;
}

function validateGuess(guess, levels, level) {
  fetchJsonFile("data/comprehensive_country_distances.json").then((data) => {
    if (!isGuessValid(guess.country, data.distances)) {
      displayErrorMessage(
        GUESSED_ERROR_MESSAGES.INVALID.id,
        `${guess.country} ${GUESSED_ERROR_MESSAGES.INVALID.message}`
      );
    } else {
      setLatestLevel(levels, level);
      if (isGuessADuplicate(guess, level.id)) {
        displayErrorMessage(
          GUESSED_ERROR_MESSAGES.DUPLICATE.message,
          `${guess.country} ${GUESSED_ERROR_MESSAGES.DUPLICATE.message}`
        );
      } else {
        guess.country = toTitleCase(guess.country);
        if (guess.country == level.origin) {
          guess.distance = 0;
          level.status = LevelStatus.completed;
        } else {
          guess.distance = Math.round(data.distances[guess.country][level.origin]);
          level.status = LevelStatus.inProgress;
        }
        setLocalStorageLevels(level, guess);
        insertSortInProgressLevelGuessCard(level.id);
        let endLevelDialog = createEndLevelDialog(level.id);
        if (guess.country == level.origin) {
          dispatchEndLevelEvent(endLevelDialog);
        }
      }
    }
  });
}

function insertSortInProgressLevelGuessCard(levelId) {
  if (isLevelInProgress(levelId)) {
    removeOnScreenGuessCards();
    loadGuessedCards(levelId);
  }
}

function handleFormDataEvent(formElem, levels, level) {
  let guess = {
    country: undefined,
    distance: undefined,
  };
  formElem.addEventListener("formdata", (e) => {
    for (const value of e.formData.values()) {
      guess.country = value;
    }
    validateGuess(guess, levels, level);
  });
}

function handleFormSubmitEvent(formElem) {
  formElem.addEventListener("submit", (e) => {
    // on form submission, prevent default
    e.preventDefault();

    // construct a FormData object, which fires the formdata event
    new FormData(formElem);
  });
}

function tagLevelsStatus(levels, localStorageLevels) {
  return levels.map(l => {
    return {...l, status: localStorageLevels.find(cl => cl.id == l.id)?.status ?? l.status}
  })
}

function main() {
  let level = {};
  const localStorageLevels = getLocalStorageLevels();

  attachEndLevelEvent();
  fetchJsonFile("data/levels.json").then((data) => {
    let levels = data.levels;
    levels = tagLevelsStatus(levels, localStorageLevels);
    setLatestLevel(levels, level);
    
    if (level.status == LevelStatus.completed) {
      let endLevelDialog = createEndLevelDialog(level.id);
      dispatchEndLevelEvent(endLevelDialog);
    }

    createCardElements(LEVEL_CARD, levels);
    loadLevelAttributes(level);
    handleFormDataEvent(formElem, levels, level);

    let completedLevels = filterIncompleteLevels(localStorageLevels);
  });

  handleDialogEvent();
  const formElem = document.querySelector("form");
  handleFormSubmitEvent(formElem);
}

main();
