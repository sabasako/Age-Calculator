"use strict";

const day = document.querySelector("#day");
const month = document.querySelector("#month");
const year = document.querySelector("#year");
const btn = document.querySelector("button");
const errorDay = document.querySelector(".error-day");
const errorMonth = document.querySelector(".error-month");
const errorYear = document.querySelector(".error-year");
const inputDay = document.querySelector(".input-day");
const inputMonth = document.querySelector(".input-month");
const inputYear = document.querySelector(".input-year");
const labelDay = document.querySelector(".label-day");
const labelMonth = document.querySelector(".label-month");
const labelYear = document.querySelector(".label-year");
const guessDay = document.querySelector(".guess-day");
const guessMonth = document.querySelector(".guess-month");
const guessYear = document.querySelector(".guess-year");
const guessHighlight = document.querySelectorAll(".guess-highlight");
const darkLogo = document.querySelector(".dark-logo");
const lightLogo = document.querySelector(".light-logo");
const guessText = document.querySelectorAll(".guess-text");
const inputs = document.querySelectorAll("input");
const labelText = document.querySelectorAll(".label-text");
const form = document.querySelector(".form");

// if year is leap, returns true, otherwise false
function checkLeapYear(year) {
  if (year % 4 === 0 && year % 100 !== 0) return true;
  else if (year % 4 === 0 && year % 100 === 0 && year % 400 === 0) return true;
  else return false;
}

// error if user left input bar empty
function emptyError(n, m) {
  if (document.querySelector(`#${n}`).value === "") {
    m.classList.remove(`error-${n}`);
    m.textContent = "This field is required";
    document.querySelector(`.label-${n}`).classList.add("error-color");
    document.querySelector(`.input-${n}`).classList.add("error-border");
    guessHighlight.forEach((el) => (el.textContent = "--"));
  }
}

// error if a text in input isn't a number
function NaNError(n, m, maxNumber) {
  if (
    Number(document.querySelector(`#${n}`).value) < 1 ||
    Number(document.querySelector(`#${n}`).value) > maxNumber ||
    /^\d+$/.test(document.querySelector(`#${n}`).value) === false
  ) {
    m.classList.remove(`error-${n}`);
    m.textContent = `Must be a valid ${n}`;
    document.querySelector(`.label-${n}`).classList.add("error-color");
    document.querySelector(`.input-${n}`).classList.add("error-border");
    guessHighlight.forEach((el) => (el.textContent = "--"));
  } else {
    m.classList.add(`error-${n}`);
    document.querySelector(`.label-${n}`).classList.remove("error-color");
    document.querySelector(`.input-${n}`).classList.remove("error-border");
  }
}

// checks all errors
function checkError() {
  NaNError("day", errorDay, 31);
  NaNError("month", errorMonth, 12);

  if (Number(year.value) > new Date().getFullYear()) {
    errorYear.classList.remove("error-year");
    errorYear.textContent = "Must be in the past";
    document.querySelector(".label-year").classList.add("error-color");
    document.querySelector(`.input-year`).classList.add("error-border");
    guessHighlight.forEach((el) => (el.textContent = "--"));
  } else if (
    Number(year.value) === new Date().getFullYear() &&
    Number(month.value) > new Date().getMonth() + 1 &&
    Number(month.value) <= 12
  ) {
    errorMonth.classList.remove("error-month");
    errorMonth.textContent = "Must be in the past";
    document.querySelector(".label-month").classList.add("error-color");
    document.querySelector(`.input-month`).classList.add("error-border");
    guessHighlight.forEach((el) => (el.textContent = "--"));
  } else if (
    Number(year.value) === new Date().getFullYear() &&
    Number(month.value) === new Date().getMonth() + 1 &&
    Number(day.value) > new Date().getDate() &&
    Number(day.value) <= 31
  ) {
    errorDay.classList.remove("error-day");
    errorDay.textContent = "Must be in the past";
    document.querySelector(".label-day").classList.add("error-color");
    document.querySelector(`.input-day`).classList.add("error-border");
    guessHighlight.forEach((el) => (el.textContent = "--"));
  } else if (
    (Number(month.value) === 4 ||
      Number(month.value) === 6 ||
      Number(month.value) === 9 ||
      Number(month.value) === 11) &&
    Number(day.value) === 31
  ) {
    errorDay.classList.remove("error-day");
    errorDay.textContent = "Must be a valid date";
    document.querySelector(".label-day").classList.add("error-color");
    document.querySelector(`.input-day`).classList.add("error-border");
    guessHighlight.forEach((el) => (el.textContent = "--"));
  } else if (
    Number(month.value) === 2 &&
    (Number(day.value) === 30 || Number(day.value) === 31)
  ) {
    errorDay.classList.remove("error-day");
    errorDay.textContent = "Must be a valid date";
    document.querySelector(".label-day").classList.add("error-color");
    document.querySelector(`.input-day`).classList.add("error-border");
    guessHighlight.forEach((el) => (el.textContent = "--"));
  } else if (
    Number(month.value) === 2 &&
    Number(day.value) === 29 &&
    checkLeapYear(Number(year.value)) === false
  ) {
    errorYear.classList.remove("error-year");
    errorYear.textContent = "That wasn't leap year";
    document.querySelector(".label-year").classList.add("error-color");
    document.querySelector(`.input-year`).classList.add("error-border");
    guessHighlight.forEach((el) => (el.textContent = "--"));
  } else if (/^\d+$/.test(year.value) === false) {
    errorYear.classList.remove("error-year");
    errorYear.textContent = "Must be a valid year";
    document.querySelector(".label-year").classList.add("error-color");
    document.querySelector(`.input-year`).classList.add("error-border");
    guessHighlight.forEach((el) => (el.textContent = "--"));
  } else {
    errorYear.classList.add(`error-year`);
    document.querySelector(`.label-year`).classList.remove("error-color");
    document.querySelector(`.input-year`).classList.remove("error-border");
  }

  emptyError("day", errorDay);
  emptyError("month", errorMonth);
  emptyError("year", errorYear);
}

