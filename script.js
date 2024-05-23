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

// Initiate time
let time = 25 * 60;

// Declare timer in global scope
let timer;

// load audio files
const audioBtnClick = new Audio("audio/pop-sound.mp3");
const audioAlarm = new Audio("audio/alarm.mp3");

// Change bg color, time, etc.
const changeTimer = function (btn, bgColor, minute, seconds) {
  timerBtns.forEach((btn) => btn.classList.remove("btn-clicked"));
  btn.classList.add("btn-clicked");
  document.body.style.backgroundColor = bgColor;
  timerMinutes.textContent = minute;
  timerSeconds.textContent = seconds;
};

// Starting the timer
const startTimer = function () {
  const tick = function () {
    time--;
    let minute = String(Math.trunc(time / 60));
    let second = String(time % 60);

    timerMinutes.textContent = `${minute.padStart(2, "0")}`;
    timerSeconds.textContent = `${second.padStart(2, "0")}`;

    if (time === 0) {
      clearInterval(timer);
      playSound(1);
    }
  };

  const timer = setInterval(tick, 1000);

  // reduce time by 1 at first
  tick();
  return timer;
};

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
    time =
      Number(timerMinutes.textContent) * 60 + Number(timerSeconds.textContent);
  }
};

// Play sound
const playSound = function (alarm) {
  if (alarm) audioAlarm.play();
  else audioBtnClick.play();
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
    changeTimer(e.target, "rgb(186, 73, 73)", "25", "00");
    time = 25 * 60;
  } else if (e.target.classList.contains("short-break")) {
    changeTimer(e.target, "rgb(56, 133, 138)", "05", "00");
    time = 5 * 60;
  } else if (e.target.classList.contains("long-break")) {
    changeTimer(e.target, "rgb(57, 112, 151)", "15", "00");
    time = 15 * 60;
  }
});

btnStartTimer.addEventListener("click", function (e) {
  playSound();

  // Check condition to pause timer
  if (e.target.classList.contains("started")) pauseTimer();
  else timer = startTimer();

  // Add a class to pause timer when clicked again
  e.target.classList.toggle("started");

  // Change start button text
  changebtnState();
});
