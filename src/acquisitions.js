import Chart from "chart.js/auto";

const expenseNames = [
  "Gym",
  "Care Credit",
  "Capital One",
  "Peacock",
  "Groceries",
];
const expenseCost = [23, 34, 100, 15, 70];
const colors = ["green", "red", "pink", "purple", "yellow"];

const fancyData = {
  labels: expenseNames,
  datasets: [
    {
      data: expenseCost,
      backgroundColor: colors,
    },
  ],
};

new Chart("extra_fancy", {
  type: "pie",
  data: fancyData,
});
