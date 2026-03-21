import { DIALOG_CONFIG } from "./constants.js";

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

export function handleDialogClose(closeBtns) {
  closeBtns.forEach((btn) => {
    btn.parentElement.close();
  });
}