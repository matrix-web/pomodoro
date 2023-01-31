export const getValueFromLocalStorage = (name) => {
  const valueFromStorage = JSON.parse(localStorage.getItem(name)) ? JSON.parse(localStorage.getItem(name)) : null

  return valueFromStorage;
}

export const setValueToLocalStorage = (key, value) => {
  if (!value) return;

  const stringValue = JSON.stringify(value);
  localStorage.setItem(key, stringValue);
}