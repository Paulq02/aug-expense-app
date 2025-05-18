if (typeof Chart !== "undefined") {
  Chart.defaults.font.family = '"Roboto", "sans-serif"';
}

const openSidebar = document.querySelector(".close");

const closeSearchBox = document.querySelector(".open-search-box");

const toggleButton = document.querySelector(".toggle");
if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    openSidebar.classList.toggle("sidebar");
    closeSearchBox.classList.toggle("close-search-box");
  });
}

let bodyColor = document.querySelector(".dark");

const toggleSwitch = document.querySelector(".toggle-switch");
if (toggleSwitch) {
  toggleSwitch.addEventListener("click", () => {
    let currentColor = window.localStorage.getItem("color");

    if (currentColor === "dark") {
      window.localStorage.setItem("color", "light");
      bodyColor.classList.toggle("light");
    }
    if (currentColor === "light") {
      window.localStorage.setItem("color", "dark");
      bodyColor.classList.toggle("light");
    }
  });
}

const logoutButton = document
  .querySelector(".logout-button")
  .addEventListener("click", () => {
    window.localStorage.clear();
  });

window.addEventListener("DOMContentLoaded", () => {
  let currentColor = window.localStorage.getItem("color");
  if (currentColor === null || "dark") {
    window.localStorage.setItem("color", "dark");
  }
  if (currentColor === "light") {
    window.localStorage.setItem("color", "light");
    bodyColor.classList.toggle("light");
  }
});

const yearSelect = document.getElementById("year-select");
if (yearSelect) {
  yearSelect.addEventListener("change", () => {
    const selectForm = document.querySelector(".select-form");
    selectForm.submit();
  });
}

const mySelectElement = document.querySelector(".asc-desc");

if (mySelectElement) {
  mySelectElement.addEventListener("change", function () {
    this.form.submit();
  });
}

const sortCost = document.querySelector(".sort-expense-dropdown");

if (sortCost) {
  sortCost.addEventListener("change", function () {
    this.form.submit();
  });
}

const jsonStuff = document.querySelector(".json_data");
let categoryArray = [];

if (jsonStuff && categoryArray) {
  const my_json_data = document.querySelector(".json_data").textContent;
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
}

const confirmPassword = function () {
  const createAccountButton = document.querySelector(".create-account-button");
  const messageBox = document.querySelector(".password-alert");
  const password = document.querySelector(".first-password").value;

  const secondPassword = document.querySelector(".confirm-password").value;
  if (password !== secondPassword) {
    messageBox.textContent = "Passwords do not match";
    messageBox.style.color = "red";
    createAccountButton.disabled = true;
  } else {
    messageBox.innerHTML = "";
    createAccountButton.disabled = false;
  }
};

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

      this.height += 25;
    };
  },
};
const doughnutTextPlugin = {
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

const doughnutChart = document.getElementById("myCanvas");
if (doughnutChart) {
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
    plugins: [gapPlugin, doughnutTextPlugin],
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
}

const barChartTextPlugin = {
  id: "barTextColor",
  afterDraw(chart) {
    let currentColor = window.localStorage.getItem("color");
    if (currentColor === "dark") {
      chart.options.scales.y.ticks.color = "#ffffff";
      chart.options.scales.x.ticks.color = colors;
      chart.options.plugins.legend.labels.color = "#ffffff";
      chart.options.scales.y.grid.color = "#ffffff";
      chart.options.scales.x.grid.color = "#ffffff";
      chart.update();
    } else {
      chart.options.scales.y.ticks.color = "#000000";
      chart.options.scales.x.ticks.color = colors;
      chart.options.plugins.legend.labels.color = "#000000";
      chart.options.scales.y.grid.color = "#000000";
      chart.options.scales.x.grid.color = "#000000";
      chart.update();
    }
  },
};
const colors = [
  "rgb(54, 162, 235)", // blue
  "rgb(255, 159, 64)", // orange
  "rgb(255, 205, 86)", // yellow
  "rgb(75, 192, 192)", // green
  "rgb(153, 102, 255)", // purple
  "rgb(255, 99, 132)", // red
];

const chartBar = document.getElementById("barChart");

if (chartBar) {
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
            color: "red",
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
    plugins: [barChartTextPlugin],
  });
}
/*
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

*/

