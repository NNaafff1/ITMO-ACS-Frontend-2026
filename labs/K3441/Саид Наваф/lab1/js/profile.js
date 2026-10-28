
const resumeForm = document.getElementById("resumeForm");
const resumeModalEl = document.getElementById("editResumeModal");


const view = {
  position: document.getElementById("resumePosition"),
  positionShort: document.getElementById("resumePositionShort"),
  salary: document.getElementById("resumeSalary"),
  industry: document.getElementById("resumeIndustry"),
  experience: document.getElementById("resumeExperience"),
  skills: document.getElementById("resumeSkills"),
  about: document.getElementById("resumeAbout"),
  city: document.getElementById("cityText"),
};

const fields = {
  position: document.getElementById("inPosition"),
  salary: document.getElementById("inSalary"),
  industry: document.getElementById("inIndustry"),
  experience: document.getElementById("inExperience"),
  city: document.getElementById("inCity"),
  skills: document.getElementById("inSkills"),
  about: document.getElementById("inAbout"),
};


function formatSalary(value) {
  return "от " + Number(value).toLocaleString("ru-RU") + " ₽";
}


function renderSkills(text) {
  view.skills.innerHTML = "";
  text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .forEach((skill) => {
      const badge = document.createElement("span");
      badge.className = "badge text-bg-primary";
      badge.textContent = skill;
      view.skills.appendChild(badge);
    });
}

resumeModalEl.addEventListener("show.bs.modal", () => {
  fields.position.value = view.position.textContent;
  fields.salary.value = view.salary.textContent.replace(/\D/g, "");
  fields.industry.value = view.industry.textContent;
  fields.experience.value = view.experience.textContent;
  fields.city.value = view.city.textContent;
  fields.about.value = view.about.textContent;
  fields.skills.value = Array.from(view.skills.children)
    .map((el) => el.textContent)
    .join(", ");
  resumeForm.classList.remove("was-validated");
});

resumeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!resumeForm.checkValidity()) {
    resumeForm.classList.add("was-validated");
    return;
  }

  view.position.textContent = fields.position.value.trim();
  view.positionShort.textContent = fields.position.value.trim();
  view.salary.textContent = formatSalary(fields.salary.value);
  view.industry.textContent = fields.industry.value;
  view.experience.textContent = fields.experience.value;
  view.city.textContent = fields.city.value.trim();
  view.about.textContent = fields.about.value.trim();
  renderSkills(fields.skills.value);

  bootstrap.Modal.getInstance(resumeModalEl).hide();
  bootstrap.Toast.getOrCreateInstance(document.getElementById("saveToast")).show();
});
