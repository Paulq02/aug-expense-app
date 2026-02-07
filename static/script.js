const openSidebar = document.getElementById("close");

const dSearchBoxUl = document.getElementById("d-close-searchbox");

const aeSeachbox = document.getElementById("a-e-searchbox");

const dashboardToggleButton = document.getElementById("d-toggle");

const addExpenseToggleButton = document.getElementById(
  "add-expense-toggle-button",
);

const searchTableMainContainer = document.querySelector(
  ".search-table-main-container",
);

const userSearchIcon = document.querySelector(".search-icon");

const toggleSwitch = document.querySelector(".toggle-switch");

const logoutButton = document.querySelector(".logout-button");

const yearSelect = document.getElementById("year-select");

const mySelectElement = document.querySelector(".asc-desc");

const sortCost = document.querySelector(".sort-expense-dropdown");

const jsonStuff = document.querySelector(".json_data");

const userInput = document.getElementById("search-input");

const searchTableDiv = document.querySelector(
  ".searched-expense-display-container",
);

const searchInputCancelIcon = document.querySelector(
  ".search-input-cancel-icon",
);

/* const quickSearchTable = document.querySelector(".search-table"); */

const expenseDataContainer = document.querySelector(".expense_data_container");

const quickSearchResultsContainer = document.querySelector(
  ".quick-search-results-amount-container",
);

const quickSearchButtonContainer = document.querySelector(
  ".quick-search-button-container",
);

const noEntriesParentContainer = document.querySelector(
  ".no-entries-parent-container",
);

const noEntriesChildContainer = document.querySelector(
  ".no-entries-child-container",
);

const firstTimerParentContainer = document.querySelector(
  ".first_timer_parent_container",
);

const firstExpenseContainer = document.querySelector(
  ".first-expense-container",
);

let searchTable = document.querySelector(".search-table");

/* 

ALL ChartJS Constants Below 

*/

const doughnutCanvas = document.getElementById("myCanvas");

const chartBarCanvas = document.getElementById("barChart");

/*

This checks if Chart.js module exists 
if it exists then go into font defaults and set the default font to Roboto

*/
if (typeof Chart !== "undefined") {
  Chart.defaults.font.family = '"Roboto", "sans-serif"';
}

/* 

I've added a toggle feature to switch from Dark/Light mode by clicking a button.
This gets a hold of many elements and adds/removes Dark/Light classes to fit the users specification.
It also updates the local storage on the current color scheme.



*/

let htmlColor = document.querySelector("html");

if (toggleSwitch) {
  toggleSwitch.addEventListener("click", () => {
    let currentColor = window.localStorage.getItem("color");

    if (currentColor === "dark") {
      window.localStorage.setItem("color", "light");
      htmlColor.classList.remove("dark");
      htmlColor.classList.toggle("light");
    }
    if (currentColor === "light") {
      window.localStorage.setItem("color", "dark");
      htmlColor.classList.remove("light");
      htmlColor.classList.toggle("dark");
    }
  });
}

/* 
I've added a click event listener to the logout button, which clears the local storage

*/

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    window.localStorage.clear();
  });
}

/* 

I've added a change event listener to a "select" element which defaults to a "none" value at login.
Once a user makes their choice of a YEAR they would like to filter by, the form that's wrapped around the select element is submitted and a query is made

*/

if (yearSelect) {
  yearSelect.addEventListener("change", () => {
    const selectForm = document.querySelector(".select-form");
    selectForm.submit();
  });
}

/* 

I've added a change event listener to a "select" element which defaults to a "none" value at login.
Once a user makes their choice of sorting expenses by ascending or descending by DATE the form that's wrapped around the select element is submitted and a query is made

*/

if (mySelectElement) {
  mySelectElement.addEventListener("change", function () {
    this.form.submit();
  });
}

/* 

I've added a change event listener to a "select" element which defaults to a "none" value at login.
Once a user makes their choice of sorting expenses by ascending or descending by COST the form that's wrapped around the select element is submitted and a query is made

*/

if (sortCost) {
  sortCost.addEventListener("change", function () {
    this.form.submit();
  });
}

