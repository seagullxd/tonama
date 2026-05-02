import { displayCompletionMessage } from "./errors.js";
import { loadLevelAttributes, unloadLevel } from "./util/utilLevels.js";
import { 
  DIALOG_CONFIG, 
  END_LEVEL, 
  GAME_COMPLETION_MESSAGE, 
  GAME_COMPLETION_MESSAGE_CONTINUED,
  FORM_GUESS,
  REVIEW_LEVEL_CONTAINER,
  STYLE_ATTRIBUTES
} from "./constants.js";

export function handleDialogEvent() {
  const closeBtns = document.querySelectorAll(".close");
  Object.entries(DIALOG_CONFIG).forEach(([key, { button, dialog }]) => {
    const buttonElement = document.getElementById(button);
    console.log(buttonElement);
    const dialogElement = document.getElementById(dialog);
    buttonElement.addEventListener("click", () => {
      closeDialogs(closeBtns);
      dialogElement.showModal();
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.close();
    });
  });
}

export function createEndLevelDialog(levelId) {
  const endLevelDialogElement = document.getElementById(END_LEVEL.DIALOG);
  const endLevelEvent = new CustomEvent(END_LEVEL.EVENT, {
    detail: "End level event message",
  });
  return { element: endLevelDialogElement, event: endLevelEvent };
}

export function dispatchEndLevelEvent(endLevelDialog) {
  endLevelDialog.element.dispatchEvent(endLevelDialog.event);
}

export function attachEndLevelEvent() {
  const endLevelDialog = document.getElementById(END_LEVEL.DIALOG);
  endLevelDialog.addEventListener(END_LEVEL.EVENT, () => {
    endLevelDialog.showModal();
  });

  attachEndLevelEventReview();
  attachEndLevelEventReviewExit();
  attachEndLevelEventSelect();
}

function attachEndLevelEventReview() {
  const reviewButton = document.getElementById(END_LEVEL.BUTTON.review);
  reviewButton.addEventListener("click", () => {
    setSVGHTMLElementDisplay(FORM_GUESS.PARENT, false, STYLE_ATTRIBUTES.DISPLAY.none)
    setSVGHTMLElementDisplay(END_LEVEL.BUTTON.reviewExit, true, STYLE_ATTRIBUTES.DISPLAY.flex)
    showDialogModal(END_LEVEL.DIALOG, false);

    const reviewLevelContainer = document.getElementById(REVIEW_LEVEL_CONTAINER);
    reviewLevelContainer.setAttribute(STYLE_ATTRIBUTES.PARENT, "border-style: solid");
  });
}

export function attachEndLevelEventReviewExit() {
  const reviewExitButton = document.getElementById(END_LEVEL.BUTTON.reviewExit);
  reviewExitButton.addEventListener("click", () => {
    setSVGHTMLElementDisplay(FORM_GUESS.PARENT, false, STYLE_ATTRIBUTES.DISPLAY.flex)
    setSVGHTMLElementDisplay(END_LEVEL.BUTTON.reviewExit, true, STYLE_ATTRIBUTES.DISPLAY.none)
    showDialogModal(END_LEVEL.DIALOG, true);

    const reviewLevelContainer = document.getElementById(REVIEW_LEVEL_CONTAINER);
    reviewLevelContainer.setAttribute(STYLE_ATTRIBUTES.PARENT, "border-style: none");
  });
}

function attachEndLevelEventSelect() {
  const buttonElement = document.getElementById(END_LEVEL.BUTTON.select);
  const dialogElement = document.getElementById(DIALOG_CONFIG.LEVELS.dialog);
  buttonElement.addEventListener("click", () => {
    dialogElement.showModal();
  });
}

/**
 * Sets the display value for a HTML or SVG element.
 * @param {string} id The id of the element.
 * @param {boolean} True if the element is an SVG; false otherwise.
 * @param {string} newDisplayValue The new display value.
 * @return {undefined}
 */
function setSVGHTMLElementDisplay(id, isSVG, newDisplayValue) {
  const element = document.getElementById(id);
  const displayValue = element.getAttribute('display');
  if (isSVG) {
    element.setAttributeNS(null, 'display', newDisplayValue);
  } else {
    element.setAttributeNS(null, STYLE_ATTRIBUTES.PARENT, `display: ${newDisplayValue};`);
  }
}

function showDialogModal(id, isShow) {
  const modal = document.getElementById(id); 
  isShow ? modal.showModal() : modal.close();
}

function handleEndLevelEventNext(newLevel) {
  const nextButton = document.getElementById(END_LEVEL.BUTTON.next);
  if (!newLevel) {
    nextButton.remove();
    displayCompletionMessage(
      GAME_COMPLETION_MESSAGE.CONTAINER, 
      GAME_COMPLETION_MESSAGE.ID, 
      GAME_COMPLETION_MESSAGE.MESSAGE);
    displayCompletionMessage(
      GAME_COMPLETION_MESSAGE_CONTINUED.CONTAINER, 
      GAME_COMPLETION_MESSAGE_CONTINUED.ID, 
      GAME_COMPLETION_MESSAGE_CONTINUED.MESSAGE);
  } else {
    nextButton.addEventListener("click", () => {
      unloadLevel();
      loadLevelAttributes(newLevel);
    });
  }
}

export function closeDialogs(closeBtns) {
  closeBtns.forEach((btn) => {
    btn.parentElement.close();
  });
}
