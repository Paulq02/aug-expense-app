

/*

This checks if Chart.js module exists 
if it exists then go into font defaults and set the default font to Roboto

*/
if (typeof Chart !== "undefined") {
  Chart.defaults.font.family = '"Roboto", "sans-serif"';
  
}

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
}



);

/* 
I've added an event listener to a button attached to my sidebar
When this button is clicked, the sidebar class is toggled and added which adds a 250px width to the sidebar
which opens the sidebar, if clicked again the sidebar class is removed 
I'm going to be adding a search feature soon


*/

const openSidebar = document.querySelector(".close");

const closeSearchBox = document.querySelector(".open-search-box");

const toggleButton = document.querySelector(".toggle");
if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    openSidebar.classList.toggle("sidebar");
    closeSearchBox.classList.toggle("close-search-box");
  });
}


/* 

I've added a toggle feature to switch from Dark/Light mode by clicking a button.
This gets a hold of many elements and adds/removes Dark/Light classes to fit the users specification.
It also updates the local storage on the current color scheme.



*/

let htmlColor = document.querySelector("html");

const toggleSwitch = document.querySelector(".toggle-switch");
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

const logoutButton = document.querySelector(".logout-button");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    window.localStorage.clear();
  });
}




/* 

I've added a change event listener to a "select" element which defaults to a "none" value at login.
Once a user makes their choice of a YEAR they would like to filter by, the form that's wrapped around the select element is submitted and a query is made

*/
const yearSelect = document.getElementById("year-select");
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

const mySelectElement = document.querySelector(".asc-desc");

if (mySelectElement) {
  mySelectElement.addEventListener("change", function () {
    this.form.submit();
  });
}



/* 

I've added a change event listener to a "select" element which defaults to a "none" value at login.
Once a user makes their choice of sorting expenses by ascending or descending by COST the form that's wrapped around the select element is submitted and a query is made

*/

const sortCost = document.querySelector(".sort-expense-dropdown");

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




/* 
// Loop through each expense object in the converted JavaScript data.
// Each expense has an "expense_category" (like groceries, rent, entertainment)
// and an "amount" representing how much was spent.
// We check which category the expense belongs to by matching the key name.
// When a match is found, we take the expense amount and add it to that
// category's total inside categoryArray. This keeps a running total for
// each category so we can track overall spending by type.

*/


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



/*

Prepare data for Chart.js by separating category names and amounts.

Two empty arrays are created: nameArray and amountArray.

We loop through categoryArray (which already holds totals for each category after processing the converted expense objects).

"name" refers to the category name (e.g., groceries, rent, entertainment) chosen by the user when they created an expense.

"amount" refers to the running total of all expenses for that category.

For each category object in categoryArray, push the name into nameArray and the amount into amountArray. These arrays will be passed to Chart.js
to display the chart labels (names) and corresponding values (amounts).


*/



let nameArray = [];

let amountArray = [];

for (let cat of categoryArray) {
  let name = cat.category;
  let amount = cat.amount;
  nameArray.push(name);
  amountArray.push(amount);
}



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


const doughnutCanvas = document.getElementById("myCanvas");
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
              size: 30,
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
      let fontSize = 30;

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
  "rgb(54, 162, 235)", // blue
  "rgb(255, 159, 64)", // orange
  "rgb(255, 205, 86)", // yellow
  "rgb(75, 192, 192)", // green
  "rgb(153, 102, 255)", // purple
  "rgb(255, 99, 132)", // red
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


const chartBarCanvas = document.getElementById("barChart");

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
  const yellowEditnameBtn = getComputedStyle(EditNameBtn).display
  

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
  
  
  const myDisplay = getComputedStyle(errorElement).display
 

  
  if (myDisplay === "block") {
    errorElement.style.color = "#000000";
  }
};


/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* STOP SCOLLLING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */



async function searchExpenseByName() {
  console.log("function called")

  let noResultsMessage = document.querySelector(".no-results")
  
  const tbodyParentBody = document.getElementById("tbodyParent")
    tbodyParentBody.innerHTML = "" 
  
  const userInput = document.getElementById("search-input")
  const userInputValue = userInput.value

  const trimmedUserInputValue = userInputValue.trim()

  let searchTableDiv = document.querySelector(".searched-expense-display-container")

  if (trimmedUserInputValue === "") {
    console.log("IF BLOCK PRINTING ")
    let searchTableDiv = document.querySelector(".searched-expense-display-container")
    searchTableDiv.style.display = "none"
  }

  else {
     
  
   try {
      console.log("TRY BLOCK PRINTING")
      const response = await fetch(`/user_search?userSearch=${encodeURIComponent(trimmedUserInputValue)}`)
      const data = await response.json()
      console.log(data)

      if (data.message == "no results") {
        let searchTable = document.querySelector(".search-table")
        searchTable.style.display = "none"
        
        let searchTableDiv = document.querySelector(".searched-expense-display-container")
        searchTableDiv.style.display = "flex"
        searchTableDiv.style.justifyContent = "center"
        noResultsMessage = document.querySelector(".no-results")
        noResultsMessage.style.display = "flex"
        return
      }

      else {
        noResultsMessage.style.display = "none"
        let searchTable = document.querySelector(".search-table")
        searchTable.style.display = "table"
      }


      const searchTableDiv = document.querySelector(".searched-expense-display-container")
        searchTableDiv.style.display = "flex"
        searchTableDiv.style.justifyContent = "center"

    const expenseDataHeaderRow = document.createElement("tr")

    const expenseNameHeader = document.createElement("th")
      expenseNameHeader.textContent= "Name"
   

    const expenseCostHeader = document.createElement("th")
      expenseCostHeader.textContent = "Cost"
   

    const expenseDateHeader = document.createElement("th")
    expenseDateHeader.textContent = "Date"

  
      
      expenseDataHeaderRow.appendChild(expenseNameHeader)
      expenseDataHeaderRow.appendChild(expenseCostHeader)
      expenseDataHeaderRow.appendChild(expenseDateHeader)

      
      expenseNameHeader.style.color =  "#bb86fc"
      expenseCostHeader.style.color =  "#bb86fc"
      expenseDateHeader.style.color =  "#bb86fc"

      tbodyParentBody.appendChild(expenseDataHeaderRow)

   

      for (const info of data) {
        expense_name = info.expense_name
        expense_cost = info.expense_cost
        expense_date = info.expense_date


        const trDataRow = document.createElement("tr")

        const tdName = document.createElement("td")
          tdName.textContent = expense_name

        const tdCost = document.createElement("td")
          tdCost.textContent = expense_cost

        const tdDate = document.createElement("td")
          tdDate.textContent = expense_date

      
      
      trDataRow.appendChild(tdName)
      trDataRow.appendChild(tdCost)
      trDataRow.appendChild(tdDate)

      tdName.style.color = "red"
      tdCost.style.color = "red"
      tdDate.style.color = "red"
      

     
      tbodyParentBody.appendChild(trDataRow)
    }
}

catch(error) {
    console.log(error)
  }

}

}

 
const closedSidebar = document.querySelector(".close")
closedSidebar.addEventListener("mouseenter", ()=> {
  closedSidebar.classList.toggle("sidebar")
})

closedSidebar.addEventListener("mouseleave", ()=> {
  closedSidebar.classList.toggle("sidebar")
})