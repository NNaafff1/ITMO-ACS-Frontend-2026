// Общий скрипт сайта: адрес API, авторизация, запросы к серверу и шапка.
// Подключается на всех страницах ПЕРЕД скриптом самой страницы.

const API_URL = "http://localhost:3000";
const AUTH_KEY = "jobsite_auth";

// Справочники: на сервере хранятся короткие коды, на странице показываем подписи
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

// ---------- Авторизация: токен хранится в браузере ----------

// Читаем сохранённый вход: сначала из sessionStorage (до закрытия вкладки), потом из localStorage
function getAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

// remember = true: храним в localStorage (останется после закрытия браузера)
function setAuth(data, remember) {
  clearAuth();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_KEY, JSON.stringify({ token: data.accessToken, user: data.user }));
}

function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_KEY);
}

// Обновляем данные пользователя в хранилище (например, после смены имени)
function updateStoredUser(user) {
  const auth = getAuth();
  if (!auth) {
    return;
  }
  const storage = sessionStorage.getItem(AUTH_KEY) ? sessionStorage : localStorage;
  storage.setItem(AUTH_KEY, JSON.stringify({ token: auth.token, user: user }));
}

// Страница доступна только вошедшим. role = "seeker" | "employer" | undefined (любая роль)
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

// ---------- Запросы к API ----------

// Единая обёртка над fetch: добавляет токен, разбирает JSON, превращает ошибки в исключения
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
    // Токен устарел или недействителен: выходим и отправляем на вход
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

// Сообщения json-server-auth приходят на английском, показываем пользователю русский текст
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

// ---------- Шапка сайта ----------

// Если пользователь вошёл, вместо «Войти / Регистрация» показываем имя и кнопку «Выйти»
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

  // Работодателя «Мой кабинет» ведёт в его кабинет
  const cabinetLink = document.querySelector('#mainNav a[href="profile.html"]');
  if (cabinetLink && auth.user.role === "employer") {
    cabinetLink.href = "employer.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Подставляем текущий год в футер
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  renderNavbar();
});
