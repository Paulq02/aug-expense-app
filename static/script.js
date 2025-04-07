(Chart.defaults.family = "Roboto"), "sans-serif";

function checkCurrentColor() {
  inititalColor = window.localStorage.getItem("color");
  if (inititalColor === null) {
    let currentColor = window.localStorage.setItem("color", "dark");
  }
}

checkCurrentColor();

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
  currentColor = window.localStorage.getItem("color");

  if (currentColor === "dark") {
    bodyLight.classList.toggle("light");
    setColor = window.localStorage.setItem("color", "light");
  }

  if (currentColor === "light") {
    bodyLight.classList.toggle("light");
    setColor = localStorage.setItem("color", "dark");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  currentColor = window.localStorage.getItem("color");
  if (currentColor === "light") {
    bodyLight.classList.add("light");
  }
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

const yearSelect = document.getElementById("year-select");

yearSelect.addEventListener("change", () => {
  const selectForm = document.querySelector(".select-form");
  selectForm.submit();
});

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

const gapPlugin = {
  id: "gapPlugin",
  beforeInit(chart) {
    const originalFit = chart.legend.fit;

    chart.legend.fit = function () {
      originalFit.bind(chart.legend)();

      this.height += 60;
    };
  },
};

const textColorPlugin = {
  id: "text_color_plugin",
  afterDraw(chart) {
    let currentColor = window.localStorage.getItem("color");

    if (currentColor === "light") {
      chart.options.plugins.legend.labels.color = "#000000";
      chart.update();
    } else {
      chart.options.plugins.legend.labels.color = "#ffffff";
      chart.update();
    }
  },
};

const doughnutChart = new Chart(document.getElementById("myCanvas"), {
  type: "doughnut",
  data: {
    labels: nameArray,
    datasets: [
      {
        data: amountArray,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 30,
          },
        },
      },
    },
  },
  plugins: [gapPlugin, textColorPlugin],
});

new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: nameArray,
    datasets: [
      {
        label: "Expenses by Category",
        data: amountArray,
        backgroundColor: "#bb86fc",
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 23,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 23,
          },
        },
      },
    },

    plugins: {
      legend: {
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 23,
          },
        },
      },
    },
  },
});

function doughChartText(chart) {
  let windowWidth = window.outerWidth;

  if (windowWidth >= 1120) {
    let fontSize = 30;

    chart.options.plugins.legend.labels.font.size = fontSize;

    chart.update();
  }

  if (windowWidth <= 1119) {
    let fontSize = 25;
    chart.options.plugins.legend.labels.font.size = fontSize;
    chart.update();
  }
}

window.addEventListener("resize", function () {
  doughChartText(doughnutChart);
});
