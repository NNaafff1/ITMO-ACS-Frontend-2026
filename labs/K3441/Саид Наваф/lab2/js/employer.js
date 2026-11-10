// Кабинет работодателя: вакансии хранятся на сервере (API).
//   GET    /vacancies?userId=...&_embed=responses   свои вакансии вместе с откликами
//   POST   /vacancies                               создать
//   PATCH  /vacancies/:id                           изменить и закрыть/открыть
//   DELETE /vacancies/:id?_dependent=responses      удалить вместе с откликами

const auth = requireAuth("employer"); // страница только для вошедших работодателей
let vacancies = [];
let editingId = null; // id изменяемой вакансии (null = создаём новую)
let idToDelete = null; // id вакансии, ожидающей подтверждения удаления

const $ = (id) => document.getElementById(id);
const tbody = $("vacancyRows");
const vacancyForm = $("vacancyForm");
const vacancyModalEl = $("vacancyModal");
const deleteModalEl = $("deleteModal");

const f = {
  title: $("vTitle"),
  salary: $("vSalary"),
  industry: $("vIndustry"),
  experience: $("vExperience"),
  city: $("vCity"),
  description: $("vDescription"),
};

function fillSelect(select, map) {
  select.replaceChildren(...Object.entries(map).map(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }));
}

function showToast(text, type) {
  const toast = $("employerToast");
  toast.className = "toast text-bg-" + (type || "success");
  $("employerToastText").textContent = text;
  bootstrap.Toast.getOrCreateInstance(toast).show();
}

function responsesCount(vacancy) {
  return (vacancy.responses || []).length;
}

// Карточки сверху считаем из загруженных вакансий
function updateStats() {
  const active = vacancies.filter((v) => v.active).length;
  $("statActive").textContent = active;
  $("statClosed").textContent = vacancies.length - active;
  $("statResponses").textContent = vacancies.reduce((sum, v) => sum + responsesCount(v), 0);
  $("emptyRows").classList.toggle("d-none", vacancies.length > 0);
}

function actionButton(action, id, className, label) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn-sm " + className;
  btn.dataset.action = action;
  btn.dataset.id = id;
  btn.textContent = label;
  return btn;
}

function createRow(vacancy) {
  const row = document.createElement("tr");

  const titleCell = document.createElement("th");
  titleCell.scope = "row";
  titleCell.className = "fw-semibold";
  const link = document.createElement("a");
  link.className = "text-decoration-none";
  link.href = "vacancy.html?id=" + encodeURIComponent(vacancy.id);
  link.textContent = vacancy.title;
  const city = document.createElement("div");
  city.className = "text-secondary small fw-normal";
  city.textContent = vacancy.city;
  titleCell.append(link, city);

  const industry = document.createElement("td");
  industry.textContent = INDUSTRIES[vacancy.industry] || vacancy.industry;

  const salary = document.createElement("td");
  salary.textContent = "от " + Number(vacancy.salary).toLocaleString("ru-RU") + " ₽";

  const responses = document.createElement("td");
  responses.textContent = responsesCount(vacancy);

  const status = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = "badge " + (vacancy.active ? "text-bg-success" : "text-bg-secondary");
  badge.textContent = vacancy.active ? "Активна" : "Закрыта";
  status.appendChild(badge);

  const actions = document.createElement("td");
  actions.className = "text-end text-nowrap";
  actions.append(
    actionButton("edit", vacancy.id, "btn-outline-primary", "Изменить"),
    " ",
    actionButton("toggle", vacancy.id, "btn-outline-secondary", vacancy.active ? "Закрыть" : "Открыть"),
    " ",
    actionButton("delete", vacancy.id, "btn-outline-danger", "Удалить")
  );

  row.append(titleCell, industry, salary, responses, status, actions);
  return row;
}

function render() {
  tbody.replaceChildren(...vacancies.map(createRow));
  updateStats();
}

async function loadVacancies() {
  try {
    vacancies = await apiFetch("/vacancies?userId=" + auth.user.id + "&_embed=responses&_sort=id&_order=desc");
    render();
  } catch (error) {
    tbody.replaceChildren();
    showToast(getErrorMessage(error), "danger");
  }
}

function findVacancy(id) {
  return vacancies.find((v) => String(v.id) === String(id));
}

