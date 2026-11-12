const auth = requireAuth("seeker");
let resume = null;

const $ = (id) => document.getElementById(id);
const resumeForm = $("resumeForm");
const resumeModalEl = $("editResumeModal");

const fields = {
  position: $("inPosition"),
  salary: $("inSalary"),
  industry: $("inIndustry"),
  experience: $("inExperience"),
  city: $("inCity"),
  skills: $("inSkills"),
  about: $("inAbout"),
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
  const toast = $("saveToast");
  toast.className = "toast text-bg-" + (type || "success");
  toast.querySelector(".toast-body").textContent = text;
  bootstrap.Toast.getOrCreateInstance(toast).show();
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

function renderUser() {
  $("fullName").textContent = auth.user.name;
  $("avatarInitials").textContent = initials(auth.user.name);
  $("profileEmail").textContent = auth.user.email;
}

function renderResume() {
  const hasResume = resume !== null;
  $("resumeEmpty").classList.toggle("d-none", hasResume);
  $("resumeContent").classList.toggle("d-none", !hasResume);
  $("cityText").textContent = hasResume ? resume.city : "не указан";
  $("resumePositionShort").textContent = hasResume ? resume.position : "Резюме не заполнено";
  if (!hasResume) {
    return;
  }

  $("resumePosition").textContent = resume.position;
  $("resumeSalary").textContent = "от " + Number(resume.salary).toLocaleString("ru-RU") + " ₽";
  $("resumeExperience").textContent = EXPERIENCES[resume.experience] || resume.experience;
  $("resumeIndustry").textContent = INDUSTRIES[resume.industry] || resume.industry;
  $("resumeAbout").textContent = resume.about || "Не заполнено";
  $("resumeSkills").replaceChildren(...(resume.skills || []).map((skill) => {
    const badge = document.createElement("span");
    badge.className = "badge text-bg-primary";
    badge.textContent = skill; // textContent, а не innerHTML: нельзя вставить чужой HTML
    return badge;
  }));
}

const STATUSES = {
  pending: ["На рассмотрении", "text-bg-warning"],
  invited: ["Приглашение", "text-bg-success"],
  rejected: ["Отказ", "text-bg-secondary"],
};

function renderResponses(responses) {
  const body = $("responsesBody");
  if (responses.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.className = "text-secondary";
    cell.textContent = "Откликов пока нет. Найдите вакансию и нажмите «Откликнуться».";
    row.appendChild(cell);
    body.replaceChildren(row);
    return;
  }

  body.replaceChildren(...responses.map((item) => {
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = "vacancy.html?id=" + encodeURIComponent(item.vacancyId);
    link.textContent = item.vacancy ? item.vacancy.title : "Вакансия удалена";
    titleCell.appendChild(link);

    const companyCell = document.createElement("td");
    companyCell.textContent = item.vacancy ? item.vacancy.company : "—";

    const statusCell = document.createElement("td");
    const [label, cls] = STATUSES[item.status] || [item.status, "text-bg-light"];
    const badge = document.createElement("span");
    badge.className = "badge " + cls;
    badge.textContent = label;
    statusCell.appendChild(badge);

    row.append(titleCell, companyCell, statusCell);
    return row;
  }));
}

async function loadData() {
  try {
    const resumes = await apiFetch("/resumes?userId=" + auth.user.id);
    resume = resumes[0] || null;
    renderResume();
  } catch (error) {
    showToast(getErrorMessage(error), "danger");
  }

  try {
    const responses = await apiFetch("/responses?userId=" + auth.user.id + "&_expand=vacancy");
    renderResponses(responses);
  } catch (error) {
    $("responsesBody").innerHTML = "";
    showToast(getErrorMessage(error), "danger");
  }
}


resumeModalEl.addEventListener("show.bs.modal", () => {
  const data = resume || {};
  fields.position.value = data.position || "";
  fields.salary.value = data.salary || "";
  fields.industry.value = data.industry || "it";
  fields.experience.value = data.experience || "none";
  fields.city.value = data.city || "";
  fields.skills.value = (data.skills || []).join(", ");
  fields.about.value = data.about || "";
  resumeForm.classList.remove("was-validated");
});


resumeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!resumeForm.checkValidity()) {
    resumeForm.classList.add("was-validated");
    focusFirstInvalid(resumeForm);
    return;
  }

  const data = {
    position: fields.position.value.trim(),
    salary: Number(fields.salary.value),
    industry: fields.industry.value,
    experience: fields.experience.value,
    city: fields.city.value.trim(),
    skills: fields.skills.value.split(",").map((s) => s.trim()).filter(Boolean),
    about: fields.about.value.trim(),
  };

  const submitBtn = resumeForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  try {
    if (resume) {
      resume = await apiFetch("/resumes/" + resume.id, { method: "PATCH", body: JSON.stringify(data) });
    } else {
      resume = await apiFetch("/resumes", { method: "POST", body: JSON.stringify({ userId: auth.user.id, ...data }) });
    }
    renderResume();
    bootstrap.Modal.getInstance(resumeModalEl).hide();
    showToast("Резюме сохранено.");
  } catch (error) {
    showToast(getErrorMessage(error), "danger");
  } finally {
    submitBtn.disabled = false;
  }
});

if (auth) {
  fillSelect(fields.industry, INDUSTRIES);
  fillSelect(fields.experience, EXPERIENCES);
  renderUser();
  loadData();
}
