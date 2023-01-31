import './insertSprite.js';
import { 
  setValueToLocalStorage,
  getValueFromLocalStorage } from './utils.js'
import {
  tabs,
  bellElement,
  buttonSettings,
  buttonStartTimer,
  changeButtonStartText,
  setDefaultTab,
  renderTimer,
  changeIndicator,
  showBell,
  hideBell
} from "./view.js"
import Modal from "./modal.js"


const modalSettings = new Modal()
modalSettings.init()

let timerSettings = modalSettings.getSettings()

setDefaultTab(timerSettings.currentTimer)

modalSettings.onSave(() => {
  timerSettings = modalSettings.getSettings();
})

let timerID = null
let deadline = null
const audio = new Audio(timerSettings.audioSrc)

const getDeadline = (currentTime) => new Date(Date.now() + currentTime)

const calculateTimer = (diff) => {
  let minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0
  let seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0

  timerSettings[timerSettings.currentTimer].lostTime = diff

  if (minutes < 10) {
    minutes = `0${minutes}` 
  }

  if (seconds < 10) {
    seconds = `0${seconds}`
  }

  return {
    minutes,
    seconds
  }
}

const changeValue = (event) => {
  const target = event.target
  const actionType = target.dataset.action
  switch(actionType) {
    case "inc": 
      const inputField = target.nextElementSibling;
      if (inputField.value === "") inputField.value = 0;
      inputField.stepUp();
    break;
    case "dec":
      const input = target.previousElementSibling;
      if (input.value === "") input.value = 0;
      if (input.value <= 0) return;
      input.stepDown();
    break;
  }
}

const finishTimer = () => {
  changeButtonStartText("Start")
  timerSettings[timerSettings.currentTimer].started = false
  timerSettings[timerSettings.currentTimer].lostTime = null
  audio.play()
  showBell()
  clearInterval(timerID)
}

const setTimer = () => { 
  const diff = deadline - new Date()
  const calculatedValues = calculateTimer(diff)
  changeIndicator(timerSettings)
  renderTimer(calculatedValues)

  if (diff <= 0) {
    finishTimer()
    setDefaultTimer()
  }
}

const setDefaultTimer = () => {
  deadline = null
  if (!deadline) deadline = getDeadline(timerSettings[timerSettings.currentTimer].timer * 60 * 1000)
  setTimer()
}

const startTimer = () => { 
  deadline = null
  if (!deadline) deadline = getDeadline(timerSettings[timerSettings.currentTimer].lostTime)

  if (timerSettings[timerSettings.currentTimer].started) {
    changeButtonStartText("Start")
    timerSettings[timerSettings.currentTimer].started = false
    clearInterval(timerID)
    setValueToLocalStorage("timerSettings", timerSettings)
  } else {
    timerSettings[timerSettings.currentTimer].started = true
    changeButtonStartText("Pause")
    timerID = setInterval(setTimer, 1000)
  }
}

const hadlerChangeTimer = (event) => {
  const tabField = event.target.closest('.tab__field')
  if (tabField) {
    timerSettings[timerSettings.currentTimer].started = false
    timerSettings.previousTimer = timerSettings.currentTimer
    timerSettings[timerSettings.previousTimer].lostTime = null
    timerSettings.currentTimer = tabField.value
    changeButtonStartText("Start")
    clearInterval(timerID)
    setDefaultTimer()
  }
}

setDefaultTimer()

tabs.forEach(tab => {
  tab.addEventListener("click", hadlerChangeTimer)
})

bellElement.addEventListener("click", (event) => {
  if (event.target.closest('.timer-bell')) {
    audio.pause()
    hideBell()
  }
})

audio.addEventListener("ended", hideBell)
buttonStartTimer.addEventListener("click", startTimer)

document.querySelectorAll('[data-btn="btn-inc"]').forEach(incbtn => incbtn.addEventListener("click", changeValue))
document.querySelectorAll('[data-btn="btn-dec"]').forEach(decbtn => decbtn.addEventListener("click", changeValue))

buttonSettings.addEventListener("click", () => {
  modalSettings.open()
})