/*
If the user has entered expenses, it has been added the the MySql database.

Whether the user is just logging in or making a specific selection on what to retrieve/display - Python appends the Data in key/value pairs (dictionary.

"my_list" is a list of these key/value pairs - The Python dictionary is then converted to JSON and injected into the Jinja template.

I stuck the JSON inside a <p> tag, then grabbed it with JavaScript using textContent.

The JSON string from the <p> element was parsed with JSON.parse() to produce a JavaScript object.

The parsed JSON produces an array of category objects. Each object has two properties: a category string (e.g., groceries, rent, entertainment) and an amount defaulting as 0. 
As expenses are added, the corresponding category’s amount is incremented, allowing totals to be tracked per category.



*/

const barDoughnutChartData = document.querySelector(".complete_json_data");
let nameArray = [];
let amountArray = [];
if (barDoughnutChartData) {
  let barDoughnutChartDataText = barDoughnutChartData.textContent;

  let convertedBarDoughnutDataToJsObject = JSON.parse(barDoughnutChartDataText);

  for (let item of convertedBarDoughnutDataToJsObject) {
    catName = item.name;
    catAmount = item.amount;
    nameArray.push(catName);
    amountArray.push(catAmount);
  }
}

/* 
// Loop through each expense object in the converted JavaScript data.
// Each expense has an "expense_category" (like groceries, rent, entertainment)
// and an "amount" representing how much was spent.
// We check which category the expense belongs to by matching the key name.
// When a match is found, we take the expense amount and add it to that
// category's total inside categoryArray. This keeps a running total for
// each category so we can track overall spending by type.

*/

/*

Prepare data for Chart.js by separating category names and amounts.

Two empty arrays are created: nameArray and amountArray.

We loop through categoryArray (which already holds totals for each category after processing the converted expense objects).

"name" refers to the category name (e.g., groceries, rent, entertainment) chosen by the user when they created an expense.

"amount" refers to the running total of all expenses for that category.

For each category object in categoryArray, push the name into nameArray and the amount into amountArray. These arrays will be passed to Chart.js
to display the chart labels (names) and corresponding values (amounts).


*/

/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------ */

/* 

 * Why: By default the gap between the chart and the legend labels (groceries, non-essentials, other)
 *      feels too tight. I’m making that gap bigger with a tiny custom plugin.
 *
 * What I’m doing (in my words):
 * - Custom plugins need an id → I’m calling this one "gapPlugin".
 * - I run it in `beforeInit` so I can tweak legend sizing *before* Chart.js locks in the layout.
 * - I grab the legend’s built-in `fit` method (the thing that measures the legend box)
 *   and store it as `originalFit`.
 * - Then I “reprogram” `fit` by assigning my own function to `chart.legend.fit`.
 * - Inside my function, I let the original run first with the legend as `this`:
 *     originalFit.call(this);
 *   That way it does all the normal measuring it already knows how to do.
 * - After it finishes, I add my bump:
 *     this.height += 25;
 *   (Important: I do this *after* calling the original. If I add first, the original will overwrite it.)
 *
 * Notes to future me:
 * - Keep this as `function () {}` not an arrow function, so `this` is the legend.
 * - I’m not tweaking label padding here; I’m making the whole legend box taller so the chart
 *   reserves extra space under it.
 
 */

const gapPlugin = {
  id: "gapPlugin",
  beforeInit(chart) {
    const originalFit = chart.legend.fit;

    chart.legend.fit = function () {
      originalFit.call(this);

      this.height += 25;
    };
  },
};

/*
  doughnutTextPlugin notes:

  - This plugin switches the doughnut chart label text color 
    depending on the light/dark mode the user selects.
  - The toggle button saves the mode into localStorage as "color".
  - Each time the chart draws, the plugin checks localStorage.
  - If "Dark Mode" → text color is set to white.
  - If "Light Mode" → text color is set to black.

  In short: it keeps the chart labels readable by flipping the 
  text color when the theme changes.
*/

const doughnutTextPlugin = {
  id: "text_color_plugin",
  afterDraw(chart) {
    let currentColor = window.localStorage.getItem("color");

    if (currentColor === "light") {
      Chart.defaults.color = "#000000";

      chart.update();
    } else {
      Chart.defaults.color = "#ffffff";

      chart.update();
    }
  },
};

/*
  doughnutChart notes:

  - This chart helps the user visualize their expense data.
  - After grabbing the JSON data from the HTML element, it’s 
    converted into a JavaScript object.
  - The categoryArray holds all expense categories and amounts 
    that the user has entered.
  - I iterate through categoryArray to pull out each category 
    name and its corresponding amount.
  - These values are split into two separate arrays:
      • nameArray   → holds all category names
      • amountArray → holds all expense amounts
  - Both arrays are then inserted into the doughnut chart to 
    display the data visually.
*/

