import { COLOUR } from "./models/entity-colours.js";

// Sizes
export const COUNTRY_CARD = {
  PARENT: "guessed-cards-container",
  ID: "guess-card",
	WIDTH: 290,
	HEIGHT: 50,
  COLOUR: COLOUR.FRESH_SKY,
}

export const LEVEL_CARD = {
  PARENT: "levels-cards-container",
  ID: "level-card",
	WIDTH: 290,
	HEIGHT: 50,
  COLOUR: COLOUR.FRESH_SKY,
}

export const TEXT_COORDINATES = {
	X: 30,
	Y: 180
}

export const CARD_PADDING = 10;

// HTML Elements 
export const DIALOG_CONFIG = {
  MORE: {
    button: "more-btn",
    dialog: "more-dialog"
  },
  RESTART: {
    button: "restart-btn",
    dialog: "restart-dialog"
  },
  LEVELS: {
    button: "levels-btn",
    dialog: "levels-dialog"
  },
  HOW_TO_PLAY: {
    button: "how-to-play-btn",
    dialog: "how-to-play-dialog"
  },
  FAQ: {
    button: "faq-btn",
    dialog: "faq-dialog"
  },
  SETTINGS: {
    button: "settings-btn",
    dialog: "settings-dialog"
  }
};

export const END_LEVEL = {
  DIALOG: "end-level-dialog",
  EVENT: "end-level-event",
  BUTTON: {
    review: "end-level-review-btn",
    next: "end-level-next-btn",
    select: "end-level-select-btn" 
  }
}

export const GUESSED_ERROR_MESSAGES = {
  CONTAINER: "guessed-message-container",
  DUPLICATE: {
    message: "has already been guessed.",
    id: "guessed-message-duplicate"
  },
  INVALID: {
    message: "is not a valid country.",
    id: "guessed-message-invalid"
  }
}

export const COMPLETION_MESSAGE = {
  CONTAINER: "",
  MESSAGE: ""
}

export const LEVEL_CLASS = "level";