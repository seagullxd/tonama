import { sortedIndex } from "./util/object.js";

export function getLastLevelIdOpened() {
	return localStorage.getItem("lastLevelIdOpened"); 
}

/**
 * Sets a level id as the last level opened.
 *
 * @param {string} levelId the level id.
 * @return {undefined}
 */
export function setLastLevelOpened(levelId) {
	localStorage.setItem("lastLevelIdOpened", levelId); 
}

// todo: this is ideally for local storage levels
// but you can use it for static levels
// therefore, shouldn't it be placed in a levels.js file to encourage that re-use?
export function getLevelIndex(levelId) {
  return getLevels().findIndex((l) => l.id === levelId);
}

/**
 * Returns a level using a level id.
 * 
 * @param {string} levelId the level id. 	// todo: confirm it's a string
 * @return {object} the level found.
 */
export function getLevel(levelId) {
  return getLevels().find((l) => l.id === levelId);
}

/**
 * Returns the levels.
 *
 * @return {object} the levels
 */
export function getLevels() {
	return localStorage.getItem("levels") ? 
	JSON.parse(localStorage.getItem("levels")) : [];
}

/**
 * Sets the levels.
 *
 * @param {array} levels The levels to set.
 * @return {undefined}
 */
function setLevels(levels) {
	localStorage.setItem("levels", JSON.stringify(levels))
}

/**
 * Sets a guess for a given level. 
 * If the level doesn't exist in local storage, a new one is made.
 *
 * @param {array} levels The levels to set.
 * @return {undefined}
 */
export function setLevelGuess(level, guess) {
	let levels  = getLevels();
	let levelIndex = getLevelIndex(level.id);
	if (levels[levelIndex]) {
		const sortedGuessIndex = sortedIndex(levels[levelIndex].guesses, guess.distance);
		levels[levelIndex].guesses.splice(sortedGuessIndex, 0, guess);
		levels[levelIndex].status = level.status;
	} else {
		levels[levelIndex] = createNewLevel(level, guess);
		levels.push(levels[levelIndex]);
	}
	setLevels(levels);
}

function createNewLevel(level, guess) {
	const guesses = [];
	guesses.push(guess);
	const newLevel = {
		id: level.id,
		title: level.title,
		status: level.status,
		hintsUsed: level.hintsUsed,
		guesses: guesses,
	};
	return newLevel;
}