const digits = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
};

const operators = {
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  "%": "%",
  "^": "^",
  "=": "=",
};

const expressions = new Map([
  ["leftOperand", []],
  ["operator", []],
  ["rightOperand", []],
]);

function checkExpressions(key) {
  let operandOne = expressions.get("leftOperand");
  let sign = expressions.get("operator");
  let operandTwo = expressions.get("rightOperand");

  let operandOneLength = operandOne.length > 0 ? "1" : "0";
  let signLength = sign.length > 0 ? "1" : "0";
  let operandTwoLength = operandTwo.length > 0 ? "1" : "0";

  let positions = operandOneLength + signLength + operandTwoLength;

  if (key >= 0 && key <= 9) {
    numericHandler(key, positions);
  } else {
    operatorHandler(key, positions);
  }
}

function numericHandler(key, code) {
  console.log(key);
  console.log(code);
}

let buttons = document.querySelector(".calc-buttons");

document.addEventListener("keydown", getPressedTarget);
buttons.addEventListener("click", getClickedTarget);

function getPressedTarget(e) {
  checkTarget(e.key);
}

function getClickedTarget(e) {
  checkTarget(e.target.getAttribute("data-key"));
}

function checkTarget(key) {
  if (key in digits) {
    checkExpressions(digits[key]);
  }

  if (key in operators) {
    const mapFunction = {
      Backspace: deleteExpressions(),
      Delete: deleteExpressions(),
      ".": setFloatingPoint(),
      "+/-": setUnaryOperator(),
      Clear: isReset(),
    };

    key in mapFunction ? mapFunction[key] : checkExpressions(operators[key]);
  }
}

function calculateExpressions() {}

function deleteExpressions() {}

function setFloatingPoint() {}

function setUnaryOperator() {}

function isReset() {}
