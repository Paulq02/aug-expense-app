const openSidebar = document.querySelector(".close");
const toggleButton = document.querySelector(".toggle");
const toggleSwitch = document.querySelector(".toggle-switch");
const bodyLight = document.querySelector("body");
const closeSearchBox = document.querySelector(".open-search-box");

toggleButton.addEventListener("click", () => {
  openSidebar.classList.toggle("sidebar");
  closeSearchBox.classList.toggle("close-search-box");
});

toggleSwitch.addEventListener("click", () => {
  toggleSwitch.classList.toggle("light");
  bodyLight.classList.toggle("light");
});
