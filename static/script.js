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

/*
const sortAscDesc = document.querySelector(".asc-desc");
const sortAscDescForm = document.querySelector(".sort-desc-asc");
sortFunction = sortAscDesc.addEventListener("change", () => {
  sortAscDescForm.this.form.submit();
});
*/

const mySelectElement = document.querySelector(".asc-desc");

mySelectElement.addEventListener("change", function () {
  this.form.submit();
});

const sortCost = document.querySelector(".sort-expense-dropdown");
sortCost.addEventListener("change", function () {
  this.form.submit();
});

my_json_data = document.querySelector(".json_data").textContent;

converted_to_javascript_object = JSON.parse(my_json_data);

colorList = ["red", "purple", "yellow", "green", "blue", "pink"];

console.log(converted_to_javascript_object);

categoryArray = [
  { category: "entertainment", amount: 0 },
  { category: "groceries", amount: 0 },
  { category: "rent", amount: 0 },
  { category: "non-essentials", amount: 0 },
  { category: "monthly", amount: 0 },
  { category: "other", amount: 0 },
];

for (let item of converted_to_javascript_object) {
  if (item.expense_category === "entertainment") {
    let newAmount = item.amount;
    categoryArray[0].amount += newAmount;
  }
  if (item.expense_category === "groceries") {
    let newAmount = item.amount;
    categoryArray[1].amount += newAmount;
  }
  if (item.expense_category === "rent") {
    let newAmount = item.amount;
    categoryArray[2].amount += newAmount;
  }
  if (item.expense_category === "non-essentials") {
    let newAmount = item.amount;
    categoryArray[3].amount += newAmount;
  }
  if (item.expense_category === "monthly") {
    let newAmount = item.amount;
    categoryArray[4].amount += newAmount;
  }
  if (item.expense_category === "other") {
    let newAmount = item.amount;
    categoryArray[5].amount += newAmount;
  }
}

const nameArray = [];
const amountArray = [];

for (let cat of categoryArray) {
  let name = cat.category;
  let amount = cat.amount;
  nameArray.push(name);
  amountArray.push(amount);
}

console.log(nameArray);
console.log(amountArray);

new Chart(document.getElementById("myCanvas"), {
  type: "doughnut",
  data: {
    labels: nameArray,
    datasets: [
      {
        data: amountArray,
        backgroundColor: colorList,
      },
    ],
  },
});
