const openSidebar = document.querySelector(".close");
const toggleButton = document.querySelector(".toggle");
const toggleSwitch = document.querySelector(".toggle-switch");
const bodyLight = document.querySelector("body");

toggleButton.addEventListener("click", () => {
  openSidebar.classList.toggle("sidebar");
});

toggleSwitch.addEventListener("click", () => {
  toggleSwitch.classList.toggle("light");
  bodyLight.classList.toggle("light");
});
