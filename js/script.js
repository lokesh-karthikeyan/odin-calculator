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

const expressions = {
  expressionOne: "",
  operator: "",
  expressionTwo: "",
};

document.addEventListener("keydown", checkTarget);

function checkTarget(e) {
  if (e.key in digits) {
    updateExpression(digits[e.key]);
  }

  if (e.key in operators) {
    const mapFunction = {
      Backspace: deleteExpressions(),
      Delete: deleteExpressions(),
      ".": setFloatingPoint(),
    };

    e.key in mapFunction
      ? mapFunction[e.key]
      : updateExpression(operators[e.key]);
  }
}
