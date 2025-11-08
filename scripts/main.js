import { countryColours } from './colours.js';
import PlayerCards from './player_cards.js';
import { 
  toTitleCase, 
  doesNotContainOnlyLettersSpaces, 
  doesNotContainMisplacedCapital 
} from './helper.js';
import { 
  duplicateGuessErrorMessage, 
  invalidCountryErrorMessage, 
  duplicateGuessTag, 
  invalidCountryTag 
} from './errors.js'

// https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Scripting
function getSvg() {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "width", "280");
  svg.setAttributeNS(null, "height", "60");
  return svg 
}

function getRect(colour) {
  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttributeNS(null, "x", "5");
  rect.setAttributeNS(null, "y", "5");
  rect.setAttributeNS(null, "width", "270");
  rect.setAttributeNS(null, "height", "50");
  rect.setAttributeNS(null, "stroke", colour);
  rect.setAttributeNS(null, "stroke-width", "5px");
  rect.setAttributeNS(null, "rx", "10px");
  rect.setAttributeNS(null, "ry", "10px");
  rect.setAttributeNS(null, "stroke-linejoin", "round");
  rect.setAttributeNS(null, "fill-opacity", "0.5");
  rect.setAttributeNS(null, "fill", colour);
  return rect 
}

function getText(x, text) {
  const textNS = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textNS.setAttributeNS(null, "x", x);
  textNS.setAttributeNS(null, "y", "35");
  textNS.setAttributeNS(null, "fill", "white");
  textNS.textContent = text;
  return textNS
}

function displayCard(country, distance, colour) {
  const textCoordinateX = "30"; 
  const textCoordinateY = "180"; 
  const guessesContainer = "guesses"

  let svg = getSvg();
  let node = document.getElementById(guessesContainer);
  node.appendChild(svg)
  let r = getRect(colour);
  svg.appendChild(r);
  let t1 = getText(textCoordinateX, country);
  svg.appendChild(t1);
  let t2 = getText(textCoordinateY, distance);
  svg.appendChild(t2);
}

function addTempParagraph(message, messageType) {
  let node = document.querySelector('#guessed-message')
  if (!node) {
    console.log(message);
    const messageContainer = "tags"
    node = document.getElementById(messageContainer);
    const pElement = document.createElement("p")
    pElement.setAttribute("class", "message")
    pElement.setAttribute("id", messageType)

    const sampElement = document.createElement("samp")
    sampElement.textContent = message; 
    node.appendChild(pElement);
    pElement.appendChild(sampElement);

    setTimeout(function() {
      node.removeChild(pElement);
      console.log("Message removed")
    }, 5000);  
  }
}

function isGuessTooLong(guess) {
  const maxGuessLength = 56 // based on the longest country name 
  return guess.length > maxGuessLength  
}

function isGuessInvalid(guess) {
  // todo: handle Uppercase letters that occur after the first letter e.g., eNglanD
  console.log(isGuessTooLong(guess))
  console.log(doesNotContainOnlyLettersSpaces(guess)) // good = 
  console.log(!(guess in countryColours)) // true 
  console.log(doesNotContainMisplacedCapital(guess)) // true 
  return isGuessTooLong(guess) || doesNotContainOnlyLettersSpaces(guess) 
    || !(toTitleCase(guess) in countryColours) || doesNotContainMisplacedCapital(guess)
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
    handleDialogClose(closeBtns)
    restartDialog.showModal();
  });

  levelBtn.addEventListener("click", () => {
    handleDialogClose(closeBtns)
    levelDialog.showModal();
  });

  howToPlayBtn.addEventListener("click", () => {
    handleDialogClose(closeBtns)
    howToPlayDialog.showModal();
  });

  faqBtn.addEventListener("click", () => {
    handleDialogClose(closeBtns)
    faqDialog.showModal();
  });

  settingsBtn.addEventListener("click", () => {
    handleDialogClose(closeBtns)
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
  handleDialog()

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
    let guess = ''
    for (const value of data.values()) {
      guess = value 
    }

    const playerCards = new PlayerCards();
    if (!isGuessInvalid(guess)) {
      const titleCasedGuess = toTitleCase(guess);
      if (!playerCards.hasCard(titleCasedGuess)) {
        playerCards.addCard(titleCasedGuess, countryColours[titleCasedGuess])
        displayCard(titleCasedGuess, "500km", countryColours[titleCasedGuess])
      } else {
        addTempParagraph(`${titleCasedGuess} ${duplicateGuessErrorMessage}`, duplicateGuessTag)
      }      
    } else {
      addTempParagraph(`${guess} ${invalidCountryErrorMessage}`, invalidCountryTag)
    }
  });
}

main()

