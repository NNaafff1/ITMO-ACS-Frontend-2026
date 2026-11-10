const filterForm = document.getElementById("filterForm");
const searchInput = document.getElementById("fSearch");
const industrySelect = document.getElementById("fIndustry");
const salaryInput = document.getElementById("fSalary");
const experienceSelect = document.getElementById("fExperience");

const listEl = document.getElementById("vacancyList");
const countEl = document.getElementById("resultsCount");
const emptyMessage = document.getElementById("emptyMessage");
const loadError = document.getElementById("loadError");
const loader = document.getElementById("loader");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

function createCard(vacancy) {
  const col = el("div", "col-md-6");
  const card = el("article", "card vacancy-card h-100");
  const body = el("div", "card-body d-flex flex-column");

  const title = el("h2", "h5 mb-1");
  const link = el("a", "text-decoration-none", vacancy.title);
  link.href = "vacancy.html?id=" + encodeURIComponent(vacancy.id);
  title.appendChild(link);

  const company = el("p", "text-secondary mb-2", vacancy.company + " · " + vacancy.city);
  const salary = el("p", "salary fs-5 mb-3", "от " + Number(vacancy.salary).toLocaleString("ru-RU") + " ₽");

  const badges = el("div", "d-flex flex-wrap gap-2 mb-3");
  badges.append(
    el("span", "badge text-bg-light border", INDUSTRIES[vacancy.industry] || vacancy.industry),
    el("span", "badge text-bg-light border", EXPERIENCES[vacancy.experience] || vacancy.experience)
  );

  const more = el("a", "btn btn-outline-primary mt-auto align-self-start", "Подробнее");
  more.href = link.href;

  body.append(title, company, salary, badges, more);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

let lastRequestId = 0;

async function loadVacancies() {
  const requestId = ++lastRequestId;

  const params = new URLSearchParams({ active: "true" });
  const query = searchInput.value.trim();
  if (query) {
    params.set("q", query);
  }
  if (industrySelect.value) {
    params.set("industry", industrySelect.value);
  }
  if (experienceSelect.value) {
    params.set("experience", experienceSelect.value);
  }
  const minSalary = Number(salaryInput.value);
  if (minSalary > 0) {
    params.set("salary_gte", minSalary);
  }

  loader.classList.remove("d-none");
  loadError.classList.add("d-none");

  try {
    const vacancies = await apiFetch("/vacancies?" + params.toString());
    if (requestId !== lastRequestId) {
      return;
    }
    listEl.replaceChildren(...vacancies.map(createCard));
    countEl.textContent = vacancies.length;
    emptyMessage.classList.toggle("d-none", vacancies.length > 0);
  } catch (error) {
    if (requestId !== lastRequestId) {
      return;
    }
    listEl.replaceChildren();
    countEl.textContent = "0";
    emptyMessage.classList.add("d-none");
    loadError.textContent = getErrorMessage(error);
    loadError.classList.remove("d-none");
  } finally {
    if (requestId === lastRequestId) {
      loader.classList.add("d-none");
    }
  }
}

let timer;
function scheduleLoad() {
  clearTimeout(timer);
  timer = setTimeout(loadVacancies, 300);
}

filterForm.addEventListener("input", scheduleLoad);
filterForm.addEventListener("reset", () => setTimeout(loadVacancies, 0));
filterForm.addEventListener("submit", (event) => event.preventDefault());

loadVacancies();
