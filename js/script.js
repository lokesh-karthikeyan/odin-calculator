let operandOne = "";
let operator = "";
let operandTwo = "";
let negativeLeftOperand = null;
let negativeRightOperand = null;
let display = document.querySelector(".display h2");

/*******************************************************************************
 * Event Listener's objective: "DOMContentLoaded" event is to do some          *
 * actions as soon as page is loaded.                                          *
 *******************************************************************************/

document.addEventListener("DOMContentLoaded", sayGreeting);

/*********************************************************************************
 * Function objective: To say greeting and it will revert back in 600ms.         *
 *********************************************************************************/

function sayGreeting() {
  display.textContent = "Hello!";

  setTimeout(() => {
    display.textContent = "0";
  }, 600);
}

/************************************************************************************
 * Event Listener's objective: This is a "keydown" event which adds support         *
 * for the keyboard in the site.                                                    *
 ************************************************************************************/

document.addEventListener("keydown", getPressedTarget);

/*****************************************************************************
 * Function objective: Helper function -> which passes the pressed key.      *
 *****************************************************************************/

function getPressedTarget(e) {
  keyHandler(e.key);
}

/********************************************************************************************
 * Event Listener's objective: Used Event delegation (click) to target the contents         *
 * inside the container.                                                                    *
 ********************************************************************************************/

let buttons = document.querySelector(".calc-buttons");

buttons.addEventListener("click", getClickedTarget);

/*******************************************************************************
 * Function objective: Helper function -> which passes the clicked target's    *
 * HTML data-key's attribute value.                                            *
 *******************************************************************************/

function getClickedTarget(e) {
  keyHandler(e.target.getAttribute("data-key"));
}

/*****************************************************************************
 * Function objective: Helper function -> Central key handling function      *
 * where it calls the proper functions / methods based on the target keys.   *
 *****************************************************************************/

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

/*****************************************************************************
 * Class's objective: It is to update, or delete, or wipe the data of        *
 * the operands & operators and also show the changes in display UI.         *
 *****************************************************************************/

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

/*****************************************************************************
 * Class's objective: Sub Class -> It is to update, or delete the data of    *
 * the operands & operators and also show the changes in display UI.         *
 * This is for the "Parantheses" based value's methods.                      *
 *****************************************************************************/

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

      if (operandTwo.length === 0 && negativeRightOperand !== null)
        negativeRightOperand = null;

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

      if (operandOne.length === 0 && negativeLeftOperand !== null)
        negativeLeftOperand = null;

      if (operandOne[operandOne.length - 1] === "-") {
        negativeLeftOperand = null;
        return (operandOne = operandOne.slice(0, length - 1));
      }
      return;
    }
  }
}

// Instance of the above classes.

let displayOperations = new Display(display);
let hasParanthesesDisplayOperations = new IsNegative(display);

/*********************************************************************************
 * Function objective: Helper function -> Removes & re-adds the "," comma        *
 * delimiters. Then, calls proper class's methods based on the scenarios to      *
 * update the Display UI.                                                        *
 *********************************************************************************/

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

/********************************************************************************
 * Function objective: Helper function -> Calls the proper class's methods      *
 * to delete the operands & operators & also update the HTML element.           *
 ********************************************************************************/

function deleteOperandsAndDisplayData() {
  if (negativeLeftOperand !== null || negativeRightOperand !== null) {
    hasParanthesesDisplayOperations.delete();
    return;
  }

  displayOperations.delete();
}

/********************************************************************************
 * Function objective: Helper function -> Calls the proper class's methods      *
 * to wipe clean the operands & operators & also removes any parantheses.       *
 ********************************************************************************/

function flushData() {
  displayOperations.clear();
  negativeLeftOperand = null;
  negativeRightOperand = null;
}

/********************************************************************************
 * Function objective: Helper function -> Checks the expressions if there's     *
 * parantheses & period and calls proper functions based on that info.          *
 ********************************************************************************/

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

/********************************************************************************
 * Function objective: Helper function -> It just separates the integer &       *
 * fractional part of the decimal, and after processed it will then joins.      *
 ********************************************************************************/

function separateExpressions(expression) {
  let index = expression.indexOf(".");
  let integerExpression = expression.slice(0, index);
  let fractionalExpression = expression.slice(index + 1);

  let formattedIntegerExpression = setDelimiters(integerExpression);
  let formattedFractionalExpression = setDelimiters(fractionalExpression);

  return formattedIntegerExpression + "." + formattedFractionalExpression;
}

/*****************************************************************************
 * Function objective: It sets the "," Comma delimiters looping through      *
 * the expression.                                                           *
 *****************************************************************************/

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

/*****************************************************************************
 * Function objective: Removes the "," Commas from the expression.           *
 *****************************************************************************/

function removeDelimiters(expression) {
  return expression.replaceAll(",", "");
}

/**********************************************************************************
 * Function objective: It acts like a toggler which adds & removes parantheses.   *
 * It also adds "-" minus sign if necessary.                                      *
 **********************************************************************************/

function toggleParantheses() {
  if (operator === "") {
    if (negativeLeftOperand === null) {
      if (operandOne === "Err" || operandOne === "∞" || operandOne === "-∞")
        return;
      if (operandOne[0] !== "-") operandOne = "-" + operandOne.slice(0);
      return (negativeLeftOperand = "true");
    }

    if (negativeLeftOperand !== null) {
      operandOne = operandOne.slice(1);
      return (negativeLeftOperand = null);
    }
  }

  if (operator !== "") {
    if (negativeRightOperand === null) {
      operandTwo = "-" + operandTwo.slice(0);
      return (negativeRightOperand = "true");
    }

    if (negativeRightOperand !== null) {
      operandTwo = operandTwo.slice(1);
      return (negativeRightOperand = null);
    }
  }
}

