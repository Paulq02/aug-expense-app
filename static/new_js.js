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

function checkPassword() {
  const password = document.querySelector("[name='password']").value;
  const confirmPassword = document.querySelector(
    "[name='confirm_password']"
  ).value;
  if (password !== confirmPassword) {
    window.alert("passwords do not match");
  }
}

function validatePassword() {
  const password = document.querySelector('[name="password"]').value;
  const confirmPasswordInput = document.querySelector(
    '[name="confirm_password"]'
  );
  const message = document.querySelector("#password-error");

  if (confirmPasswordInput.value !== password) {
    message.textContent = "Passwords do not match";
    message.style.color = "red";
    confirmPasswordInput.style.borderColor = "red";
  } else {
    message.textContent = ""; // Clear the error message
    confirmPasswordInput.style.borderColor = ""; // Reset border color
  }
}

function confirmPassword() {
  const createAccountButton = document.querySelector(".create-account-button");
  const messageBox = document.querySelector(".password-alert");
  const password = document.querySelector("[name='password']").value;
  const secondPassword = document.querySelector(
    "[name='confirm-password']"
  ).value;
  if (password !== secondPassword) {
    messageBox.textContent = "Passwords do not match";
    messageBox.style.color = "red";
    createAccountButton.disabled = true;
  } else {
    messageBox.textContent = "";
    createAccountButton.disabled = false;
  }
}

function sortDates() {
  dateButton = document.querySelector(".sort-button");
  recentExpenses = document.querySelector(".newest-first");
  olderExpenses = document.querySelector(".oldest-first");

  if (recentExpenses.style.display === "flex") {
    recentExpenses.style.display = "none";
    olderExpenses.style.display = "flex";
    localStorage.setItem("sortBy", "oldest");
  } else {
    recentExpenses.style.display = "flex";
    olderExpenses.style.display = "none";
    localStorage.setItem("sortBy", "newest");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  dateButton = document.querySelector(".sort-button");
  recentExpenses = document.querySelector(".newest-first");
  olderExpenses = document.querySelector(".oldest-first");

  buttonState = localStorage.getItem("sortBy");
  if (buttonState == "oldest") {
    recentExpenses.style.display = "none";
    olderExpenses.style.display = "flex";
  } else {
    recentExpenses.style.display = "flex";
    olderExpenses.style.display = "none";
  }
});
