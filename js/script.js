let operandOne = "";
let operator = "";
let operandTwo = "";
let negativeLeftOperand = null;
let negativeRightOperand = null;
let display = document.querySelector(".display h2");

document.addEventListener("DOMContentLoaded", sayGreeting);

function sayGreeting() {
  display.textContent = "Hello!";

  setTimeout(() => {
    display.textContent = "0";
  }, 600);
}

document.addEventListener("keydown", getPressedTarget);

function getPressedTarget(e) {
  keyHandler(e.key);
}

let buttons = document.querySelector(".calc-buttons");

buttons.addEventListener("click", getClickedTarget);

function getClickedTarget(e) {
  keyHandler(e.target.getAttribute("data-key"));
}

function keyHandler(key) {
  if (key === null || key === undefined) {
    return;
  }

  if (key === "Backspace" || key === "Delete") {
    deleteOperandsAndDisplayData();
  }

  if (key === "+/-") {
    toggleParantheses();
  }

  if (key === "Clear") {
    flushData();
  }

  let expression = new ExpressionHandler();
  expression.update(key);
  appendOperandsAndDisplayData();
}