// Кнопки в таблице обрабатываем одним обработчиком на tbody (делегирование событий)
tbody.addEventListener("click", async (event) => {
  const btn = event.target.closest("button[data-action]");
  if (!btn) {
    return;
  }
  const vacancy = findVacancy(btn.dataset.id);
  if (!vacancy) {
    return;
  }

  if (btn.dataset.action === "edit") {
    editingId = vacancy.id;
    $("vacancyModalLabel").textContent = "Изменение вакансии";
    $("vacancySubmit").textContent = "Сохранить";
    f.title.value = vacancy.title;
    f.salary.value = vacancy.salary;
    f.industry.value = vacancy.industry;
    f.experience.value = vacancy.experience;
    f.city.value = vacancy.city;
    f.description.value = vacancy.description || "";
    vacancyForm.classList.remove("was-validated");
    bootstrap.Modal.getOrCreateInstance(vacancyModalEl).show();
  }

  if (btn.dataset.action === "toggle") {
    btn.disabled = true;
    try {
      const updated = await apiFetch("/vacancies/" + vacancy.id, {
        method: "PATCH",
        body: JSON.stringify({ active: !vacancy.active }),
      });
      vacancy.active = updated.active;
      render();
      showToast(vacancy.active ? "Вакансия снова активна." : "Вакансия закрыта.");
    } catch (error) {
      btn.disabled = false;
      showToast(getErrorMessage(error), "danger");
    }
  }

  if (btn.dataset.action === "delete") {
    idToDelete = vacancy.id;
    $("deleteName").textContent = vacancy.title;
    bootstrap.Modal.getOrCreateInstance(deleteModalEl).show();
  }
});

// Кнопка «Добавить вакансию»: открываем чистую форму
$("addVacancyBtn").addEventListener("click", () => {
  editingId = null;
  $("vacancyModalLabel").textContent = "Новая вакансия";
  $("vacancySubmit").textContent = "Опубликовать";
  vacancyForm.reset();
  vacancyForm.classList.remove("was-validated");
});

// Сохранение формы: новая вакансия (POST) или изменение существующей (PATCH)
vacancyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!vacancyForm.checkValidity()) {
    vacancyForm.classList.add("was-validated");
    return;
  }

  const data = {
    title: f.title.value.trim(),
    salary: Number(f.salary.value),
    industry: f.industry.value,
    experience: f.experience.value,
    city: f.city.value.trim(),
    description: f.description.value.trim(),
  };

  const submitBtn = $("vacancySubmit");
  submitBtn.disabled = true;
  try {
    if (editingId !== null) {
      const updated = await apiFetch("/vacancies/" + editingId, { method: "PATCH", body: JSON.stringify(data) });
      Object.assign(findVacancy(editingId), updated);
      showToast("Изменения сохранены.");
    } else {
      const created = await apiFetch("/vacancies", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userId: auth.user.id,
          company: auth.user.company || auth.user.name,
          employment: "Полная занятость",
          format: "Офис",
          active: true,
          responsibilities: [],
          requirements: [],
          conditions: [],
        }),
      });
      created.responses = [];
      vacancies.unshift(created); // новые вакансии показываем сверху
      showToast("Вакансия опубликована.");
    }
    render();
    bootstrap.Modal.getInstance(vacancyModalEl).hide();
  } catch (error) {
    showToast(getErrorMessage(error), "danger");
  } finally {
    submitBtn.disabled = false;
  }
});

// Подтверждение удаления
$("confirmDelete").addEventListener("click", async () => {
  if (idToDelete === null) {
    return;
  }
  const id = idToDelete;
  try {
    await apiFetch("/vacancies/" + id + "?_dependent=responses", { method: "DELETE" });
    vacancies = vacancies.filter((v) => String(v.id) !== String(id));
    idToDelete = null;
    render();
    bootstrap.Modal.getInstance(deleteModalEl).hide();
    showToast("Вакансия удалена.");
  } catch (error) {
    showToast(getErrorMessage(error), "danger");
  }
});

if (auth) {
  fillSelect(f.industry, INDUSTRIES);
  fillSelect(f.experience, EXPERIENCES);
  $("companyTitle").textContent = auth.user.company || auth.user.name;
  loadVacancies();
}
