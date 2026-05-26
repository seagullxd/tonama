import { LevelStatus } from "./models/levels.js";
import { displayErrorMessage } from "./errors.js";
import {
  GUESSED_ERROR_MESSAGES,
  LEVEL_CARD,
  COUNTRY_CARD,
  PATH,
  DIALOG_FAQ,
  CLASS_TRIM_VERTICAL_MARGINS
} from "./constants.js";
import { 
  createCardElement, 
  createCardElements, 
  createSvgElement,
  createDivElement,
  createParagraphElement
} from "./svg.js";
import { 
  toTitleCase, 
  isGuessValid,
  insertSortGuessedCards
} from "./util/guess.js";
import { 
  handleDialogOpenEvent,
  attachEndLevelEvents,
  attachEndLevelEventNext,
  createEndLevelDialog,
  dispatchEndLevelEvent
} from "./menu.js";
import {
  getLevels,
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
    // todo: should var naming distinguish between local storage and static?
    level.status = LevelStatus.completed; 
    const levelIndex = levels.findIndex(l => l.id == level.id);
    levels[levelIndex].status = LevelStatus.completed;
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
  if (getLastLevelIdOpened() != level.id) {
    setLastLevelOpened(level.id);
  }
  insertSortGuessedCards(level.id);
}

function attachFormDataEvent(formElem, levels) {
  let guess = {
    country: undefined,
    distance: undefined,
  };
  formElem.addEventListener("formdata", (e) => {
    for (const value of e.formData.values()) {
      guess.country = value;
    }
    guess.country = toTitleCase(guess.country);
    let lastLevelIdOpened = getLastLevelIdOpened();
    let level = {}; // todo: should we just do level = getStaticLevel??
    fetchJsonFile(`${PATH.PARENT}/${PATH.COUNTRIES_FILE}`).then((countryData) => {
      setStaticLevel(level, levels, lastLevelIdOpened,); // todo: why is this set again?
      if (isGuessValid(guess, countryData, level.id)) {
        applyGuess(guess, levels, level, countryData);  
      }
    });
  });
}

function attachFormSubmitEvent(formElem) {
  formElem.addEventListener("submit", (e) => {
    e.preventDefault();
    // construct a FormData object, which fires the formdata event
    new FormData(formElem);
  });
}

function tagLevelsWithStatus(levels, initialLevels) {
  return levels.map(l => {
    return {...l, status: initialLevels.find(cl => cl.id == l.id)?.status ?? l.status}
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
    let levels = tagLevelsWithStatus(data.levels, getLevels());
    setStaticLevel(level, levels, getLastLevelIdOpened()); 
    // todo: what is the purpose of this again?
    // why can't we just live fetch the latest level? in each new function instead of relying on this?
    // i think it's because of the level.origin... as part of obfuscation

    // todo: create an event listener for this?
    if (level.status == LevelStatus.completed) {
      let endLevelDialog = createEndLevelDialog(level.id);
      dispatchEndLevelEvent(endLevelDialog);   
    }
    createCardElements(LEVEL_CARD, levels);
    loadLevelAttributes(level);

    attachFormDataEvent(formElem, levels, level);
  });
  handleDialogOpenEvent();
  attachFormSubmitEvent(formElem);
}

main();
