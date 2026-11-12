document.querySelectorAll(".js-toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    btn.textContent = isHidden ? "Скрыть" : "Показать";
    btn.setAttribute("aria-label", isHidden ? "Скрыть пароль" : "Показать пароль");
  });
});

function showFormError(form, message) {
  let box = document.getElementById("formError");
  if (!box) {
    box = document.createElement("div");
    box.id = "formError";
    box.className = "alert alert-danger";
    box.setAttribute("role", "alert");
    form.prepend(box);
  }
  box.textContent = message;
}

function hideFormError() {
  const box = document.getElementById("formError");
  if (box) {
    box.remove();
  }
}

function redirectAfterAuth(user) {
  window.location.href = user.role === "employer" ? "employer.html" : "profile.html";
}

async function runAuthRequest(form, request) {
  const button = form.querySelector('button[type="submit"]');
  const label = button.textContent;
  button.disabled = true;
  button.textContent = "Подождите…";
  hideFormError();

  try {
    const data = await request();
    redirectAfterAuth(data.user);
  } catch (error) {
    showFormError(form, getErrorMessage(error));
    button.disabled = false;
    button.textContent = label;
  }
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!loginForm.checkValidity()) {
      loginForm.classList.add("was-validated");
      focusFirstInvalid(loginForm);
      return;
    }

    runAuthRequest(loginForm, async () => {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({
          email: document.getElementById("loginEmail").value.trim().toLowerCase(),
          password: document.getElementById("loginPassword").value,
        }),
      });
      setAuth(data, document.getElementById("rememberMe").checked);
      return data;
    });
  });
}


const resetForm = document.getElementById("resetForm");
if (resetForm) {
  resetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!resetForm.checkValidity()) {
      resetForm.classList.add("was-validated");
      focusFirstInvalid(resetForm);
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
      focusFirstInvalid(registerForm);
      return;
    }

    runAuthRequest(registerForm, async () => {
      const data = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({
          name: document.getElementById("regName").value.trim(),
          email: document.getElementById("regEmail").value.trim().toLowerCase(),
          password: pass1.value,
          role: registerForm.elements["role"].value,
        }),
      });
      setAuth(data, true);
      return data;
    });
  });
}
