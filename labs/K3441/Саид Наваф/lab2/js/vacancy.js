const vacancyId = new URLSearchParams(window.location.search).get("id");

const $ = (id) => document.getElementById(id);
const applyBtn = $("applyBtn");
const applyModalEl = $("applyModal");
const applyForm = $("applyForm");
const resumeSelect = $("applyResume");

let currentVacancy = null;

function showToast(text, type) {
  const toast = $("applyToast");
  toast.className = "toast text-bg-" + (type || "success");
  $("applyToastText").textContent = text;
  bootstrap.Toast.getOrCreateInstance(toast).show();
}

function fillList(listId, items) {
  const list = $(listId);
  list.replaceChildren(...items.map((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    return li;
  }));
}

function showPageError(message) {
  $("pageLoader").classList.add("d-none");
  $("pageError").textContent = message;
  $("pageError").classList.remove("d-none");
}

function markApplied() {
  applyBtn.textContent = "Вы откликнулись";
  applyBtn.classList.replace("btn-primary", "btn-success");
  applyBtn.disabled = true;
}

function renderVacancy(vacancy) {
  document.title = vacancy.title + " — Работа рядом";
  $("crumbTitle").textContent = vacancy.title;
  $("vTitle").textContent = vacancy.title;
  $("vCompanyLine").textContent = vacancy.company + " · " + vacancy.city;
  $("vSalary").textContent = "от " + Number(vacancy.salary).toLocaleString("ru-RU") + " ₽";
  $("vDescription").textContent = vacancy.description;
  fillList("vDuties", vacancy.responsibilities || []);
  fillList("vReqs", vacancy.requirements || []);
  fillList("vConds", vacancy.conditions || []);

  const badges = [
    INDUSTRIES[vacancy.industry] || vacancy.industry,
    "Опыт: " + (EXPERIENCES[vacancy.experience] || vacancy.experience),
    vacancy.employment,
    vacancy.format,
  ].filter(Boolean);
  $("vBadges").replaceChildren(...badges.map((text) => {
    const span = document.createElement("span");
    span.className = "badge text-bg-light border";
    span.textContent = text;
    return span;
  }));

  $("companyName").textContent = vacancy.company;
  $("companyCity").textContent = vacancy.city;
  $("companyInitials").textContent = vacancy.company
    .replace(/[«»"]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  if (!vacancy.active) {
    applyBtn.textContent = "Вакансия закрыта";
    applyBtn.disabled = true;
  }

  $("pageLoader").classList.add("d-none");
  $("vacancyContent").classList.remove("d-none");
}

async function loadExtras(vacancy) {
  try {
    const own = await apiFetch("/vacancies?active=true&userId=" + vacancy.userId);
    $("companyOpen").textContent = own.length;

    const similar = await apiFetch(
      "/vacancies?active=true&industry=" + encodeURIComponent(vacancy.industry) + "&id_ne=" + vacancy.id + "&_limit=2"
    );
    const list = $("similarList");
    if (similar.length === 0) {
      list.innerHTML = "";
      const empty = document.createElement("li");
      empty.className = "text-secondary small";
      empty.textContent = "Похожих вакансий нет.";
      list.appendChild(empty);
      return;
    }
    list.replaceChildren(...similar.map((item) => {
      const li = document.createElement("li");
      li.className = "mb-2";
      const link = document.createElement("a");
      link.className = "fw-semibold text-decoration-none";
      link.href = "vacancy.html?id=" + encodeURIComponent(item.id);
      link.textContent = item.title;
      const info = document.createElement("div");
      info.className = "text-secondary small";
      info.textContent = item.company + " · от " + Number(item.salary).toLocaleString("ru-RU") + " ₽";
      li.append(link, info);
      return li;
    }));
  } catch (error) {

    $("companyOpen").textContent = "—";
  }
}


async function checkAlreadyApplied(vacancy) {
  const auth = getAuth();
  if (!auth || auth.user.role !== "seeker") {
    return;
  }
  try {
    const existing = await apiFetch("/responses?userId=" + auth.user.id + "&vacancyId=" + vacancy.id);
    if (existing.length > 0) {
      markApplied();
    }
  } catch (error) {

  }
}

async function loadVacancy() {
  if (!vacancyId) {
    showPageError("Вакансия не выбрана. Вернитесь к списку и откройте нужную вакансию.");
    return;
  }
  try {
    currentVacancy = await apiFetch("/vacancies/" + encodeURIComponent(vacancyId));
  } catch (error) {
    showPageError(error.status === 404 ? "Такой вакансии нет." : getErrorMessage(error));
    return;
  }
  renderVacancy(currentVacancy);
  loadExtras(currentVacancy);
  checkAlreadyApplied(currentVacancy);
}


async function loadResumes(auth) {
  const resumes = await apiFetch("/resumes?userId=" + auth.user.id);
  resumeSelect.replaceChildren();
  $("noResume").classList.toggle("d-none", resumes.length > 0);
  $("applySubmit").disabled = resumes.length === 0;

  if (resumes.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Нет резюме";
    resumeSelect.appendChild(option);
    return;
  }
  resumes.forEach((resume) => {
    const option = document.createElement("option");
    option.value = resume.id;
    option.textContent = resume.position;
    resumeSelect.appendChild(option);
  });
}

applyBtn.addEventListener("click", async () => {
  const auth = getAuth();
  if (!auth) {
    window.location.href = "login.html";
    return;
  }
  if (auth.user.role !== "seeker") {
    showToast("Откликаться на вакансии могут только соискатели.", "danger");
    return;
  }
  try {
    await loadResumes(auth);
  } catch (error) {
    showToast(getErrorMessage(error), "danger");
    return;
  }
  $("applyVacancyName").textContent = currentVacancy.title + ", " + currentVacancy.company;
  bootstrap.Modal.getOrCreateInstance(applyModalEl).show();
});

applyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!applyForm.checkValidity()) {
    applyForm.classList.add("was-validated");
    return;
  }

  const auth = getAuth();
  const submitBtn = $("applySubmit");
  submitBtn.disabled = true;
  try {
    await apiFetch("/responses", {
      method: "POST",
      body: JSON.stringify({
        userId: auth.user.id,
        vacancyId: currentVacancy.id,
        resumeId: Number(resumeSelect.value),
        letter: $("applyLetter").value.trim(),
        status: "pending",
        createdAt: new Date().toISOString().slice(0, 10),
      }),
    });
    bootstrap.Modal.getInstance(applyModalEl).hide();
    showToast("Отклик отправлен. Работодатель увидит его в своём кабинете.");
    markApplied();
  } catch (error) {
    showToast(getErrorMessage(error), "danger");
  } finally {
    submitBtn.disabled = false;
  }
});

applyModalEl.addEventListener("hidden.bs.modal", () => {
  applyForm.reset();
  applyForm.classList.remove("was-validated");
});

loadVacancy();
