import { DIALOG_CONFIG, END_LEVEL } from "./constants.js";
import {
  loadLevelTitleElement,
  loadCurrentLevelProperties,
  setLevel
} from "./local-storage.js";
import { displayErrorMessage } from "./errors.js";

export function handleDialogEvent() {
  const closeBtns = document.querySelectorAll(".close");
  Object.entries(DIALOG_CONFIG).forEach(([key, { button, dialog }]) => {
    const buttonElement = document.getElementById(button);
    const dialogElement = document.getElementById(dialog);
    buttonElement.addEventListener("click", () => {
      handleDialogClose(closeBtns);
      dialogElement.showModal();
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.close();
    });
  });
}

export function handleEndLevelEvent(allLevelsData, currentLevel, newLevel) {
  console.log('handleEndLevelEvent');
  const endLevelDialog = document.getElementById(END_LEVEL.DIALOG);
  const reviewButton = document.getElementById(END_LEVEL.BUTTON.review);
  const nextButton = document.getElementById(END_LEVEL.BUTTON.next);
  const selectButton = document.getElementById(END_LEVEL.BUTTON.select);

  endLevelDialog.addEventListener(END_LEVEL.EVENT, () => {
    console.log('end-level event triggered!');
    endLevelDialog.showModal();
  });


  // todo
  reviewButton.addEventListener("click", () => {
    // do something
  });

  if (!newLevel) {
    nextButton.remove();
    
  } else {
    nextButton.addEventListener("click", () => {
      console.log('trigger next level button');
      setLevel(currentLevel, newLevel); // next level becomes the current level
      loadCurrentLevelProperties(allLevelsData, currentLevel, true);
      loadLevelTitleElement(currentLevel);
    })    
  }

  const selectButtonDialog = document.getElementById(
    DIALOG_CONFIG.LEVELS.dialog
  );
  selectButton.addEventListener("click", () => {
    console.log('trigger select level button');
    selectButtonDialog.showModal();
  });
}

export function handleDialogClose(closeBtns) {
  closeBtns.forEach((btn) => {
    btn.parentElement.close();
  });
}