let doughnutChart;

if (doughnutCanvas) {
  doughnutChart = new Chart(document.getElementById("myCanvas"), {
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
              size: 20,
            },
          },
        },
      },
    },
    plugins: [gapPlugin, doughnutTextPlugin],
  });

  /*
  doughChartText notes:

  - This function changes the legend label font size of the doughnut chart
    depending on the browser window width.
  - It uses window.outerWidth to check how wide the full browser window is.
  - If width is 1120px or larger → font size = 30.
  - If width is 1119px or smaller → font size = 25.
  - The new font size is set in chart.options.plugins.legend.labels.font.size.
  - Finally, chart.update() is called to redraw the chart with the new size.

  In short: the chart legend text resizes automatically when the window width changes.
*/

  function doughChartText(chart) {
    let windowWidth = window.outerWidth;

    if (windowWidth >= 1120) {
      let fontSize = 20;

      chart.options.plugins.legend.labels.font.size = fontSize;
    }

    if (windowWidth <= 1119) {
      let fontSize = 25;
      chart.options.plugins.legend.labels.font.size = fontSize;
    }

    chart.update();
  }

  /*
  resize event notes:

  - window.addEventListener("resize", ...) listens for when the browser window is resized.
  - Each time the window size changes, the doughChartText function is called.
  - The chart instance (doughnutChart) is passed in so its legend text size can be updated.
  - This makes the chart responsive: the legend font will adjust automatically
    whenever the window is resized.
*/

  window.addEventListener("resize", function () {
    doughChartText(doughnutChart);
  });
}

/*
  barChartTextPlugin notes:

  - This plugin changes the text and grid colors of the bar chart 
    depending on the user's selected theme (light or dark).
  - The current theme is stored in localStorage as "color".
  - After the chart draws, the plugin checks localStorage:
      • If "dark" → ticks, legend labels, and grid lines are set to white.
      • If not "dark" (light mode) → they are set to black.
  - The chart.update() call ensures the chart is redrawn with the 
    updated colors.
  -  - The x-axis (category names) uses a "colors" array to style each 
    tick label with its own color:
*/

const colors = [
  "rgb(48, 128, 208)",
  "rgb(255, 99, 132)", // red

  "rgb(255, 159, 64)", // orange
  "rgb(255, 205, 86)", // yellow
  "rgb(75, 192, 192)", // green
  "rgb(153, 102, 255)", // purple
];

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

/* 

Bar Chart Setup:

- This code makes a bar chart to show expenses by category. It first checks if the canvas (chartBarCanvas) exists before creating the chart.

- chartBarCanvas = the canvas element in HTML

- chartBar = the Chart.js chart drawn on that canvas

- The data comes from iterating through the converted_to_javascript_object:
    • nameArray = each category option the user selected when entering an expense
    • amountArray = the matching cost of that expense

- The y-axis starts at 0 with bigger font (23), the x-axis labels are red with font size 23, and the legend labels also use font size 23.

- A custom plugin (barChartTextPlugin) is added to handle extra styling or updates.
    • barChartTextPlugin controls the scale tick colors when switching between light and dark mode.

- This setup makes sure the chart only loads when the canvas is there and avoids errors on other pages.

*/

let chartBar;

