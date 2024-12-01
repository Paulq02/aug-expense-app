const body = document.querySelector("body");
sidebar = body.querySelector(".sidebar");
toggle = body.querySelector(".toggle");
modeSwitch = body.querySelector(".toggle-switch");
modeText = body.querySelector(".mode-text");
searchButton = body.querySelector(".search-box");

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("light");
});

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

sidebar.addEventListener("mouseenter", () => {
  sidebar.classList.remove("close"); // Open sidebar on hover
});

sidebar.addEventListener("mouseleave", () => {
  sidebar.classList.add("close"); // Close sidebar when no longer hovered
});
