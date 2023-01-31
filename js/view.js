export const tabs = document.querySelectorAll(".tabs__item")
export const buttonTimerStart = document.querySelector("#timer-start-button")
export const buttonSettings = document.querySelector("#button-settings")
export const buttonStartTimer = document.querySelector("#timer-start-button")
export const bellElement = document.querySelector("#bell")
const rootElement = document.documentElement;
const timerIndicator = document.querySelector('#timer-indicator')
const tabFields = document.querySelectorAll(".tab__field");

const minutesElement = document.querySelector("#minute")
const secondsElement = document.querySelector("#second")

export const renderTimer = (settings) => {
  minutesElement.innerText = settings.minutes;
  secondsElement.innerText = settings.seconds;
}

export const setTimerTheme = (color, font) => {
  rootElement.style.setProperty('--color-theme', color);
  rootElement.style.setProperty('--base-font', font);
}

export const setDefaultTab = (activeTab) => {
  tabFields.forEach(tabField => {
    if (tabField.value === activeTab) {
      tabField.checked = true;
    }
  })
}

export const changeIndicator = (settings) => {
  const { strokeDasharray } = getComputedStyle(timerIndicator)
  const remainTimeSeconds = settings[settings.currentTimer].lostTime / 1000
  const fullTimerSeconds = settings[settings.currentTimer].timer * 60
  const percentOfTimer = remainTimeSeconds / fullTimerSeconds
  const timerOffset = parseFloat(strokeDasharray) - (parseFloat(strokeDasharray) * percentOfTimer)

  timerIndicator.style.strokeDashoffset = `${timerOffset}px`
}

export const changeButtonStartText = (text) => {
  buttonStartTimer.innerText = text;
}

export const showBell = () => {
  bellElement.classList.remove("hide")
}

export const hideBell = () => {
  bellElement.classList.add("hide")
}