// Age animation
function ageAnimation(num, max, element) {
  if (num <= max) {
    element.textContent = num;
    setTimeout(
      function () {
        ageAnimation(num + 1, max, element);
      },
      max > 100 ? 10 : 30
    );
  }
}

// Keyboard functionality;
const keyboard = (e) => {
  if (e.key === "Enter") calculateAge();
};

// function for eventlistener

function calculateAge() {
  // Checks if date is written in the wrong format
  checkError();

  // If date is written in the wrong format, stops and doesn't execute rest of the function
  if (
    document.querySelector(".label-day").classList.contains("error-color") ||
    document.querySelector(".label-month").classList.contains("error-color") ||
    document.querySelector(".label-year").classList.contains("error-color")
  ) {
    return;
  }

  let [dayValue, monthValue, yearValue] = [
    Number(inputDay.value),
    Number(inputMonth.value),
    Number(inputYear.value),
  ];

  let currentDay = new Date().getDate();
  let currentMonth = new Date().getMonth() + 1;
  let currentYear = new Date().getFullYear();

  // calculates age
  if (monthValue > currentMonth && dayValue <= currentDay) {
    ageAnimation(1, currentYear - yearValue - 1, guessYear);
    ageAnimation(1, 12 - (monthValue - currentMonth), guessMonth);
    ageAnimation(1, currentDay - dayValue, guessDay);
  } else if (monthValue >= currentMonth && dayValue > currentDay) {
    ageAnimation(1, currentYear - yearValue - 1, guessYear);
    ageAnimation(1, 12 - (monthValue - currentMonth) - 1, guessMonth);
    ageAnimation(1, 31 - (dayValue - currentDay), guessDay);
  } else if (monthValue <= currentMonth && dayValue <= currentDay) {
    ageAnimation(1, currentYear - yearValue, guessYear);
    ageAnimation(1, currentMonth - monthValue, guessMonth);
    ageAnimation(1, currentDay - dayValue, guessDay);
  } else if (monthValue < currentMonth && dayValue > currentDay) {
    ageAnimation(1, currentYear - yearValue, guessYear);
    ageAnimation(1, currentMonth - monthValue - 1, guessMonth);
    ageAnimation(1, 31 - (dayValue - currentDay), guessDay);
  }
}

btn.addEventListener("click", calculateAge);
window.addEventListener("keydown", keyboard);

// dark and light modes

darkLogo.addEventListener("click", function () {
  darkLogo.classList.add("hidden");
  lightLogo.classList.remove("hidden");
  document.body.style.backgroundColor = "#181a1b";
  guessText.forEach((el) => (el.style.color = "#dbd8d4"));
  inputs.forEach((el) => {
    el.style.backgroundColor = "#2b2a33";
    el.style.color = "#a1998d";
    el.style.border = "1px solid #44434c";
  });
  labelText.forEach((el) => (el.style.color = "#a1998d"));
  btn.style.backgroundColor = "#32009e";
  form.style.borderBottom = "1px solid rgba(68, 67, 76, 0.264)";
});

lightLogo.addEventListener("click", function () {
  darkLogo.classList.remove("hidden");
  lightLogo.classList.add("hidden");
  document.body.style.backgroundColor = "hsl(0, 0%, 100%)";
  guessText.forEach((el) => (el.style.color = "hsl(0, 0%, 8%)"));
  inputs.forEach((el) => {
    el.style.backgroundColor = "hsl(0, 0%, 100%)";
    el.style.color = "hsl(0, 0%, 8%)";
    el.style.border = "1px solid hsl(0, 0%, 86%)";
  });
  labelText.forEach((el) => (el.style.color = "hsl(0, 1%, 44%)"));
  btn.style.backgroundColor = "hsl(259, 100%, 65%)";
  form.style.borderBottom = "1px solid rgba(0, 0, 0, 0.085)";
});
