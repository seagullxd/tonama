import { removeElementTextValue } from "../svg.js";
import { closeDialogs } from "../menu.js";
import { classifyDate } from "./utilDate.js";
import { LevelStatus } from "../models/levels.js";
import { ENTITY_COLOURS } from "../models/entity-colours.js";
import { createCardElement } from "../svg.js";
import {  
	GUESS_INPUT,
	LEVEL_TITLE,
	COUNTRY_CARD,
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
	removeElementTextValue(GUESS_INPUT);
	removeOnScreenGuessCards();
	const closeBtns = document.querySelectorAll(".close");
  closeDialogs(closeBtns);
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

  loadGuessedCards(level.id);
  localStorage.setItem("lastLevelIdOpened", level.id);

  const closeBtns = document.querySelectorAll(".close");
  closeDialogs(closeBtns);
}

/**
 * Set a target level's properties
 * 
 * @param {object} levels The levels.
 * @param {object} level The level to be set.
 * @param {boolean} triggerLoadInGuessCards false by default.
 * @return {object} level The level now set.
 */
export function setLatestLevel(
  levels,
  level,
  enableGuessCardLoading = false,
) {
  let lastLevelIdOpened = localStorage.getItem("lastLevelIdOpened");
  let newLevel;
  if (lastLevelIdOpened) {
    newLevel = levels.find((l) => l.id == lastLevelIdOpened);
    if (enableGuessCardLoading) {
      loadGuessedCards(lastLevelIdOpened);
    }
  } else {
    newLevel = levels[levels.length - 1]; // default is latest level
  }
  setLevelProperties(level, newLevel);
  setPropertiesForLocalStorage(level);
  return level;
}


export function removeOnScreenGuessCards() {
  document.querySelectorAll(".guessed-card").forEach((e) => e.remove());
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
  familyName.innerHTML = `"${name}"`;
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

function setPropertiesForLocalStorage(level) {
  level.status = LevelStatus.notStarted;
  level.hintsUsed = 0;
}

/**
 * Display country cards for a target level.
 * 
 * @param {number} levelId The level identifier to generate guessed cards for.
 * @return {undefined} 
 */
export function loadGuessedCards(levelId) {
	let localStorageLevels = JSON.parse(localStorage.getItem("levels"));
	if (localStorageLevels) {
		const targetLevel = localStorageLevels.find((l) => l.id == levelId);
		if (targetLevel) {
			targetLevel.guesses.forEach((guess) => {
				const card = { title: guess.country, grade: `${guess.distance}km` };
				COUNTRY_CARD.COLOUR = ENTITY_COLOURS[guess.country];
				createCardElement(COUNTRY_CARD, card);
			});
		}
	}
}

export function filterInCompleteLevels(localStorageLevels) {
	let completedLevels = localStorageLevels.filter(function(e) { 
		return e.guesses.find(g => g.distance === 0)
	});
	return completedLevels;
}