export function getUserFromLocalStorage() {
  return JSON.parse(localStorage.getItem("user") || "{}");
}
