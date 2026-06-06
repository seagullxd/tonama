import { 
  GUESSED_ERROR_MESSAGES,
  DISPLAY_CLASS
} from "./constants.js";
import { createMessageElement } from "./svg.js";

/**
 * Display a new error message about a user's input.
 * 
 * @param {string} textContent An error message to display
 * @returns {undefined}
 */
export function displayNewError(textContent) {
  let errorElement = document.getElementById("error");
  errorElement.removeAttribute("class");

  if (errorElement.getAttribute("class") != DISPLAY_CLASS.SHOW) {
    errorElement.textContent = textContent;
    errorElement.setAttribute("class", DISPLAY_CLASS.SHOW);
    setTimeout(function () {
      errorElement.setAttribute("class", DISPLAY_CLASS.HIDE);
    }, 8000);
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