const showNameBtn = function (index) {
  console.log("hio");
  const EditNameBtn = document.getElementById("edit-name-button-" + index);
  const yellowEditnameBtn = getComputedStyle(EditNameBtn).display;

  const cancelEditNameForm = document.getElementById("edit-name-form-" + index);
  const cancelEditNameFormDisplay =
    getComputedStyle(cancelEditNameForm).display;

  if (yellowEditnameBtn === "none") {
    EditNameBtn.style.display = "inline-flex";
    EditNameBtn.style.alignItems = "center";
    EditNameBtn.style.justifyContent = "center";
  } else {
    EditNameBtn.style.display = "none";
    cancelEditNameForm.style.display = "none";
  }
};

const showCostBtn = function (index) {
  console.log("hi");
  const mainEditButton = document.getElementById("main-edit-button-" + index);
  const costBtn = document.getElementById("edit-cost-button-" + index);
  const yellowCostBtn = getComputedStyle(costBtn).display;

  const editCostForm = document.getElementById("edit-cost-form-" + index);

  if (yellowCostBtn === "none") {
    costBtn.style.display = "inline-flex";
    costBtn.style.justifyContent = "center";
    costBtn.style.alignItems = "center";
  } else {
    costBtn.style.display = "none";

    editCostForm.style.display = "none";
  }
};

showDatebutton = function (index) {
  const dateButton = document.getElementById("edit-date-button-" + index);
  const dateBtnCss = getComputedStyle(dateButton).display;

  const editDateForm = document.getElementById("edit-date-form-" + index);
  if (dateBtnCss === "none") {
    dateButton.style.display = "inline-flex";
    dateButton.style.justifyContent = "center";
    dateButton.style.alignItems = "center";
  } else {
    dateButton.style.display = "none";

    editDateForm.style.display = "none";
  }
};

const editModeActivated = function (index) {
  const editIcon = document.getElementById("main-edit-button-" + index);
  const editPNG = document.getElementById("edit-icon-" + index);
  const editPNGDisplay = getComputedStyle(editPNG).display;
  const editModePNG = document.getElementById("edit-mode-" + index);
  const editModePNGDisplay = getComputedStyle(editModePNG);

  if (editPNGDisplay === "inline") {
    editPNG.style.display = "none";
    editModePNG.style.display = "inline";
  } else {
    editPNG.style.display = "inline";
    editModePNG.style.display = "none";
  }
};

/*
function editNamebutton(index) {
  const name_edit = document.getElementById("edit-name-button-" + index);
  name_edit.style.display = "inline-flex";
  name_edit.style.justifyContent = "center";
  name_edit.style.alignItems = "center";
}

*/

/*
function clearEditNameButton(index) {
  editNameBtn = document.getElementById("edit-name-button-" + index);
  classEditNameBtn = document.getElementById(
    ".edit-name-button-" + index
  );
  const cancelIcon = document.getElementById(
    ".cancel-svg-button-" + index
  );
  if (
    editNameBtn.style.display == "none" &&
    cancelIcon.style.display == "none"
  ) {
    editNameBtn.style.display = "inline-flex";
  }
}
/*

/*
function showCancelIcons(index) {
        const showNameCancel = document.getElementById(
          "cancel-svg-name-button-" + index
        );
        showNameCancel.style.display = "flex";
        showNameCancel.style.justifyContent = "center";
        showNameCancel.style.alignItems = "center";
        const showCostCancel = document.getElementById(
          "cancel-svg-cost-button-" + index
        );
        showCostCancel.style.display = "flex";
        showCostCancel.style.justifyContent = "center";
        showCostCancel.style.alignItems = "center";
        const showDateCancel = document.getElementById(
          "cancel-svg-date-button-" + index
        );
        showDateCancel.style.display = "flex";
        showDateCancel.style.justifyContent = "center";
        showDateCancel.style.alignItems = "center";
      }
*/

const clearErrorMessage = function () {
  const errorElement = document.querySelector(".login-error");
  const myDisplay = getComputedStyle(errorElement).display;
  if (myDisplay === "block") {
    errorElement.style.color = "#000000";
  }
};

const errorElement = document.querySelector(".login-error");
if (errorElement) {
  const clearErrorMessage = function () {
    const errorElement = document.querySelector(".login-error");
    const myDisplay = getComputedStyle(errorElement).display;
    if (myDisplay === "block") {
      errorElement.style.color = "#000000";
    }
  };
}
