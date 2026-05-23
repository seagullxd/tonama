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

export function handleDialogOpenEvent() {
  const closeBtns = document.querySelectorAll(".close");
  Object.entries(DIALOG_CONFIG).forEach(([key, { button, dialog }]) => {
    const buttonElement = document.getElementById(button);
    const dialogElement = document.getElementById(dialog);
    attachDialogOpenEvent(buttonElement, dialogElement);
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.close();
    });
  });
}

function attachDialogOpenEvent(buttonElement, dialogElement) {
  const closeBtns = document.querySelectorAll(".close");
  buttonElement.addEventListener("click", () => {
    closeDialogs(closeBtns);
    dialogElement.showModal();
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

export function attachEndLevelEvents() {
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
  const isSvg = true;
  const isSvgElement = false;
  const isHtmlElement = true; 
  reviewButton.addEventListener("click", () => {
    setHtmlOrSvgElementDisplayValue(
      FORM_GUESS.PARENT, 
      isHtmlElement, 
      STYLE_ATTRIBUTES.DISPLAY.none
    );
    setHtmlOrSvgElementDisplayValue(
      END_LEVEL.BUTTON.reviewExit, 
      isSvgElement, 
      STYLE_ATTRIBUTES.DISPLAY.flex
    );
    setHtmlOrSvgElementDisplayValue(
      DIALOG_CONFIG.MORE.button, 
      isHtmlElement, 
      STYLE_ATTRIBUTES.DISPLAY.none
    );
    showDialogModal(END_LEVEL.DIALOG, false);
    const reviewLevelContainer = document.getElementById(REVIEW_LEVEL_CONTAINER);
    reviewLevelContainer.setAttribute(STYLE_ATTRIBUTES.PARENT, "border-style: solid");
  });
}

function attachEndLevelEventReviewExit() {
  const reviewExitButton = document.getElementById(END_LEVEL.BUTTON.reviewExit);
  const isSvgElement = false;
  const isHtmlElement = true; 
  reviewExitButton.addEventListener("click", () => {
    setHtmlOrSvgElementDisplayValue(
      FORM_GUESS.PARENT, 
      isHtmlElement, 
      STYLE_ATTRIBUTES.DISPLAY.flex
    );
    setHtmlOrSvgElementDisplayValue(
      END_LEVEL.BUTTON.reviewExit, 
      isSvgElement, 
      STYLE_ATTRIBUTES.DISPLAY.none
    );
    setHtmlOrSvgElementDisplayValue(
      DIALOG_CONFIG.MORE.button, 
      isHtmlElement, 
      STYLE_ATTRIBUTES.DISPLAY.flex
    );
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
 * Attach an event for the next level button.
 * @param {object} nextLevel the next level to load in.
 */
export function attachEndLevelEventNext(nextLevel) {
  const nextButton = document.getElementById(END_LEVEL.BUTTON.next);
  if (!nextLevel) {
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
    const endLevelDialog = document.getElementById(END_LEVEL.DIALOG);
    nextButton.addEventListener("click", () => {
      unloadLevel();
      loadLevelAttributes(nextLevel);
      endLevelDialog.close();
    });
  }
}

/**
 * Sets the display value for a HTML or SVG element.
 * @param {string} id The id of the element.
 * @param {boolean} True if the element is an HTML; false otherwise.
 * @param {string} newDisplayValue The new display value.
 * @return {undefined}
 */
function setHtmlOrSvgElementDisplayValue(id, isHTMLElement, newDisplayValue) {
  const element = document.getElementById(id);
  isHTMLElement ? element.setAttributeNS(null, STYLE_ATTRIBUTES.PARENT, `display: ${newDisplayValue};`) 
  : element.setAttributeNS(null, 'display', newDisplayValue) 
}

function showDialogModal(id, showDialog) {
  const modal = document.getElementById(id); 
  showDialog ? modal.showModal() : modal.close();
}

export function closeDialogs(closeBtns) {
  closeBtns.forEach((btn) => {
    btn.parentElement.close();
  });
}
