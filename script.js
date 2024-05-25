"use strict";

// Select elements
const favicon = document.querySelector("link[rel*='icon']");
const selectionContainer = document.querySelector(".timer-btns-container");
const btnPomodoro = document.querySelector(".pomodoro");
const timerBtns = document.querySelectorAll(".btn-timer");
const btnShortBreak = document.querySelector(".short-break");
const btnLongBreak = document.querySelector(".long-break");
const timerMinutes = document.querySelector(".minutes");
const timerSeconds = document.querySelector(".seconds");
const btnStartTimer = document.querySelector(".btn-start");
const progressBar = document.querySelector(".progressbar");
const quoteText = document.querySelector(".quote-text");
const quoteAuthor = document.querySelector(".quote-author");
const year = document.querySelector(".year");

// Set initial time
let time = 25 * 60;
let progressBarFill = 0;
let activeTimer = "work"; // break

// Declare timer in global scope
let timer;

// load audio files
const audioBtnClick = new Audio("audio/pop-sound.mp3");
const audioAlarm = new Audio("audio/alarm.mp3");

// Set current year
year.textContent = new Date().getFullYear() + " |";

// Display quotes dynamically
const quotes = [
  ["– Mahatma Gandhi", "The future depends on what you do today."],
  [
    "– Paul J. Meyer",
    "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
  ],
  [
    "– Steve Jobs",
    "Your time is limited, so don’t waste it living someone else’s life.",
  ],
  [
    "– Robert Collier",
    "Success is the sum of small efforts, repeated day-in and day-out.",
  ],
  ["– Sam Levenson", "Don’t watch the clock; do what it does. Keep going."],
  ["– Tim Ferriss", "Focus on being productive instead of busy."],
  [
    "– Walt Disney",
    "The way to get started is to quit talking and begin doing.",
  ],
  [
    "– Zig Ziglar",
    "You don’t have to be great to start, but you have to start to be great.",
  ],
  ["– Unknown", "It’s not about having time. It’s about making time."],
  [
    "– Stephen Covey",
    "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  ],
];
const displayQuotes = function () {
  const quoteId = Math.trunc(Math.random() * quotes.length);
  [quoteAuthor.textContent, quoteText.textContent] = quotes[quoteId];
};
setInterval(displayQuotes, 5000);

// Read time from clock
const getDisplayedTime = function () {
  return (
    Number(timerMinutes.textContent) * 60 + Number(timerSeconds.textContent)
  );
};

// Change bg color, time, progress bar etc.
const changeTimer = function (btn, bgColor, minute, seconds) {
  timerBtns.forEach((btn) => btn.classList.remove("btn-clicked"));
  btn.classList.add("btn-clicked");
  document.body.style.backgroundImage = bgColor;
  // progressBar.style.width = "0%";
  timerMinutes.textContent = String(minute).padStart(2, 0);
  timerSeconds.textContent = String(seconds).padStart(2, 0);
  time = minute * 60 + seconds;
  progressBarFill = 0;
  activeTimer = btn.dataset.type;
};

// Starting the timer
const startTimer = function () {
  const fill = 100 / time;
  document.title = "Timer started!";
  const tick = function () {
    time--;
    let minute = String(Math.trunc(time / 60));
    let second = String(time % 60);

    timerMinutes.textContent = `${minute.padStart(2, "0")}`;
    timerSeconds.textContent = `${second.padStart(2, "0")}`;
    fillProgressBar(fill);

    if (time === 0) {
      clearInterval(timer);
      switchTimer();
      playSound(1);
    }
  };

  // reduce time by 1 at first
  tick();

  const timer = setInterval(tick, 1000);

  return timer;
};

// progress bar
const fillProgressBar = function (fill) {
  progressBarFill += fill;
  progressBar.style.width = `${progressBarFill}%`;
};

// Change start button state to 'pause' or 'start'
const changebtnState = function () {
  if (btnStartTimer.classList.contains("started")) {
    btnStartTimer.textContent = "Pause";
  } else {
    btnStartTimer.textContent = "Start";
  }
};

// Pause the timer
const pauseTimer = function () {
  if (timer) {
    clearInterval(timer);
    time = getDisplayedTime();
  }
};

// Play sound
const playSound = function (alarm) {
  if (alarm) audioAlarm.play();
  else audioBtnClick.play();
};

const switchTimer = function () {
  if (activeTimer === "work") {
    btnShortBreak.click();
    document.title = "Take a break!";
    favicon.attributes.href.nodeValue = "icon-break.svg";
  } else {
    progressBar.style.width = "100%";
    btnPomodoro.click();
    document.title = "Time to focus!";
    favicon.attributes.href.nodeValue = "icon-pomodoro.svg";
  }
};

// Event listeners
selectionContainer.addEventListener("click", function (e) {
  // Close guard
  if (!e.target.classList.contains("btn-timer")) return;

  // Clear timer if already started
  if (timer) clearInterval(timer);

  // Change start button state
  btnStartTimer.classList.remove("started");
  changebtnState();

  if (e.target.classList.contains("pomodoro")) {
    changeTimer(
      e.target,
      `linear-gradient(135deg, #ff9d6c 10%, #bb4e75 100%)`,
      25,
      0
    );
  } else if (e.target.classList.contains("short-break")) {
    changeTimer(
      e.target,
      `linear-gradient(135deg, #79f1a4 10%, #0e5cad 100%)`,
      5,
      0
    );
  } else if (e.target.classList.contains("long-break")) {
    changeTimer(
      e.target,
      `linear-gradient(135deg, #52e5e7 10%, #130cb7 100%)`,
      15,
      0
    );
  }
});

btnStartTimer.addEventListener("click", function (e) {
  playSound();

  // Check condition to pause timer
  if (e.target.classList.contains("started")) pauseTimer();
  else {
    time = 10; // getDisplayedTime();
    timer = startTimer();
  }

  // Add a class to pause timer when clicked again
  e.target.classList.toggle("started");

  // Change start button text
  changebtnState();
});
