/* Dynamically create svgs and elements for use in HTML */
import { unloadLevel, loadLevelAttributes } from "./util/utilLevels.js";
import { isEmpty } from "./util/object.js";
import { COLOUR } from "./models/entity-colours.js";
import { LevelStatusToColour } from "./models/levels.js";
import { LevelStatus } from "./models/levels.js";
import { setLastLevelOpened } from "./local-storage.js";
import { 
  createEndLevelDialog, 
  dispatchEndLevelEvent 
} from "./menu.js";
import {
  TEXT_COORDINATES,
  LEVEL_CLASS,
  CARD_PADDING,
  LEVEL_CARD_ATTRIBUTES,
  FORM_GUESS,
  END_LEVEL
} from "./constants.js";

// https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Scripting
export function createSvgElement(id, className, width, height) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "id", id);
  svg.setAttributeNS(null, "class", className);
  svg.setAttributeNS(null, "width", width);
  svg.setAttributeNS(null, "height", height);

  
  // svg.addEventListener('animationend', () => {
  //   svg.classList.add('new-drop-shadow-platinum');
  // }, { once: true }); 
  return svg;
}

function createRectElement(width, height, colour) {
  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttributeNS(null, "x", "5");
  rect.setAttributeNS(null, "y", "5");
  rect.setAttributeNS(null, "width", width);
  rect.setAttributeNS(null, "height", height);
  rect.setAttributeNS(null, "stroke", colour);
  rect.setAttributeNS(null, "stroke-width", "5px");
  rect.setAttributeNS(null, "rx", "10px");
  rect.setAttributeNS(null, "ry", "10px");
  rect.setAttributeNS(null, "stroke-linejoin", "round");
  rect.setAttributeNS(null, "fill-opacity", "0.5");
  rect.setAttributeNS(null, "fill", colour);
  return rect;
}

function createTextElement(x, text) {
  const textNS = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textNS.setAttributeNS(null, "x", x);
  textNS.setAttributeNS(null, "y", "35");
  textNS.setAttributeNS(null, "fill", "white");
  textNS.textContent = text;
  return textNS;
}

export function createButtonElement(id, className, type) {
  const buttonNS = document.createElementNS("http://www.w3.org/2000/xhtml", "button");
  buttonNS.setAttributeNS(null, "id", id);
  buttonNS.setAttributeNS(null, "class", className);
  buttonNS.setAttributeNS(null, "type", type);
  return buttonNS;
}

export function createDivElement(id, className) {
  const container = document.createElement('div');
  container.setAttribute("id", id);
  container.setAttribute("class", className);
  return container;
}

export function createMessageElement(id, className, content) {
  const paragraph = document.createElement("p");
  paragraph.setAttribute("id", id);
  paragraph.setAttribute("class", className);

  const samp = document.createElement("samp");
  samp.textContent = content;
  paragraph.appendChild(samp);
  return paragraph;
}

export function createParagraphElement(id, className, content) {
  const paragraph = document.createElement("p");
  paragraph.setAttribute("id", id);
  paragraph.setAttribute("class", className);

  paragraph.innerHTML = content;
  return paragraph;
}

function attachNewLevelSelectEvent(level, button) {
  const endLevelDialog = document.getElementById(END_LEVEL.DIALOG);
  button.addEventListener("click", () => {
    unloadLevel();
    loadLevelAttributes(level);
    setLastLevelOpened(level.id);
   
    endLevelDialog.close();
    if (level.status == LevelStatus.completed) {
      let endLevelDialog = createEndLevelDialog(level.id);
      dispatchEndLevelEvent(endLevelDialog);
    }
  });
}

// todo: goal is to make a card.js file, acknowledge this is very similar to 
// createGuessedCardElements and have them next to each other so the developer knows

/* See createCardElement(...) */
export function createLevelCardElements(levels) {
  for (const level of levels) {
    const newCard = { title: level.title, measurement: level.difficulty };
    LEVEL_CARD_ATTRIBUTES.COLOUR = LevelStatusToColour[level.status];
    createCardElement(LEVEL_CARD_ATTRIBUTES, newCard, level);
  }
}

/**
 * Creates a card element
 * @param {object} cardAttributes A card's HTML attributes
 * @param {object} newCard A newly prepared card with properties: title, measurement
 * @param {object} level A level's attributes
 * @return {undefined}
 */
export function createCardElement(cardAttributes, newCard, level = undefined) {
  const svgId = newCard.title.split(" ").join("-"); // todo: make this into a numeric identifier
  const svg = createSvgElement(
    svgId,
    cardAttributes.CLASS,
    cardAttributes.WIDTH + CARD_PADDING,
    cardAttributes.HEIGHT + CARD_PADDING
  );

  const parentContainer = document.getElementById(cardAttributes.PARENT);
  if (level) {
    const button = createButtonElement(`level-${level.id}`, LEVEL_CLASS, "submit");
    attachNewLevelSelectEvent(level, button);
    button.appendChild(svg);
    parentContainer.appendChild(button);
  }
  else parentContainer.appendChild(svg);

  const r = createRectElement(
    cardAttributes.WIDTH, 
    cardAttributes.HEIGHT, 
    cardAttributes.COLOUR
  );
  svg.appendChild(r);
  const t1 = createTextElement(TEXT_COORDINATES.X, newCard.title);
  svg.appendChild(t1);
  const t2 = createTextElement(TEXT_COORDINATES.Y, newCard.measurement);
  svg.appendChild(t2);
}

export function removeGuessTextInput() {
  const textInput = document.getElementById(FORM_GUESS.INPUT);
  textInput.value = "";
}

export function removeElementTextValue(id) {
  const element = document.getElementById(id);

  element.value = "";
}

export function removeAllCards(selector) {
  document.querySelectorAll(selector).forEach((e) => e.remove());
}
