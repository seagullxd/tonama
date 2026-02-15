import { ENTITY_COLOURS } from "./models/entity-colours.js";
import {
  saveLocalStorage,
  getId,
  generateDateId,
  loadLevelCards,
} from "./local-storage.js";
import { toTitleCase, isGuessValid, isGuessADuplicate } from "./util/guess.js";
import { displayCard } from "./svg.js";
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
  const levelBtn = document.getElementById("level-btn");
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

  levelBtn.addEventListener("click", () => {
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

function main() {
  handleDialog();
  const origin = "Wales";

  let currentLevel = localStorage.getItem("lastLevelOpen");
  let currentLevelId;
  if (currentLevel) {
    currentLevelId = generateDateId(currentLevel);
    loadLevelCards(currentLevelId);
  } else {
    currentLevel = "26 Jan 25"; // TODO: implement level select
    currentLevelId = generateDateId(currentLevel);
  }

  const formElem = document.querySelector("form");
  formElem.addEventListener("submit", (e) => {
    // on form submission, prevent default
    e.preventDefault();

    // construct a FormData object, which fires the formdata event
    new FormData(formElem);
  });

  formElem.addEventListener("formdata", (e) => {
    console.log("formdata fired");

    // Get the form data from the event object
    const data = e.formData;

    let guess = {
      country: undefined,
      distance: undefined,
    };
    for (const value of data.values()) {
      guess.country = value;
    }

    fetchJsonFile("data/comprehensive_country_distances.json").then((data) => {
      const titleCasedGuess = toTitleCase(guess.country);
      if (!isGuessValid(guess.country, data.distances)) {
        displayErrorMessage(
          `${guess.country} ${invalidCountryErrorMessage}`,
          invalidCountryTag,
        );
      } else {
        if (isGuessADuplicate(guess, currentLevelId)) {
          displayErrorMessage(
            `${guess.country} ${duplicateGuessErrorMessage}`,
            duplicateGuessTag,
          );
        } else {
          guess.distance = Math.round(data.distances[guess.country][origin]);
          saveLocalStorage(getId(), currentLevel, guess, currentLevel, 0);
          console.log(`displayCard ${titleCasedGuess} ${ENTITY_COLOURS[titleCasedGuess]}`);
          displayCard(
            titleCasedGuess,
            `${guess.distance}km`,
            ENTITY_COLOURS[titleCasedGuess],
          );
        }
      }
    });
  });
}

main();
