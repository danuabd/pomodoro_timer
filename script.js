"use strict";

// Select elements
const selectionContainer = document.querySelector(".timer-btns-container");
const btnPomodoro = document.querySelector(".pomodoro");
const timerBtns = document.querySelectorAll(".btn-timer");
const btnShortBreak = document.querySelector(".short-break");
const btnLongBreak = document.querySelector(".long-break");
const timerMinutes = document.querySelector(".minutes");
const timerSeconds = document.querySelector(".seconds");
const btnStartTimer = document.querySelector(".btn-start");
const progressBar = document.querySelector(".progressbar");
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
year.textContent = new Date().getFullYear();

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
  document.body.style.backgroundColor = bgColor;
  progressBar.style.width = "0%";
  timerMinutes.textContent = String(minute).padStart(2, 0);
  timerSeconds.textContent = String(seconds).padStart(2, 0);
  time = minute * 60 + seconds;
  progressBarFill = 0;
  activeTimer = btn.dataset.type;
  console.log(activeTimer);
};

// Starting the timer
const startTimer = function () {
  const fill = 100 / time;
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
const pauseTimer = function (pausedTimer) {
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
  if (activeTimer === "work") btnShortBreak.click();
  else btnPomodoro.click();
  progressBar.style.width = "100%";
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
    changeTimer(e.target, "rgb(186, 73, 73)", 25, 0);
  } else if (e.target.classList.contains("short-break")) {
    changeTimer(e.target, "rgb(56, 133, 138)", 5, 0);
  } else if (e.target.classList.contains("long-break")) {
    changeTimer(e.target, "rgb(57, 112, 151)", 15, 0);
  }
});

btnStartTimer.addEventListener("click", function (e) {
  playSound();

  // Check condition to pause timer
  if (e.target.classList.contains("started")) pauseTimer();
  else {
    time = getDisplayedTime();
    timer = startTimer();
  }

  // Add a class to pause timer when clicked again
  e.target.classList.toggle("started");

  // Change start button text
  changebtnState();
});
