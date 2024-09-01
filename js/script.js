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

class Display {
  constructor(element) {
    this.element = element;
  }

  update(leftExpression, operator, rightExpression) {
    if (leftExpression === "" && operator === "" && rightExpression === "") {
      this.element.textContent = "0";
      return;
    }
    this.element.textContent =
      leftExpression + " " + operator + " " + rightExpression;
    return;
  }

  delete() {
    if (operandTwo !== "") {
      return (operandTwo = operandTwo.slice(0, length - 1));
    }

    if (operandTwo === "" && operator !== "") {
      return (operator = operator.slice(0, length - 1));
    }

    if (operandOne !== "") {
      return (operandOne = operandOne.slice(0, length - 1));
    }
  }

  clear() {
    operandOne = "";
    operator = "";
    operandTwo = "";
  }
}

class IsNegative extends Display {
  constructor(element) {
    super(element);
  }

  update(leftExpression, operator, rightExpression) {
    if (negativeLeftOperand !== null && negativeRightOperand !== null) {
      this.element.textContent =
        "(" +
        leftExpression +
        ")" +
        " " +
        operator +
        " " +
        "(" +
        rightExpression +
        ")";
    }

    if (negativeLeftOperand !== null && negativeRightOperand === null) {
      this.element.textContent =
        "(" + leftExpression + ")" + " " + operator + " " + rightExpression;
    }

    if (negativeLeftOperand === null && negativeRightOperand !== null) {
      this.element.textContent =
        leftExpression + " " + operator + " " + "(" + rightExpression + ")";
    }
  }

  delete() {
    if (operandTwo !== "") {
      operandTwo = operandTwo.slice(0, length - 1);

      if (operandTwo[operandTwo.length - 1] === "-") {
        negativeRightOperand = null;
        return (operandTwo = operandTwo.slice(0, length - 1));
      }
      return;
    }

    if (operandTwo === "" && operator !== "") {
      return (operator = operator.slice(0, length - 1));
    }

    if (operandOne !== "") {
      operandOne = operandOne.slice(0, length - 1);

      if (operandOne[operandOne.length - 1] === "-") {
        negativeLeftOperand = null;
        return (operandOne = operandOne.slice(0, length - 1));
      }
      return;
    }
  }
}

let displayOperations = new Display(display);
let hasParanthesesDisplayOperations = new IsNegative(display);

function appendOperandsAndDisplayData() {
  operandOne = removeDelimiters(operandOne);
  operandOne = checkDelimiters(operandOne);

  operandTwo = removeDelimiters(operandTwo);
  operandTwo = checkDelimiters(operandTwo);

  if (negativeLeftOperand !== null || negativeRightOperand !== null) {
    hasParanthesesDisplayOperations.update(operandOne, operator, operandTwo);
    return;
  }

  displayOperations.update(operandOne, operator, operandTwo);
}

function deleteOperandsAndDisplayData() {
  if (negativeLeftOperand !== null || negativeRightOperand !== null) {
    hasParanthesesDisplayOperations.delete();
    return;
  }

  displayOperations.delete();
}

function flushData() {
  displayOperations.clear();
  negativeLeftOperand = null;
  negativeRightOperand = null;
}

function checkDelimiters(expression) {
  let length = expression.length;
  let formattedExpression;

  if (expression[length - 1] === ")") {
    expression = expression.slice(1, length - 1);

    if (expression.includes(".")) {
      formattedExpression = separateExpressions(expression);
      return "(" + formattedExpression + ")";
    }

    formattedExpression = setDelimiters(expression);
    return "(" + formattedExpression + ")";
  }

  if (expression.includes(".") && !expression.includes("(")) {
    formattedExpression = separateExpressions(expression);
    return formattedExpression;
  }

  formattedExpression = setDelimiters(expression);
  return formattedExpression;
}

function separateExpressions(expression) {
  let index = expression.indexOf(".");
  let integerExpression = expression.slice(0, index);
  let fractionalExpression = expression.slice(index + 1);

  let formattedIntegerExpression = setDelimiters(integerExpression);
  let formattedFractionalExpression = setDelimiters(fractionalExpression);

  return formattedIntegerExpression + "." + formattedFractionalExpression;
}

function setDelimiters(expression) {
  let length = expression.length;

  if (expression.includes("E")) {
    length = expression.indexOf("E");
  }

  if (expression.includes("e")) {
    length = expression.indexOf("e");
  }

  if (length > 3) {
    if (expression[length - 4] !== "-")
      expression =
        expression.slice(0, length - 3) + "," + expression.slice(length - 3);
  }

  if (length > 5) {
    let index = expression.indexOf(",");

    while (index > 0) {
      if (index - 2 <= 0) break;
      if (expression[index - 3] === "-") break;
      expression =
        expression.slice(0, index - 2) + "," + expression.slice(index - 2);
      index -= 2;
    }
  }
  return expression;
}

function removeDelimiters(expression) {
  return expression.replaceAll(",", "");
}
