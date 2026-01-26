import { countryColours } from "./models/colours.js";
import PlayerCards from "./player-cards.js";
import {
  saveLocalStorage,
  loadLocalStorage,
  getId,
  generateDateId
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
  handleDialog();
  //TODO: add code to handle creation of level cards
  // todo3: do the same for other svg creation methods
  const formElem = document.querySelector("form");
  formElem.addEventListener("submit", (e) => {
    // on form submission, prevent default
    e.preventDefault();

    // construct a FormData object, which fires the formdata event
    new FormData(formElem);
  });

  const currentLevelTitle = "26 Jan 25"; // TODO: implement level select
  const currentLevelId = generateDateId(currentLevelTitle);
  let userData = loadLocalStorage();

  formElem.addEventListener("formdata", (e) => {
    console.log("formdata fired");

    // Get the form data from the event object
    const data = e.formData;
    let guess = {
      "country": undefined,
      "distance": 500
    };
    for (const value of data.values()) {
      guess.country = value;
    }

    const playerCards = new PlayerCards();
    if (isGuessValid(guess.country)) {
      
      // check if user exists
      let id = localStorage.getItem("id");
      if (id) {
        // handle duplicate guess
        let storedLevels = localStorage.getItem("levels");
        if (storedLevels) {
          const level = storedLevels.find((l) => l.id == currentLevelId);
          if (level) {
            const foundGuess = level.guesses.find((g) => g.country == guess.country);
            // CHECKPOINT #3: Handle duplicate guess
            addTempParagraph(`${guess.country} ${invalidCountryErrorMessage}`, invalidCountryTag);
          }
        }
      }

      id = getId();   
      saveLocalStorage(id, currentLevelTitle, currentLevelTitle, undefined, guess); 

      // checkpoint #1 aus day jan 26
      // IS IT AS A SINGLE OBJECT OR MULTIPLE DIFFERENT OBJECTS???

      // TODO: HANDLE DUPLICATE GUESSES
      const titleCasedGuess = toTitleCase(guess.country);
      if (!playerCards.hasCard(titleCasedGuess)) {
        playerCards.addCard(titleCasedGuess, countryColours[titleCasedGuess]);
        displayCard(titleCasedGuess, `${guess.distance}km`, countryColours[titleCasedGuess]);
      } else {
        addTempParagraph(
          `${titleCasedGuess} ${duplicateGuessErrorMessage}`,
          duplicateGuessTag,
        );
      }
    } else {
      addTempParagraph(
        `${guess.country} ${invalidCountryErrorMessage}`,
        invalidCountryTag,
      );
    }
  });
}

main();
