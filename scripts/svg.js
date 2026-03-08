/* Dynamically create svgs and elements for use in HTML */

import { handleDialogClose } from "./main.js";
import {
  TEXT_COORDINATES,
  LEVEL_CLASS,
  CARD_PADDING,
  COUNTRY_CARD,
  LEVEL_CARD,
} from "./constants.js";
import { loadGuessCards } from "./local-storage.js";

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
  const buttonNS = document.createElementNS("http://www.w3.org/1999/xhtml", "button");
  buttonNS.setAttributeNS(null, "type", type);
  buttonNS.setAttributeNS(null, "id", id);
  buttonNS.setAttributeNS(null, "class", className);
  return buttonNS;
}

export function loadLevelTitleElement(levelData) {
  const familyName = document.getElementById("family-name");
  familyName.innerHTML = `"${levelData.name}"`;

  const levelTitle = levelData.level.split(" ");

  // classify date into correct superscripts
  let superscript = "th";
  const date = levelTitle[0].slice(-1);
  switch (date) {
    case "1":
      superscript = "st";
      break;
    case "2":
      superscript = "nd";
      break;
    case "3":
      superscript = "rd";
      break;
  }

  const levelTitleTimeContent = `${levelTitle[0]}<sup>${superscript}</sup> ${levelTitle[1]} ${levelTitle[2]}`;
  const levelTitleTime = document.getElementById("level-title-time");
  levelTitleTime.innerHTML = levelTitleTimeContent;
}

function removeOnScreenGuessCards() {
  document.querySelectorAll(".guess-card").forEach((e) => e.remove());
}

function loadLevelHandler(levelData) {
  loadLevelTitleElement(levelData);
  removeOnScreenGuessCards();
  loadGuessCards(levelData.id);
  localStorage.setItem("lastLevelIdOpened", levelData.id);

  const closeBtns = document.querySelectorAll(".close");
  handleDialogClose(closeBtns);
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

function categoriseCard(CARD) {
  let title;
  let measure;
  switch (CARD.PARENT) {
    case COUNTRY_CARD.PARENT:
      title = CARD.country;
      measure = `${CARD.distance}km`;
      break;
    case LEVEL_CARD.PARENT:
      title = CARD.level;
      measure = CARD.difficulty;
      console.log(`title measure ${title, measure}`);
      break;
  }
  return { title, measure };
}

export function createCardElement(
  CARD,
  levelData = undefined
) {
  let parentContainer = document.getElementById(CARD.PARENT);
  if ((!CARD.WIDTH && !CARD.HEIGHT) || !parentContainer) {
    return;
  }

  let svg = createSvgElement(
    CARD.WIDTH + CARD_PADDING,
    CARD.HEIGHT + CARD_PADDING,
    levelData ? LEVEL_CARD.ID : COUNTRY_CARD.ID
  );

  levelData
    ? handleIncludeButton(svg, parentContainer, levelData)
    : parentContainer.appendChild(svg);

  const { title, measure } = categoriseCard(CARD);
  console.log(`title: ${title} measure: ${measure}`);
  let r = createRectElement(CARD.colour, CARD.WIDTH, CARD.HEIGHT);
  svg.appendChild(r);
  let t1 = createTextElement(TEXT_COORDINATES.X, title);
  svg.appendChild(t1);
  let t2 = createTextElement(TEXT_COORDINATES.Y, measure);
  svg.appendChild(t2);
}
