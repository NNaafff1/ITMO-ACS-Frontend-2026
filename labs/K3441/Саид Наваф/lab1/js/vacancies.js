
const filterForm = document.getElementById("filterForm");
const searchInput = document.getElementById("fSearch");
const industrySelect = document.getElementById("fIndustry");
const salaryInput = document.getElementById("fSalary");
const experienceSelect = document.getElementById("fExperience");

const items = document.querySelectorAll(".vacancy-item");
const countEl = document.getElementById("resultsCount");
const emptyMessage = document.getElementById("emptyMessage");

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const industry = industrySelect.value;
  const minSalary = Number(salaryInput.value) || 0;
  const experience = experienceSelect.value;

  let visibleCount = 0;

  items.forEach((item) => {
    const matchesQuery = item.dataset.title.includes(query);
    const matchesIndustry = !industry || item.dataset.industry === industry;
    const matchesSalary = Number(item.dataset.salary) >= minSalary;
    const matchesExperience = !experience || item.dataset.experience === experience;

    const isVisible = matchesQuery && matchesIndustry && matchesSalary && matchesExperience;
    item.classList.toggle("d-none", !isVisible);
    if (isVisible) {
      visibleCount++;
    }
  });

  countEl.textContent = visibleCount;
  emptyMessage.classList.toggle("d-none", visibleCount > 0);
}

filterForm.addEventListener("input", applyFilters);
filterForm.addEventListener("change", applyFilters);

filterForm.addEventListener("reset", () => {
  setTimeout(applyFilters, 0);
});


filterForm.addEventListener("submit", (event) => event.preventDefault());
