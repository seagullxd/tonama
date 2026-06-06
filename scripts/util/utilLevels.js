import { removeElementTextValue } from "../svg.js";
import { closeButtonParentDialogs } from "../menu.js";
import { classifyDate } from "./utilDate.js";
import { LevelStatus } from "../models/levels.js";
import { getLevels } from "../local-storage.js";
import { createGuessedCardElements } from "./guess.js";
import { 
	createCardElement, 
	createLevelCardElements, 
	createDivElement,
	removeAllCards
} from "../svg.js";
import {  
	FORM_GUESS,
	LEVEL_TITLE,
	LEVEL_CARD_ATTRIBUTES,
  GUESSED_CARD_ATTRIBUTES,
  HTML_CHARACTER_REFERENCE
} from "../constants.js";

/**
 * Unloads a level's attributes i.e., title, name, text input, guessed cards and dialogs.
 * @return {undefined}
 */
export function unloadLevel() {
	for (let child of Object.values(LEVEL_TITLE.DATE)) {
		console.log(child);
		removeElementTextValue(child);
	}
	removeElementTextValue(LEVEL_TITLE.FAMILY_NAME);
	removeElementTextValue(FORM_GUESS.INPUT);
	removeAllCards(`.${GUESSED_CARD_ATTRIBUTES.CLASS}`);
  closeButtonParentDialogs();
}

/**
 * Reload the level cards container. May be useful to re-tag cards.
 * @param {object} levels All of the levels data
 * @return {undefined}
 */
export function reloadLevelCards(levels) {
  const node = document.getElementById(LEVEL_CARD_ATTRIBUTES.GRANDPARENT);
  const levelCardsContainer = document.getElementById(LEVEL_CARD_ATTRIBUTES.PARENT);
  const newLevelCardsContainer = createDivElement(LEVEL_CARD_ATTRIBUTES.PARENT);

  levelCardsContainer.remove();
  node.appendChild(newLevelCardsContainer);

  createLevelCardElements(levels); 
}

/**
 * Loads in a level's attributes i.e., title, name, guessed cards.
 * @param {object} levelData A level's data
 * @return {undefined}
 */
export function loadLevelAttributes(level) {
	const dateString = level.title;
	const superscript = classifyDate(dateString);
	setElementTitle(dateString, superscript);
	setElementName(level.name);

  const levelLocalStorage = getLevels()?.find((l) => l.id == level.id);
  createGuessedCardElements(levelLocalStorage?.guesses);
  closeButtonParentDialogs();
}

/**
 * Set a level with static level data using a target level id. 
 * Set a default level if target doesn't exist.
 * 
 * @param {object} level The level to be set.
 * @param {array} levels The static data to search through.
 * @param {number} targetLevelId The target level id to search for in static data.
 * @return {object} level The level now set.
 */
export function setStaticLevel(level, levels, targetLevelId,) {
  let newLevel;
  newLevel = targetLevelId ? levels.find((l) => l.id == targetLevelId) 
  : levels[levels.length - 1];
  setLevelProperties(level, newLevel);
  setLevelPropertiesForStorage(level, newLevel);
}

/**
 * Set the LEVEL_TITLE.DATE element with a human-readable date.
 * 
 * @param {string} dateString The date to be used.
 * @param {string} superscript The date's superscript to be used.
 * @returns {undefined}
 */
function setElementTitle(dateString, superscript) {
  const dateArray = dateString.split(" ");
  const day = dateArray[0];
  const month = dateArray[1];
  const year = dateArray[2];

  const levelTitleTimeContent = `${day}<sup>${superscript}</sup> ${month} ${year}`;
  const levelTitleTime = document.getElementById(LEVEL_TITLE.DATE.time);
  levelTitleTime.innerHTML = levelTitleTimeContent;
}

function setElementName(name) {
	const familyName = document.getElementById(LEVEL_TITLE.FAMILY_NAME);
  familyName.innerHTML = `${HTML_CHARACTER_REFERENCE.QUOTE}${name}${HTML_CHARACTER_REFERENCE.QUOTE}`;
}

/** 
 * Set level properties for a level. See data/levels.json for an example object.
 * 
 * @param level The level to be set.
 * @param newLevel The new level to set for level.
 * @returns {undefined}
 */
function setLevelProperties(level, newLevel) {
  level.id = newLevel.id;
  level.title = newLevel.title;
  level.difficulty = newLevel.difficulty;
  level.name = newLevel.name;
  level.origin = newLevel.origin;
}

function setLevelPropertiesForStorage(level, newLevel) {
  level.status = newLevel.status;
  level.hintsUsed = 0;
}

export function filterByIncompleteLevels(localStorageLevels) {
	let completedLevels = localStorageLevels.filter(l => l.status === LevelStatus.completed);
	return completedLevels;
}

function sliceLevelsWithoutCurrentLevel(incompleteLevels, incompleteLevelIndex) {
  const levelsAfterCurrentLevel = incompleteLevels.slice(incompleteLevelIndex + 1, incompleteLevels.length);
  const levelsBeforeCurrentLevel = incompleteLevels.slice(0, incompleteLevelIndex);
  const levelsWithoutCurrentLevel = levelsAfterCurrentLevel.concat(levelsBeforeCurrentLevel);
  return levelsWithoutCurrentLevel;
}

export function findNextLevelsToComplete(levels, level) {
  const incompleteLevels = levels.filter(l => l.status != LevelStatus.completed);
  const indexOfCurrentLevelInIncompleteLevels = incompleteLevels.findIndex(l => l.id == level.id);
  const nextLevelsToComplete = sliceLevelsWithoutCurrentLevel(incompleteLevels, indexOfCurrentLevelInIncompleteLevels);
  return nextLevelsToComplete;
}