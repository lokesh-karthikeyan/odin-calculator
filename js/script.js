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

  updateFormattedExpression();
  showExpression();
}

function updateFormattedExpression() {
  let leftOperand = expressions.get("leftOperand");
  let rightOperand = expressions.get("rightOperand");

  const mapMethods = {
    expressionOne: {
      noParantheses() {
        leftOperand = filterExpressions(leftOperand);
        expressions.set("leftOperand", leftOperand);
      },
      hasParantheses() {
        leftOperand = filterExpressions(leftOperand);
        leftOperand.unshift("(", "-");
        leftOperand.push(")");
        expressions.set("leftOperand", leftOperand);
      },
    },
    expressionTwo: {
      noParantheses() {
        rightOperand = filterExpressions(rightOperand);
        expressions.set("rightOperand", rightOperand);
      },
      hasParantheses() {
        rightOperand = filterExpressions(rightOperand);
        rightOperand.unshift("(", "-");
        rightOperand.push(")");
        expressions.set("rightOperand", rightOperand);
      },
    },
  };

  let paranthesesStatus = isUnary(leftOperand);

  mapMethods["expressionOne"][paranthesesStatus]();
  mapMethods["expressionTwo"][paranthesesStatus]();
}

function isUnary(expression) {
  return expression.includes("(") ? "hasParantheses" : "noParantheses";
}

function filterExpressions(expression) {
  let filteredNumbers = expression.filter(
    (item) => (item >= 0 && item <= 9) || item === ".",
  );

  if (filteredNumbers.includes(".")) {
    let index = filteredNumbers.indexOf(".");
    let partInteger = filteredNumbers.slice(0, index);
    let partFractional = filteredNumbers.slice(index + 1);

    let formattedInteger = addDelimiter(partInteger);
    let formattedFractional = addDelimiter(partFractional);

    formattedInteger.push(".");

    let formattedExpression = formattedInteger.concat(formattedFractional);

    return formattedExpression;
  }

  let formattedExpression = addDelimiter(filteredNumbers);

  return formattedExpression;
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

function setNumericExpression(key, code) {
  let leftOperand = expressions.get("leftOperand");
  let operator = expressions.get("operator");
  let rightOperand = expressions.get("rightOperand");

  console.log(code);

  const mapExpressions = {
    "000"() {
      leftOperand.push(key);
    },
    100() {
      leftOperand.push(key);
    },
    110() {
      rightOperand.push(key);
    },
    111() {
      rightOperand.push(key);
    },
  };

  mapExpressions[code]();

  // console.log(expressions.get("leftOperand"));
}

function setOperatorExpression(key, code) {
  let leftOperand = expressions.get("leftOperand");
  let operator = expressions.get("operator");
  let rightOperand = expressions.get("rightOperand");

  let normalOperators = ["+", "*", "/", "^"];

  let normalSign = normalOperators.includes(key) ? "true" : "false";

  console.log(normalSign);
  console.log(code);
  const mapExpressions = {
    true: {
      "000"() {
        leftOperand = "[]";
      },
      100() {
        operator.push(key);
      },
      110() {
        operator.splice(length - 1, 1, key);
      },
    },
  };

  mapExpressions[normalSign][code]();
}

function showExpression() {
  let display = document.querySelector(".display h2");

  let leftOperand = expressions.get("leftOperand");
  let sign = expressions.get("operator");
  let rightOperand = expressions.get("rightOperand");

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

function setUnaryOperator() {
  // let leftOperand = expressions.get("leftOperand");
  // let sign = expressions.get("operator");
  // let rightOperand = expressions.get("rightOperand");
  //
  // if (sign.length === 0) {
  //   leftOperand.unshift("(", "-");
  //   leftOperand.push(")");
  // }
  // if (sign.length !== 0) {
  //   rightOperand.unshift(("(", "-"));
  //   rightOperand.push(")");
  // }
}

function isReset() {}
