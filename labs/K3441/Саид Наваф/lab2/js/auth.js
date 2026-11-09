
document.querySelectorAll(".js-toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    btn.textContent = isHidden ? "Скрыть" : "Показать";
    btn.setAttribute("aria-label", isHidden ? "Скрыть пароль" : "Показать пароль");
  });
});

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!loginForm.checkValidity()) {
      loginForm.classList.add("was-validated");
      return;
    }
    window.location.href = "profile.html";
  });
}

const resetForm = document.getElementById("resetForm");
if (resetForm) {
  resetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!resetForm.checkValidity()) {
      resetForm.classList.add("was-validated");
      return;
    }
    document.getElementById("resetSuccess").classList.remove("d-none");
  });

  document.getElementById("resetModal").addEventListener("hidden.bs.modal", () => {
    resetForm.reset();
    resetForm.classList.remove("was-validated");
    document.getElementById("resetSuccess").classList.add("d-none");
  });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  const pass1 = document.getElementById("regPassword");
  const pass2 = document.getElementById("regPassword2");

  function checkPasswordsMatch() {
    pass2.setCustomValidity(pass1.value === pass2.value ? "" : "Пароли не совпадают");
  }
  pass1.addEventListener("input", checkPasswordsMatch);
  pass2.addEventListener("input", checkPasswordsMatch);

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkPasswordsMatch();
    if (!registerForm.checkValidity()) {
      registerForm.classList.add("was-validated");
      return;
    }
   
    const role = registerForm.elements["role"].value;
    window.location.href = role === "employer" ? "employer.html" : "profile.html";
  });
}
