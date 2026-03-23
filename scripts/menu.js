import { DIALOG_CONFIG, END_LEVEL } from "./constants.js";

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

export function handleEndLevelEvent() {
  console.log('handleEndLevelEvent');
  const endLevelDialogElement = document.getElementById(END_LEVEL.DIALOG);
  const reviewButtonElement = document.getElementById(END_LEVEL.BUTTON.review);
  const nextButtonElement = document.getElementById(END_LEVEL.BUTTON.next);
  const selectButtonElement = document.getElementById(END_LEVEL.BUTTON.select);

  endLevelDialogElement.addEventListener(END_LEVEL.EVENT, () => {
    console.log('end-level event triggered!');
    endLevelDialogElement.showModal();
  });


  // todo
  reviewButtonElement.addEventListener("click", () => {
    // do something
  });

  nextButtonElement.addEventListener("click", () => {
    // do something
  });

  selectButtonElement.addEventListener("click", () => {
    // do something
  });
}

export function handleDialogClose(closeBtns) {
  closeBtns.forEach((btn) => {
    btn.parentElement.close();
  });
}