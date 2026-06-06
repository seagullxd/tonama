import { LevelStatus } from "./models/levels.js";
import { ENTITY_COLOURS } from "./models/entity-colours.js";
import {
  PATH,
  DIALOG_FAQ,
  CLASS_TRIM_VERTICAL_MARGINS
} from "./constants.js";
import { 
  createLevelCardElements, 
  createParagraphElement
} from "./svg.js";
import { 
  insertSortGuessedCards,
  isInputValid,
  isGuessValidNew,
  toTitleCase,
  scrollToCard,
  displayNewCardEffect
} from "./util/guess.js";
import { 
  handleDialogOpenEvent,
  attachButtonParentDialogCloseEvents,
  attachEndLevelEvents,
  attachEndLevelEventNext,
  createEndLevelDialog,
  dispatchEndLevelEvent
} from "./menu.js";
import {
  getLevels,
  getLevelIndex,
  setLevelGuess,
  getLastLevelIdOpened,
  setLastLevelOpened
} from "./local-storage.js";
import { 
  loadLevelAttributes,
  setStaticLevel,
  reloadLevelCards,
  findNextLevelsToComplete
} from "./util/utilLevels.js";

// todo: refactor so that js files contain functions that make sense
// want to eliminate menu.js and just group into business logic 
// e.g., attachFormDataEvent should be in guess.js, applyGuess should be in guess.js
// meanwhile, you should rename utilLevels.js to just levels because its role is beyond just helper functions now

export async function fetchJsonFile(filename) {
  const response = await fetch(filename);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  return data;
}

function applyGuess(guess, levels, level, countryData) {
  if (guess.country === level.origin) {
    guess.distance = 0;
    level.status = LevelStatus.completed; 
    levels[getLevelIndex(level.id)].status = LevelStatus.completed;
    // todo: do we need to reload every level? or can we just do the one?
    reloadLevelCards(levels); // to re-tag levels
    const nextLevelToComplete = findNextLevelsToComplete(levels, level)?.[0];
    attachEndLevelEventNext(nextLevelToComplete);
    const endLevelDialog = createEndLevelDialog(level.id);
    dispatchEndLevelEvent(endLevelDialog);
  } else {
    guess.distance = Math.round(countryData.distances[guess.country][level.origin]);
    level.status = LevelStatus.inProgress;
  }
  setLevelGuess(level, guess);
}

function attachFormSubmitEvent(formElem, levels) {
  formElem.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = document.getElementById("form-container-input-text");
    if (isInputValid(input)) {
      fetchJsonFile(`${PATH.PARENT}/${PATH.COUNTRIES_FILE}`).then((countryData) => {
        let level = {};
        setStaticLevel(level, levels, getLastLevelIdOpened());
        const guessCountryCapitals = toTitleCase(input.value);
        let guess = {
          id: guessCountryCapitals.split(" ").join("-"),
          country: guessCountryCapitals,
          distance: undefined,
        };
        if (isGuessValidNew(guess, countryData, level.id)) {
          applyGuess(guess, levels, level, countryData);

          if (getLastLevelIdOpened() != level.id) {
            setLastLevelOpened(level.id);
          }
          insertSortGuessedCards(level.id);
          scrollToCard(guess.id);
          displayNewCardEffect(guess.id);
        }
      });
    }
  });
}

/**
 * Map the fetched local storage levels status to static levels.
 * Useful to re-tag static levels status.
 * 
 * @param {array} staticLevels Static levels to be map to
 * @param {array} fetchedLevels Fetched levels to map from
 * @return {object} level The level now set.
 */
function mapFetchedLevelsStatusToStaticLevels(staticLevels, fetchedLevels) {
  return staticLevels.map(sl => {
    return {...sl, status: fetchedLevels.find(fl => fl.id == sl.id)?.status ?? sl.status}
  })
}

function createFaqQuestionsAndAnswers() {
  const parent = document.getElementById(DIALOG_FAQ.ARTICLE);
  fetchJsonFile(`${PATH.PARENT}/${PATH.FAQ_FILE}`).then((data) => {
    data.faq.forEach(qa => {
      let question = createParagraphElement(undefined, CLASS_TRIM_VERTICAL_MARGINS, qa.question);
      let answer = createParagraphElement(undefined, DIALOG_FAQ.ANSWER, qa.answer);
      parent.appendChild(question);
      parent.appendChild(answer);
    })
  })
}

function main() {
  let level = {};
  const formElem = document.querySelector('form');
  attachEndLevelEvents();
  createFaqQuestionsAndAnswers();

  fetchJsonFile(`${PATH.PARENT}/${PATH.LEVELS_FILE}`).then((data) => {
    let levels = mapFetchedLevelsStatusToStaticLevels(data.levels, getLevels());
    createLevelCardElements(levels);
    setStaticLevel(level, levels, getLastLevelIdOpened()); 

    if (level.status == LevelStatus.completed) {
      let endLevelDialog = createEndLevelDialog(level.id);
      dispatchEndLevelEvent(endLevelDialog);   
    }
    loadLevelAttributes(level);
    attachFormSubmitEvent(formElem, levels);
  });
  handleDialogOpenEvent();
  attachButtonParentDialogCloseEvents();
}

main();
