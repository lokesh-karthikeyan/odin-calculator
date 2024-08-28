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

let unaryModes = [];

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
  let unaryCheck;

  unaryCheck =
    leftOperand.includes("(") || rightOperand.includes("(") ? "true" : "false";

  const mapExpressions = {
    false: {
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
    },
    true: {
      100() {
        leftOperand.splice(length - 1, 0, key);
      },
    },
  };

  mapExpressions[unaryCheck][code]();

  // console.log(expressions.get("leftOperand"));
}

function setOperatorExpression(key, code) {
  let leftOperand = expressions.get("leftOperand");
  let operator = expressions.get("operator");
  let rightOperand = expressions.get("rightOperand");
  let normalOperators = ["+", "*", "/", "^"];
  let signIdentifier = normalOperators.includes(key)
    ? "normalOperators"
    : "specialOperators";
  let unaryCheck;

  const mapExpressions = {
    "000": {
      normalOperators() {
        leftOperand = "[]";
      },
      specialOperators: {
        "-"() {
          unaryModes.push("left");
        },
        "%"() {
          leftOperand = "[]";
        },
        "="() {
          leftOperand = "[]";
        },
      },
    },
    100: {
      normalOperators() {
        operator.push(key);
      },
      specialOperators: {
        "-"() {
          operator.push(key);
        },
        "%"() {
          operator.push(key);
          calculateExpressions();
        },
        "="() {
          operator.push(key);
          calculateExpressions();
        },
      },
    },
    110: {
      normalOperators() {
        if (!unaryModes.includes("right")) operator.splice(length - 1, 1, key);
      },
      specialOperators: {
        "-"() {
          let currentOperator = operator[operator.length - 1];

          if (currentOperator === "-") unaryModes.push("right");
          if (!unaryModes.includes("right"))
            operator.splice(length - 1, 1, key);
        },
        "%"() {
          if (!unaryModes.includes("right"))
            operator.splice(length - 1, 1, key);
          calculateExpressions();
        },
        "="() {
          if (!unaryModes.includes("right"))
            operator.splice(length - 1, 1, key);
          calculateExpressions();
        },
      },
    },
  };
  console.log(code);
  signIdentifier === "normalOperators"
    ? mapExpressions[code][signIdentifier]()
    : mapExpressions[code][signIdentifier][key]();
  // mapExpressions[key][unaryCheck][code]();
}

function showExpression() {
  let display = document.querySelector(".display h2");

  if (unaryModes.length > 0) {
    setUnaryMode(display);
    removeDuplicates();
    return;
  }

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

function setUnaryOperator() {}

function removeDuplicates() {
  unaryModes = [...new Set(unaryModes)];
}

function setUnaryMode(element) {
  console.log(unaryModes);

  const mapParantheses = {
    left() {
      element.textContent =
        "(-" +
        expressions.get("leftOperand").join("") +
        ")" +
        " " +
        expressions.get("operator").join("") +
        " " +
        expressions.get("rightOperand").join("");
    },
    right() {
      element.textContent =
        expressions.get("leftOperand").join("") +
        " " +
        expressions.get("operator").join("") +
        " " +
        "(-" +
        expressions.get("rightOperand").join("") +
        ")";
    },
    leftAndRight() {
      element.textContent =
        "(-" +
        expressions.get("leftOperand").join("") +
        ")" +
        " " +
        expressions.get("operator").join("") +
        " " +
        "(-" +
        expressions.get("rightOperand").join("") +
        ")";
    },
  };

  let length = unaryModes.length;
  length === 1
    ? mapParantheses[unaryModes[0]]()
    : mapParantheses["leftAndRight"]();
}

function isReset() {}
