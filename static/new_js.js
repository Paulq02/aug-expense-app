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

function confirmPassword() {
  const createAccountButton = document.querySelector(".create-account-button");
  const messageBox = document.querySelector(".password-alert");
  const password = document.querySelector(".first-password").value;

  const secondPassword = document.querySelector(".confirm-password").value;
  if (password !== secondPassword) {
    messageBox.innerHTML = "Passwords do not match";
    messageBox.style.color = "red";
    createAccountButton.disabled = true;
  } else {
    messageBox.innerHTML = "";
    createAccountButton.disabled = false;
  }
}

/*
const dateButton = document.querySelector(".sort-button");
const newestExpenses = document.querySelector(".newest-first");
const olderExpenses = document.querySelector(".oldest-first");

dateButton.addEventListener("click", () => {
  let sortBy = localStorage.getItem("sortBy");

  if (sortBy === "newest") {
    olderExpenses.style.display = "none";
    newestExpenses.style.display = "flex";
  } else {
    olderExpenses.style.display = "none";
    newestExpenses.style.display = "flex";
  }
});

window.addEventListener("load", () => {
  const sortBy = localStorage.getItem("sortBy");

  if (sortBy == "newest") {
    newestExpenses.style.display = "flex";
    olderExpenses.style.display = "none";
  } else {
    newestExpenses.style.display = "none";
    olderExpenses.style.display = "flex";
  }
});
*/
const yearSelect = document.getElementById("year-select");

yearSelect.addEventListener("change", () => {
  const selectForm = document.querySelector(".select-form");
  selectForm.submit();
});
