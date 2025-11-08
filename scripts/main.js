import { countryColours } from './colours.js';
import PlayerCards from './player_cards.js';

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

function displayMessage(country, distance, colour) {
  const textCoordinateX = "30"; 
  const textCoordinateY = "180"; 
  const articleContainer = "core"

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

function main() {

  const formElem = document.querySelector("form");
  formElem.addEventListener("submit", (e) => {
    // on form submission, prevent default
    e.preventDefault();

    // construct a FormData object, which fires the formdata event
    new FormData(formElem);
  });

  const playerCards = new PlayerCards();
  let hasAlreadyBeenGuessed = false 
  formElem.addEventListener("formdata", (e) => {
    console.log("formdata fired");

    // Get the form data from the event object
    const data = e.formData;
    let guess = ''
    for (const value of data.values()) {
      guess = value 
    }

    if (!playerCards.hasCard(guess)) {
      playerCards.addCard(guess, countryColours[guess])
      displayCard(guess, "500km", countryColours[guess])
    } else {
      addTempParagraph(`${guess} has already been guessed.`, "guessed-message")
    }
  });
}

main()