/*********************************************************************************
 * Class's objective: It has a single public method & the rest all are private.  *
 * The public method decides if it's numeric (or) operators & calls the          *
 * proper private method to append values to the operands & operators.           *
 *********************************************************************************/

class ExpressionHandler {
  update(key) {
    let validOperators = ["+", "-", "*", "/", "^", "%", "="];

    if (validOperators.includes(key)) {
      this.#updateOperator(key);
    }

    if (hasNumbers(key) || key === ".") {
      this.#updateNumericValue(key);
    }
  }

  #updateNumericValue(key) {
    if (operator === "") {
      if (operandOne.includes(".") && key === ".") return;
      if (operandOne === "Err" || operandOne === "∞" || operandOne === "-∞") {
        operandOne = "";
        if (negativeLeftOperand !== null) negativeLeftOperand = null;
      }
      operandOne += key;
    }

    if (operator !== "") {
      if (operandTwo.includes(".") && key === ".") return;
      operandTwo += key;
    }
  }

  #updateOperator(key) {
    if (operandOne === "" && operator === "" && operandTwo === "") {
      if (key !== "-") {
        return (operator = "");
      }

      if (key === "-") {
        negativeLeftOperand = "true";
        return (operandOne += key);
      }
    }

    if (operandOne !== "" && operator === "" && operandTwo === "") {
      if (hasNumbers(operandOne) && key === "=") {
        return (operator = "");
      }

      if (hasNumbers(operandOne) && key !== "%") {
        return (operator = key);
      }

      if (hasNumbers(operandOne) && key === "%") {
        operandOne = expressionConversion(key);
        return (operator = "");
      }
    }

    if (operandOne !== "" && operator !== "" && operandTwo === "") {
      if (key === "=") {
        return;
      }

      if (key === "%") {
        operandOne = expressionConversion(key);
        return (operator = "");
      }

      if (key === "-") {
        if (operator === "-") {
          negativeRightOperand = "true";
          return (operandTwo += key);
        }
        return (operator = key);
      }
      return (operator = key);
    }

    if (operandOne !== "" && operator !== "" && operandTwo !== "") {
      if (key !== "%" && hasNumbers(operandTwo)) {
        expressionConversion(key);
      }

      if (key === "%" && hasNumbers(operandTwo)) {
        operandTwo = expressionConversion(key);
      }
    }
  }
}

/***********************************************************************************
 * Function objective: It checks if the string (or) character has any numbers.     *
 ***********************************************************************************/

function hasNumbers(string) {
  return string.match(/\d/) !== null;
}

/*********************************************************************************
 * Function objective: It prepares the operands for calculation by removing      *
 * delimiters & parses based on the operands value such as float, number, int.   *
 * It then updates the operands & operators values.                              *
 *********************************************************************************/

function expressionConversion(key) {
  let expressionOne = removeDelimiters(operandOne);
  let expressionTwo = removeDelimiters(operandTwo);

  if (operandOne.includes(".") || operandTwo.includes(".")) {
    expressionOne = parseFloat(expressionOne);
    expressionTwo = parseFloat(expressionTwo);
  } else if (operandOne.includes("e") || operandTwo.includes("e")) {
    expressionOne = Number(expressionOne);
    expressionTwo = Number(expressionTwo);
  } else {
    expressionOne = parseInt(expressionOne);
    expressionTwo = parseInt(expressionTwo);
  }

  if (key === "%") {
    let result;

    if (operandOne !== "" && operandTwo === "") {
      result = Calculate.inPercentage(expressionOne).toFixed(2);
    }
    if (operandOne !== "" && operandTwo !== "") {
      result = Calculate.inPercentage(expressionTwo).toFixed(2);
    }
    return result.toString();
  }

  let result = calculateExpressions(expressionOne, expressionTwo);

  if (result === Infinity) result = "∞";
  if (result === -Infinity) result = "-∞";
  if (Number.isNaN(result)) result = "Err";
  if (String(result).includes(".")) result = result.toFixed(2);
  if (!String(result).includes("-")) negativeLeftOperand = null;

  operandOne = result.toString();
  operator = key !== "=" ? key : "";

  if (result === "∞" || result === "-∞" || result === "Err") operator = "";

  if (negativeRightOperand !== null) negativeRightOperand = null;
  operandTwo = "";
}

/**********************************************************************************
 * Class's objective: It contains all the methods as static. These static         *
 * methods contains calculation formulas which calculates & returns the result.   *
 **********************************************************************************/

class Calculate {
  static addition(operandOne, operandTwo) {
    return Number(operandOne) + Number(operandTwo);
  }

  static subtraction(operandOne, operandTwo) {
    return operandOne - operandTwo;
  }

  static multiplication(operandOne, operandTwo) {
    return operandOne * operandTwo;
  }

  static division(dividend, divisor) {
    return divisor !== 0 ? dividend / divisor : "Err";
  }

  static exponential(base, power) {
    return base ** power;
  }

  static inPercentage(value) {
    return (value * 1) / 100;
  }
}

/***********************************************************************************
 * Function objective: Helper function -> Calls the appropriate method based       *
 * on the current value of the operator & returns the result.                      *
 ***********************************************************************************/

function calculateExpressions(expressionOne, expressionTwo) {
  const mapCalculations = new Map([
    ["+", Calculate.addition(expressionOne, expressionTwo)],
    ["-", Calculate.subtraction(expressionOne, expressionTwo)],
    ["*", Calculate.multiplication(expressionOne, expressionTwo)],
    ["/", Calculate.division(expressionOne, expressionTwo)],
    ["^", Calculate.exponential(expressionOne, expressionTwo)],
  ]);

  return mapCalculations.get(operator);
}
