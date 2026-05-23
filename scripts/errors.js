import { GUESSED_ERROR_MESSAGES } from "./constants.js";
import { createMessageElement } from "./svg.js";

/**
 * @param {string} id An identifier for the html tag
 * @param {string} message An error message to display
 * @returns {undefined}
 */
export function displayErrorMessage(id, message) {
  let errorElement;
  let guessErrorElement = document.getElementById(GUESSED_ERROR_MESSAGES.DUPLICATE.id);
  let invalidErrorElement = document.getElementById(GUESSED_ERROR_MESSAGES.INVALID.id);
  if (!(guessErrorElement || invalidErrorElement)) {    
    const node = document.getElementById(GUESSED_ERROR_MESSAGES.CONTAINER);
    errorElement = createMessageElement(id, undefined, message);
    node.append(errorElement);

    setTimeout(function () {
      node.removeChild(errorElement);
      console.log("Message removed");
    }, 5000);
  }
}

// todo #1: move this function out of error.js

// todo #2: see if this function is diff enoguh from about
// if not, just use the above
// want the style to be not red (this is not a temp error msg!)
/**
 * @param {string} id An identifier for the html tage
 * @param {string} message A completion message to display 
 * @returns {undefined}
 */
export function displayCompletionMessage(parent, id, message) {
  let guessedMessageTag = document.querySelector(GUESSED_ERROR_MESSAGES.DUPLICATE.id);
  let invalidMessageTag = document.querySelector(GUESSED_ERROR_MESSAGES.INVALID.id);
  if (!(guessedMessageTag || invalidMessageTag)) {
    const node = document.getElementById(parent);
    node.appendChild(createMessageElement(id, undefined, message));
  }
}