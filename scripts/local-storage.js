import { LevelStatus } from "./models/levels.js";
import { isEmpty } from "./util/object.js";
import { ENTITY_COLOURS } from "./models/entity-colours.js";
import { createCardElement } from "./svg.js";
import { CONTAINER, COUNTRY_CARD, LEVEL_CARD } from "./constants.js";

export function saveLocalStorage(
	userId,
	levelId,
	levelTitle,
	guess,
	additionalHintsUsed = 0,
) {
	let storedLevels = JSON.parse(localStorage.getItem("levels"));
	let storedLevel;
	if (storedLevels) {
		storedLevel = storedLevels.find((l) => l.id == levelId);
		if (storedLevel) {
			storedLevel.guesses.push(guess);
		} else {
			storedLevel = makeLevel(levelId, levelTitle, additionalHintsUsed, guess);
			storedLevels.push(storedLevel);
		}
	} else {
		storedLevels = [];
		storedLevel = makeLevel(levelId, levelTitle, additionalHintsUsed, guess);
		storedLevels.push(storedLevel);
	}

	localStorage.setItem("levels", JSON.stringify(storedLevels));

	let storedLastLevelIdOpen = localStorage.getItem("lastLevelIdOpen");
	if (!storedLastLevelIdOpen) {
		localStorage.setItem("lastLevelIdOpen", levelId);
	} else if (storedLastLevelIdOpen != levelId) {
		localStorage.setItem("lastLevelIdOpen", storedLastLevelIdOpen);
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
	const newLevelObj = {
		id: levelId,
		title: level,
		status: LevelStatus.inProgress,
		hintsUsed: hintsUsed,
		guesses: guesses,
	};
	return newLevelObj;
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
				createCardElement(
					guess.country,
					`${guess.distance}km`,
					ENTITY_COLOURS[guess.country],
					CONTAINER.GUESSED_CARDS,
					LEVEL_CARD.WIDTH,
					LEVEL_CARD.HEIGHT,
				);
			});
		}
	}
}

// Source - https://stackoverflow.com/a/2117523
// Posted by broofa, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-13, License - CC BY-SA 4.0
function uuidv4() {
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
		(
			+c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
		).toString(16),
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
