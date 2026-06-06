import { displayCompletionMessage } from "./errors.js";
import { loadLevelAttributes, unloadLevel } from "./util/utilLevels.js";
import { setLastLevelOpened } from "./local-storage.js";
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
  Object.entries(DIALOG_CONFIG).forEach(([key, { button, dialog }]) => {
    const buttonElement = document.getElementById(button);
    const dialogElement = document.getElementById(dialog);
    attachDialogOpenEvent(buttonElement, dialogElement);
  });
}

export function attachButtonParentDialogCloseEvents() {
  const closeBtns = document.querySelectorAll(".close");
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.close();
    });
  });
}

function attachDialogOpenEvent(buttonElement, dialogElement) {
  buttonElement.addEventListener("click", () => {
    closeButtonParentDialogs();
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
  const classesToHide = document.querySelectorAll(".hide-in-review-state");
  const classesToShow = document.querySelectorAll(".show-in-review-state");
  const reviewButton = document.getElementById(END_LEVEL.BUTTON.review);
  const reviewLevelContainer = document.getElementById(REVIEW_LEVEL_CONTAINER);
  reviewButton.addEventListener("click", () => {
    classesToHide.forEach((classToHide) => {
      classToHide.classList.add("hidden");
    });
    classesToShow.forEach((classToShow) => {
      classToShow.classList.remove("hidden");
    });

    showDialogModal(END_LEVEL.DIALOG, false);
    reviewLevelContainer.classList.add("border-solid-white-small");
  });
}

function attachEndLevelEventReviewExit() {
  // notice this is swapped around
  const classesToShow = document.querySelectorAll(".hide-in-review-state");
  const classesToHide = document.querySelectorAll(".show-in-review-state");
  const reviewExitButton = document.getElementById(END_LEVEL.BUTTON.reviewExit);
  const reviewLevelContainer = document.getElementById(REVIEW_LEVEL_CONTAINER);
  reviewExitButton.addEventListener("click", () => {
    classesToHide.forEach((classToHide) => {
      classToHide.classList.add("hidden");
    });
    classesToShow.forEach((classToShow) => {
      classToShow.classList.remove("hidden");
    });
    showDialogModal(END_LEVEL.DIALOG, true);
    reviewLevelContainer.classList.remove("border-solid-white-small");
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
      setLastLevelOpened(nextLevel.id);
      endLevelDialog.close();
    });
  }
}

function showDialogModal(id, showDialog) {
  const modal = document.getElementById(id); 
  showDialog ? modal.showModal() : modal.close();
}

export function closeButtonParentDialogs() {
  const closeBtns = document.querySelectorAll(".close");
  closeBtns.forEach((btn) => {
    btn.parentElement.close();
  });
}
