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

function checkExpressions(key) {
  let operandOneLength = expressions.get("leftOperand").length > 0 ? "1" : "0";
  let signLength = expressions.get("operator").length > 0 ? "1" : "0";
  let operandTwoLength = expressions.get("rightOperand").length > 0 ? "1" : "0";

  let positions = operandOneLength + signLength + operandTwoLength;

  if (key >= 0 && key <= 9) {
    setNumericExpression(key, positions);
  } else {
    setOperatorExpression(key, positions);
  }

  checkDelimiter(
    expressions.get("leftOperand"),
    expressions.get("rightOperand"),
  );

  showExpression();
}

function setNumericExpression(key, code) {
  let leftOperand = expressions.get("leftOperand");
  let operator = expressions.get("operator");
  let rightOperand = expressions.get("rightOperand");
  const mapExpressions = {
    "000"() {
      leftOperand.push(key);
    },
    100() {
      leftOperand.push(key);
    },
  };

  mapExpressions[code]();

  // console.log(expressions.get("leftOperand"));
}

function setOperatorExpression(key, code) {}

function checkDelimiter(leftOperand, rightOperand) {
  let unaryCheckLeftOperand;
  let unaryCheckRightOperand;

  unaryCheckLeftOperand = leftOperand.includes("(") ? "true" : "false";
  unaryCheckRightOperand = rightOperand.includes("(") ? "true" : "false";

  let leftOperandFiltered = leftOperand.filter(
    (item) => (item >= 0 && item <= 9) || item === ".",
  );
  let rightOperandFiltered = rightOperand.filter(
    (item) => (item >= 0 && item <= 9) || item === ".",
  );
  if (leftOperandFiltered.length > 3)
    updateDelimiterExpressions(leftOperandFiltered, unaryCheckLeftOperand);
  if (rightOperandFiltered.length > 3)
    updateDelimiterExpressions(rightOperandFiltered, unaryCheckRightOperand);
}

function updateDelimiterExpressions(expression, isUnary) {
  let periodCheck = expression.includes(".");
  let formattedOutput;

  const mapDelimiter = {
    false: {
      false() {
        formattedOutput = addDelimiter(expression);
      },
      true() {
        formattedOutput = addDelimiter(expression);
        formattedOutput.unshift("(", "-");
        formattedOutput.push(")");
      },
    },

    true: {
      false() {
        let index = expression.indexOf(".");
        let partInteger = expression.slice(0, index);
        let partFractional = expression.slice(index + 1);

        let formattedInteger = addDelimiter(partInteger, isUnary);
        let formattedFractional = addDelimiter(partFractional, isUnary);

        formattedInteger.push(".");

        formattedOutput = formattedInteger.concat(formattedFractional);
      },
      true() {
        let index = expression.indexOf(".");
        let partInteger = expression.slice(0, index);
        let partFractional = expression.slice(index + 1);

        let formattedInteger = addDelimiter(partInteger, isUnary);
        let formattedFractional = addDelimiter(partFractional, isUnary);

        formattedInteger.push(".");

        formattedOutput = formattedInteger.concat(formattedFractional);
        formattedOutput.unshift("(", "-");
        formattedOutput.push(")");
      },
    },
  };

  mapDelimiter[periodCheck][isUnary]();

  if (expressions.get("rightOperand").length === 0) {
    expressions.set("leftOperand", formattedOutput);
  }
  if (expressions.get("operator").length > 0) {
    expressions.set("rightOperand", formattedOutput);
  }
}

function addDelimiter(expression) {
  let slicedExpression = expression.slice();
  let length = slicedExpression.length;

  if (length > 3) slicedExpression.splice(length - 3, 0, ",");
  if (length > 5) {
    let index = slicedExpression.indexOf(",");

    while (index > 0) {
      if (index - 2 <= 0) break;
      slicedExpression.splice(index - 2, 0, ",");
      index -= 2;
    }
  }

  return slicedExpression;
}

function showExpression() {
  let display = document.querySelector(".display h2");

  let leftOperand = expressions.get("leftOperand");
  let sign = expressions.get("operator");
  let rightOperand = expressions.get("rightOperand");

  let context = leftOperand;
  console.log(context);
  if (leftOperand.length === 0 && sign.length === 0) {
    display.textContent = "0";
  } else {
    display.textContent =
      leftOperand.join("") + " " + sign.join("") + " " + rightOperand.join("");
  }
}

function calculateExpressions() {}

function deleteExpressions() {}

function setFloatingPoint() {}

function setUnaryOperator() {}

function isReset() {}
