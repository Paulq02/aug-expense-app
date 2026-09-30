const openSidebar = document.getElementById("close");

const dSearchBoxUl = document.getElementById("d-close-searchbox");

const aeSeachbox = document.getElementById("a-e-searchbox");

const aeSidebar = document.getElementById("ae-close");

const aeToggleButton = document.getElementById("ae-toggle");

const dashboardToggleButton = document.getElementById("d-toggle");

const flToggleButton = document.getElementById("fl-toggle");

const flSidebar = document.getElementById("fl-close");

const addExpenseToggleButton = document.getElementById(
  "add-expense-toggle-button",
);

const addExpenseMainContainer = document.getElementById("ae-main-container");

const searchTableMainContainer = document.getElementById(
  "db-search-table-main-container",
);
/*
const mainTableDashboardContainer = document.querySelector(
  ".main-table-pie-entire-container",
);
*/

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

  window.addEventListener("resize", (e) => {
    if (e.target.innerWidth < 1230) {
      console.log(e.target.innerWidth);
      doughnutChart.options.plugins.legend.labels.font.size = 15;
    }
    if (e.target.innerWidth > 1231) {
      console.log(e.target.innerWidth);
      doughnutChart.options.plugins.legend.labels.font.size = 20;
    }
    doughnutChart.update();
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
      let fontSize = 12;
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
          data: amountArray,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 12,
            },
          },
        },
        x: {
          ticks: {
            color: "red",
            font: {
              size: 15,
            },
          },
        },
      },

      plugins: {
        legend: {
          display: false,
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
  showEditnameForm(index);
  let stackedNameContainer = document.getElementById(`name-container-${index}`);
  let dateNameFlexContainer = document.getElementById(
    `date_name_flex_container-${index}`,
  );
  let costNameFlexContainer = document.getElementById(
    `name_cost_flex_container-${index}`,
  );

  let nameFlexContainer = document.getElementById(
    `name_flex_container-${index}`,
  );

  let tdMainName = document.getElementById(`name-td-${index}`);
  let tdMainCost = document.getElementById(`cost-td-${index}`);
  let tdMainDate = document.getElementById(`date-td-${index}`);
  let tdMainDelete = document.getElementById(`delete-td-${index}`);
  let tdMainEdit = document.getElementById(`edit-td-${index}`);

  let nameCostDateMainContainer = document.getElementById(
    `name-cost-date-container-${index}`,
  );

  let nameDescriptionTag = document.getElementById(`name-description-${index}`);
  let expenseNameDescription = document.getElementById(`name-p-tag-${index}`);
  let expenseCostDescription = document.getElementById(`cost-p-tag-${index}`);
  let expenseDateDescription = document.getElementById(`date-p-tag-${index}`);

  let updatedExpenseDescription = Number(
    expenseCostDescription.textContent.replace("$", ""),
  );

  let editNameInput = document.getElementById(`edit-name-input-${index}`);
  editNameInput.value = expenseNameDescription.textContent;
  editNameInput.disabled = false;
  editNameInput.required = true;

  let editDateInput = document.getElementById(`datepicker-${index}`);
  editDateInput.value = expenseDateDescription.textContent;
  editDateInput.disabled = false;
  editDateInput.required = true;

  let costDescriptionTag = document.getElementById(`cost-description-${index}`);
  let dateDescriptionTag = document.getElementById(`date-description-${index}`);
  let editCostInput = document.getElementById(`edit-cost-input-${index}`);
  editCostInput.value = updatedExpenseDescription;
  editCostInput.disabled = false;
  editCostInput.required = true;

  let cancelButton = document.getElementById(`cancel-edit-button-${index}`);
  let saveChangesButton = document.getElementById(`save-new-changes-${index}`);

  let saveCancelButtonContainer = document.getElementById(
    `save-cancel-button-container-${index}`,
  );
  saveCancelButtonContainer.style.display = "flex";

  nameDescriptionTag.style.display = "flex";
  costDescriptionTag.style.display = "flex";
  dateDescriptionTag.style.display = "flex";

  tdMainName.colSpan = 5;
  tdMainName.style.height = "auto";
  tdMainCost.style.display = "none";
  tdMainDate.style.display = "none";
  tdMainDelete.style.display = "none";
  tdMainEdit.style.display = "none";
  expenseNameDescription.style.display = "none";
  expenseCostDescription.style.display = "none";
  expenseDateDescription.style.display = "none";

  dateNameFlexContainer.style.display = "flex";
  dateNameFlexContainer.style.height = "auto";
  costNameFlexContainer.style.display = "flex";
  costNameFlexContainer.style.height = "auto";
  editNameInput.style.display = "flex";

  nameFlexContainer.style.justifyContent = "center";
  nameFlexContainer.style.height = "auto";
  nameCostDateMainContainer.style.flexDirection = "column";

  cancelButton.style.display = "block";

  saveChangesButton.style.display = "block";
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
  let editCostInput = document.getElementById(`edit-cost-input-${index}`);
  let costBtn = document.getElementById("edit-cost-button-" + index);

  let editCostForm = document.getElementById("edit-cost-form-" + index);

  if (costBtn.style.display === "none") {
    costBtn.style.display = "inline-flex";
    costBtn.style.justifyContent = "center";
    costBtn.style.alignItems = "center";
  } else {
    editCostInput.value = "";
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
  let editDateInput = document.getElementById(`datepicker-${index}`);
  let dateButton = document.getElementById("edit-date-button-" + index);

  let editDateForm = document.getElementById("edit-date-form-" + index);
  if (dateButton.style.display === "none") {
    dateButton.style.display = "inline-flex";
    dateButton.style.justifyContent = "center";
    dateButton.style.alignItems = "center";
  } else {
    editDateInput.value = "";
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

/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
let offset = Number(0);

let qsPreviousResultsButton = document.querySelector(".qs-previous-results");
let qsNextResultsButton = document.querySelector(".qs-next-results");

let resultsAmount = Number(0);

let sumAmount = Number(0);

let searchTable = document.querySelector(".search-table");

let aeSearchTableMainContainer = document.getElementById(
  "ae-search-table-main-container",
);
/*
let flSearchTableMainContainer = document.getElementById(
  "fl-search-table-main-container",
);
*/
async function searchExpenseByName(offset) {
  sumAmount = Number(0);

  if (searchTableMainContainer) {
    searchTableMainContainer.innerHTML = "";
  }

  if (addExpenseMainContainer) {
    addExpenseMainContainer.style.display = "none";
  }

  if (expenseDataContainer) {
    expenseDataContainer.style.display = "none";
  }

  if (flSearchTableMainContainer) {
    flSearchTableMainContainer.innerHTML = "";
  }

  searchTableDiv.style.display = "flex";

  let userInputValue = userInput.value;

  let trimmedUserInputValue = userInputValue.trim();

  let noResultsMessage = document.querySelector(".no-results");
  let tryAnotherSearch = document.querySelector(".try-again");
  let backToDashboard = document.querySelector(".back-to-dashboard-button");
  let backToDashboardContainer = document.querySelectorAll(
    ".back-to-dashboard-container",
  );

  if (trimmedUserInputValue === "") {
    if (firstTimerParentContainer) {
      firstTimerParentContainer.style.display = "flex";
    }
    let quickSearchButtonContainer = document.querySelector(
      ".quick-search-button-container",
    );
    quickSearchButtonContainer.style.display = "none";

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
        console.log("no results");
        if (searchTable) {
          searchTable.style.display = "none";
        }
        if (firstExpenseContainer) {
          firstExpenseContainer.style.display = "none";
        }
        if (firstTimerParentContainer) {
          firstTimerParentContainer.style.display = "none";
        }
        if (quickSearchButtonContainer) {
          quickSearchButtonContainer.style.display = "none";
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
        console.log("check this line");
        backToDashboard.style.display = "none";
        backToDashboard.style.justifyContent = "center";

        quickSearchButtonContainer.style.display = "none";
        noEntriesParentContainer.style.display = "flex";
        noEntriesParentContainer.style.justifyContent = "center";
        quickSearchResultsContainer.style.display = "none";

        noEntriesChildContainer.style.display = "flex";
      } else {
        let backToDashboard = document.querySelector(
          ".back-to-dashboard-button",
        );
        if (aeSearchTableMainContainer) {
          aeSearchTableMainContainer.textContent = "";
        }
        if (firstExpenseContainer) {
          firstExpenseContainer.style.display = "none";
        }
        if (firstTimerParentContainer) {
          firstTimerParentContainer.style.display = "none";
        }
        if (quickSearchButtonContainer) {
          quickSearchButtonContainer.style.display = "flex";
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
          const userId = info.user_id;
          const expenseName = info.expense_name;
          const expenseCost = info.expense_cost;
          const expenseDate = info.expense_date;

          const trDataRow = document.createElement("tr");

          let deleteTd = document.createElement("td");
          deleteTd.setAttribute("id", `qs-delete-td-${info.expense_id}`);

          let editTd = document.createElement("td");
          editTd.setAttribute("id", `qs-edit-td-${info.expense_id}`);

          let tdName = document.createElement("td");
          tdName.setAttribute("id", `td-name-${info.expense_id}`);

          let qsTdNameCostDateMainContainer = document.createElement("div");
          qsTdNameCostDateMainContainer.setAttribute(
            "id",
            `qs-name-cost-date-main-container-${info.expense_id}`,
          );
          qsTdNameCostDateMainContainer.style.display = "flex";

          let qsTdNameCostDateChildContainer = document.createElement("div");
          qsTdNameCostDateChildContainer.setAttribute(
            "class",
            "qs-name-cost-date-child-container",
          );
          qsTdNameCostDateChildContainer.setAttribute(
            "id",
            `qs-name-cost-date-child-container-${info.expense_id}`,
          );

          let qsEditNameContainer = document.createElement("div");
          let qsEditNameInputContainer = document.createElement("div");
          qsEditNameInputContainer.setAttribute(
            "id",
            `qs-edit-name-input-container-${info.expense_id}`,
          );
          qsEditNameInputContainer.style.display = "none";
          qsEditNameInputContainer.dataset.expenseId = info.expense_id;

          let qsEditNameInputField = document.createElement("input");
          qsEditNameInputField.name = "updateName";
          qsEditNameInputField.required = true;
          qsEditNameInputField.type = "text";

          qsEditNameInputField.setAttribute(
            "id",
            `qs-edit-name-input-field-${info.expense_id}`,
          );
          qsEditNameInputField.setAttribute(
            "class",
            "qs-edit-name-input-field",
          );
          qsEditNameInputField.style.paddingRight = "12px";

          let expenseNamepTag = document.createElement("p");
          expenseNamepTag.textContent = expenseName;
          expenseNamepTag.setAttribute("class", "expense-name-p-tag");
          expenseNamepTag.dataset.expenseId = info.expense_id;
          expenseNamepTag.setAttribute(
            "id",
            `expense-name-p-tag-${info.expense_id}`,
          );
          let nameLabel = document.createElement("p");
          nameLabel.setAttribute("id", `name-label-${info.expense_id}`);
          nameLabel.setAttribute("class", "name-label");
          nameLabel.textContent = "Name";
          nameLabel.style.display = "none";

          let costLabel = document.createElement("p");
          costLabel.setAttribute("id", `cost-label-${info.expense_id}`);
          costLabel.setAttribute("class", "cost-label");
          costLabel.textContent = "Cost";

          expenseNamepTag.style.display = "inline";

          qsEditNameContainer.append(expenseNamepTag);
          qsEditNameInputContainer.append(qsEditNameInputField, nameLabel);

          let tdNameCostContainer = document.createElement("div");
          tdNameCostContainer.setAttribute(
            "id",
            `td-name-cost-container-${info.expense_id}`,
          );
          tdNameCostContainer.style.display = "none";

          tdNameCostContainer.append(costLabel);

          let tdCost = document.createElement("td");
          tdCost.setAttribute("id", `td-cost-${info.expense_id}`);

          let qsEditCostContainer = document.createElement("div");

          let qsEditCostInputContainer = document.createElement("div");
          qsEditCostInputContainer.style.alignItems = "center";
          qsEditCostInputContainer.setAttribute(
            "id",
            `qs-edit-cost-input-container-${info.expense_id}`,
          );

          qsEditCostInputContainer.style.display = "none";

          qsEditCostInputContainer.dataset.expenseId = info.expense_id;

          let qsEditCostInputField = document.createElement("input");
          qsEditCostInputField.type = "number";
          qsEditCostInputField.step = "0.01";
          qsEditCostInputField.required = true;

          qsEditCostInputField.style.paddingLeft = "12px";
          let moneySymbol = document.createElement("p");
          moneySymbol.textContent = "$";
          moneySymbol.style.color = "red";
          moneySymbol.style.position = "absolute";
          moneySymbol.style.margin = "0";

          qsEditCostInputField.setAttribute(
            "id",
            `qs-edit-cost-input-field-${info.expense_id}`,
          );
          qsEditCostInputField.setAttribute(
            "class",
            "qs-edit-cost-input-field",
          );
          qsEditCostInputField.dataset.expenseId = info.expense_id;
          qsEditCostInputField.name = "qs-edit-input-field";

          let qsEditCostpTag = document.createElement("p");
          qsEditCostpTag.textContent = expenseCost;
          qsEditCostpTag.setAttribute("class", "qs-edit-cost-p-tag");
          qsEditCostpTag.style.display = "inline";

          let convertedCost = Number(
            qsEditCostpTag.textContent.replace("$", ""),
          );

          qsEditCostInputField.value = convertedCost;

          qsEditCostContainer.append(qsEditCostpTag);

          qsEditCostInputContainer.append(moneySymbol, qsEditCostInputField);
          /*
          qsEditCostInputContainer.append(qsEditCostInputField);
          */
          qsTdNameCostDateMainContainer.append(qsEditNameContainer);

          tdNameCostContainer.append(
            qsEditCostContainer,
            qsEditCostInputContainer,
          );

          let qsMoneySymbol = document.createElement("p");
          qsMoneySymbol.textContent = "$";

          qsMoneySymbol.setAttribute("class", "qs-money-symbol");

          tdNameCostContainer.append(qsEditCostInputField, qsMoneySymbol);

          qsTdNameCostDateMainContainer.append(qsEditCostInputContainer);

          tdName.append(qsTdNameCostDateMainContainer);

          tdCost.append(qsEditCostContainer, qsEditCostInputContainer);

          let tdDate = document.createElement("td");
          tdDate.setAttribute("id", `td-date-${info.expense_id}`);

          let editDateContainer = document.createElement("div");
          let editDateInputContainer = document.createElement("div");
          editDateInputContainer.dataset.expenseId = info.expense_id;
          editDateInputContainer.classList.add("qs-edit-date-input-container");
          editDateInputContainer.setAttribute(
            "id",
            `qs-edit-date-input-container-${info.expense_id}`,
          );
          let editDateInputField = document.createElement("input");
          editDateInputField.classList.add("qs-edit-date-input-field");
          editDateInputField.dataset.expenseId = info.expense_id;

          editDateInputField.style.paddingRight = "12px";
          editDateInputField.setAttribute(
            "id",
            `edit-date-input-${info.expense_id}`,
          );
          editDateInputField.type = "text";

          editDateInputContainer.style.display = "none";
          let expenseDatepElement = document.createElement("p");
          expenseDatepElement.textContent = expenseDate;
          expenseDatepElement.setAttribute("class", "qs-edit-date-p-tag");
          expenseDatepElement.style.display = "inline";

          editDateContainer.append(expenseDatepElement);
          editDateInputContainer.append(editDateInputField);
          tdDate.append(editDateContainer, editDateInputContainer);

          let qsDateContainer = document.createElement("div");
          qsDateContainer.setAttribute(
            "id",
            `qs-date-container-${info.expense_id}`,
          );
          qsDateContainer.style.display = "none";

          let dateLabel = document.createElement("p");
          dateLabel.setAttribute("class", "date-label");
          dateLabel.setAttribute("id", `date-label-${info.expense_id}`);
          dateLabel.textContent = "Date";
          dateLabel.style.display = "none";

          editDateInputField.value = expenseDatepElement.textContent;

          qsDateContainer.append(dateLabel, editDateInputField);

          qsTdNameCostDateChildContainer.append(
            qsEditNameInputContainer,
            tdNameCostContainer,
            qsDateContainer,
          );

          let qsSaveCancelButtonContainer = document.createElement("div");
          qsSaveCancelButtonContainer.setAttribute(
            "id",
            `qs-save-cancel-button-container-${info.expense_id}`,
          );
          qsSaveCancelButtonContainer.setAttribute(
            "class",
            "qs-save-cancel-button-container",
          );

          qsSaveCancelButtonContainer.style.display = "none";

          let qsCancelButton = document.createElement("button");
          qsCancelButton.setAttribute(
            "id",
            `qs-cancel-button-${info.expense_id}`,
          );
          qsCancelButton.dataset.expenseId = info.expense_id;
          qsCancelButton.setAttribute("class", "qs-cancel-button");
          qsCancelButton.textContent = "Cancel";

          let qsSaveButton = document.createElement("button");
          qsSaveButton.setAttribute(
            "id",
            `qs-save-new-changes-button-${info.expense_id}`,
          );
          qsSaveButton.dataset.expenseId = info.expense_id;
          qsSaveButton.setAttribute("class", "save-new-changes-button");
          qsSaveButton.textContent = "Save";

          qsSaveCancelButtonContainer.append(qsCancelButton, qsSaveButton);

          qsTdNameCostDateChildContainer.append(qsSaveCancelButtonContainer);
          qsTdNameCostDateMainContainer.append(qsTdNameCostDateChildContainer);

          const trashIcon = document.createElement("button");
          trashIcon.innerHTML = `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
             
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-trash2-icon lucide-trash-2"
            >
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>`;

          trashIcon.style.textAlign = "center";
          trashIcon.style.cursor = "pointer";
          trashIcon.setAttribute("class", "trash-icon");
          trashIcon.style.border = "none";
          trashIcon.style.background = "transparent";

          trashIcon.id = `trash-icon-${info.expense_id}`;
          trashIcon.dataset.trashExpenseId = info.expense_id;
          trashIcon.dataset.userId = info.user_id;
          trashIcon.dataset.expenseName = expenseName;
          trashIcon.dataset.expenseCost = expenseCost;

          deleteTd.appendChild(trashIcon);

          let editIcon = document.createElement("button");
          editIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`;

          editIcon.classList.add("qs-edit-icon");
          editIcon.style.background = "transparent";
          editIcon.style.border = "none";
          editIcon.id = `qs-edit-icon-${info.expense_id}`;
          editIcon.style.cursor = "pointer";
          editIcon.style.display = "inline";
          editIcon.dataset.expenseId = info.expense_id;
          editIcon.dataset.userId = info.user_id;

          editTd.appendChild(editIcon);

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

          if (aeSearchTableMainContainer) {
            aeSearchTableMainContainer.appendChild(quickSearchTable);
          }
          if (searchTableMainContainer) {
            searchTableMainContainer.appendChild(quickSearchTable);
          }
          if (flSearchTableMainContainer) {
            flSearchTableMainContainer.append(quickSearchTable);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

if (qsNextResultsButton) {
  qsNextResultsButton.addEventListener("click", () => {
    offset = offset + 10;

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
    /*
    bodyColor.classList.toggle("light");
    */
  }
});

/* 
I've added an event listener to a button attached to my sidebar
When this button is clicked, the sidebar class is toggled and added which adds a 250px width to the sidebar
which opens the sidebar, if clicked again the sidebar class is removed 
I'm going to be adding a search feature soon


*/
if (aeSidebar && aeToggleButton) {
  aeToggleButton.addEventListener("click", (e) => {
    if (!aeSidebar.classList.contains("sidebar")) {
      aeSidebar.classList.toggle("sidebar");
      aeToggleButton.classList.remove("bx-chevron-right");
      aeToggleButton.classList.add("bx-chevron-left");
    } else {
      aeSidebar.classList.toggle("sidebar");
      aeToggleButton.classList.remove("bx-chevron-left");
      aeToggleButton.classList.add("bx-chevron-right");
    }
  });
}

if (flSidebar && flToggleButton) {
  let flToggleButton = document.getElementById("fl-toggle");
  let flSearchLi = document.getElementById("fl-close-searchbox");
  let flSearchIcon = document.getElementById("fl-search-icon");
  let closeSearchBox = document.querySelector(".open-search-box");
  flToggleButton.addEventListener("click", (e) => {
    let isClosed = !flSidebar.classList.contains("sidebar");
    console.log(`THIS IS THE VALUE OF IS CLOSED ----${isClosed}`);

    if (isClosed) {
      console.log("open added");
      flSidebar.classList.toggle("sidebar");
      flToggleButton.classList.remove("bx-chevron-right");
      flToggleButton.classList.add("bx-chevron-left");

      flSearchLi.classList.add("open-search-box");
      flSearchLi.classList.remove("close-search-box");

      flSearchIcon.classList.remove("close-search-box");
      flSearchIcon.classList.add("open-search-box");

      firstTimerParentContainer.style.marginLeft = "210px";
    } else {
      let isOpen = flSidebar.classList.contains("sidebar");
      console.log(`THIS IS THE VALUE OF IS OPEN ----${isOpen}`);
      if (isOpen) {
        console.log("close added");
        flSidebar.classList.toggle("sidebar");
        firstTimerParentContainer.style.marginLeft = "0px";
        flToggleButton.classList.remove("bx-chevron-left");
        flToggleButton.classList.add("bx-chevron-right");

        flSearchLi.classList.add("close-search-box");
        flSearchLi.classList.remove("open-search-box");

        flSearchIcon.classList.add("close-search-box");
        flSearchIcon.classList.remove("open-search-box");
      }
    }
  });
}

if (flSidebar) {
  let flToggleButton = document.getElementById("fl-toggle");
  let flSearchLi = document.getElementById("fl-close-searchbox");
  let flSearchIcon = document.getElementById("fl-search-icon");
  flSidebar.addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.classList.contains("close-search-box")) {
      console.log("yes has close search box");
      flSidebar.classList.add("sidebar");
      flSearchLi.classList.add("open-search-box");
      flSearchLi.classList.remove("close-search-box");

      flSearchIcon.classList.remove("close-search-box");
      flSearchIcon.classList.add("open-search-box");

      flToggleButton.classList.remove("bx-chevron-right");
      flToggleButton.classList.add("bx-chevron-left");
    }
  });
}

/*
if (flSidebar) {
  let flToggleButton = document.getElementById("fl-toggle");
  let flSearchLi = document.getElementById("fl-close-searchbox");
  let flSearchIcon = document.getElementById("fl-search-icon");
  let closeSearchBox = document.querySelector(".open-search-box");
  flSidebar.addEventListener("click", (e) => {
    if (e.target.closest(".close-search-box")) {
      if (
        !flSidebar.classList.contains("sidebar") &&
        flToggleButton.classList.contains("bx-chevron-right")
      ) {
        console.log("other open added");

        flSearchLi.classList.remove("close-search-box");
        flSearchLi.classList.add("open-search-box");

        flSearchIcon.classList.remove("close-search-box");
        flSearchIcon.classList.add("open-search-box");

        flToggleButton.classList.remove("bx-chevron-right");
        flToggleButton.classList.add("bx-chevron-left");
      }
    } else {
      console.log("contradiction 2");
      flSearchLi.classList.add("close-search-box");
      flSearchLi.classList.remove("open-search-box");

      flSearchIcon.classList.add("close-search-box");
      flSearchIcon.classList.remove("open-search-box");

      flToggleButton.classList.add("bx-chevron-right");
      flToggleButton.classList.remove("bx-chevron-left");
    }
  });
}
*/

/*
if (flSidebar) {
  flSidebar.addEventListener("click", (e) => {
    let flToggleButton = document.getElementById("fl-toggle");
    let flSearchLi = document.getElementById("fl-close-searchbox");
    let flSearchIcon = document.getElementById("fl-search-icon");
    let closeSearchBox = document.querySelector(".open-search-box");

    if (e.target.closest(".toggle")) {
      let isClosed = e.target.classList.contains("bx-chevron-right");
      console.log(isClosed);
      if (isClosed) {
        console.log("open added");
        flSearchLi.classList.add("open-search-box");
        flSearchLi.classList.remove("close-search-box");
      }
    }

    if (e.target.closest(".toggle")) {
      let isOpen = e.target.classList.contains("bx-chevron-left");
      console.log(isOpen);
      if (isOpen) {
        console.log("close added");
        flSearchLi.classList.add("close-search-box");
        flSearchLi.classList.remove("open-search-box");
      }
    }
       });
}


*/

if (dashboardToggleButton && expenseDataContainer) {
  dashboardToggleButton.addEventListener("click", () => {
    let userInputValue = userInput.value;
    let trimmedUserInputValue = userInputValue.trim();

    if (!openSidebar.classList.contains("sidebar")) {
      openSidebar.classList.toggle("sidebar");
      let expenseDataContainer = document.querySelector(
        ".expense_data_container",
      );
      expenseDataContainer.style.width = "calc(100% - 210px)";
    } else {
      openSidebar.classList.toggle("sidebar");
      expenseDataContainer.style.width = "calc(100% - 50px)";
    }

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

if (openSidebar) {
  let toggleButton = document.getElementById("fl-toggle");
  openSidebar.addEventListener("click", (e) => {
    console.log("line 1572");
    if (e.target.closest(".bx-chevron-right")) {
      console.log("toggle button");
      openSidebar.classList.add("sidebar");

      toggleButton.classList.remove("bx-chevron-right");
      toggleButton.classList.add("bx-chevron-left");
    } else {
      openSidebar.classList.remove("sidebar");
      toggleButton.classList.add("bx-chevron-right");
      toggleButton.classList.remove("bx-chevron-left");
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
    let confirmDelete = document.querySelector(
      ".delete-confirmation-main-container",
    );
    if (confirmDelete) {
      confirmDelete.style.display = "none";
    }
  });
}

function displayDetails(eName, eCost, uId, eId) {
  let confirmDeleteButton = document.querySelector(".confirm-delete");
  if (confirmDeleteButton) {
    confirmDeleteButton.style.display = "flex";
    confirmDeleteButton.style.alignItems = "center";
    confirmDeleteButton.dataset.userId = uId;
    confirmDeleteButton.dataset.expenseId = eId;
  }

  let confirmDelete = document.querySelector(
    ".delete-confirmation-main-container",
  );
  if (confirmDelete) {
    confirmDelete.style.display = "flex";
    confirmDelete.style.justifyContent = "space-evenly";
  }

  let flConfirmDeleteContainer = document.querySelector(
    ".fl-delete-confirmation-main-container",
  );
  if (flConfirmDeleteContainer) {
    flConfirmDeleteContainer.style.display = "flex";
    flConfirmDeleteContainer.style.flexDirection = "column";
    flConfirmDeleteContainer.style.justifyContent = "space-evenly";
    flConfirmDeleteContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("cancel-delete")) {
        flConfirmDeleteContainer.style.display = "none";
      }
    });
  }

  let eNamep = document.querySelector(".e-name");
  let nameSpanValue = document.querySelector(".span-name-value");
  eNamep.style.display = "flex";

  eNamep.innerHTML = `Expense:`;
  nameSpanValue.textContent = `${eName}`;

  let eCostp = document.querySelector(".e-cost");
  let eCostValue = document.querySelector(".e-cost-value");
  eCostp.style.display = "flex";

  eCostp.textContent = `Amount:`;
  eCostValue.style.display = "flex";
  eCostValue.textContent = `${eCost}`;
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

async function updateName(tId, uId) {
  let updateNameInputField = document.getElementById(
    `qs-edit-name-input-field-${tId}`,
  );
  let userInput = updateNameInputField.value.trim();

  try {
    let response = await fetch(
      `/update_name_quick_search?updateName=${encodeURIComponent(userInput)}&userId=${uId}&expenseId=${encodeURIComponent(tId)}`,
      {
        method: "POST",
      },
    );
    let data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

async function updateCost(eId, uId) {
  let qsEditCostInputField = document.getElementById(
    `qs-edit-cost-input-field-${eId}`,
  );
  let userInput = qsEditCostInputField.value.trim();

  try {
    let request = await fetch(
      `/quick_search_update_cost?userInput=${encodeURIComponent(userInput)}&expenseId=${encodeURIComponent(eId)}&userId=${encodeURIComponent(uId)}`,
      { method: "POST" },
    );

    let response = await request.json();
    return response;
  } catch (e) {
    console.log(e);
  }
}

async function updateDate(eId, uId) {
  let userInput = document.getElementById(`edit-date-input-${eId}`);

  try {
    let request = await fetch(
      `/quick_search_update_date?userInput=${encodeURIComponent(userInput.value.trim())}&userId=${encodeURIComponent(uId)}&expenseId=${encodeURIComponent(eId)}`,
      { method: "post" },
    );

    let response = await request.json();
    return response;
  } catch (e) {
    console.log(e);
  }
}

if (aeSearchTableMainContainer) {
  aeSearchTableMainContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("save-name-edit-button")) {
      userId = e.target.dataset.userId;
      expenseId = e.target.dataset.expenseId;

      try {
        let result = await updateName(expenseId, userId);

        if (result.success === true) {
          searchExpenseByName(offset);
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (e.target.classList.contains("save-cost-edit-button")) {
      expenseId = e.target.dataset.expenseId;
      userId = e.target.dataset.userId;
      result = await updateCost(expenseId, userId);
      console.log(result);
      if (result.success === true) {
        searchExpenseByName(offset);
      }
    }
    if (e.target.classList.contains("save-date-edit-button")) {
      expenseId = e.target.dataset.expenseId;
      userId = e.target.dataset.userId;

      result = await updateDate(expenseId, userId);
      if (result.success === true) {
        searchExpenseByName(offset);
      }
    }
  });
}

if (searchTableMainContainer) {
  searchTableMainContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("save-name-edit-button")) {
      userId = e.target.dataset.userId;
      expenseId = e.target.dataset.expenseId;
      try {
        let result = await updateName(expenseId, userId);
        if (result.success === true) {
          searchExpenseByName(offset);
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (e.target.classList.contains("save-cost-edit-button")) {
      expenseId = e.target.dataset.expenseId;
      userId = e.target.dataset.userId;
      result = await updateCost(expenseId, userId);
      console.log(result);
      if (result.success === true) {
        searchExpenseByName(offset);
      }
    }
    if (e.target.classList.contains("save-date-edit-button")) {
      expenseId = e.target.dataset.expenseId;
      userId = e.target.dataset.userId;

      result = await updateDate(expenseId, userId);
      if (result.success === true) {
        searchExpenseByName(offset);
      }
    }
  });
}
let flSearchTableMainContainer = document.getElementById(
  "fl-search-table-main-container",
);

if (flSearchTableMainContainer) {
  flSearchTableMainContainer.addEventListener("click", (e) => {
    console.log("clicked fl container");
    let trashButton = e.target.closest(".trash-icon");

    if (e.target.classList.contains("qs-cancel-button")) {
      let expenseId = e.target.dataset.expenseId;
      console.log(expenseId);

      let qsChildContainer = document.getElementById(
        `qs-name-cost-date-child-container-${expenseId}`,
      );
      qsChildContainer.style.display = "none";

      let qsTdNameCostDateMainContainer = document.getElementById(
        `qs-name-cost-date-main-container-${expenseId}`,
      );
      qsTdNameCostDateMainContainer.style.justifyContent = "flex-start";

      let tdName = document.getElementById(`td-name-${expenseId}`);
      tdName.colSpan = 1;

      let expenseNamepTag = document.getElementById(
        `expense-name-p-tag-${expenseId}`,
      );
      expenseNamepTag.style.display = "inline";

      let tdCost = document.getElementById(`td-cost-${expenseId}`);
      tdCost.style.display = "table-cell";

      let tdDate = document.getElementById(`td-date-${expenseId}`);
      tdDate.style.display = "table-cell";

      let tdDelete = document.getElementById(`qs-delete-td-${expenseId}`);
      tdDelete.style.display = "table-cell";

      let tdEdit = document.getElementById(`qs-edit-td-${expenseId}`);
      tdEdit.style.display = "table-cell";

      let qsEditIcon = document.getElementById(`qs-edit-icon-${expenseId}`);
      qsEditIcon.style.display = "inline";
    }

    if (trashButton) {
      console.log(trashButton);
      let userId = trashButton.dataset.userId;
      let expenseId = trashButton.dataset.trashExpenseId;
      let expenseName = trashButton.dataset.expenseName;
      let expenseCost = trashButton.dataset.expenseCost;
      console.log(userId, expenseId, expenseName, expenseCost);
      displayDetails(expenseName, expenseCost, userId, expenseId);
    }
    let qsEditButton = e.target.closest(".qs-edit-icon");
    if (qsEditButton) {
      let targetExpenseId = qsEditButton.dataset.expenseId;

      let qsChildContainer = document.getElementById(
        `qs-name-cost-date-child-container-${targetExpenseId}`,
      );
      qsChildContainer.style.display = "inline-block";

      let qsTdNameCostDateMainContainer = document.getElementById(
        `qs-name-cost-date-main-container-${targetExpenseId}`,
      );
      qsTdNameCostDateMainContainer.style.display = "flex";
      qsTdNameCostDateMainContainer.style.justifyContent = "center";

      let turnOffEditIcon = document.getElementById(
        `qs-edit-icon-${targetExpenseId}`,
      );

      let tdDate = document.getElementById(`td-date-${targetExpenseId}`);
      tdDate.style.display = "none";

      let deleteTd = document.getElementById(`qs-delete-td-${targetExpenseId}`);
      deleteTd.style.display = "none";

      let editTd = document.getElementById(`qs-edit-td-${targetExpenseId}`);
      editTd.style.display = "none";

      let tdName = document.getElementById(`td-name-${targetExpenseId}`);
      tdName.colSpan = 5;

      let qsEditDateButton = document.getElementById(
        `qs-edit-date-button-${targetExpenseId}`,
      );

      let tdCost = document.getElementById(`td-cost-${targetExpenseId}`);
      tdCost.style.display = "none";

      let tdNameCostContainer = document.getElementById(
        `td-name-cost-container-${targetExpenseId}`,
      );
      tdNameCostContainer.style.display = "flex";
      tdNameCostContainer.style.flexDirection = "column";
      tdNameCostContainer.style.position = "relative";

      let qsDateContainer = document.getElementById(
        `qs-date-container-${targetExpenseId}`,
      );

      let costLabel = document.getElementById(`cost-label-${targetExpenseId}`);
      costLabel.style.display = "flex";
      costLabel.style.justifyContent = "center";

      qsDateContainer.style.display = "block";

      turnOffEditIcon.style.display = "none";

      let qsExpenseNamepTag = document.getElementById(
        `expense-name-p-tag-${targetExpenseId}`,
      );
      qsExpenseNamepTag.style.display = "none";

      let nameLabel = document.getElementById(`name-label-${targetExpenseId}`);

      let dateLabel = document.getElementById(`date-label-${targetExpenseId}`);
      dateLabel.style.display = "flex";
      dateLabel.style.justifyContent = "center";

      let qsEditNameInputContainer = document.getElementById(
        `qs-edit-name-input-container-${targetExpenseId}`,
      );

      let qsEditNameinputField = document.getElementById(
        `qs-edit-name-input-field-${targetExpenseId}`,
      );
      qsEditNameinputField.value = qsExpenseNamepTag.textContent;

      qsEditNameInputContainer.style.display = "flex";
      qsEditNameInputContainer.style.flexDirection = "column-reverse";
      nameLabel.style.display = "flex";
      nameLabel.style.marginTop = "0";
      nameLabel.style.justifyContent = "center";

      let qsSaveCancelButtonContainer = document.getElementById(
        `qs-save-cancel-button-container-${targetExpenseId}`,
      );
      qsSaveCancelButtonContainer.style.display = "flex";
    }
  });
}

if (searchTableMainContainer) {
  searchTableMainContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("qs-edit-date-input-field")) {
      let expenseId = e.target.dataset.expenseId;
    }
    let editButton = e.target.closest(".qs-edit-icon");
    if (editButton) {
      let targetExpenseId = editButton.dataset.expenseId;

      let qsChildContainer = document.getElementById(
        `qs-name-cost-date-child-container-${targetExpenseId}`,
      );
      qsChildContainer.style.display = "inline-block";

      let qsTdNameCostDateMainContainer = document.getElementById(
        `qs-name-cost-date-main-container-${targetExpenseId}`,
      );
      qsTdNameCostDateMainContainer.style.display = "flex";
      qsTdNameCostDateMainContainer.style.justifyContent = "center";

      let turnOffEditIcon = document.getElementById(
        `qs-edit-icon-${targetExpenseId}`,
      );

      let tdDate = document.getElementById(`td-date-${targetExpenseId}`);
      tdDate.style.display = "none";

      let tdDelete = document.getElementById(`qs-delete-td-${targetExpenseId}`);

      tdDelete.style.display = "none";

      let editTd = document.getElementById(`qs-edit-td-${targetExpenseId}`);
      editTd.style.display = "none";

      let tdName = document.getElementById(`td-name-${targetExpenseId}`);

      let qsEditDateButton = document.getElementById(
        `qs-edit-date-button-${targetExpenseId}`,
      );

      let tdCost = document.getElementById(`td-cost-${targetExpenseId}`);
      tdCost.style.display = "none";

      let tdNameCostContainer = document.getElementById(
        `td-name-cost-container-${targetExpenseId}`,
      );
      tdNameCostContainer.style.display = "flex";
      tdNameCostContainer.style.flexDirection = "column";
      tdNameCostContainer.style.position = "relative";

      let qsDateContainer = document.getElementById(
        `qs-date-container-${targetExpenseId}`,
      );

      let costLabel = document.getElementById(`cost-label-${targetExpenseId}`);
      costLabel.style.display = "flex";
      costLabel.style.justifyContent = "center";

      qsDateContainer.style.display = "block";

      turnOffEditIcon.style.display = "none";

      let qsExpenseNamepTag = document.getElementById(
        `expense-name-p-tag-${targetExpenseId}`,
      );
      qsExpenseNamepTag.style.display = "none";

      let nameLabel = document.getElementById(`name-label-${targetExpenseId}`);

      let dateLabel = document.getElementById(`date-label-${targetExpenseId}`);
      dateLabel.style.display = "flex";
      dateLabel.style.justifyContent = "center";

      let qsEditNameInputContainer = document.getElementById(
        `qs-edit-name-input-container-${targetExpenseId}`,
      );

      let qsEditNameinputField = document.getElementById(
        `qs-edit-name-input-field-${targetExpenseId}`,
      );
      qsEditNameinputField.value = qsExpenseNamepTag.textContent;

      qsEditNameInputContainer.style.display = "flex";
      qsEditNameInputContainer.style.flexDirection = "column-reverse";
      nameLabel.style.display = "flex";
      nameLabel.style.marginTop = "0";
      nameLabel.style.justifyContent = "center";

      let qsSaveCancelButtonContainer = document.getElementById(
        `qs-save-cancel-button-container-${targetExpenseId}`,
      );
      qsSaveCancelButtonContainer.style.display = "flex";

      tdName.colSpan = 5;
    }
    let trashButton = e.target.closest(".trash-icon");
    if (trashButton) {
      console.log("trash icon working ");
      let userId = trashButton.dataset.userId;
      let expenseId = trashButton.dataset.trashExpenseId;
      let expenseName = trashButton.dataset.expenseName;
      let expenseCost = trashButton.dataset.expenseCost;
      displayDetails(expenseName, expenseCost, userId, expenseId);
    }

    if (e.target.classList.contains("cancel-edit-button")) {
      let expenseId = e.target.dataset.cancelEditButton;
      let cancelEditButton = document.getElementById(
        `cancel-edit-button-${expenseId}`,
      );
      let editNameInput = document.getElementById(
        `edit-name-input-${expenseId}`,
      );
      editNameInput.disabled = true;
      editNameInput.required = false;

      let editCostInput = document.getElementById(
        `edit-cost-input-${expenseId}`,
      );
      editCostInput.disabled = true;
      editCostInput.required = false;

      let editDateInput = document.getElementById(`datepicker-${expenseId}`);
      editDateInput.disabled = true;
      editDateInput.required = false;
    }
    if (e.target.classList.contains("qs-cancel-button")) {
      let expenseId = e.target.dataset.expenseId;
      console.log(expenseId);

      let qsChildContainer = document.getElementById(
        `qs-name-cost-date-child-container-${expenseId}`,
      );
      qsChildContainer.style.display = "none";

      let qsTdNameCostDateMainContainer = document.getElementById(
        `qs-name-cost-date-main-container-${expenseId}`,
      );
      qsTdNameCostDateMainContainer.style.justifyContent = "flex-start";

      let tdName = document.getElementById(`td-name-${expenseId}`);
      tdName.colSpan = 1;
      /*
      tdName.style.display = "table-cell";
      */

      let expenseNamepTag = document.getElementById(
        `expense-name-p-tag-${expenseId}`,
      );
      expenseNamepTag.style.display = "inline";

      let tdCost = document.getElementById(`td-cost-${expenseId}`);
      tdCost.style.display = "table-cell";

      let tdDate = document.getElementById(`td-date-${expenseId}`);
      tdDate.style.display = "table-cell";

      let tdDelete = document.getElementById(`qs-delete-td-${expenseId}`);
      tdDelete.style.display = "table-cell";

      let tdEdit = document.getElementById(`qs-edit-td-${expenseId}`);
      tdEdit.style.display = "table-cell";

      let qsEditIcon = document.getElementById(`qs-edit-icon-${expenseId}`);
      qsEditIcon.style.display = "inline";
    }
    if (e.target.classList.contains("save-new-changes-button")) {
      let expenseId = e.target.dataset.expenseId;
      let qsEditNameInput = document.getElementById(
        `qs-edit-name-input-field-${expenseId}`,
      ).value;
      let qsEditCostInput = document.getElementById(
        `qs-edit-cost-input-field-${expenseId}`,
      ).value;
      let convertedCostInput = parseFloat(qsEditCostInput);
      let qsEditDateInput = document.getElementById(
        `edit-date-input-${expenseId}`,
      ).value;
      if (qsEditDateInput.trim() === "") {
        e.preventDefault();
        alert("Please enter a date");
      }

      let work = await updateEntries(
        expenseId,
        qsEditNameInput,
        qsEditCostInput,
        qsEditDateInput,
      );

      if (work.success === true) {
        window.location.href = "/dashboard";
      }
    }
  });
}

if (expenseDataContainer) {
  expenseDataContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("save-new-changes-button")) {
      let expenseId = e.target.dataset.expenseId;

      console.log(expenseId);
      let dateInput = document.getElementById(`datepicker-${expenseId}`);

      if (dateInput.value.trim() === "") {
        e.preventDefault();

        alert("please enter a date");
      }
    }
  });
}

/*
if (flSearchTableMainContainer) {
  flSearchTableMainContainer.addEventListener("click", (e) => {
   
    if (e.target.classList.contains("save-new-changes-button")) {
      let expenseId = e.target.dataset.expenseId;
      let dateInput = document.getElementById(`edit-date-input-${expenseId}`);

      if (dateInput.value.trim() === "") {
        e.preventDefault();

        alert("please enter a date");
      }
    }
  });
}
*/
async function updateEntries(eId, eName, eCost, eDate) {
  try {
    let request = await fetch(
      `/quick-search-update?expenseId=${encodeURIComponent(eId)}&expenseName=${encodeURIComponent(eName)}&expenseCost=${encodeURIComponent(eCost)}&expenseDate=${encodeURIComponent(eDate)}`,
      {
        method: "POST",
      },
    );
    let response = await request.json();
    return response;
  } catch (e) {
    console.log(e);
  }
}

let topNavbars = document.querySelectorAll(".top-navbar-container");
topNavbars.forEach((topNavbar) => {
  window.addEventListener("resize", (e) => {
    if (window.outerWidth > 970) {
      let hamburgerIcon = document.querySelector(".hamburger-icon");
      hamburgerIcon.style.display = "none";
    }
    if (window.outerWidth <= 970) {
      let hamburgerIcon = document.querySelector(".hamburger-icon");
      hamburgerIcon.style.display = "block";
    }
    /*
    let currentColor = window.localStorage.getItem("color");
    
    if (currentColor === "dark" && window.outerWidth < 800) {
      let darkHamburgerIcon = document.querySelector(".dark-hamburger-icon");
      darkHamburgerIcon.style.display = "block";
      let lightHamburgerIcon = document.querySelector(".light-hamburger-icon");
      lightHamburgerIcon.style.display = "none";
    }
    if (currentColor === "light" && window.outerWidth < 800) {
      let darkHamburgerIcon = document.querySelector(".dark-hamburger-icon");
      let lightHamburgerIcon = document.querySelector(".light-hamburger-icon");
      darkHamburgerIcon.style.display = "none";
      lightHamburgerIcon.style.display = "block";
    }
      */
  });
});

let aeTopNavbar = document.querySelectorAll(".ae-top-navbar-container");
aeTopNavbar.forEach((topNavbar) => {
  window.addEventListener("resize", (e) => {
    if (window.outerWidth > 970) {
      let hamburgerIcon = document.querySelector(".hamburger-icon");
      hamburgerIcon.style.display = "none";
    }
    if (window.outerWidth <= 970) {
      let hamburgerIcon = document.querySelector(".hamburger-icon");
      hamburgerIcon.style.display = "block";
    }
    /*
    let currentColor = window.localStorage.getItem("color");
    if (currentColor === "dark" && window.outerWidth < 800) {
      let darkHamburgerIcon = document.querySelector(".dark-hamburger-icon");
      darkHamburgerIcon.style.display = "block";
      let lightHamburgerIcon = document.querySelector(".light-hamburger-icon");
      lightHamburgerIcon.style.display = "none";
    }
    if (currentColor === "light" && window.outerWidth < 800) {
      let darkHamburgerIcon = document.querySelector(".dark-hamburger-icon");
      let lightHamburgerIcon = document.querySelector(".light-hamburger-icon");
      darkHamburgerIcon.style.display = "none";
      lightHamburgerIcon.style.display = "block";
    }
      */
  });
});

let dbMobileMenu = document.getElementById("db-mobile-menu");
if (dbMobileMenu) {
  dbMobileMenu.addEventListener("click", (e) => {
    let dbLightSpan = document.querySelector(".light-mode");
    let dbDarkSpan = document.querySelector(".dark-mode");

    let lightCalenderIcon = document.querySelector(".light-calender-icon");
    let darkCalenderIcon = document.querySelector(".dark-calender-icon");

    let dbDarkModeText = document.querySelector(".db-dark-mode-text");
    let dbLightModeText = document.querySelector(".db-light-mode-text");

    let currentColor = localStorage.getItem("color");

    console.log(currentColor);
    if (e.target.classList.contains("db-close-mobile-menu-icon")) {
      dbMobileMenu.style.display = "none";
    }

    if (e.target.closest(".db-dashboard-menu-div")) {
      window.location.href = "/dashboard";
    }
    if (e.target.closest(".db-add-expense-div")) {
      window.location.href = "/add_expense";
    }

    if (e.target.closest(".db-hamburger-logout-container")) {
      window.location.href = "/logout";
    }

    if (e.target.closest(".db-mobile-light-dark-toggle-div")) {
      if (currentColor === "dark") {
        console.log("if block triggered");
        let currentColor = localStorage.setItem("color", "light");
        htmlColor.classList.remove("dark");
        htmlColor.classList.add("light");

        dbMobileMenu.style.backgroundColor = "#ffffff";

        darkCalenderIcon.style.display = "none";
        lightCalenderIcon.style.display = "flex";

        dbLightSpan.style.display = "none";
        dbDarkSpan.style.display = "flex";

        dbDarkModeText.style.display = "flex";
        dbLightModeText.style.display = "none";

        let colorCheck = localStorage.getItem("color");

        let isLight = colorCheck === "light";
        console.log(isLight);

        document.querySelectorAll(".light-icon").forEach((icon) => {
          icon.style.display = isLight ? "flex" : "none";
        });

        document.querySelectorAll(".dark-icon").forEach((icon) => {
          icon.style.display = isLight ? "none" : "flex";
        });
      } else {
        console.log("else block triggered");
        let currentColor = localStorage.setItem("color", "dark");
        htmlColor.classList.remove("light");
        htmlColor.classList.add("dark");

        dbMobileMenu.style.backgroundColor = "#000000";

        darkCalenderIcon.style.display = "flex";
        lightCalenderIcon.style.display = "none";

        dbLightSpan.style.display = "flex";
        dbDarkSpan.style.display = "none";

        dbDarkModeText.style.display = "none";
        dbLightModeText.style.display = "flex";

        let colorCheck = localStorage.getItem("color");

        let isDark = colorCheck === "dark";

        document.querySelectorAll(".dark-icon").forEach((icon) => {
          icon.style.display = isDark ? "flex" : "none";
        });

        document.querySelectorAll(".light-icon").forEach((icon) => {
          icon.style.display = isDark ? "none" : "flex";
        });
      }
    }
  });
}

let dbHamburgerExpenseTrackerContainer = document.getElementById(
  "db-hamburger-expense-tracker-container",
);

if (dbHamburgerExpenseTrackerContainer) {
  dbHamburgerExpenseTrackerContainer.addEventListener("click", (e) => {
    let dbHamburgerButton = e.target.closest(".hamburger-icon");
    let dbLightSpan = document.querySelector(".light-mode");
    let dbDarkSpan = document.querySelector(".dark-mode");

    let dbDarkModeText = document.querySelector(".db-dark-mode-text");
    let dbLightModeText = document.querySelector(".db-light-mode-text");

    if (dbHamburgerButton) {
      let currentColor = localStorage.getItem("color");

      let dbMobileMenu = document.getElementById("db-mobile-menu");
      dbMobileMenu.style.display = "block";

      if (currentColor === "dark") {
        dbLightSpan.style.display = "flex";
        dbDarkSpan.style.display = "none";

        dbDarkModeText.style.display = "none";
        dbLightModeText.style.display = "flex";
      } else {
        dbLightSpan.style.display = "none";
        dbDarkSpan.style.display = "flex";

        dbDarkModeText.style.display = "flex";
        dbLightModeText.style.display = "none";
      }
    }
  });
}
/*
let dbNavContainer = document.getElementById("db-nav-container");
if (dbNavContainer) {
  dbNavContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("light-mode")) {
      let currentColor = localStorage.setItem("color", "light");

      let html = document.querySelector("html");
      html.classList.remove("dark");
      html.classList.add("light");

      let dbLightSpan = document.querySelector(".light-mode");
      let dbDarkSpan = document.querySelector(".dark-mode");
      dbDarkSpan.style.display = "flex";
      dbLightSpan.style.display = "none";

      let lightCalenderIcon = document.querySelector(".light-calender-icon");
      let darkCalenderIcon = document.querySelector(".dark-calender-icon");
      lightCalenderIcon.style.display = "block";
      darkCalenderIcon.style.display = "none";

      let darkMoneyIcon = document.querySelector(".dark-money-out-image");
      let lightMoneyIcon = document.querySelector(".light-money-out-image");
      darkMoneyIcon.style.display = "none";
      lightMoneyIcon.style.display = "flex";

      let darkCatIcon = document.querySelector(".dark-cat-icon");
      let lightCatIcon = document.querySelector(".light-cat-icon");
      darkCatIcon.style.display = "none";
      lightCatIcon.style.display = "flex";

      let darkReceiptIcon = document.querySelector(".dark-receipt-icon");
      let lightReceiptIcon = document.querySelector(".light-receipt-icon");
      darkReceiptIcon.style.display = "none";
      lightReceiptIcon.style.display = "flex";
    }
    if (e.target.classList.contains("dark-mode")) {
      let currentColor = localStorage.setItem("color", "dark");
      let html = document.querySelector("html");
      html.classList.remove("light");
      html.classList.add("dark");
      let dbLightSpan = document.querySelector(".light-mode");
      let dbDarkSpan = document.querySelector(".dark-mode");
      dbDarkSpan.style.display = "none";
      dbLightSpan.style.display = "flex";

      let lightCalenderIcon = document.querySelector(".light-calender-icon");
      let darkCalenderIcon = document.querySelector(".dark-calender-icon");
      lightCalenderIcon.style.display = "none";
      darkCalenderIcon.style.display = "block";

      let darkMoneyIcon = document.querySelector(".dark-money-out-image");
      let lightMoneyIcon = document.querySelector(".light-money-out-image");
      darkMoneyIcon.style.display = "flex";
      lightMoneyIcon.style.display = "none";

      let darkCatIcon = document.querySelector(".dark-cat-icon");
      let lightCatIcon = document.querySelector(".light-cat-icon");
      darkCatIcon.style.display = "flex";
      lightCatIcon.style.display = "none";

      let darkReceiptIcon = document.querySelector(".dark-receipt-icon");
      let lightReceiptIcon = document.querySelector(".light-receipt-icon");
      darkReceiptIcon.style.display = "flex";
      lightReceiptIcon.style.display = "none";
    }
    let homeButton = e.target.closest(".db-dashboard-span");
    if (homeButton) {
      window.location.href = "/dashboard";
    }
    let addExpenseButton = e.target.closest(".db-add-expense-span");
    if (addExpenseButton) {
      window.location.href = "/add_expense/";
    }
  });
}
*/
let aeHamburgerExpenseTrackerContainer = document.getElementById(
  "ae-hamburger-expense-tracker-container",
);

let aeHamburgerIcon = document.querySelector(".ae-hamburger-icon");

if (aeHamburgerExpenseTrackerContainer) {
  let aeMobileMenu = document.getElementById("ae-mobile-menu");

  aeHamburgerExpenseTrackerContainer.addEventListener("click", (e) => {
    let aeDarkModeSpan = document.querySelector(".dark-mode");
    let aeDarkModeText = document.querySelector(".ae-dark-mode-text");

    let aeLightModeSpan = document.querySelector(".light-mode");
    let aeLightModeText = document.querySelector(".ae-light-mode-text");

    if (e.target.closest(".ae-hamburger-icon")) {
      aeMobileMenu.style.display = "block";
      let currentColor = localStorage.getItem("color");

      if (currentColor === "dark") {
        aeDarkModeSpan.style.display = "none";
        aeDarkModeText.style.display = "none";

        aeLightModeSpan.style.display = "flex";
        aeLightModeText.style.display = "flex";
      } else {
        aeDarkModeSpan.style.display = "flex";
        aeDarkModeText.style.display = "flex";

        aeLightModeSpan.style.display = "none";
        aeLightModeText.style.display = "none";
      }
    }

    if (e.target.closest(".ae-hamburger-cancel-icon")) {
      aeMobileMenu.style.display = "none";
    }

    if (e.target.closest(".ae-mobile-light-dark-toggle-div")) {
      let currentColor = localStorage.getItem("color");
      if (currentColor === "dark") {
        let currentColor = localStorage.setItem("color", "light");
        htmlColor.classList.remove("dark");
        htmlColor.classList.add("light");

        aeDarkModeSpan.style.display = "flex";
        aeDarkModeText.style.display = "flex";

        aeLightModeSpan.style.display = "none";
        aeLightModeText.style.display = "none";
      } else {
        let currentColor = localStorage.setItem("color", "dark");
        htmlColor.classList.remove("light");
        htmlColor.classList.add("dark");

        aeDarkModeSpan.style.display = "none";
        aeDarkModeText.style.display = "none";

        aeLightModeSpan.style.display = "flex";
        aeLightModeText.style.display = "flex";
      }
    }

    if (e.target.closest(".ae-dashboard-menu-div")) {
      window.location.href = "/dashboard";
    }

    if (e.target.closest(".ae-add-expense-div")) {
      window.location.href = "/add_expense";
    }

    if (e.target.closest(".ae-hamburger-logout-container")) {
      window.location.href = "/logout";
    }
    if (e.target.closest(".ae-search-expense-div")) {
      window.location.href = "/search_expense";
    }
  });
}

let flHamburgerExpenseTrackerContainer = document.getElementById(
  "fl-hamburger-expense-tracker-container",
);
if (flHamburgerExpenseTrackerContainer) {
  flHamburgerExpenseTrackerContainer.addEventListener("click", (e) => {
    let currentColor = localStorage.getItem("color", "none");

    let flHamburgerButton = e.target.closest(".hamburger-icon");
    if (flHamburgerButton) {
      let lightSpan = document.querySelector(".light-mode");
      let darkSpan = document.querySelector(".dark-mode");
      let flMobileColorDiv = document.querySelector(
        ".fl-mobile-light-dark-toggle-div",
      );
      let currentColor = localStorage.getItem("color", "none");
      if (currentColor === "dark") {
        let lightSpan = document.querySelector(".light-mode");
        let darkSpan = document.querySelector(".dark-mode");
        lightSpan.style.display = "flex";
        darkSpan.style.display = "none";
        flMobileColorDiv.classList.add("dark-mode-on");
        flMobileColorDiv.classList.remove("light-mode-on");
        let lightText = document.querySelector(".fl-light-mode-text");
        lightText.style.display = "flex";
        let darkText = document.querySelector(".fl-dark-mode-text");
        darkText.style.display = "none";
      }

      if (currentColor === "light") {
        let lightSpan = document.querySelector(".light-mode");
        let darkSpan = document.querySelector(".dark-mode");
        lightSpan.style.display = "none";
        darkSpan.style.display = "flex";
        flMobileColorDiv.classList.add("light-mode-on");
        flMobileColorDiv.classList.remove("dark-mode-on");
        let lightText = document.querySelector(".fl-light-mode-text");
        lightText.style.display = "none";
        let darkText = document.querySelector(".fl-dark-mode-text");
        darkText.style.display = "flex";
      }

      let flMobileMenu = document.getElementById("fl-mobile-menu");
      flMobileMenu.style.display = "block";
    }
  });
}

let flCancelIconContainer = document.getElementById(
  "fl-hamburger-cancel-icon-container",
);
if (flCancelIconContainer) {
  flCancelIconContainer.addEventListener("click", (e) => {
    let flCancelButton = e.target.closest(".fl-close-mobile-menu-icon");
    if (flCancelButton) {
      let flMobileMenu = document.getElementById("fl-mobile-menu");
      flMobileMenu.style.display = "none";
    }
  });
}

/*
let flMobileMenu = document.getElementById("fl-mobile-menu");
if (flMobileMenu) {
  let currentColor = localStorage.getItem("color");
  if (currentColor === "light") {
    let lightSpan = document.querySelector(".light-mode");
    lightSpan.style.display = "none";
    let lightText = document.querySelector(".fl-light-mode-text");
    lightText.style.display = "none";

    let flMobileColorDiv = document.querySelector(
      ".fl-mobile-light-dark-toggle-div",
    );
    flMobileColorDiv.classList.add("light-mode-on");
    flMobileColorDiv.classList.remove("dark-mode-on");

    let darkSpan = document.querySelector(".dark-mode");
    darkSpan.style.display = "flex";
    let darkText = document.querySelector(".fl-dark-mode-text");
    darkText.style.display = "flex";
  }
  if (currentColor === "dark") {
    let lightSpan = document.querySelector(".light-mode");
    lightSpan.style.display = "flex";
    let lightText = document.querySelector(".fl-light-mode-text");
    lightText.style.display = "flex";

    let darkSpan = document.querySelector(".dark-mode");
    darkSpan.style.display = "none";
    let darkText = document.querySelector(".fl-dark-mode-text");
    darkText.style.display = "none";

    let flMobileColorDiv = document.querySelector(
      ".fl-mobile-light-dark-toggle-div",
    );
    flMobileColorDiv.classList.add("dark-mode-on");
    flMobileColorDiv.classList.remove("light-mode-on");
  }
}
  */

let hamburgerIcon = document.querySelector(".hamburger-icon");
if (hamburgerIcon) {
  if (window.outerWidth < 801) {
    hamburgerIcon.style.display = "block";
  }
}

let flMobileMenu = document.getElementById("fl-mobile-menu");
if (flMobileMenu) {
  flMobileMenu.addEventListener("click", (e) => {
    console.log("line 2449 triggered");
    let flHomeButton = e.target.closest(".fl-dashboard-menu-div");
    if (flHomeButton) {
      console.log(flHomeButton);
      window.location.href = "/dashboard";
    }

    let flAddExpenseButton = e.target.closest(".fl-add-expense-div");
    if (flAddExpenseButton) {
      window.location.href = "/add_expense";
    }

    let lightSpan = document.querySelector(".light-mode");
    let lightText = document.querySelector(".fl-light-mode-text");
    let darkSpan = document.querySelector(".dark-mode");
    let darkText = document.querySelector(".fl-dark-mode-text");
    let lightCalenderIcon = document.querySelector(".light-calender-icon");
    let darkCalenderIcon = document.querySelector(".dark-calender-icon");

    let lightSpanDisplay = getComputedStyle(lightSpan).display;

    if (e.target.closest(".fl-mobile-light-dark-toggle-div")) {
      console.log("line 2469");
      let currentColor = localStorage.getItem("color");

      if (currentColor === "dark") {
        let lightCalenderIcon = document.querySelector(".light-calender-icon");
        let darkCalenderIcon = document.querySelector(".dark-calender-icon");
        console.log("line 2473 Dark color");
        let html = document.querySelector("html");
        html.classList.remove("dark");
        html.classList.add("light");

        darkSpan.style.display = "flex";
        darkText.style.display = "flex";
        darkCalenderIcon.style.display = "none";

        lightSpan.style.display = "none";
        lightText.style.display = "none";
        lightCalenderIcon.style.display = "flex";

        let currentColor = localStorage.setItem("color", "light");
      } else {
        let lightCalenderIcon = document.querySelector(".light-calender-icon");
        let darkCalenderIcon = document.querySelector(".dark-calender-icon");
        let html = document.querySelector("html");
        html.classList.remove("light");
        html.classList.add("dark");

        darkSpan.style.display = "none";
        darkText.style.display = "none";
        darkCalenderIcon.style.display = "flex";

        lightSpan.style.display = "flex";
        lightText.style.display = "flex";
        lightCalenderIcon.style.display = "none";

        let currentColor = localStorage.setItem("color", "dark");
      }
    }

    /*
    if (e.target.classList.contains("fl-mobile-light-dark-toggle-div")) {
      console.log("line 2486");
      if (currentColor === "light") {
        let html = document.querySelector("html");
        html.classList.remove("light");
        html.classList.add("dark");

        darkSpan.style.display = "none";
        darkText.style.display = "none";

        lightSpan.style.display = "flex";
        lightText.style.display = "flex";
      }
    }
    */
  });
}
/*
if (flMobileMenu) {
  console.log("fl mobile here");
  let flMobileColorDiv = document.querySelector(
    ".fl-mobile-light-dark-toggle-div",
  );
  flMobileColorDiv.addEventListener("click", (e) => {
    console.log("clicked");
    if (e.target.classList.contains("dark-mode-on")) {
      console.log("div has dark mode class");
      let currentColor = localStorage.setItem("color", "light");
      let lightCalenderIcon = document.querySelector(".light-calender-icon");
      lightCalenderIcon.style.display = "flex";
      let darkCalenderIcon = document.querySelector(".dark-calender-icon");
      darkCalenderIcon.style.display = "none";

      let lightSpan = document.querySelector(".light-mode");
      lightSpan.style.display = "none";
      let lightText = document.querySelector(".fl-light-mode-text");
      lightText.style.display = "none";
      let darkSpan = document.querySelector(".dark-mode");
      darkSpan.style.display = "flex";
      let darkText = document.querySelector(".fl-dark-mode-text");
      darkText.style.display = "flex";

      let flMobileColorDiv = document.querySelector(
        ".fl-mobile-light-dark-toggle-div",
      );
      flMobileColorDiv.classList.remove("dark-mode-on");
      flMobileColorDiv.classList.add("light-mode-on");

      let html = document.querySelector("html");
      html.classList.remove("dark");
      html.classList.add("light");
    }
    if (e.target.classList.contains("light-mode-on")) {
      console.log("div has light mode class");
      let currentColor = localStorage.setItem("color", "dark");
      let lightCalenderIcon = document.querySelector(".light-calender-icon");
      lightCalenderIcon.style.display = "none";
      let darkCalenderIcon = document.querySelector(".dark-calender-icon");
      darkCalenderIcon.style.display = "flex";

      let lightSpan = document.querySelector(".light-mode");
      lightSpan.style.display = "flex";
      let lightText = document.querySelector(".fl-light-mode-text");
      lightText.style.display = "flex";
      let darkSpan = document.querySelector(".dark-mode");
      darkSpan.style.display = "none";
      let darkText = document.querySelector(".fl-dark-mode-text");
      darkText.style.display = "none";

      let flMobileColorDiv = document.querySelector(
        ".fl-mobile-light-dark-toggle-div",
      );
      flMobileColorDiv.classList.remove("light-mode-on");
      flMobileColorDiv.classList.add("dark-mode-on");

      let html = document.querySelector("html");
      html.classList.remove("light");
      html.classList.add("dark");
    }
  });
}

*/
/*
 if (e.target.classList.contains("light-mode-on")) {
      console.log("dark mode activated");
      let currentColor = localStorage.setItem("color", "dark");
      let lightCalenderIcon = document.querySelector(".light-calender-icon");
      lightCalenderIcon.style.display = "none";
      let darkCalenderIcon = document.querySelector(".dark-calender-icon");
      darkCalenderIcon.style.display = "flex";

      let lightSpan = document.querySelector(".light-mode");
      lightSpan.style.display = "flex";
      let lightText = document.querySelector(".fl-light-mode-text");
      lightText.style.display = "flex";
      let darkSpan = document.querySelector(".dark-mode");
      darkSpan.style.display = "none";
      let darkText = document.querySelector(".fl-dark-mode-text");
      darkText.style.display = "none";

      let flMobileColorDiv = document.querySelector(
        ".fl-mobile-light-dark-toggle-div",
      );
      flMobileColorDiv.classList.remove("light-mode-on");
      flMobileColorDiv.classList.add("dark-mode-on");

      let html = document.querySelector("html");
      html.classList.remove("light");
      html.classList.add("dark");
     
    }
*/

window.addEventListener("DOMContentLoaded", (e) => {
  let currentColor = localStorage.getItem("color");
  let lightCalenderIcon = document.querySelector(".light-calender-icon");
  let darkCalenderIcon = document.querySelector(".dark-calender-icon");

  if (currentColor === "light") {
    let lightCalenderIcon = document.querySelector(".light-calender-icon");
    let darkCalenderIcon = document.querySelector(".dark-calender-icon");
    if (lightCalenderIcon) {
      lightCalenderIcon.style.display = "block";
    }
    if (darkCalenderIcon) {
      darkCalenderIcon.style.display = "none";
    }
  }
  if (currentColor === "dark") {
    let lightCalenderIcon = document.querySelector(".light-calender-icon");
    let darkCalenderIcon = document.querySelector(".dark-calender-icon");
    if (lightCalenderIcon) {
      lightCalenderIcon.style.display = "none";
    }
    if (darkCalenderIcon) {
      darkCalenderIcon.style.display = "flex";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  let currentColor = localStorage.getItem("color");
  if (window.outerWidth <= 970 && currentColor === "dark") {
    let hamburgerIcon = document.querySelector(".hamburger-icon");
    hamburgerIcon.style.display = "block";

    let lightSpan = document.querySelector(".light-mode");
    if (lightSpan) {
      lightSpan.style.display = "flex";
    }

    let darkSpan = document.querySelector(".dark-mode");
    if (darkSpan) {
      darkSpan.style.display = "none";
    }
  }
  if (window.outerWidth <= 970 && currentColor === "light") {
    let hamburgerIcon = document.querySelector(".hamburger-icon");
    hamburgerIcon.style.display = "block";

    let lightSpan = document.querySelector(".light-mode");
    if (lightSpan) {
      lightSpan.style.display = "none";
    }

    let darkSpan = document.querySelector(".dark-mode");
    if (darkSpan) {
      darkSpan.style.display = "flex";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  let currentColor = localStorage.getItem("color");
  const isDark = currentColor === "dark";

  document.querySelectorAll(".dark-icon").forEach((icon) => {
    icon.style.display = isDark ? "flex" : "none";
  });

  document.querySelectorAll(".light-icon").forEach((icon) => {
    icon.style.display = isDark ? "none" : "flex";
  });
});

let sideBarBottomContent = document.querySelector(".bottom-content");

if (sideBarBottomContent) {
  sideBarBottomContent.addEventListener("click", (e) => {
    if (e.target.classList.contains("switch")) {
      let currentColor = localStorage.getItem("color");
      const isDark = currentColor === "dark";

      document.querySelectorAll(".dark-icon").forEach((icon) => {
        icon.style.display = isDark ? "flex" : "none";
      });
      document.querySelectorAll(".light-icon").forEach((icon) => {
        icon.style.display = isDark ? "none" : "flex";
      });
    }
  });
}

window.addEventListener("DOMContentLoaded", (e) => {
  let arrayOfHamburgerIcons = document.querySelectorAll(".hamburger-icon");

  arrayOfHamburgerIcons.forEach((icon) => {
    if (window.outerWidth <= 970) {
      if (icon) {
        icon.style.display = "block";
      }
    }
  });

  if (window.outerWidth >= 971) {
    let arrayOfHamburgerIcons = document.querySelectorAll(".hamburger-icon");

    arrayOfHamburgerIcons.forEach((icon) => {
      if (icon) {
        icon.style.display = "none";
      }
    });
  }
});
const searchExpenseMainContainer = document.querySelector(
  ".search-expense-main",
);

if (searchExpenseMainContainer) {
  turnOffSearchButton();
  let offset = 0;
  searchExpenseMainContainer.addEventListener("click", async (e) => {
    let searchExpenseInput = document.getElementById("search-expense-input");
    let searchExpenseButton = document.querySelector(".search-expense-button");
    let searchResultsButtonContainer = document.querySelector(
      ".searched-results-button-container",
    );
    let totalResultsContainer = document.querySelector(
      ".total-results-container",
    );

    let searchResultsContainer = document.querySelector(
      ".searched-expense-results-container",
    );

    let fromInput = document.getElementById("search_from_input");
    if (e.target.id === "search_from_input") {
      let fromCalender = flatpickr(fromInput, {
        dateFormat: "m-d-Y",
        disableMobile: true,
      });
      fromCalender.open();
    }
    if (e.target.id === "search_to_input") {
      let toInput = document.querySelector(".se-to-input");
      let toInputCalender = flatpickr(toInput, {
        disableMobile: true,
        dateFormat: "m-d-Y",
      });
      toInputCalender.open();
    }
    if (e.target.classList.contains("search-expense-button")) {
      searchResultsContainer.innerHTML = "";
      let previousButton = document.querySelector(".previous");
      if (offset == 0) {
        previousButton.style.display = "none";
        searchResultsButtonContainer.style.justifyContent = "center";
      }
      searchResultsButtonContainer.style.display = "flex";

      searchResultsContainer.style.display = "flex";

      totalResultsContainer.style.display = "flex";

      let searchExpenseButton = e.target;

      let userSearch = searchExpenseInput.value.trim();
      if (userSearch === "") {
        alert("Please enter an expense name to search.");
      } else {
        try {
          let offset = 0;

          let response = await fetch(
            `/search_expense?userSearch=${encodeURIComponent(userSearch)}&offset=${encodeURIComponent(offset)}`,
          );
          if (response.ok === true) {
            let data = await response.json();

            /*
            console.log(data[0].expense_name);
            let names =
             data[0].expense_name;
            */

            /*
            let convertedToString = JSON.stringify(data);
            */

            let totalAmount = data[0].total_results_amount;
            let runningCount = data[0].running_count;

            for (let result of data) {
              let expenseName = result.expense_name;
              let expenseCost = result.expense_cost;
              let expenseDate = result.expense_date;
              let expenseCategory = result.expense_category;
              let expenseId = result.expense_id;

              showResult(
                expenseName,
                expenseCost,
                expenseDate,
                expenseCategory,
                expenseId,
              );
            }
            showResultsTotal(totalAmount);
            buttonsOff(offset, totalAmount, runningCount);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    if (e.target.classList.contains("clear-button")) {
      let offset = 0;
      searchExpenseInput.value = "";
      searchExpenseInput.focus();
      window.location.reload();

      searchExpenseButton.disabled = true;

      searchResultsButtonContainer.style.display = "none";
      totalResultsContainer.style.display = "none";
      searchResultsContainer.style.display = "none";
    }

    if (e.target.closest(".next")) {
      let previousButton = document.querySelector(".previous");
      searchResultsContainer.innerHTML = "";
      let userSearchElement = document.getElementById("search-expense-input");
      let userSearch = userSearchElement.value.trim();

      try {
        offset += 10;

        console.log(offset);

        let response = await fetch(
          `/search_expense?userSearch=${encodeURIComponent(userSearch)}&offset=${encodeURIComponent(offset)}`,
        );
        let data = await response.json();

        runningCount = data[0].running_count;
        totalAmountResult = data[0].total_amount_results;

        let noob = data[0].expense_id;

        for (result of data) {
          let expenseName = result.expense_name;
          let expenseCost = result.expense_cost;
          let expenseDate = result.expense_date;
          let expenseCategory = result.expense_category;
          let expenseId = result.expense_id;
          showResult(
            expenseName,
            expenseCost,
            expenseDate,
            expenseCategory,
            expenseId,
          );
        }

        buttonsOff(offset, totalAmountResult, runningCount);
      } catch (e) {
        console.log(e);
      }
    }
    if (e.target.closest(".previous")) {
      offset -= 10;

      let previousButton = document.querySelector(".previous");
      let nextButton = document.querySelector(".next");
      searchResultsContainer.innerHTML = "";
      let userSearchElement = document.getElementById("search-expense-input");
      let userSearch = userSearchElement.value.trim();
      console.log(`previous clicked this is the offset ${offset}`);

      try {
        let response = await fetch(
          `/search_expense?userSearch=${encodeURIComponent(userSearch)}&offset=${encodeURIComponent(offset)}`,
        );
        let data = await response.json();

        runningCount = data[0].running_count;
        totalAmountResult = data[0].total_amount_results;

        for (result of data) {
          let expenseName = result.expense_name;
          let expenseCost = result.expense_cost;
          let expenseDate = result.expense_date;
          let expenseCategory = result.expense_category;
          let expenseId = result.expense_id;

          showResult(
            expenseName,
            expenseCost,
            expenseDate,
            expenseCategory,
            expenseId,
          );
        }

        buttonsOff(offset, totalAmountResult, runningCount);
      } catch (e) {
        console.log(e);
      }
    }
    if (e.target.closest(".expense-div")) {
      let outerDiv = e.target.closest(".expense-div");

      let expenseId = outerDiv.dataset.expenseId;
      let expenseCategory = outerDiv.dataset.expenseCategory;
      let expenseName = outerDiv.dataset.expenseName;
      let expenseCost = outerDiv.dataset.expenseCost;
      let expenseDate = outerDiv.dataset.expenseDate;

      showExpenseDetails(
        expenseId,
        expenseCategory,
        expenseName,
        expenseCost,
        expenseDate,
      );
    }
  });
}

let expenseResultsContainer = document.querySelector(
  ".searched-expense-results-container",
);

if (expenseResultsContainer) {
  expenseResultsContainer.addEventListener("click", (e) => {
    if (e.target.closest(".arrow-back-text")) {
      let expenseId = e.target.dataset.expenseId;

      let expenseDetailsDiv = document.getElementById(
        `expense-details-parent-div-${expenseId}`,
      );

      expenseDetailsDiv.remove();
    }

    if (e.target.closest(".as-delete-button")) {
      let deleteButton = e.target.closest(".as-delete-button");
      let expenseId = deleteButton.dataset.expenseId;
      let expenseName = deleteButton.dataset.expenseName;

      /*
      advancedDeleteExpense(expenseId);
      */

      expenseDeleteConfirmation(expenseId, expenseName);
      let currentDeleteButton = document.getElementById(
        `as-delete-button-${expenseId}`,
      );
      let currentEditButton = document.getElementById(
        `as-edit-button-${expenseId}`,
      );
      currentDeleteButton.disabled = true;
      currentEditButton.disabled = true;
    }
  });
}

function showExpenseDetails(eId, eCat, eName, eCost, eDate) {
  let resultsContainer = document.querySelector(
    ".searched-expense-results-container",
  );
  let mainDetailsContainer = document.createElement("div");

  mainDetailsContainer.setAttribute("class", "expense-details-parent-div");
  mainDetailsContainer.setAttribute("id", `expense-details-parent-div-${eId}`);

  let arrowBackCloseButtonContainer = document.createElement("div");
  arrowBackCloseButtonContainer.setAttribute(
    "class",
    "arrow-back-close-container",
  );
  arrowBackCloseButtonContainer.style.width = "95%";
  arrowBackCloseButtonContainer.style.margin = "0 auto";
  arrowBackCloseButtonContainer.style.marginTop = "10px";

  let backIcon = document.createElement("span");
  backIcon.setAttribute("class", "back-icon");
  backIcon.dataset.expenseId = eId;

  backIcon.innerHTML = `
  <svg
    data-expense-id = "${eId}"
    class="arrow-back-text"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6d28d9"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
    data-expense-id = "${eId}"
    class="arrow-back-text"
    d="m12 19-7-7 7-7"/>
    <path 
     data-expense-id = "${eId}"
    class="arrow-back-text"
    d="M19 12H5"/>
  </svg>
`;

  let backText = document.createElement("span");
  backText.setAttribute("class", "arrow-back-text");
  backText.dataset.expenseId = eId;

  backText.append(backIcon, "Back");

  arrowBackCloseButtonContainer.append(backText);

  let expenseId = document.createElement("p");
  expenseId.style.color = "#ffffff";
  expenseId.textContent = eId;

  let transactionDetailsTextContainer = document.createElement("div");
  transactionDetailsTextContainer.setAttribute("class", "trans-text-container");

  let transactionDetailsText = document.createElement("span");
  transactionDetailsText.setAttribute("class", "trans-text");
  transactionDetailsText.textContent = "Transaction Details";

  transactionDetailsTextContainer.append(transactionDetailsText);

  let childContainer = document.createElement("div");
  childContainer.classList.add("expense-child-container");

  let expenseNameIconTagContainer = document.createElement("div");
  expenseNameIconTagContainer.classList.add("expense-name-icon-tag-container");

  let groIcon = document.createElement("img");
  groIcon.src = "static/images/mobile-icons/gro-icon.png";
  groIcon.style.height = "100px";

  let monthBillIcon = document.createElement("img");
  monthBillIcon.src = "static/images/mobile-icons/month-bill.png";
  monthBillIcon.style.height = "100px";

  let essentialIcon = document.createElement("img");
  essentialIcon.src = "static/images/mobile-icons/non-essentials-icon.png";
  essentialIcon.style.height = "100px";

  let otherIcon = document.createElement("img");
  otherIcon.src = "static/images/mobile-icons/other-icon.png";
  otherIcon.style.height = "100px";

  let rentIcon = document.createElement("img");
  rentIcon.src = "static/images/mobile-icons/rent-icon.png";
  rentIcon.style.height = "100px";

  let entIcon = document.createElement("img");
  entIcon.src = "static/images/mobile-icons/ent-icon.png";
  entIcon.style.height = "100px";

  if (eCat === "groceries") {
    let icon = groIcon;
    expenseNameIconTagContainer.append(icon);
  }

  if (eCat === "rent") {
    let icon = rentIcon;
    expenseNameIconTagContainer.append(icon);
  }

  if (eCat === "non-essentials") {
    let icon = essentialIcon;
    expenseNameIconTagContainer.append(icon);
  }

  if (eCat === "monthly") {
    let icon = monthBillIcon;
    expenseNameIconTagContainer.append(icon);
  }

  if (eCat === "other") {
    let icon = otherIcon;
    expenseNameIconTagContainer.append(icon);
  }
  if (eCat === "entertainment") {
    let icon = entIcon;
    expenseNameIconTagContainer.append(icon);
  }

  let expenseName = document.createElement("p");
  expenseName.classList.add("expense-name-details");
  expenseName.setAttribute("id", `expense-name-details-${eId}`);
  expenseName.textContent = eName;

  expenseNameIconTagContainer.append(expenseName);

  let eTagIcon = document.createElement("img");
  eTagIcon.src =
    "static/images/mobile-icons/entertainment_tag_badge_tight_crop.png";

  let gTagIcon = document.createElement("img");
  gTagIcon.src =
    "static/images/mobile-icons/groceries_tag_badge_1159x264_preserved.png";

  let mTagIcon = document.createElement("img");
  mTagIcon.src = "static/images/mobile-icons/monthly_bills_badge_1159x264.png";

  let nTagIcon = document.createElement("img");
  nTagIcon.src =
    "static/images/mobile-icons/non_essentials_taller_1159x290.png";

  let oTagIcon = document.createElement("img");
  oTagIcon.src = "static/images/mobile-icons/other_badge_1159x310.png";

  let rTagIcon = document.createElement("img");
  rTagIcon.src = "static/images/mobile-icons/rent_badge_1159x330.png";

  if (eCat === "groceries") {
    let icon = gTagIcon;
    icon.style.height = "35px";
    expenseNameIconTagContainer.append(icon);
  }

  if (eCat === "rent") {
    let icon = rTagIcon;
    icon.style.height = "35px";
    expenseNameIconTagContainer.append(icon);
  }

  if (eCat === "non-essentials") {
    let icon = nTagIcon;
    icon.style.height = "35px";
    expenseNameIconTagContainer.append(icon);
  }

  if (eCat === "monthly") {
    let icon = mTagIcon;
    icon.style.height = "35px";
    expenseNameIconTagContainer.append(icon);
  }

  if (eCat === "other") {
    let icon = oTagIcon;
    icon.style.height = "35px";
    expenseNameIconTagContainer.append(icon);
  }
  if (eCat === "entertainment") {
    let icon = eTagIcon;
    icon.style.height = "35px";
    expenseNameIconTagContainer.append(icon);
  }

  let amountContainer = document.createElement("div");
  amountContainer.classList.add("amount-container");

  let amountIcon = document.createElement("p");
  amountIcon.innerHTML = `<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="35" height="35" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="#6d28d9" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round" 
  class="lucide lucide-circle-dollar-sign preview-icon"><circle 
  cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>`;

  let amountValueText = document.createElement("p");
  amountValueText.classList.add("amount-value-text");

  let amountLabel = document.createElement("span");
  amountLabel.classList.add("amount-span");
  amountLabel.textContent = "Amount";

  amountValueText.append(amountLabel);
  amountValueText.append(`$${eCost}`);

  amountContainer.append(amountIcon, amountValueText);

  let dateContainer = document.createElement("div");
  dateContainer.classList.add("date-container");

  let calenderIcon = document.createElement("span");
  calenderIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" 
  width="35" height="35" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="#6d28d9" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round" 
  class="lucide lucide-calendar-days preview-icon">
  <path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" 
  width="18" height="18" rx="2"/><path d="M3 9h18"/>
  <path d="M8 13h.01"/><path d="M12 13h.01"/>
  <path d="M16 13h.01"/><path d="M8 17h.01"/>
  <path d="M12 17h.01"/><path d="M16 17h.01"/></svg>`;

  let dateText = document.createElement("p");
  dateText.classList.add("date-value-text");

  let dateLabel = document.createElement("span");
  dateLabel.classList.add("date-span");
  dateLabel.textContent = "Date";

  dateText.append(dateLabel, eDate);

  dateContainer.append(calenderIcon, dateText);

  let categoryContainer = document.createElement("div");
  categoryContainer.classList.add("category-container");

  let categoryIcon = document.createElement("span");
  categoryIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" 
  width="35" height="35" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="#6d28d9" 
  stroke-width="2" 
  stroke-linecap="round"
  stroke-linejoin="round" 
  class="lucide lucide-tag preview-icon">
  <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>
  <circle cx="7.5" cy="7.5" r=".5" 
  fill="currentColor"/></svg>`;

  let categorySpan = document.createElement("span");
  categorySpan.classList.add("category-span");
  categorySpan.textContent = "Category";

  let categoryTextValue = document.createElement("p");
  categoryTextValue.classList.add("category-value-text");

  categoryTextValue.append(categorySpan, eCat);

  categoryContainer.append(categoryIcon, categoryTextValue);

  childContainer.append(
    expenseNameIconTagContainer,
    amountContainer,
    dateContainer,
    categoryContainer,
  );

  let editDeleteButtonContainer = document.createElement("div");
  editDeleteButtonContainer.classList.add("edit-delete-button-container");
  editDeleteButtonContainer.setAttribute(
    "id",
    `edit-delete-button-container-${eId}`,
  );

  let editButton = document.createElement("button");
  editButton.classList.add("as-edit-button");
  editButton.setAttribute("id", `as-edit-button-${eId}`);
  editButton.dataset.expenseId = eId;

  let asEditIcon = document.createElement("span");
  asEditIcon.classList.add("as-edit-span");
  asEditIcon.innerHTML = `<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="24" height="24"
   viewBox="0 0 24 24" fill="none"  stroke-width="2" stroke="#6d28d9"  
   stroke-linecap="round" 
   stroke-linejoin="round" 
   class="lucide lucide-square-pen preview-icon">
   <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
   <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
   </svg>`;

  editButton.append(asEditIcon, "Edit");

  let asDeleteButton = document.createElement("button");
  asDeleteButton.classList.add("as-delete-button");
  asDeleteButton.setAttribute("id", `as-delete-button-${eId}`);
  asDeleteButton.dataset.expenseId = eId;
  asDeleteButton.dataset.expenseName = eName;

  let asTrashIcon = document.createElement("span");
  asTrashIcon.classList.add("as-trash-span");
  asTrashIcon.innerHTML = `<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="24" height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="#ff2d55" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round" 
  class="lucide lucide-trash preview-icon">
  <path d="M10 11v6"/><path d="M14 11v6"/>
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
  <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>`;

  asDeleteButton.append(asTrashIcon, "Delete");

  editDeleteButtonContainer.append(editButton, asDeleteButton);

  mainDetailsContainer.append(
    arrowBackCloseButtonContainer,
    transactionDetailsTextContainer,
    childContainer,
    editDeleteButtonContainer,
  );

  resultsContainer.append(mainDetailsContainer);
}

function toggleSearchButton() {
  let searchExpenseButton = document.querySelector(".search-expense-button");
  let userInput = document.getElementById("search-expense-input");
  let userInputValue = userInput.value.trim();
  if (userInputValue === "") {
    searchExpenseButton.disabled = true;
  } else {
    searchExpenseButton.disabled = false;
  }
}

function turnOffSearchButton() {
  let searchExpenseButton = document.querySelector(".search-expense-button");
  searchExpenseButton.disabled = true;
}

function showResultsTotal(amount) {
  let searchedResultsAmount = document.querySelector(".amount-value");

  searchedResultsAmount.textContent = amount;
}

function showResult(eName, eCost, eDate, eCat, eId) {
  let resultsContainer = document.querySelector(
    ".searched-expense-results-container",
  );
  let newDiv = document.createElement("div");
  newDiv.style.backgroundColor = "#000000";
  newDiv.style.height = "140px";
  newDiv.style.width = "80%";
  newDiv.style.margin = "0 auto";
  newDiv.style.border = "solid 2px grey";
  newDiv.style.borderRadius = "10px";
  newDiv.style.display = "flex";
  newDiv.dataset.expenseId = eId;
  newDiv.dataset.expenseCost = eCost;
  newDiv.dataset.expenseName = eName;
  newDiv.dataset.expenseDate = eDate;
  newDiv.dataset.expenseCategory = eCat;
  newDiv.setAttribute("id", `new-div-${eId}`);
  newDiv.setAttribute("class", "expense-div");

  let iconContainer = document.createElement("div");
  iconContainer.style.display = "flex";
  iconContainer.style.alignItems = "center";
  iconContainer.style.justifyContent = "center";
  iconContainer.style.width = "15%";

  let groIcon = document.createElement("img");
  groIcon.src = "static/images/mobile-icons/gro-icon.png";
  groIcon.style.height = "75px";

  let monthBillIcon = document.createElement("img");
  monthBillIcon.src = "static/images/mobile-icons/month-bill.png";
  monthBillIcon.style.height = "75px";

  let essentialIcon = document.createElement("img");
  essentialIcon.src = "static/images/mobile-icons/non-essentials-icon.png";
  essentialIcon.style.height = "75px";

  let otherIcon = document.createElement("img");
  otherIcon.src = "static/images/mobile-icons/other-icon.png";
  otherIcon.style.height = "75px";

  let rentIcon = document.createElement("img");
  rentIcon.src = "static/images/mobile-icons/rent-icon.png";
  rentIcon.style.height = "75px";

  let entIcon = document.createElement("img");
  entIcon.src = "static/images/mobile-icons/ent-icon.png";
  entIcon.style.height = "75px";

  if (eCat === "groceries") {
    let icon = groIcon;
    iconContainer.append(icon);
  }

  if (eCat === "rent") {
    let icon = rentIcon;
    iconContainer.append(icon);
  }

  if (eCat === "non-essentials") {
    let icon = essentialIcon;
    iconContainer.append(icon);
  }

  if (eCat === "monthly") {
    let icon = monthBillIcon;
    iconContainer.append(icon);
  }

  if (eCat === "other") {
    let icon = otherIcon;
    iconContainer.append(icon);
  }
  if (eCat === "entertainment") {
    let icon = entIcon;
    iconContainer.append(icon);
  }

  /*
  icon.style.border = "solid 1px #6d28d9";
  icon.style.borderRadius = "5px";
  */

  newDiv.append(iconContainer);

  let flexColumnContainer = document.createElement("div");

  flexColumnContainer.style.width = "100%";
  flexColumnContainer.style.display = "flex";
  flexColumnContainer.style.flexDirection = "column";
  flexColumnContainer.style.justifyContent = "center";
  flexColumnContainer.style.gap = "15px";

  let nameCostContainer = document.createElement("div");
  nameCostContainer.style.backgroundColor = "black";
  nameCostContainer.style.width = "95%";
  nameCostContainer.style.display = "flex";
  nameCostContainer.style.justifyContent = "space-between";

  let mobileExpenseName = document.createElement("p");
  mobileExpenseName.textContent = eName;
  mobileExpenseName.style.color = "#ffffff";
  mobileExpenseName.style.fontFamily = `"Roboto", sans-serif;`;
  mobileExpenseName.style.fontSize = "22px";
  mobileExpenseName.style.margin = "0";

  let mobileExpenseCost = document.createElement("p");
  mobileExpenseCost.textContent = "$" + eCost;
  mobileExpenseCost.style.fontFamily = `"Roboto", sans-serif;`;
  mobileExpenseCost.style.color = "#ffffff";
  mobileExpenseCost.style.fontSize = "20px";
  mobileExpenseCost.style.margin = "0";

  let dateButtonContainer = document.createElement("div");
  dateButtonContainer.style.width = "95%";
  dateButtonContainer.style.display = "flex";
  dateButtonContainer.style.justifyContent = "space-between";

  let tagIconContainer = document.createElement("div");
  tagIconContainer.style.width = "100%";

  let eTagIcon = document.createElement("img");
  eTagIcon.src =
    "static/images/mobile-icons/entertainment_tag_badge_tight_crop.png";

  let gTagIcon = document.createElement("img");
  gTagIcon.src =
    "static/images/mobile-icons/groceries_tag_badge_1159x264_preserved.png";

  let mTagIcon = document.createElement("img");
  mTagIcon.src = "static/images/mobile-icons/monthly_bills_badge_1159x264.png";

  let nTagIcon = document.createElement("img");
  nTagIcon.src =
    "static/images/mobile-icons/non_essentials_taller_1159x290.png";

  let oTagIcon = document.createElement("img");
  oTagIcon.src = "static/images/mobile-icons/other_badge_1159x310.png";

  let rTagIcon = document.createElement("img");
  rTagIcon.src = "static/images/mobile-icons/rent_badge_1159x330.png";

  if (eCat === "groceries") {
    let icon = gTagIcon;
    icon.style.height = "30px";
    tagIconContainer.append(icon);
  }

  if (eCat === "rent") {
    let icon = rTagIcon;
    icon.style.height = "30px";
    tagIconContainer.append(icon);
  }

  if (eCat === "non-essentials") {
    let icon = nTagIcon;
    icon.style.height = "30px";
    tagIconContainer.append(icon);
  }

  if (eCat === "monthly") {
    let icon = mTagIcon;
    icon.style.height = "30px";
    tagIconContainer.append(icon);
  }

  if (eCat === "other") {
    let icon = oTagIcon;
    icon.style.height = "30px";
    tagIconContainer.append(icon);
  }
  if (eCat === "entertainment") {
    let icon = eTagIcon;
    icon.style.height = "30px";
    tagIconContainer.append(icon);
  }

  let mobileExpenseDate = document.createElement("p");
  mobileExpenseDate.style.fontFamily = `"Roboto", sans-serif;`;
  mobileExpenseDate.style.color = "grey";
  mobileExpenseDate.style.fontSize = "19px";
  mobileExpenseDate.textContent = eDate;
  mobileExpenseDate.style.margin = "0";

  let arrowDetailsIcon = document.createElement("img");
  arrowDetailsIcon.src = "static/images/next.png";
  arrowDetailsIcon.style.height = "40px";
  arrowDetailsIcon.style.display = "block";

  dateButtonContainer.append(mobileExpenseDate, arrowDetailsIcon);
  nameCostContainer.append(mobileExpenseName, mobileExpenseCost);
  flexColumnContainer.append(
    nameCostContainer,
    tagIconContainer,
    dateButtonContainer,
  );

  newDiv.append(flexColumnContainer);

  resultsContainer.append(newDiv);
}

function buttonsOff(offset, resultsTotal, runCount) {
  let previousButton = document.querySelector(".previous");
  let nextButton = document.querySelector(".next");

  if (offset == 0) {
    previousButton.style.display = "none";
    nextButton.style.display = "flex";
  }

  if (offset === 0 && runCount === resultsTotal) {
    previousButton.style.display = "none";
    nextButton.style.display = "none";
  }

  if (offset > 0 && runCount < resultsTotal) {
    previousButton.style.display = "flex";
    nextButton.style.display = "flex";
  }

  if (offset > 0 && runCount === resultsTotal) {
    previousButton.style.display = "flex";
    nextButton.style.display = "none";
  }
}

async function advancedDeleteExpense(eId) {
  try {
    let response = await fetch(
      `/advancedDeleteExpense?expenseId=${encodeURIComponent(eId)}`,
    );
    let data = response.json();
  } catch (e) {
    console.log(e);
  }
}

function expenseDeleteConfirmation(eId, eName) {
  let mainDiv = document.querySelector(".search-expense-main");

  let parentDiv = document.getElementById(`expense-details-parent-div-${eId}`);
  parentDiv.style.filter = "blur(3px)";

  let expenseName = document.getElementById(`expense-name-details-${eId}`);

  let confirmDeletePrompt = document.createElement("div");
  confirmDeletePrompt.classList.add("confirm-delete-expense");
  confirmDeletePrompt.setAttribute("id", `confirm-delete-expense-${eId}`);
  confirmDeletePrompt.style.zIndex = "20";

  let cdDeleteButton = document.createElement("button");
  cdDeleteButton.classList.add("confirm-delete-button");
  cdDeleteButton.setAttribute("id", `confirm-delete-button-${eId}`);
  cdDeleteButton.dataset.expenseId = eId;

  let cdTrashIcon = document.createElement("span");
  cdTrashIcon.classList.add("cd-trash-span");
  cdTrashIcon.innerHTML = `<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="24" height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="#ff2d55" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round" 
  class="lucide lucide-trash preview-icon">
  <path d="M10 11v6"/><path d="M14 11v6"/>
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
  <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>`;

  let trashIconContainer = document.createElement("div");
  trashIconContainer.classList.add("trash-icon-container");
  trashIconContainer.innerHTML = `<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="80" height="80" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="#ff2d55" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round" 
  class="lucide lucide-trash preview-icon">
  <path d="M10 11v6"/><path d="M14 11v6"/>
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
  <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>`;

  let deleteTransactionContainer = document.createElement("div");
  deleteTransactionContainer.classList.add("delete-transaction-container");

  let deleteTransactionPrompt = document.createElement("p");
  deleteTransactionPrompt.classList.add("delete-transaction-prompt");
  deleteTransactionPrompt.innerHTML = "Delete Transaction?";

  deleteTransactionContainer.append(deleteTransactionPrompt);

  let confirmDeleteCancelContainer = document.createElement("div");
  confirmDeleteCancelContainer.classList.add("confirm-delete-cancel-container");

  let asCancelButton = document.createElement("button");
  asCancelButton.classList.add("as-cancel-button");
  asCancelButton.setAttribute("id", `as-cancel-button-${eId}`);
  asCancelButton.dataset.expenseId = eId;
  asCancelButton.dataset.expenseName = eName;

  asCancelButton.append("Cancel");

  cdDeleteButton.append(cdTrashIcon, "Delete");

  trashIconContainer.append(cdDeleteButton);

  let detailsDivMessageContainer = document.createElement("div");
  detailsDivMessageContainer.classList.add("details-div-container");

  let areYouSureText = document.createElement("span");
  areYouSureText.classList.add("are-you-sure-text");
  areYouSureText.innerHTML = "are you sure you want to delete";

  let expenseNameTextValue = document.createElement("span");
  expenseNameTextValue.classList.add("expense-name-text-value");

  expenseNameTextValue.textContent = eName;

  let actionUndoneText = document.createElement("span");
  actionUndoneText.classList.add("action-undone-text");
  actionUndoneText.innerHTML = "This action cannot be undone.";

  detailsDivMessageContainer.append(
    areYouSureText,
    expenseNameTextValue,
    actionUndoneText,
  );

  confirmDeleteCancelContainer.append(asCancelButton, cdDeleteButton);

  confirmDeletePrompt.append(
    trashIconContainer,
    deleteTransactionContainer,
    detailsDivMessageContainer,
    confirmDeleteCancelContainer,
  );

  mainDiv.append(confirmDeletePrompt);
}
