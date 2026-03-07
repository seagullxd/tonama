import { COLOUR, ENTITY_COLOURS } from "./models/entity-colours.js";
import {
  CONTAINER,
  COUNTRY_CARD,
  LEVEL_CARD,
  LEVEL_CLASS,
  DIALOG_CONFIG,
} from "./constants.js";
import {
  saveLocalStorage,
  getUserId,
  loadGuessCards,
} from "./local-storage.js";
import { toTitleCase, isGuessValid, isGuessADuplicate } from "./util/guess.js";
import { createCardElement, loadLevelTitleElement } from "./svg.js";
import {
  duplicateGuessErrorMessage,
  invalidCountryErrorMessage,
  duplicateGuessTag,
  invalidCountryTag,
  displayErrorMessage,
} from "./errors.js";

/**
 * Add event listener to a given HTML element.
 * @param {Element} the HTML element to attach event listener to.
 * @param {Element} successorElement the successor HTML element to display.
 * @return {undefined}
 */
function attachEventListener(element, successorElement) {
  const closeBtns = document.querySelectorAll(".close");

  element.addEventListener("click", () => {
    handleDialogClose(closeBtns);
    successorElement.showModal();
  });
}

function handleDialogEvent() {
  const closeBtns = document.querySelectorAll(".close");
  Object.entries(DIALOG_CONFIG).forEach(([key, { button, dialog }]) => {
    const buttonElement = document.getElementById(button);
    const dialogElement = document.getElementById(dialog);
    buttonElement.addEventListener("click", () => {
      handleDialogClose(closeBtns);
      dialogElement.showModal();
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.close();
    });
  });
}

export function handleDialogClose(closeBtns) {
  closeBtns.forEach((btn) => {
    btn.parentElement.close();
  });
}

export async function fetchJsonFile(filename) {
  const response = await fetch(filename);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data;
}

function loadLevelCards(allLevelsData) {
  for (const l of allLevelsData) {
    createCardElement(
      l.level,
      l.difficulty,
      COLOUR.FRESH_SKY,
      CONTAINER.LEVELS,
      LEVEL_CARD.WIDTH,
      LEVEL_CARD.HEIGHT,
      true,
      l,
    );
  }
}

/**
 * Load the last level opened by using local storage.
 * @param {object} allLevelsData all levels
 * @param {object} currentLevel level to be replaced
 * @param {boolean} triggerLoadInGuessCards false by default
 * @return {object} the last level to be modified in local storage
 */
function loadLastLevelOpened(allLevelsData, currentLevel, triggerLoadInGuessCards=false) {
  let lastLevelIdOpened = localStorage.getItem("lastLevelIdOpened");
  let newLevelToSet;
  if (lastLevelIdOpened) {
    newLevelToSet = allLevelsData.find((level) => level.id == lastLevelIdOpened);
    if (triggerLoadInGuessCards) {
      loadGuessCards(lastLevelIdOpened);
    }
  } else {
    newLevelToSet = allLevelsData[allLevelsData.length - 1] // default is latest level
  }
  currentLevel.id = newLevelToSet.id;
  currentLevel.level = newLevelToSet.level;
  currentLevel.difficulty = newLevelToSet.difficulty;
  currentLevel.name = newLevelToSet.name;
  currentLevel.origin = newLevelToSet.origin;
  return currentLevel;
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

    fetchJsonFile("data/comprehensive_country_distances.json").then((data) => {
      if (!isGuessValid(guess.country, data.distances)) {
        displayErrorMessage(
          `${guess.country} ${invalidCountryErrorMessage}`,
          invalidCountryTag,
        );
      } else {
        loadLastLevelOpened(allLevelsData, currentLevel);
        if (isGuessADuplicate(guess, currentLevel.id)) {
          displayErrorMessage(
            `${guess.country} ${duplicateGuessErrorMessage}`,
            duplicateGuessTag,
          );
        } else {
          guess.country = toTitleCase(guess.country);
          let distance = Math.round(
            data.distances[guess.country][currentLevel.origin],
          );
          guess.distance = guess.country == currentLevel.origin ? 0 : distance;
          saveLocalStorage(
            getUserId(),
            currentLevel.id,
            currentLevel.level,
            guess,
            0,
          );
          createCardElement(
            guess.country,
            `${guess.distance}km`,
            ENTITY_COLOURS[guess.country],
            CONTAINER.GUESSED_CARDS,
            COUNTRY_CARD.WIDTH,
            COUNTRY_CARD.HEIGHT,
          );
        }
      }
    });
  });
}

function main() {
  let currentLevel = { };
  let allLevelsData;
  // initial level load in
  fetchJsonFile("data/levels.json").then((rawLevelsData) => {
    allLevelsData = rawLevelsData.levels;
    loadLevelCards(allLevelsData);
    loadLastLevelOpened(allLevelsData, currentLevel, true);
    handleFormDataEvent(formElem, allLevelsData, currentLevel);
    loadLevelTitleElement(currentLevel);
  });

  handleDialogEvent();
  const formElem = document.querySelector("form");
  handleFormSubmitEvent(formElem);
  
}

main();
