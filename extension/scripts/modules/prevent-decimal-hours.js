// since the hours input field unfortunately does not support decimals, make sure the user CANNOT even input decimals in the hours input
document.addEventListener("input", (e) => {
  const input = e.target;
  if (input.type === "number" && input.classList.contains("ds-input") && input.classList.contains("text-center")) {
    input.value = input.value.replace(/\./g, "");
  }
});

document.addEventListener("keydown", (e) => {
  const input = e.target;
  if (input.type === "number" && input.classList.contains("ds-input") && input.classList.contains("text-center") && e.key === ".") {
    e.preventDefault();
  }
});