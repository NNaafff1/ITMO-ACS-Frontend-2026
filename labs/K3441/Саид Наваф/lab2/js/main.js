const API_URL = "http://localhost:3000";
const AUTH_KEY = "jobsite_auth";

const INDUSTRIES = {
  it: "IT и разработка",
  marketing: "Маркетинг",
  finance: "Финансы",
  education: "Образование",
  trade: "Торговля",
};
const EXPERIENCES = {
  none: "Без опыта",
  "1-3": "1–3 года",
  "3-6": "3–6 лет",
  "6+": "Более 6 лет",
};


function getAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function setAuth(data, remember) {
  clearAuth();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_KEY, JSON.stringify({ token: data.accessToken, user: data.user }));
}

function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_KEY);
}


function updateStoredUser(user) {
  const auth = getAuth();
  if (!auth) {
    return;
  }
  const storage = sessionStorage.getItem(AUTH_KEY) ? sessionStorage : localStorage;
  storage.setItem(AUTH_KEY, JSON.stringify({ token: auth.token, user: user }));
}

function requireAuth(role) {
  const auth = getAuth();
  if (!auth) {
    window.location.href = "login.html";
    return null;
  }
  if (role && auth.user.role !== role) {
    window.location.href = auth.user.role === "employer" ? "employer.html" : "profile.html";
    return null;
  }
  return auth;
}


async function apiFetch(path, options = {}) {
  const auth = getAuth();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (auth) {
    headers.Authorization = "Bearer " + auth.token;
  }

  let response;
  try {
    response = await fetch(API_URL + path, { ...options, headers });
  } catch (networkError) {
    const error = new Error("Не удалось связаться с сервером. Проверьте, что API запущен (npm start в папке api).");
    error.status = 0;
    throw error;
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      data = text;
    }
  }

  if (!response.ok) {

    if (response.status === 401 && auth) {
      clearAuth();
      window.location.href = "login.html";
    }
    const message = typeof data === "string" ? data : (data && data.message) || "Ошибка запроса (" + response.status + ")";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}


const API_ERRORS = {
  "Incorrect password": "Неверный пароль.",
  "Cannot find user": "Пользователь с такой почтой не найден.",
  "Email already exists": "Эта почта уже зарегистрирована.",
  "Email format is invalid": "Некорректный адрес почты.",
  "Password is too short": "Пароль слишком короткий.",
};

function getErrorMessage(error) {
  return API_ERRORS[error.message] || error.message || "Произошла ошибка.";
}


function renderNavbar() {
  const auth = getAuth();
  const box = document.querySelector("#mainNav .d-flex");
  if (!auth || !box) {
    return;
  }

  box.innerHTML = "";
  const name = document.createElement("span");
  name.className = "navbar-text me-2";
  name.textContent = auth.user.name;

  const logoutBtn = document.createElement("button");
  logoutBtn.type = "button";
  logoutBtn.className = "btn btn-outline-primary";
  logoutBtn.textContent = "Выйти";
  logoutBtn.addEventListener("click", () => {
    clearAuth();
    window.location.href = "index.html";
  });
  box.append(name, logoutBtn);

 
  const cabinetLink = document.querySelector('#mainNav a[href="profile.html"]');
  if (cabinetLink && auth.user.role === "employer") {
    cabinetLink.href = "employer.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
 
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  renderNavbar();
});
