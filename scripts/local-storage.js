import { uuidv4 } from "/scripts/util/guess.js";

export function saveLocalStorage(userId, lastLevelOpen, level) {
	let levels = [];
	let oldLastLevelOpen = "";
	if (userId) {
		// check if user exists
		localStorage.getItem("userId");
		oldLastLevelOpen = localStorage.getItem("lastLevelOpen");
		levels = JSON.parse(localStorage.getItem("levels"));
	} else {
		// make a new user
		localStorage.setItem("userId", uuidv4());
	}

	if (oldLastLevelOpen != lastLevelOpen) {
		localStorage.setItem("lastLevelOpen", lastLevelOpen);
	}

	levels.push(level);
	localStorage.setItem("levels", JSON.stringify(levels));
}

export function loadLocalStorage(userId) {
	let data = {};
	let user = localStorage.getItem("userId");
	if (user) {
		// check if user exists
		// fetch the remaining info
		data.user = user;
		const lastLevelOpen = localStorage.getItem("lastLevelOpen");
		const storedLevels = JSON.parse(localStorage.getItem("levels"));
		data.lastLevelOpen = lastLevelOpen;
		data.levels = storedLevels;
	}
	return data;
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

function addNewLevel(userData, newLevel) {
	// handle if no user exists
	const newLevelData = {};
	newLevelData.name = newLevel;
	newLevelData.status = "in-progress"; // TODO: make this LevelStatus.inProgress
	newLevelData.guesses = [];

	if ("levels" in userData) {
		userData.levels.push(newLevelData);
	} else {
		throw new Error("No level data found!");
	}
}

function addNewGuess(levelData, guess, distance) {
	const newGuess = {
		origin: guess,
		distance: distance,
	};
	if ("guesses" in levelData) {
		levelData.guesses.push(newGuess);
	} else {
		throw new Error("No guess data found!");
	}
}
