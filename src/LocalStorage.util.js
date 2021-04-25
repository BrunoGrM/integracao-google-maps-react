const KEY = "PLACES";

export const getLocalStorage = () => {
  let places = localStorage.getItem(KEY);
  if (places) {
    places = JSON.parse(places);
  }
  return places || [];
};

export const setLocalStorage = (value) => {
  localStorage.setItem(KEY, JSON.stringify(value));
};

export const removeLocalStorage = () => {
  localStorage.removeItem(KEY);
};
