export function initCvControls() {
  document.querySelectorAll<HTMLButtonElement>("[data-cv-dialog]").forEach(button => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.cvDialog ?? "");
      if (dialog instanceof HTMLDialogElement) dialog.showModal();
    });
  });
  document.querySelectorAll<HTMLDialogElement>(".cv-dialog").forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.querySelectorAll("[data-cv-close]").forEach(link => link.addEventListener("click", () => dialog.close()));
  });
}
