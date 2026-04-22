import { displayCompletionMessage } from "./errors.js";
import { loadLevelAttributes, unloadLevel } from "./util/utilLevels.js";
import { 
  DIALOG_CONFIG, 
  END_LEVEL, 
  GAME_COMPLETION_MESSAGE, 
  GAME_COMPLETION_MESSAGE_CONTINUED 
} from "./constants.js";

export function handleDialogEvent() {
  const closeBtns = document.querySelectorAll(".close");
  Object.entries(DIALOG_CONFIG).forEach(([key, { button, dialog }]) => {
    const buttonElement = document.getElementById(button);
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

export function setupCustomEndLevelEvent() {
  // todo: prevent any further guessings by removing formInput box
  const endLevelDialogElement = document.getElementById(END_LEVEL.DIALOG);
  const endLevelEvent = new CustomEvent(END_LEVEL.EVENT, {
    detail: "End level event message",
  });
  endLevelDialogElement.dispatchEvent(endLevelEvent);
}

export function handleEndLevelEvent(level, newLevel) {
  // todo update level status
  // use local-storage.js nextStatus

  // todo: this should persist on refresh!!!
  const endLevelDialog = document.getElementById(END_LEVEL.DIALOG);

  endLevelDialog.addEventListener(END_LEVEL.EVENT, () => {
    console.log('end-level event triggered!');
    endLevelDialog.showModal();
  });

  handleEndLevelEventReview();
  handleEndLevelEventNext(newLevel);
  handleEndLevelEventSelect();
}

function handleEndLevelEventReview() {
  const reviewButton = document.getElementById(END_LEVEL.BUTTON.review);
  reviewButton.addEventListener("click", () => {
    // todo: do something
  });
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

function handleEndLevelEventSelect() {
  const selectButton = document.getElementById(END_LEVEL.BUTTON.select);
  const selectButtonDialog = document.getElementById(DIALOG_CONFIG.LEVELS.dialog);
  selectButton.addEventListener("click", () => {
    console.log('trigger select level button');
    selectButtonDialog.showModal();
  });
}

export function closeDialogs(closeBtns) {
  closeBtns.forEach((btn) => {
    btn.parentElement.close();
  });
}