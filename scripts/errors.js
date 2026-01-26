export const duplicateGuessErrorMessage = "has already been guessed.";
export const invalidCountryErrorMessage = "is not a valid country.";

export const duplicateGuessTag = "guessed-message";
export const invalidCountryTag = "invalid-message";

export function displayErrorMessage(message, messageType) {
  let node = document.querySelector("#guessed-message");
  if (!node) {
    console.log(message);
    const messageContainer = "tags";
    node = document.getElementById(messageContainer);
    const pElement = document.createElement("p");
    pElement.setAttribute("class", "message");
    pElement.setAttribute("id", messageType);

    const sampElement = document.createElement("samp");
    sampElement.textContent = message;
    node.appendChild(pElement);
    pElement.appendChild(sampElement);

    setTimeout(function () {
      node.removeChild(pElement);
      console.log("Message removed");
    }, 5000);
  }
}