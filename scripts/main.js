import { LevelStatus } from "./models/levels.js";
import { toTitleCase, isGuessValid, isGuessADuplicate } from "./util/guess.js";
import { isLevelInProgress } from "./util/object.js";
import { displayErrorMessage } from "./errors.js";
import {
  GUESSED_ERROR_MESSAGES,
  LEVEL_CARD,
  COUNTRY_CARD
} from "./constants.js";
import { 
  createCardElement, 
  createCardElements, 
  createSvgElement,
  createDivElement
} from "./svg.js";
import { 
  handleDialogOpenEvent,
  attachEndLevelEvents,
  attachEndLevelEventNext,
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
  sliceLevelsWithoutCurrentLevel,
  reloadLevelCards,
  removeAllCards
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

          const levelIndex = levels.findIndex(l => l.id == level.id);
          levels[levelIndex].status = LevelStatus.completed;
        } else {
          guess.distance = Math.round(data.distances[guess.country][level.origin]);
          level.status = LevelStatus.inProgress;
        }
        setLocalStorageLevels(level, guess);
        insertSortInProgressLevelGuessCard(level.id);
        
        // TODO: Fix this repetitive if stmt, could be done above instead?
        if (guess.country === level.origin) {
          reloadLevelCards(levels); // to re-tag levels
          const incompleteLevels = levels.filter(l => l.status != 2);
          const incompleteLevelIndex = incompleteLevels.findIndex(l => l.id == level.id);
          const incompleteLevelsWithoutCurrentLevel = sliceLevelsWithoutCurrentLevel(incompleteLevels, incompleteLevelIndex);
          attachEndLevelEventNext(incompleteLevelsWithoutCurrentLevel?.[0]);

          let endLevelDialog = createEndLevelDialog(level.id);
          dispatchEndLevelEvent(endLevelDialog);
        }
      }
    }
  });
}



function insertSortInProgressLevelGuessCard(levelId) {
  if (isLevelInProgress(levelId)) {
    removeAllCards(`.${COUNTRY_CARD.ID}`);
    loadGuessedCards(levelId);
  }
}

function attachFormDataEvent(formElem, levels, level) {
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

function attachFormSubmitEvent(formElem) {
  formElem.addEventListener("submit", (e) => {
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
  
  fetchJsonFile("data/levels.json").then((data) => {
    let levels = data.levels;
    levels = tagLevelsStatus(levels, localStorageLevels);
    setLatestLevel(levels, level);
    attachEndLevelEvents();

    if (level.status == LevelStatus.completed) {
      let endLevelDialog = createEndLevelDialog(level.id);
      dispatchEndLevelEvent(endLevelDialog);   
    }

    createCardElements(LEVEL_CARD, levels);
    loadLevelAttributes(level);
    attachFormDataEvent(formElem, levels, level);
    // TODO:
    // 1: Remove guess in countryData from isGuessValid so that you can run this check first before having to await levelsData
    // 2: Simplify isGuessValid function, it shouldn't check if guess in CountryData, that's not really for 'guess validity'
    // 3: You should only use countryData when absolutely essential
  });

  handleDialogOpenEvent();
  const formElem = document.querySelector('form');
  attachFormSubmitEvent(formElem);
}

main();
