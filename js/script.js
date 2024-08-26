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

const proxyHandler = {
  set(object, key, value) {
    object[key] = value;
    displayExpressions();
  },
};

const proxyForExpressions = new Proxy(expressions, proxyHandler);

function displayExpressions() {
  let display = document.querySelector(".display h2");
  let displayContent = [];

  for (let key in expressions) {
    displayContent.push(expressions[key]);
  }

  const mapDisplayContext = {
    Yes: (display.textContent = "0"),
    No: () => {
      let context = displayContent.filter((item) => item !== "").join("");
      context.length > 3
        ? (display.textContent = formatNumbers(context))
        : (display.textContent = context);
    },
  };

  displayContent.every((item) => item === "")
    ? mapDisplayContext["Yes"]
    : mapDisplayContext["No"]();
}

function formatNumbers(string) {
  let displayContext = string.split("");
  let length = displayContext.length;

  displayContext.splice(length - 3, 0, ",");

  delimiterChecker(displayContext);
  return displayContext.join("");
}

function delimiterChecker(array) {
  let position = array.indexOf(",");

  if (position - 2 <= 0) {
    return;
  } else {
    array.splice(position - 2, 0, ",");
    delimiterChecker(array);
  }
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

function checkExpressions(key) {
  let expValues = Object.values(expressions);
  let notEmptyPositions =
    expValues
      .map((item, index) => (item !== "" ? index : ""))
      .filter((item) => item !== "")
      .toString()
      .split(",")
      .join("") || "empty";

  if (key >= 0 && key <= 9) {
    numericHandler(key, notEmptyPositions);
  } else {
    operatorHandler(key, notEmptyPositions);
  }
}

function numericHandler(key, index) {
  let unaryChecker = checkForUnary(key);
  const mapExpressions = new Map([
    [
      "isUnary",
      {
        0() {
          let context = proxyForExpressions.expressionOne;
          let length = context.length - 1;

          proxyForExpressions.expressionOne =
            context.slice(0, length) + key + context.slice(length);
        },
        "01"() {
          if (expressions.expressionOne !== "" && expressions.operator != "") {
            proxyForExpressions.expressionTwo = key;
          }
        },
        "012"() {
          let context = String(proxyForExpressions.expressionTwo);
          let length = context.length - 1;

          if (context.includes("(") !== -1) {
            proxyForExpressions.expressionTwo =
              context.slice(0, length) + key + context.slice(length);
          } else {
            context += key;
          }
        },
      },
    ],
    [
      "notUnary",
      {
        empty() {
          proxyForExpressions.expressionOne += key;
        },
        0() {
          proxyForExpressions.expressionOne += key;
        },
        "01"() {
          proxyForExpressions.expressionTwo += key;
        },
        "012"() {
          proxyForExpressions.expressionTwo += key;
        },
      },
    ],
  ]);
  mapExpressions.get(unaryChecker)[index]();
}

function operatorHandler(key, index) {
  let unaryChecker = checkForUnary(key);

  const mapExpressions = new Map([
    [
      "isUnary",
      {
        empty() {
          proxyForExpressions.expressionOne = "(" + key + ")";
        },
        0() {
          console.log("claire");
        },
        "01"() {
          proxyForExpressions.expressionTwo = "(" + key + ")";
        },
        "012"() {
          calculateExpressions();
        },
      },
    ],
    [
      "notUnary",
      {
        empty() {
          proxyForExpressions.expressionOne = "";
        },
        0() {
          if (
            expressions.expressionOne.includes("(") &&
            expressions.expressionOne.length <= 3
          )
            proxyForExpressions.operator = "";
          else proxyForExpressions.operator = key;
        },
        "01"() {
          let operator = proxyForExpressions.operator;
          if (operator === "-" && key === "-")
            proxyForExpressions.expressionTwo = "(" + key + ")";
          else proxyForExpressions.operator = key;
        },
        "012"() {
          calculateExpressions();
        },
      },
    ],
  ]);

  mapExpressions.get(unaryChecker)[index]();
}

function checkForUnary(key) {
  let value = key;

  if (key >= 0 && key <= 9) {
    value = "digit";
  }

  const checkUnary = new Map([
    [
      "-",
      () => {
        if (expressions.expressionOne === "") return "isUnary";
        if (expressions.operator === "-" && expressions.expressionTwo === "")
          return "isUnary";
        if (expressions.operator !== "-" && value === "-") return "notUnary";
        if (
          expressions.operator === "-" &&
          expressions.expressionTwo.includes("(")
        )
          return "isUnary";
        if (expressions.expressionOne.includes("(")) return "isUnary";
      },
    ],
    [
      "digit",
      () => {
        if (
          expressions.expressionOne.includes("(") ||
          expressions.expressionTwo.includes("(")
        )
          return "isUnary";
        else return "notUnary";
      },
    ],
  ]);

  let result = checkUnary.get(value) ? checkUnary.get(value)() : "notUnary";
  return result;
}

function calculateExpressions() {}

function deleteExpressions() {}

function setFloatingPoint() {}

function setUnaryOperator() {}

function isReset() {}
