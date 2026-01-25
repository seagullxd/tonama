import { countryColours } from "./models/colours.js";
import { LevelStatus } from "./models/levels.js";
import PlayerCards from "./player-cards.js";
import {
  saveLocalStorage,
  loadLocalStorage
} from "./local-storage.js";
import {
  toTitleCase,
  isGuessValid
} from "./util/guess.js";
import { displayCard } from "./svg.js";
import {
  duplicateGuessErrorMessage,
  invalidCountryErrorMessage,
  duplicateGuessTag,
  invalidCountryTag,
} from "./errors.js";

function addTempParagraph(message, messageType) {
  let node = document.querySelector("#guessed-message");
  if (!node) {
    console.log(message);
    const messageContainer = "tags";
    node = document.getElementById(messageContainer);
    const pElement = document.createElement("p");
    pElement.setAttribute("class", "message");
    pElement.setAttribute("id", messageType);

    const sampElement = document.createElement("samp");
    sampElement.textContent = message;
    node.appendChild(pElement);
    pElement.appendChild(sampElement);

    setTimeout(function () {
      node.removeChild(pElement);
      console.log("Message removed");
    }, 5000);
  }
}

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

function main() {
  handleDialogClose();
  let userData = loadLocalStorage();

  //TODO: add code to handle creation of level cards
  // todo3: do the same for other svg creation methods

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
    let guess = "";
    for (const value of data.values()) {
      guess = value;
    }

    const currentLevel = "12 Jan 2026";
    const playerCards = new PlayerCards();
    if (isGuessValid(guess)) {
      // if this level was previously in progress, then add to its guess data
      let levelData = [];
      if (userData) {
        if ("levels" in userData) {
          for (var level in userData.levels) {
            if (level.name == currentLevel) {
              levelData = level;
              break;
            }
          }
          // handle if level does not exist
        }
      }

      // make a new data instance and add to it

      // then proceed with saveLocalStorage()
      saveLocalStorage("", "Tues 13 Jan 25", level); // checkpoint #1

      const titleCasedGuess = toTitleCase(guess);
      if (!playerCards.hasCard(titleCasedGuess)) {
        playerCards.addCard(titleCasedGuess, countryColours[titleCasedGuess]);
        displayCard(titleCasedGuess, "500km", countryColours[titleCasedGuess]);
      } else {
        addTempParagraph(
          `${titleCasedGuess} ${duplicateGuessErrorMessage}`,
          duplicateGuessTag,
        );
      }
    } else {
      addTempParagraph(
        `${guess} ${invalidCountryErrorMessage}`,
        invalidCountryTag,
      );
    }
  });
}

main();
