import { LevelStatus } from "./models/levels.js";
import { isEmpty, sortedIndex } from "./util/object.js";
import { ENTITY_COLOURS } from "./models/entity-colours.js";
import { createCardElement } from "./svg.js";
import { COUNTRY_CARD, LEVEL_CARD } from "./constants.js";
import { handleDialogClose } from "./menu.js";

export function loadLevelStorage(levelIdToSave) {
  let levels = [];
  try {
    const stored = localStorage.getItem("levels");
    if (stored) {
      levels = JSON.parse(stored);
      if (!Array.isArray(levels)) levels = [];
    }
  } catch (e) {
    console.error("Failed to load levels from localStorage", e);
  }

  return levels;
}

export function saveLocalStorage(currentLevel, guess) {
	// Validate required inputs
	if (!currentLevel.id || guess === undefined) {
		console.warn("saveLocalStorage: missing required parameters", currentLevel.id, guess);
		return;
	}

	let levels  = loadLevelStorage(currentLevel.id);
	let level = levels.find((l) => l.id === currentLevel.id);

	if (level) {
		const index = sortedIndex(level.guesses, guess.distance);
		level.guesses.splice(index, 0, guess);
		level.status = currentLevel.status;
	} else {
		level = makeLevel(currentLevel, guess);
		levels.push(level);
	}

	// Update lastLevelIdOpened (only if changed)
	try {
		localStorage.setItem("levels", JSON.stringify(levels));
		const currentLast = localStorage.getItem("lastLevelIdOpened");
		if (currentLast !== currentLevel.id) {
			localStorage.setItem("lastLevelIdOpened", currentLevel.id);
		}
	} catch (e) {
		console.warn("Failed to save level data", e);
	}
}

/**
 * Load the last level opened by using local storage.
 * @param {object} allLevelsData all levels
 * @param {object} currentLevel level to be replaced
 * @param {boolean} triggerLoadInGuessCards false by default
 * @return {object} the last level to be modified in local storage
 */
export function loadCurrentLevelProperties(
  allLevelsData,
  currentLevel,
  triggerLoadInGuessCards = false
) {
  let lastLevelIdOpened = localStorage.getItem("lastLevelIdOpened");
  let newLevelToSet;
  if (lastLevelIdOpened) {
    newLevelToSet = allLevelsData.find((level) => level.id == lastLevelIdOpened);
    if (triggerLoadInGuessCards) {
      loadGuessCards(lastLevelIdOpened);
    }
  } else {
    newLevelToSet = allLevelsData[allLevelsData.length - 1]; // default is latest level
  }
  setCurrentLevel(currentLevel, newLevelToSet);
  return currentLevel;
}

function setCurrentLevel(currentLevel, newLevelToSet) {
  currentLevel.id = newLevelToSet.id;
  currentLevel.title = newLevelToSet.title;
  currentLevel.difficulty = newLevelToSet.difficulty;
  currentLevel.name = newLevelToSet.name;
  currentLevel.origin = newLevelToSet.origin;
  currentLevel.status = LevelStatus.notStarted;
  currentLevel.hintsUsed = 0;
}

function isUserExisting(id) {
	const storedId = localStorage.getItem("userId");
	return id === storedId;
}

export function getUserId() {
	let id = localStorage.getItem("userId");
	if (!id | !isUserExisting(id)) {
		id = uuidv4();
		localStorage.setItem("userId", id);
	}
	return id;
}

function makeLevel(currentLevel, guess) {
	const guesses = [];
	guesses.push(guess);
	const newLevel = {
		id: currentLevel.id,
		title: currentLevel.title,
		status: currentLevel.status,
		hintsUsed: currentLevel.hintsUsed,
		guesses: guesses,
	};
	return newLevel;
}

/**
 * Display country cards for this level.
 * @param {number} the level id to generate guessed cards for.
 * @return {undefined}
 */
export function loadGuessCards(levelId) {
	let storedLevels = JSON.parse(localStorage.getItem("levels"));
	if (storedLevels) {
		const level = storedLevels.find((l) => l.id == levelId);
		if (level) {
			level.guesses.forEach((guess) => {
				createCardElement({
					...guess,
					...COUNTRY_CARD,
					colour: ENTITY_COLOURS[guess.country],
				});
			});
		}
	}
}

export function loadLevelTitleElement(levelData) {
  const familyName = document.getElementById("family-name");
  familyName.innerHTML = `"${levelData.name}"`;

  const levelTitle = levelData.title.split(" ");

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

export function removeOnScreenGuessCards() {
  document.querySelectorAll(".guess-card").forEach((e) => e.remove());
}

export function loadLevel(levelData) {
  loadLevelTitleElement(levelData);
  removeOnScreenGuessCards();
  loadGuessCards(levelData.id);
  localStorage.setItem("lastLevelIdOpened", levelData.id);

  const closeBtns = document.querySelectorAll(".close");
  handleDialogClose(closeBtns);
}

// Source - https://stackoverflow.com/a/2117523
// Posted by broofa, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-13, License - CC BY-SA 4.0
function uuidv4() {
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
		(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
	);
}

function iterateStatus(status) {
	switch (status) {
		case LevelStatus.notStarted:
			status = LevelStatus.inProgress;
			break;
		case LevelStatus.inProgress:
			status = LevelStatus.completed;
			break;
		default:
			// do nothing to status if completed
			break;
	}
	return status;
}
