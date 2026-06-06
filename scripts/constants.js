import { COLOUR } from "./models/entity-colours.js";

export const CARD_ATTRIBUTES = {
  WIDTH: 290,
  HEIGHT: 50,
  COLOUR: COLOUR.FRESH_SKY,
}

export const GUESSED_CARD_ATTRIBUTES = {
  ...CARD_ATTRIBUTES,
  PARENT: "guessed-cards-container",
  CLASS: "card"
}

export const LEVEL_CARD_ATTRIBUTES = {
  ...CARD_ATTRIBUTES,
  PARENT: "levels-cards-container",
  CLASS: "level-card",
  BUTTON: "level"
};

export const REVIEW_LEVEL_CONTAINER = "review-level-container";

export const TEXT_COORDINATES = {
	X: 30,
	Y: 180
};

export const CARD_PADDING = 10;

// HTML Elements 
export const DIALOG_CONFIG = {
  MORE: {
    button: "more-btn",
    dialog: "more-dialog"
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
    reviewExit: "end-level-review-exit-btn",
    next: "end-level-next-btn",
    select: "end-level-select-btn" 
  }
};

export const END_LEVEL_REVIEW_HIDE = {
  NAVBAR: "in-game-nav-bar"
}

export const DIALOG_FAQ = {
  ARTICLE: "faq-dialog-article",
  ANSWER: "faq-dialog-answer"
}

// Identifiers
export const ID_TRIM_VERTICAL_MARGINS = "trim-vertical-margins";

// Classes 

export const CLASS_TRIM_VERTICAL_MARGINS = "trim-vertical-margins";

// Error Messages 

export const GUESSED_ERROR_MESSAGES = {
  CONTAINER: "guessed-message-container",
  DUPLICATE: {
    message: "has already been guessed.",
    id: "guessed-message-duplicate"
  },
  INVALID: {
    message: "is not a valid country.",
    message2: "You must enter a guess",
    message3: "Your guess is too short, it must be at least 4 characters.",
    message4: "Your guess is too long, it must not be over 56 characters.",
    message5: "Your guess contains invalid characters.",
    message6: "Your guess contains a misplaced capital letter.",
    id: "guessed-message-invalid"
  }
};

export const GAME_COMPLETION_MESSAGE = {
  CONTAINER: "game-completion-message-container",
  ID: "game-completion-message",
  MESSAGE: "You have guessed correctly, for the last time..."
};

export const GAME_COMPLETION_MESSAGE_CONTINUED = {
  CONTAINER: "game-completion-message-container",
  ID: "game-completion-message-continued",
  MESSAGE: "Congratulations on finishing the game!"
};

export const LEVEL_TITLE = {
  DATE: {
    parent: "level-title-date",
    time: "level-title-date-time",
    // sup: "level-title-date-time-sup"
  },
  FAMILY_NAME: "level-title-family-name",
};

//CSS_DISPLAY_VALUES
export const STYLE_ATTRIBUTES = {
  PARENT: "style",
  DISPLAY: {
    flex: "flex",
    none: "none"    
  }
}

export const DISPLAY_CLASS = {
  HIDE: "visually-hidden",
  SHOW: "visually-showing"
}

export const FORM_GUESS = {
  PARENT: "form-container",
  INPUT: "form-container-input-text",
  SUBMIT: "form-container-input-submit"
}

export const LEVEL_CLASS = "level";

export const PATH = {
  PARENT: "data",
  LEVELS_FILE: "levels.json",
  COUNTRIES_FILE: "comprehensive_country_distances.json",
  FAQ_FILE: "faq.json"
}

export const HTML_CHARACTER_REFERENCE = {
  QUOTE: "&quot;"
}