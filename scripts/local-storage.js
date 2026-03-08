import { LevelStatus } from "./models/levels.js";
import { isEmpty, sortedIndex } from "./util/object.js";
import { ENTITY_COLOURS } from "./models/entity-colours.js";
import { createCardElement } from "./svg.js";
import { COUNTRY_CARD, LEVEL_CARD } from "./constants.js";

export function saveLocalStorage(
	levelIdToSave,
	levelTitleToSave,
	guess,
	additionalHintsUsed = 0
	// userId removed: was unused. Re-add if needed later.
) {
	// Validate required inputs
	if (!levelIdToSave || guess === undefined) {
		console.warn("saveLocalStorage: missing required parameters", { levelIdToSave, guess });
		return;
	}

	// Safely load existing levels
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

	// Find or create the level entry
	let level = levels.find((l) => l.id === levelIdToSave);

	if (level) {
		const index = sortedIndex(level.guesses, guess.distance);
		level.guesses.splice(index, 0, guess);
	} else {
		level = makeLevel(levelIdToSave, levelTitleToSave, additionalHintsUsed, guess);
		levels.push(level);
	}

	// Persist levels back to storage
	try {
		localStorage.setItem("levels", JSON.stringify(levels));
	} catch (e) {
		console.error("Failed to save levels to localStorage", e);
	}

	// Update lastLevelIdOpened (only if changed)
	try {
		const currentLast = localStorage.getItem("lastLevelIdOpened");
		if (currentLast !== levelIdToSave) {
			localStorage.setItem("lastLevelIdOpened", levelIdToSave);
		}
	} catch (e) {
		console.warn("Could not update lastLevelIdOpened", e);
	}
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

function makeLevel(levelId, level, hintsUsed, guess) {
	const guesses = [];
	guesses.push(guess);
	const newLevel = {
		id: levelId,
		title: level,
		status: LevelStatus.inProgress,
		hintsUsed: hintsUsed,
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
