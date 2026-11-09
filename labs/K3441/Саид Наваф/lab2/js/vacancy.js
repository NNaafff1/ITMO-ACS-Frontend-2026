
const applyForm = document.getElementById("applyForm");
const applyModalEl = document.getElementById("applyModal");
const applyBtn = document.getElementById("applyBtn");

applyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!applyForm.checkValidity()) {
    applyForm.classList.add("was-validated");
    return;
  }

  bootstrap.Modal.getInstance(applyModalEl).hide();
  bootstrap.Toast.getOrCreateInstance(document.getElementById("applyToast")).show();

  applyBtn.textContent = "Вы откликнулись";
  applyBtn.classList.replace("btn-primary", "btn-success");
  applyBtn.disabled = true;
  applyBtn.removeAttribute("data-bs-toggle");
});

applyModalEl.addEventListener("hidden.bs.modal", () => {
  applyForm.classList.remove("was-validated");
});
