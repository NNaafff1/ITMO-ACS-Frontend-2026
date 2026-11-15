
(function () {
  var theme = null;
  try {
    theme = window.localStorage.getItem("jobsite_theme");
  } catch (error) {

  }

  if (theme !== "light" && theme !== "dark") {
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme = prefersDark ? "dark" : "light";
  }

  document.documentElement.setAttribute("data-bs-theme", theme);
})();
