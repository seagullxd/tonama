/* Dynamically create svgs and elements for use in HTML */
import { unloadLevel, loadLevelAttributes } from "./util/utilLevels.js";
import { isEmpty } from "./util/object.js";
import { COLOUR } from "./models/entity-colours.js";
import { LevelStatusToColour } from "./models/levels.js";
import {
  TEXT_COORDINATES,
  LEVEL_CLASS,
  CARD_PADDING,
  COUNTRY_CARD,
  LEVEL_CARD,
  GUESS_INPUT
} from "./constants.js";

// https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Scripting
function createSvgElement(width, height, className) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "width", width);
  svg.setAttributeNS(null, "height", height);
  svg.setAttributeNS(null, "class", className);
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

function createButtonElement(type, id, className) {
  const buttonNS = document.createElementNS("http://www.w3.org/1999/xhtml", "button");
  buttonNS.setAttributeNS(null, "type", type);
  buttonNS.setAttributeNS(null, "id", id);
  buttonNS.setAttributeNS(null, "class", className);
  return buttonNS;
}

function handleIncludeButton(svg, parentContainer, levelData) {
  const { id, level, difficulty, name, origin } = levelData;
  let button = createButtonElement("submit", `level-${levelData.id}`, LEVEL_CLASS);
  button.addEventListener("click", () => {
    unloadLevel();
    loadLevelAttributes(levelData);
  });
  button.appendChild(svg);
  parentContainer.appendChild(button);
}

/**
 * Creates a card element
 * @param {object} attributes A card's HTML attributes
 * @param {object} contents A card's content
 * @param {object} level A level's attributes
 * @return {undefined}
 */
export function createCardElement(attributes, content, level = undefined) {
  let parentContainer = document.getElementById(attributes.PARENT);
  if (isEmpty(attributes) || isEmpty(content)) {
    return;
  }

  let svg = createSvgElement(
    attributes.WIDTH + CARD_PADDING,
    attributes.HEIGHT + CARD_PADDING,
    level ? LEVEL_CARD.ID : COUNTRY_CARD.ID
  );

  if (level) {
    handleIncludeButton(svg, parentContainer, level);
    attributes.COLOUR = LevelStatusToColour[level.status];
    console.log(level);
  }
  else parentContainer.appendChild(svg);

  let r = createRectElement(attributes.WIDTH, attributes.HEIGHT, attributes.COLOUR);
  svg.appendChild(r);
  let t1 = createTextElement(TEXT_COORDINATES.X, content.title);
  svg.appendChild(t1);
  let t2 = createTextElement(TEXT_COORDINATES.Y, content.grade);
  svg.appendChild(t2);
}

export function removeGuessTextInput() {
  const textInput = document.getElementById(GUESS_INPUT);
  textInput.value = "";
}

export function removeElementTextValue(id) {
  const element = document.getElementById(id);
  console.log(element);
  element.value = "";
}

export function createCardElements(attributes, contents) {
  // todo: use this function to replace loadGuessedCards(...) in utilLevels.js
  const isLevelCard = attributes.ID == LEVEL_CARD.ID;
  for (const origContent of contents) {
    const content = { title: origContent.title, grade: origContent.difficulty };
    createCardElement(LEVEL_CARD, content, isLevelCard ? origContent : undefined);
  }
}