if (chartBarCanvas) {
  chartBar = new Chart(document.getElementById("barChart"), {
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

Function "confirmPassword" used to validate password confirmation when creating an account.

The user must enter their chosen password twice (password + confirm password).

On each input, the function compares both values:

If the two passwords do not match → show an alert message and keep the "Create Account" button disabled.

If both passwords match → remove the alert (if any) and enable the "Create Account" button so the user can submit.

This ensures the user confirms their intended password before account creation.

*/

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

/*
  showNameBtn notes:

  - This function is tied to the "main-edit-button" for each expense entry.
  - When the "main-edit-button" is clicked, three individual buttons appear:
      • EditNameBtn  → edit the expense name
      • costBtn      → edit the expense cost
      • dateButton   → edit the expense date
  - The function checks the current CSS display style of these buttons.
  - If the display is "inline-flex", it hides them by setting it to "none".
    If the display is "none", it shows them by setting it back to "inline-flex".
  - This lets the user toggle editing options for an existing expense.
*/

const showNameBtn = function (index) {
  const EditNameBtn = document.getElementById("edit-name-button-" + index);
  const yellowEditnameBtn = getComputedStyle(EditNameBtn).display;

  const cancelEditNameForm = document.getElementById("edit-name-form-" + index);
  let cancelEditNameFormDisplay = getComputedStyle(cancelEditNameForm).display;

  if (yellowEditnameBtn === "none") {
    EditNameBtn.style.display = "inline-flex";
    EditNameBtn.style.alignItems = "center";
    EditNameBtn.style.justifyContent = "center";
  } else {
    EditNameBtn.style.display = "none";
    cancelEditNameForm.style.display = "none";
  }
};

/*
   showCostBtn notes:

  - This function is tied to the "main-edit-button" for each expense entry.
  - When the "main-edit-button" is clicked, three individual buttons appear:
      • EditNameBtn  → edit the expense name
      • costBtn      → edit the expense cost
      • dateButton   → edit the expense date
  - The function checks the current CSS display style of these buttons.
  - If the display is "inline-flex", it hides them by setting it to "none".
    If the display is "none", it shows them by setting it back to "inline-flex".
  - This lets the user toggle editing options for an existing expense.
*/

const showCostBtn = function (index) {
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

/*
  showDatebutton  notes:

  - This function is tied to the "main-edit-button" for each expense entry.
  - When the "main-edit-button" is clicked, three individual buttons appear:
      • EditNameBtn  → edit the expense name
      • costBtn      → edit the expense cost
      • dateButton   → edit the expense date
  - The function checks the current CSS display style of these buttons.
  - If the display is "inline-flex", it hides them by setting it to "none".
    If the display is "none", it shows them by setting it back to "inline-flex".
  - This lets the user toggle editing options for an existing expense.
*/

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

/*
  editModeActivated notes:

  - This function is attached to each "main-edit-button" in the table of expenses.
  - Each row has its own main-edit-button identified by its index.
  - When a user clicks the main-edit-button, "edit mode" starts for that row.
  - Edit mode shows three separate buttons:
      • edit name
      • edit cost
      • edit date
  - These buttons let the user edit a specific piece of data in that row.
  - If the user decides not to edit anything, they can click the same
    main-edit-button again (now showing a red “X”) to cancel edit mode
    and return the row to normal view.
*/

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
  clearErrorMessage notes:

  - This function clears the red error message shown when a user enters
    wrong login details.
  - The <p> element called "errorElement" sits under the password input
    and shows the text: "Incorrect Username or Password" in red.
  - The function is triggered by the input field’s oninput event.
  - When the user starts typing again, the function changes the
    message color back to black, effectively clearing the error state.
*/

const clearErrorMessage = function () {
  const errorElement = document.querySelector(".login-error");

  const myDisplay = getComputedStyle(errorElement).display;

  if (myDisplay === "block") {
    errorElement.style.color = "#000000";
  }
};
/* 
async function quickSearchDelete(expenseId) {
  try {
    let response = await fetch(
      `/quick_search_delete?expenseId=${encodeURIComponent(expenseId)}`
    );
    let data = await response.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
} */

/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
let offset = Number(0);

let qsPreviousResultsButton = document.querySelector(".qs-previous-results");
let qsNextResultsButton = document.querySelector(".qs-next-results");

let resultsAmount = Number(0);

let sumAmount = Number(0);

async function searchExpenseByName(offset) {
  sumAmount = Number(0);

  searchTableMainContainer.innerHTML = "";

  if (expenseDataContainer) {
    expenseDataContainer.style.display = "none";
  }

  searchTableDiv.style.display = "flex";

  let userInputValue = userInput.value;

  let trimmedUserInputValue = userInputValue.trim();

  let noResultsMessage = document.querySelector(".no-results");
  let tryAnotherSearch = document.querySelector(".try-again");
  let backToDashboard = document.querySelector(".back-to-dashboard-button");

  if (trimmedUserInputValue === "") {
    console.log(trimmedUserInputValue);
    if (firstTimerParentContainer) {
      firstTimerParentContainer.style.display = "flex";
    }

    searchTableDiv.style.display = "none";
    if (expenseDataContainer) {
      expenseDataContainer.style.display = "flex";
    }
  } else {
    try {
      const response = await fetch(
        `/user_search?userSearch=${encodeURIComponent(
          trimmedUserInputValue,
        )}&offset=${offset}`,
      );
      const data = await response.json();

      let resultsAmount = data.length;

      if (data.message == "no results") {
        if (searchTable) {
          searchTable.style.display = "none";
        }
        if (firstExpenseContainer) {
          firstExpenseContainer.style.display = "none";
        }
        if (firstTimerParentContainer) {
          firstTimerParentContainer.style.display = "none";
        }

        searchTableDiv.style.display = "flex";
        searchTableDiv.style.justifyContent = "center";
        noResultsMessage = document.querySelector(".no-results");
        noResultsMessage.textContent = "no results";

        noResultsMessage.style.display = "flex";
        noResultsMessage.style.justifyContent = "center";
        noResultsMessage.style.fontSize = "3.5rem";
        tryAnotherSearch.style.display = "flex";
        tryAnotherSearch.style.justifyContent = "center";
        backToDashboard.style.display = "flex";
        backToDashboard.style.justifyContent = "center";

        quickSearchButtonContainer.style.display = "none";
        noEntriesParentContainer.style.display = "flex";
        noEntriesParentContainer.style.justifyContent = "center";
        quickSearchResultsContainer.style.display = "none";

        noEntriesChildContainer.style.display = "flex";
      } else {
        if (firstExpenseContainer) {
          firstExpenseContainer.style.display = "none";
        }
        if (firstTimerParentContainer) {
          firstTimerParentContainer.style.display = "none";
        }

        quickSearchResultsContainer.style.display = "flex";
        noEntriesChildContainer.style.display = "none";
        noResultsMessage.style.display = "none";

        let total_results = data[0].total_results;

        let sumAmount = data[0].running_count;
        backToDashboard.style.display = "flex";
        backToDashboard.style.justifyContent = "center";

        let dashboardResults = document.querySelector(".showing-results");
        if (dashboardResults) {
          dashboardResults.style.display = "none";
        }

        if (sumAmount < total_results) {
          qsNextResultsButton.style.display = "flex";
          qsNextResultsButton.justifyContent = "center";
        }

        if (sumAmount == total_results) {
          qsNextResultsButton.style.display = "none";
          qsPreviousResultsButton.style.display = "flex";
          qsPreviousResultsButton.justifyContent = "center";
        }
        if (offset == 0) {
          qsPreviousResultsButton.style.display = "none";
        }
        let quickSearchTable = document.createElement("table");
        quickSearchTable.className = "search-table";

        let quickSearchResultsAmount = document.getElementById("dp");

        quickSearchResultsAmount.textContent = `Showing ${sumAmount} of ${total_results} results`;

        let tableHeadRow = document.createElement("thead");

        let expenseDataHeaderRow = document.createElement("tr");

        let expenseNameHeader = document.createElement("th");
        expenseNameHeader.textContent = "Name";

        let expenseCostHeader = document.createElement("th");
        expenseCostHeader.textContent = "Cost";

        let expenseDateHeader = document.createElement("th");
        expenseDateHeader.textContent = "Date";

        let deleteExpense = document.createElement("th");
        deleteExpense.className = "qs-delete-th";
        deleteExpense.textContent = "Delete";
        deleteExpense.style.width = "10%";

        let editExpense = document.createElement("th");
        editExpense.className = "qs-edit-th";
        editExpense.textContent = "Edit";
        editExpense.style.width = "10%";

        expenseDataHeaderRow.appendChild(expenseNameHeader);
        expenseDataHeaderRow.appendChild(expenseCostHeader);
        expenseDataHeaderRow.appendChild(expenseDateHeader);
        expenseDataHeaderRow.appendChild(deleteExpense);
        expenseDataHeaderRow.appendChild(editExpense);

        expenseNameHeader.style.color = "#000000";
        expenseCostHeader.style.color = "#000000";
        expenseDateHeader.style.color = "#000000";

        tableHeadRow.appendChild(expenseDataHeaderRow);

        quickSearchTable.appendChild(tableHeadRow);

        tBody = document.createElement("tbody");

        for (let info of data) {
          const expenseName = info.expense_name;
          const expenseCost = info.expense_cost;
          const expenseDate = info.expense_date;

          const trDataRow = document.createElement("tr");

          let deleteTd = document.createElement("td");

          let editTd = document.createElement("td");

          const tdName = document.createElement("td");
          const qsEditName = document.createElement("button");
          qsEditName.classList.add("edit-name-button");
          qsEditName.textContent = "Edit name";
          qsEditName.style.display = "inline";
          qsEditName.dataset.expenseId = info.expense_id;
          tdName.textContent = expenseName;
          tdName.append(qsEditName);

          const tdCost = document.createElement("td");
          const qsEditCost = document.createElement("button");
          qsEditCost.textContent = "Edit cost";
          qsEditCost.classList.add("edit-cost-button");
          qsEditCost.style.display = "inline";
          qsEditCost.dataset.expenseId = info.expense_id;
          tdCost.textContent = expenseCost;
          tdCost.append(qsEditCost);

          const tdDate = document.createElement("td");
          let editDateContainer = document.createElement("div");
          let editDateInputContainer = document.createElement("div");
          let editDateInputField = document.createElement("input");
          editDateInputField.style.width = "50%";
          let expenseDatepElement = document.createElement("p");
          expenseDatepElement.textContent = expenseDate;
          expenseDatepElement.style.display = "inline";

          const qsEditDate = document.createElement("button");
          qsEditDate.classList.add("edit-date-button");
          qsEditDate.dataset.expenseId = info.expense_id;
          qsEditDate.dataset.userId = info.user_id;
          qsEditDate.style.display = "inline";
          qsEditDate.textContent = "Edit date";

          editDateContainer.append(expenseDatepElement, qsEditDate);
          editDateInputContainer.append(editDateInputField);
          tdDate.append(editDateContainer, editDateInputContainer);

          const trashIcon = document.createElement("img");
          trashIcon.src = "static/images/new_trash_icon.png";
          trashIcon.style.height = "30px";
          trashIcon.style.textAlign = "center";
          trashIcon.style.cursor = "pointer";
          trashIcon.classList.add("trash-icon");
          trashIcon.id = `trash-icon-${info.expense_id}`;
          trashIcon.dataset.trashExpenseId = info.expense_id;
          trashIcon.dataset.userId = info.user_id;
          trashIcon.dataset.expenseName = expenseName;
          trashIcon.dataset.expenseCost = expenseCost;

          deleteTd.appendChild(trashIcon);

          let editIcon = document.createElement("img");
          editIcon.src = "static/images/pencil_345648.png";
          editIcon.style.height = "30px";
          editIcon.classList.add("qs-edit-icon");
          editIcon.id = `edit-icon-${info.expense_id}`;
          editIcon.style.cursor = "pointer";
          editIcon.style.display = "inline";
          editIcon.dataset.expenseId = info.expense_id;
          editIcon.dataset.userId = info.user_id;

          cancelEditMode = document.createElement("img");
          cancelEditMode.src = "static/images/edit-mode.png";
          cancelEditMode.className = "edit-mode";
          cancelEditMode.id = `edit-mode-${info.expense_id}`;
          cancelEditMode.style.height = "30px";
          cancelEditMode.style.display = "none";
          cancelEditMode.dataset.expenseId = info.expense_id;

          editTd.appendChild(editIcon);
          editTd.appendChild(cancelEditMode);

          trDataRow.appendChild(tdName);
          trDataRow.appendChild(tdCost);
          trDataRow.append(tdDate);

          trDataRow.appendChild(deleteTd);
          trDataRow.appendChild(editTd);

          tdName.style.color = "#FFFFFF";
          tdCost.style.color = "#FFFFFF";
          tdDate.style.color = "#FFFFFF";

          tBody.appendChild(trDataRow);

          quickSearchTable.appendChild(tBody);

          searchTableMainContainer.appendChild(quickSearchTable);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

if (qsNextResultsButton) {
  qsNextResultsButton.addEventListener("click", () => {
    console.log(
      `button is cliocked this is the offset before 10 is added ${offset}`,
    );
    offset = offset + 10;
    resultsAmount = console.log(
      `THIS IS THE NEW OFFSET--------------------------${offset}`,
    );
    searchExpenseByName(offset);
  });
}

if (qsNextResultsButton) {
  qsPreviousResultsButton.addEventListener("click", () => {
    console.log("previous button clicked");
    offset = offset - 10;
    searchExpenseByName(offset);
  });
}

function turnOnCancelIcon() {
  let userInputValue = userInput.value;
  let trimmedValue = userInputValue.trim();

  if (trimmedValue.length > 0) {
    searchInputCancelIcon.style.display = "flex";
  } else {
    searchInputCancelIcon.style.display = "none";
  }
}
if (searchInputCancelIcon) {
  searchInputCancelIcon.addEventListener("click", () => {
    userInput.value = "";
    searchInputCancelIcon.style.display = "none";

    userInput.focus();
  });
}

if (dSearchBoxUl) {
  dSearchBoxUl.addEventListener("click", () => {
    if (dSearchBoxUl.classList.contains("close-search-box")) {
      openSidebar.classList.add("sidebar");
    }

    if (dashboardToggleButton.classList.contains("bx-chevron-right")) {
      dashboardToggleButton.classList.add("bx-chevron-left");
      dashboardToggleButton.classList.remove("bx-chevron-right");
    }

    if (dSearchBoxUl.classList.contains("close-search-box")) {
      dSearchBoxUl.classList.remove("close-search-box");
      dSearchBoxUl.classList.add("opened-search-box");
    }

    userInput.focus();
  });
}

/* dashboardToggleButton.addEventListener("click", () => {
  console.log("clicked");
}); */

/* 

The Window checks for DOMcontent being loaded
at login there wont be a currentColor set, so it will return null
if null then set the initial color to dark in local storage

This also keeps the color toggle feature working
when you click the toggle button it changes/updates the color scheme to light mode
also saves to local storage the updated color

*/
window.addEventListener("DOMContentLoaded", () => {
  let currentColor = window.localStorage.getItem("color");
  if (currentColor === null) {
    window.localStorage.setItem("color", "dark");
  }
  if (currentColor === "light") {
    window.localStorage.setItem("color", "light");
    bodyColor.classList.toggle("light");
  }
});

/* 
I've added an event listener to a button attached to my sidebar
When this button is clicked, the sidebar class is toggled and added which adds a 250px width to the sidebar
which opens the sidebar, if clicked again the sidebar class is removed 
I'm going to be adding a search feature soon


*/

if (dashboardToggleButton) {
  dashboardToggleButton.addEventListener("click", () => {
    let userInputValue = userInput.value;
    let trimmedUserInputValue = userInputValue.trim();

    if (dSearchBoxUl.classList.contains("close-search-box")) {
      dSearchBoxUl.classList.add("opened-search-box");
      dSearchBoxUl.classList.remove("close-search-box");
    } else {
      dSearchBoxUl.classList.remove("opened-search-box");
      dSearchBoxUl.classList.add("close-search-box");
    }

    if (dashboardToggleButton.classList.contains("bx-chevron-right")) {
      dashboardToggleButton.classList.add("bx-chevron-left");
      dashboardToggleButton.classList.remove("bx-chevron-right");
    } else {
      dashboardToggleButton.classList.remove("bx-chevron-left");
      dashboardToggleButton.classList.add("bx-chevron-right");
    }

    openSidebar.classList.toggle("sidebar");

    if (
      openSidebar.classList.contains("sidebar") &&
      trimmedUserInputValue.length > 0
    ) {
      searchInputCancelIcon.style.display = "flex";
    } else {
      searchInputCancelIcon.style.display = "none";
    }
  });
}

if (addExpenseToggleButton) {
  addExpenseToggleButton.addEventListener("click", () => {
    console.log("clicked nioggggggaaaaa");

    let userInputValue = userInput.value;
    let trimmedUserInputValue = userInputValue.trim();

    addExpenseSearchBox = addExpenseToggleButton.closest("a-e-searchbox");
    console.log(`niggga this is what youre looking for ${addExpenseSearchBox}`);

    if (aeSeachbox.classList.contains("close-search-box")) {
      aeSeachbox.classList.add("opened-search-box");
      aeSeachbox.classList.remove("close-search-box");
    } else {
      aeSeachbox.classList.remove("opened-search-box");
      aeSeachbox.classList.add("close-search-box");
    }

    if (addExpenseToggleButton.classList.contains("bx-chevron-right")) {
      addExpenseToggleButton.classList.add("bx-chevron-left");
      addExpenseToggleButton.classList.remove("bx-chevron-right");
    } else {
      addExpenseToggleButton.classList.remove("bx-chevron-left");
      addExpenseToggleButton.classList.add("bx-chevron-right");
    }

    openSidebar.classList.toggle("sidebar");

    if (
      openSidebar.classList.contains("sidebar") &&
      trimmedUserInputValue.length > 0
    ) {
      searchInputCancelIcon.style.display = "flex";
    } else {
      searchInputCancelIcon.style.display = "none";
    }
  });
}

let backToDashboard = document.querySelector(".back-to-dashboard-button");
if (backToDashboard) {
  backToDashboard.addEventListener("click", () => {
    console.log(`sum amount before resetting back to zero ---${sumAmount}`);
    sumAmount = Number(0);
    console.log(`sum amount AFTER resetting back to zero ---${sumAmount}`);
    offset = Number(0);
    searchTableDiv.style.display = "none";
    expenseDataContainer.style.display = "flex";
    userInput.value = "";
  });
}

let cancelButton = document.querySelector(".cancel-delete");
if (cancelButton) {
  cancelButton.addEventListener("click", () => {
    console.log("clicked");
    let confirmDelete = document.querySelector(
      ".delete-confirmation-main-container",
    );
    confirmDelete.style.display = "none";
  });
}

let editButton = document.querySelector(".qs-edit-icon");
if (editButton) {
  editButton.addEventListener("click", (e) => {
    console.log(e.target);
  });
}

function displayDetails(eName, eCost, uId, eId) {
  let confirmDeleteButton = document.querySelector(".confirm-delete");
  confirmDeleteButton.style.display = "flex";
  confirmDeleteButton.style.alignItems = "center";
  confirmDeleteButton.dataset.userId = uId;
  confirmDeleteButton.dataset.expenseId = eId;
  let confirmDelete = document.querySelector(
    ".delete-confirmation-main-container",
  );
  confirmDelete.style.display = "flex";
  confirmDelete.style.justifyContent = "space-evenly";

  let eNamep = document.querySelector(".e-name");
  eNamep.style.display = "flex";
  eNamep.textContent = `Expense: ${eName}`;

  let eCostp = document.querySelector(".e-cost");
  eCostp.style.display = "flex";
  eCostp.textContent = `Expense Cost: ${eCost}`;
}

async function deleteConfirmation(eId, uId) {
  try {
    const response = await fetch(
      `/quick_search_delete?expenseId=${encodeURIComponent(
        eId,
      )}&userId=${encodeURIComponent(uId)}`,
      { method: "DELETE" },
    );
    const data = await response.json();
    if (data.success === true) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

if (searchTableMainContainer) {
  searchTableMainContainer.addEventListener("click", (e) => {
    if (e.target.className === "trash-icon") {
      let expenseName = e.target.dataset.expenseName;
      let expenseCost = e.target.dataset.expenseCost;
      let userId = e.target.dataset.userId;
      let trashExpenseId = e.target.dataset.trashExpenseId;
      console.log(e);

      displayDetails(expenseName, expenseCost, userId, trashExpenseId);
    }
    if (e.target.classList.contains("qs-edit-icon")) {
      console.log(e.target.dataset);
      let selectedEditIcon = e.target;
      let cancelEditMode = document.getElementById(
        `edit-mode-${e.target.dataset.expenseId}`,
      );
      let turnOffEditIcon = document.getElementById(`${selectedEditIcon.id}`);
      if (turnOffEditIcon.style.display === "inline") {
        turnOffEditIcon.style.display = "none";
        cancelEditMode.style.display = "inline";
      }
    }
    if (e.target.classList.contains("edit-mode")) {
      let cancelEditMode = document.getElementById(`${e.target.id}`);
      let expenseId = cancelEditMode.dataset.expenseId;
      let turnOnEditIcon = document.getElementById(`edit-icon-${expenseId}`);
      cancelEditMode.style.display = "none";
      turnOnEditIcon.style.display = "inline";
    }
  });
}

let confirmDeleteButton = document.querySelector(".confirm-delete");

if (confirmDeleteButton) {
  confirmDeleteButton.addEventListener("click", async (e) => {
    let expenseId = e.target.dataset.expenseId;
    let userId = e.target.dataset.userId;
    let confirmation = await deleteConfirmation(expenseId, userId);
    if (confirmation.success === true) {
      let confirmDelete = document.querySelector(
        ".delete-confirmation-main-container",
      );
      confirmDelete.style.display = "none";
    }
    searchExpenseByName(offset);
  });
}
