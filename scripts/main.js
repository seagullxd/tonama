import { COLOUR, ENTITY_COLOURS } from "./models/entity-colours.js";
import { CONTAINER, COUNTRY_CARD, LEVEL_CARD, LEVEL_CLASS } from "./constants.js";
import {
  saveLocalStorage,
  getUserId,
  loadGuessCards,
} from "./local-storage.js";
import { toTitleCase, isGuessValid, isGuessADuplicate } from "./util/guess.js";
import { createCardElement } from "./svg.js";
import {
  duplicateGuessErrorMessage,
  invalidCountryErrorMessage,
  duplicateGuessTag,
  invalidCountryTag,
  displayErrorMessage,
} from "./errors.js";

function handleDialog() {
  const moreBtn = document.getElementById("more-btn");
  const restartBtn = document.getElementById("restart-btn");
  const levelsBtn = document.getElementById("levels-btn");
  const howToPlayBtn = document.getElementById("how-to-play-btn");
  const faqBtn = document.getElementById("faq-btn");
  const settingsBtn = document.getElementById("settings-btn");

  const moreDialog = document.getElementById("moreDialog");
  const restartDialog = document.getElementById("restartDialog");
  const levelDialog = document.getElementById("levelDialog");
  const howToPlayDialog = document.getElementById("howToPlayDialog");
  const faqDialog = document.getElementById("faqDialog");
  const settingsDialog = document.getElementById("settingsDialog");

  const closeBtns = document.querySelectorAll(".close");

  moreBtn.addEventListener("click", () => {
    moreDialog.showModal();
  });

  restartBtn.addEventListener("click", () => {
    handleDialogClose(closeBtns);
    restartDialog.showModal();
  });

  levelsBtn.addEventListener("click", () => {
    handleDialogClose(closeBtns);
    levelDialog.showModal();
  });

  howToPlayBtn.addEventListener("click", () => {
    handleDialogClose(closeBtns);
    howToPlayDialog.showModal();
  });

  faqBtn.addEventListener("click", () => {
    handleDialogClose(closeBtns);
    faqDialog.showModal();
  });

  settingsBtn.addEventListener("click", () => {
    handleDialogClose(closeBtns);
    settingsDialog.showModal();
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.close();
    });
  });
}

function handleDialogClose(closeBtns) {
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

function loadLevelTitle(levelData) {
  const familyName = document.getElementById('family-name');
  familyName.innerHTML = `"${levelData.name}"`;

  const levelTitle = levelData.level.split(" ");

  // classify date into correct superscripts 
  let superscript = 'th';
  const date = levelTitle[0].slice(-1);
  switch (date) {
    case "1":
      superscript = 'st';
      break;
    case "2":
      superscript = 'nd';
      break;
    case "3":
      superscript = 'rd';
      break;
  }
  
  const levelTitleTimeContent = `${levelTitle[0]}<sup>${superscript}</sup> ${levelTitle[1]} ${levelTitle[2]}`
  const levelTitleTime = document.getElementById('level-title-time');
  levelTitleTime.innerHTML = levelTitleTimeContent
}

function removeOnScreenGuessCards() {
  document.querySelectorAll('.guess-card').forEach(e => e.remove());
}

export function loadLevelHandler(levelData) {
  loadLevelTitle(levelData);
  removeOnScreenGuessCards();
  loadGuessCards(levelData.id);
  localStorage.setItem("lastLevelIdOpen", levelData.id);

  const closeBtns = document.querySelectorAll(".close");
  handleDialogClose(closeBtns);
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
      l
    )
  };
}

function loadCurrentLevel(allLevels) {
  let currentLevel;
  let currentLevelId = localStorage.getItem("lastLevelIdOpen");
  if (currentLevelId) {
    currentLevel = allLevels.find((level) => level.id == currentLevelId);
    loadGuessCards(currentLevelId);
  } else {
    currentLevel = allLevels[allLevels.length - 1] // default is latest level
  }
  return currentLevel;
}

function main() {
  let currentLevel;
  let allLevelsData;
  // initial level load in
  fetchJsonFile("data/levels.json").then((rawLevelsData) => {
    allLevelsData = rawLevelsData.levels;
    loadLevelCards(allLevelsData);
    currentLevel = loadCurrentLevel(allLevelsData);
    loadLevelTitle(currentLevel);
  });

  handleDialog();

  const formElem = document.querySelector("form");
  formElem.addEventListener("submit", (e) => {
    // on form submission, prevent default
    e.preventDefault();

    // construct a FormData object, which fires the formdata event
    new FormData(formElem);
  });

  formElem.addEventListener("formdata", (e) => {
    let guess = {
      country: undefined,
      distance: undefined,
    };
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
        // handle a user changing between levels
        let currentLevelId = localStorage.getItem("lastLevelIdOpen");  
        if (currentLevelId) {
          if (currentLevelId != currentLevel.id) {
            currentLevel = allLevelsData.find((level) => level.id == currentLevelId);
          }
        }
        if (isGuessADuplicate(guess, currentLevel.id)) {
          displayErrorMessage(
            `${guess.country} ${duplicateGuessErrorMessage}`,
            duplicateGuessTag,
          );
        } else {
          guess.country = toTitleCase(guess.country);
          let distance = Math.round(data.distances[guess.country][currentLevel.origin])
          guess.distance = guess.country == currentLevel.origin ? 0 : distance;
          saveLocalStorage(getUserId(), currentLevel.id, currentLevel.level, guess, 0);
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

main();
