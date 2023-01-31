import { 
  setValueToLocalStorage,
  getValueFromLocalStorage } from './utils.js'
import { setTimerTheme } from './view.js';

class Modal {
  #settings = getValueFromLocalStorage("timerSettings") ?? {
    pomodoro: {
      timer: 20,
      lostTime: null,
      started: false,
    },
    longBreak: {
      timer: 30,
      lostTime: null,
      started: false 
    },
    shortBreak: {
      timer: 5,
      lostTime: null,
      started: false
    },
    font: "Kumbh Sans, sans-serif",
    currentTimer: 'pomodoro',
    color: "#f87070",
    previousTimer: null,
    audioSrc: '../audio/romance.mp3'
  }
  #saveEvent = null;
  #applyButton = null;
  constructor(options = {}) {
    this.modal = null
    this.duration = options.duration || 400
  }
  open() {
    this.modal.classList.add("active");
    this.modal.style.zIndex = 1;

    setTimeout(() => {
      this.modal.style.opacity = 1
    }, this.duration)
  }
  close() {
    setTimeout(() => {
      this.modal.style.opacity = 0
      this.modal.classList.remove("active")
      this.modal.style.zIndex = -1;
    }, this.duration)
  }
  setSettingsValues(selector) {
    const fields = document.querySelectorAll(selector)
    fields.forEach(field => {
      const fieldName = field.getAttribute("name");
      const type = field.type

      if (type === "number") {
        field.value = this.#settings[fieldName].timer;
      }

      if (type === 'radio' && field.value.includes(this.#settings[fieldName])) {
        field.setAttribute("checked", true)
      } 

      field.addEventListener("change", () => {
        switch(type) {
          case "number": 
            this.#settings[fieldName] = {
              ...this.#settings[fieldName],
              timer: +field.value.trim(),
            }
            break
          default: 
            this.#settings[fieldName] = field.value.trim()
            field.setAttribute("checked", true)
            break
        }
      })
    })
  }
  getFormValues(selectors) {
    if (Array.isArray(selectors)) {
      selectors.forEach(selector => {
        this.setSettingsValues(selector)
      })
    }
  }
  init() {
    this.render()
    this.modal = document.querySelector('#modal')
    this.modal.style.transition = `${this.duration}ms ease-in`
    this.#applyButton = document.querySelector("#settings-button")
    this.#saveEvent = new Event("save", {
      bubbles: true,
      cancelable: true
    })
    setValueToLocalStorage("timerSettings", this.#settings)

    setTimerTheme(this.#settings.color, this.#settings.font);

    this.#applyButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.#applyButton.dispatchEvent(this.#saveEvent)
    })

    this.modal.addEventListener("click", (event) => {
      if (event.target.classList.contains('modal-overlay')) {
        this.close()
      } else if (event.target.dataset.action === 'close') {
        this.close()
      }
    })

    window.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 'escape') this.close()
    })
    this.getFormValues(["#time-settings .input-number__field", "#fonts .radio__field", "#colors .radio__field"])
  }
  getSettings() {
    return getValueFromLocalStorage("timerSettings") ?? this.#settings;
  }
  onSave(cb) {
    this.#applyButton.addEventListener("save", () => {
      setValueToLocalStorage("timerSettings", this.#settings);
      setTimerTheme(this.#settings.color, this.#settings.font);
      if (this.#settings[this.#settings.currentTimer].lostTime) {
        this.#settings[this.#settings.currentTimer].lostTime = null;
      }
      if (this.#settings[this.#settings.previousTimer]?.lostTime) {
        this.#settings[this.#settings.previousTimer].lostTime = null;
      }
      cb(this.#settings);
      this.close();
    })
  }
  render() {
    const markup = `
      <div id="modal" class="modal-overlay">
        <div class="modal modal-settings">
          <div class="modal-settings__top">
            <h2 class="modal-setting__title">Settings</h2>
            <button data-action="close" class="modal-settings__close">
              <svg class="modal-settings__close-icon">
                <use xlink:href="#cross" />
              </svg>
            </button>
          </div>
          <div class="modal__body">
            <div id="time-settings" class="row">
              <h2 class="row__title">Time (Minutes)</h2>
              <div class="row__data row__data--space-top">
                <div class="input-number-wrapper">
                  <label for="pomodoro" class="input-number__label">
                    <span>Pomodoro</span>
                  </label>
                  <div class="input-number">
                    <button data-btn="btn-inc" data-action="inc" class="input-number__button input-number__button-up">
                      <svg width="14" height="7">
                        <use xlink:href="#arrow-up" />
                      </svg>
                    </button>
                    <input id="pomodoro" name="pomodoro" class="input-number__field" type="number" min="0">
                    <button data-btn="btn-dec" data-action="dec" class="input-number__button input-number__button-down">
                      <svg width="14" height="7">
                        <use xlink:href="#arrow-down"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="input-number-wrapper">
                  <label for="short-break" class="input-number__label">
                    <span>Short break</span>
                  </label>
                  <div class="input-number">
                    <button data-btn="btn-inc" data-action="inc" class="input-number__button input-number__button-up">
                      <svg width="14" height="7">
                        <use xlink:href="#arrow-up" />
                      </svg>
                    </button>
                    <input id="short-break" name="shortBreak" class="input-number__field" type="number" min="0">
                    <button data-btn="btn-dec" data-action="dec" class="input-number__button input-number__button-down">
                      <svg width="14" height="7">
                        <use xlink:href="#arrow-down"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="input-number-wrapper">
                  <label for="long-break" class="input-number__label">
                    <span>Long break</span>
                  </label>
                  <div class="input-number">
                    <button data-btn="btn-inc" data-action="inc" class="input-number__button input-number__button-up">
                      <svg width="14" height="7">
                        <use xlink:href="#arrow-up" />
                      </svg>
                    </button>
                    <input id="long-break" name="longBreak" class="input-number__field" type="number" min="0">
                    <button data-btn="btn-dec" data-action="dec" class="input-number__button input-number__button-down">
                      <svg width="14" height="7">
                        <use xlink:href="#arrow-down"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div id="fonts" class="row row-data--align-items-center">
              <h2 class="row__title">Font</h2>
              <div class="row__data row-data--fix-width">
                <label class="radio">
                  <input name="font" class="radio__field radio__field--checked" type="radio" checked value="'Kumbh Sans', sans-serif" />
                  <span class="radio__custom" title="Kumbh Sans">Aa</span>
                </label>
                <label class="radio">
                  <input name="font" class="radio__field radio__field--checked" type="radio" value="'Roboto Slab', serif" />
                  <span class="radio__custom" title="Roboto">Aa</span>
                </label>
                <label class="radio">
                  <input name="font" class="radio__field radio__field--checked" type="radio" value="'Arima', cursive" />
                  <span class="radio__custom" title="Space Mono">Aa</span>
                </label>
              </div>
            </div>
            <div id="colors" class="row row-data--align-items-center">
              <h2 class="row__title">color</h2>
              <div class="row__data row-data--fix-width">
                <label class="radio">
                  <input name="color" class="radio__field radio__field--font-checked" checked type="radio" value="#f87070" />
                  <span class="radio__custom radio__custom--bg-red">
                    <svg class="radio__custom-icon">
                      <use xlink:href="#check" />
                    </svg>
                  </span>
                </label>
                <label class="radio">
                  <input name="color" class="radio__field radio__field--font-checked" type="radio" value="#70f3f8" />
                  <span class="radio__custom radio__custom--bg-light-blue">
                    <svg class="radio__custom-icon">
                      <use xlink:href="#check" />
                    </svg>
                  </span>
                </label>
                <label class="radio">
                  <input name="color" class="radio__field radio__field--font-checked" type="radio" value="#d881f8" />
                  <span class="radio__custom radio__custom--bg-purple">
                    <svg class="radio__custom-icon">
                      <use xlink:href="#check" />
                    </svg>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="settings-button" form="settings" type="button" class="button modal__button">Apply</button>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML("beforeend", markup)
  }
}

export default Modal