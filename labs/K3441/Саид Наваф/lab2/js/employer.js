
const tbody = document.getElementById("vacancyRows");
const vacancyForm = document.getElementById("vacancyForm");
const vacancyModalEl = document.getElementById("vacancyModal");
const deleteModalEl = document.getElementById("deleteModal");

const f = {
  title: document.getElementById("vTitle"),
  salary: document.getElementById("vSalary"),
  industry: document.getElementById("vIndustry"),
  experience: document.getElementById("vExperience"),
  city: document.getElementById("vCity"),
  description: document.getElementById("vDescription"),
};

let editingRow = null;
let rowToDelete = null;

function showToast(text) {
  document.getElementById("employerToastText").textContent = text;
  bootstrap.Toast.getOrCreateInstance(document.getElementById("employerToast")).show();
}

function updateStats() {
  const rows = tbody.querySelectorAll("tr");
  let active = 0;
  let closed = 0;
  let responses = 0;
  rows.forEach((row) => {
    if (row.dataset.active === "true") {
      active++;
    } else {
      closed++;
    }
    responses += Number(row.dataset.responses);
  });
  document.getElementById("statActive").textContent = active;
  document.getElementById("statClosed").textContent = closed;
  document.getElementById("statResponses").textContent = responses;
  document.getElementById("emptyRows").classList.toggle("d-none", rows.length > 0);
}

function renderRow(row) {
  const d = row.dataset;
  const isActive = d.active === "true";

  row.querySelector(".row-title").textContent = d.title;
  row.querySelector(".row-city").textContent = d.city;
  row.querySelector(".row-industry").textContent = d.industry;
  row.querySelector(".row-salary").textContent =
    "от " + Number(d.salary).toLocaleString("ru-RU") + " ₽";
  row.querySelector(".row-responses").textContent = d.responses;

  const statusCell = row.querySelector(".row-status");
  statusCell.innerHTML = "";
  const badge = document.createElement("span");
  badge.className = "badge " + (isActive ? "text-bg-success" : "text-bg-secondary");
  badge.textContent = isActive ? "Активна" : "Закрыта";
  statusCell.appendChild(badge);

  row.querySelector('[data-action="toggle"]').textContent = isActive ? "Закрыть" : "Открыть";
}

function createRow() {
  const row = document.createElement("tr");
  row.innerHTML = `
    <th scope="row" class="fw-semibold"><span class="row-title"></span><div class="text-secondary small fw-normal row-city"></div></th>
    <td class="row-industry"></td>
    <td class="row-salary"></td>
    <td class="row-responses"></td>
    <td class="row-status"></td>
    <td class="text-end text-nowrap">
      <button type="button" class="btn btn-sm btn-outline-primary" data-action="edit">Изменить</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-action="toggle">Закрыть</button>
      <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete">Удалить</button>
    </td>`;
  return row;
}

tbody.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-action]");
  if (!btn) {
    return;
  }
  const row = btn.closest("tr");
  const action = btn.dataset.action;

  if (action === "edit") {
    editingRow = row;
    document.getElementById("vacancyModalLabel").textContent = "Изменение вакансии";
    document.getElementById("vacancySubmit").textContent = "Сохранить";
    f.title.value = row.dataset.title;
    f.salary.value = row.dataset.salary;
    f.industry.value = row.dataset.industry;
    f.experience.value = row.dataset.experience;
    f.city.value = row.dataset.city;
    f.description.value = row.dataset.description;
    vacancyForm.classList.remove("was-validated");
    bootstrap.Modal.getOrCreateInstance(vacancyModalEl).show();
  }

  if (action === "toggle") {
    row.dataset.active = row.dataset.active === "true" ? "false" : "true";
    renderRow(row);
    updateStats();
    showToast(row.dataset.active === "true" ? "Вакансия снова активна." : "Вакансия закрыта.");
  }

  if (action === "delete") {
    rowToDelete = row;
    document.getElementById("deleteName").textContent = row.dataset.title;
    bootstrap.Modal.getOrCreateInstance(deleteModalEl).show();
  }
});

document.getElementById("addVacancyBtn").addEventListener("click", () => {
  editingRow = null;
  document.getElementById("vacancyModalLabel").textContent = "Новая вакансия";
  document.getElementById("vacancySubmit").textContent = "Опубликовать";
  vacancyForm.reset();
  vacancyForm.classList.remove("was-validated");
});

vacancyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!vacancyForm.checkValidity()) {
    vacancyForm.classList.add("was-validated");
    return;
  }

  const row = editingRow || createRow();
  row.dataset.title = f.title.value.trim();
  row.dataset.salary = f.salary.value;
  row.dataset.industry = f.industry.value;
  row.dataset.experience = f.experience.value;
  row.dataset.city = f.city.value.trim();
  row.dataset.description = f.description.value.trim();

  if (!editingRow) {
    row.dataset.responses = "0";
    row.dataset.active = "true";
    tbody.prepend(row);
  }

  renderRow(row);
  updateStats();
  bootstrap.Modal.getInstance(vacancyModalEl).hide();
  showToast(editingRow ? "Изменения сохранены." : "Вакансия опубликована.");
});

document.getElementById("confirmDelete").addEventListener("click", () => {
  if (rowToDelete) {
    rowToDelete.remove();
    rowToDelete = null;
    updateStats();
    bootstrap.Modal.getInstance(deleteModalEl).hide();
    showToast("Вакансия удалена.");
  }
});

updateStats();
