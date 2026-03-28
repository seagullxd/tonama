import { GUESSED_ERROR_MESSAGES, COMPLETION_MESSAGE } from "./constants.js";

/**
 * @param {string} message An error message to display
 * @param {string} id An identifier for the html tage
 * @returns {undefined}
 */
export function displayErrorMessage(id, message) {
  let guessedMessageTag = document.querySelector(GUESSED_ERROR_MESSAGES.DUPLICATE.id);
  let invalidMessageTag = document.querySelector(GUESSED_ERROR_MESSAGES.INVALID.id);
  if (guessedMessageTag || guessedMessageTag) {
    return;
  }

  console.log(message);
  const node = document.getElementById(GUESSED_ERROR_MESSAGES.CONTAINER);
  const paragraphElement = document.createElement("p");
  paragraphElement.setAttribute("class", "message");
  paragraphElement.setAttribute("id", id);

  const sampElement = document.createElement("samp");
  sampElement.textContent = message;
  node.appendChild(paragraphElement);
  paragraphElement.appendChild(sampElement);

  setTimeout(function () {
    node.removeChild(paragraphElement);
    console.log("Message removed");
  }, 5000);
}

// todo: see if this function is diff enoguh from about
// if not, just use the above
// want the style to be not red (this is not a temp error msg!)
/**
 * @param {string} id An identifier for the html tage
 * @param {string} message A completion message to display 
 * @returns {undefined}
 */
export function displayCompletionMessage(id, message) {
  console.log(message);
  const node = document.getElementById(COMPLETION_MESSAGE.CONTAINER);
  const paragraphElement = document.createElement("p");
  paragraphElement.setAttribute("class", "message");
  paragraphElement.setAttribute("id", id);

  const sampElement = document.createElement("samp");
  sampElement.textContent = message;
  node.appendChild(paragraphElement);
  paragraphElement.appendChild(sampElement);
}