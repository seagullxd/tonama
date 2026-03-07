/* Dynamically create svgs and elements for use in HTML */

import { loadLevelHandler } from "./main.js";
import { TEXT_COORDINATES, LEVEL_CLASS, CARD_PADDING } from "./constants.js";

// https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Scripting
function createSvgElement(width, height, className) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "width", width);
  svg.setAttributeNS(null, "height", height);
  svg.setAttributeNS(null, "class", className);
  return svg;
}

function createRectElement(colour, width, height) {
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
  const buttonNS = document.createElementNS(
    "http://www.w3.org/1999/xhtml",
    "button",
  );
  buttonNS.setAttributeNS(null, "type", type);
  buttonNS.setAttributeNS(null, "id", id);
  buttonNS.setAttributeNS(null, "class", className);
  return buttonNS;
}

function handleIncludeButton(svg, parentContainer, levelData) {
  const { id, level, difficulty, name, origin } = levelData;
  let button = createButtonElement("submit", `level-${levelData.id}`, LEVEL_CLASS);
  button.addEventListener("click", () => {
    loadLevelHandler(levelData);
  });
  button.appendChild(svg);
  parentContainer.appendChild(button);
}

export function createCardElement(
  title,
  measure,
  colour,
  parentContainerHtmlId,
  width,
  height,
  includeButton = false,
  levelData = {}
) {
  
  let parentContainer = document.getElementById(parentContainerHtmlId);
  if ((!width && !height) || !parentContainer) {
    return;
  }


  // tech debt: using includeButton to determine if card is for guess or level
  let svg = createSvgElement(width + CARD_PADDING, height + CARD_PADDING, includeButton ? "level-card" : "guess-card");
  if (includeButton) {
    handleIncludeButton(svg, parentContainer, levelData);
  } else {
    parentContainer.appendChild(svg);
  }
  let r = createRectElement(colour, width, height);
  svg.appendChild(r);
  let t1 = createTextElement(TEXT_COORDINATES.X, title);
  svg.appendChild(t1);
  let t2 = createTextElement(TEXT_COORDINATES.Y, measure);
  svg.appendChild(t2);

  console.log('create card element successfully called!');
}
