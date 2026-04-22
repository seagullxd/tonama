import { sortedIndex } from "./util/object.js";

export function getLocalStorageLevels() {
  let localStorageLevels = [];
  const stored = localStorage.getItem("levels");
  if (stored) {
    localStorageLevels = JSON.parse(stored);
    if (!Array.isArray(localStorageLevels)) {
    	localStorageLevels = [];
    }
   }
  return localStorageLevels;
}

export function setLocalStorageLevels(level, guess) {
	// Validate required inputs
	if (!level.id || guess === undefined) {
		console.warn("saveLocalStorage: missing required parameters", level.id, guess);
		return;
	}

	let localStorageLevels  = getLocalStorageLevels();
	let localStorageLevel = localStorageLevels.find((l) => l.id === level.id);

	if (localStorageLevel) {
		const index = sortedIndex(localStorageLevel.guesses, guess.distance);
		localStorageLevel.guesses.splice(index, 0, guess);
		localStorageLevel.status = level.status;
	} else {
		localStorageLevel = makeLevel(level, guess);
		localStorageLevels.push(localStorageLevel);
	}

	// Update lastLevelIdOpened (only if changed)
	try {
		localStorage.setItem("levels", JSON.stringify(localStorageLevels));
		const currentLast = localStorage.getItem("lastLevelIdOpened");
		if (currentLast !== level.id) {
			localStorage.setItem("lastLevelIdOpened", level.id);
		}
	} catch (e) {
		console.warn("Failed to save level data", e);
	}
}

function makeLevel(level, guess) {
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