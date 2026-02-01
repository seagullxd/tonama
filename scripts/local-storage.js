import { LevelStatus } from "./models/levels.js";
import { isEmpty } from "./util/object.js";
import { countryColours } from "./models/colours.js";
import { displayCard } from "./svg.js";

export function saveLocalStorage(id, levelTitle, guess, lastLevelOpen=undefined, additionalHintsUsed=0) {
	let storedLevels = JSON.parse(localStorage.getItem("levels"));
	let storedLevel;
	if (storedLevels) {
		storedLevel = storedLevels.find((l) => l.title == levelTitle);
		if (storedLevel) {
			storedLevel.guesses.push(guess);
		} else {
			storedLevel = makeLevel(levelTitle, additionalHintsUsed, guess);
			storedLevels.push(storedLevel);
		}
	} else {
		storedLevels = [];
		storedLevel = makeLevel(levelTitle, additionalHintsUsed, guess);
		storedLevels.push(storedLevel);
	}
	
	localStorage.setItem("levels", JSON.stringify(storedLevels));
	
	let storedLastLevelOpen = localStorage.getItem("lastLevelOpen");
	if (!storedLastLevelOpen) {
		localStorage.setItem("lastLevelOpen", lastLevelOpen);
	} else if (storedLastLevelOpen != lastLevelOpen) {
		localStorage.setItem("lastLevelOpen", storedLastLevelOpen);
	}
}

function isUserExisting(id) {
	const storedId = localStorage.getItem("id");
	return id === storedId;
}

export function getId() {
  let id = localStorage.getItem("id");
  if (!id | !isUserExisting(id)) {
    id = uuidv4();
    localStorage.setItem("id", id);
  }
  return id;
}

function makeLevel(title, hintsUsed, guess) {
	const guesses = [];
	guesses.push(guess);
	const level = {
		"id": generateDateId(title),
		"title": title,
		"status": LevelStatus.inProgress,
		"hintsUsed": hintsUsed,
		"guesses": guesses
	};
	return level;
}

export function generateDateId(dateString) {
	const date = new Date(dateString);
	const dateId = [date.getDate(), date.getMonth(), date.getYear()];
	return dateId.join("");
}

/**
 * Display country cards for this level.
 * @param {number} guess The level id to generate cards for.
 * @return {undefined}
 */
export function loadLevelCards(levelId) {
  let storedLevels = JSON.parse(localStorage.getItem("levels"));
  if (storedLevels) {
    const level = storedLevels.find((l) => l.id == levelId);
	  level.guesses.forEach(guess => {
	    const titleCasedGuess = guess.country;
	    displayCard(titleCasedGuess, `${guess.distance}km`, countryColours[titleCasedGuess]);    
	  });
  }
}

// Source - https://stackoverflow.com/a/2117523
// Posted by broofa, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-13, License - CC BY-SA 4.0
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
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
