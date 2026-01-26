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
  displayErrorMessage
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

function main() {
  handleDialog();
  // check if playing a level 
  let currentLevel = localStorage.getItem("lastLevelOpen"); // todo: revise this method
  let currentLevelId = undefined;
  if (currentLevel) {
    currentLevelId = generateDateId(currentLevel);
    let storedLevels = JSON.parse(localStorage.getItem("levels"));
    if (storedLevels) {
      const level = storedLevels.find((l) => l.id == currentLevelId);
      level.guesses.forEach(guess => {
        const titleCasedGuess = guess.country;
        displayCard(titleCasedGuess, `${guess.distance}km`, countryColours[titleCasedGuess]);    
      })
    }
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
    const titleCasedGuess = toTitleCase(guess.country);
    if (isGuessValid(guess.country)) {
      
      // check if user exists
      let id = localStorage.getItem("id");
      let foundDuplicateGuess = undefined;
      if (id) {
        // handle duplicate guess
        let storedLevels = JSON.parse(localStorage.getItem("levels"));
        console.log(`storedLevels is ${storedLevels}`)
        if (storedLevels) {
          const level = storedLevels.find((l) => l.id == currentLevelId);
          if (level) {
            foundDuplicateGuess = level.guesses.find((g) => g.country == toTitleCase(guess.country));
          }
        }
      }

      if (foundDuplicateGuess) {
        displayErrorMessage(`${guess.country} ${duplicateGuessErrorMessage}`, duplicateGuessTag);
      } else {
        saveLocalStorage(getId(), currentLevelTitle, currentLevelTitle, undefined, guess); 
        displayCard(titleCasedGuess, `${guess.distance}km`, countryColours[titleCasedGuess]);        
      }
    } else {
      displayErrorMessage(
        `${guess.country} ${invalidCountryErrorMessage}`,
        invalidCountryTag,
      );
    }
  });
}

main();