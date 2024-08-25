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
    updateExpression(digits[key]);
  }

  if (key in operators) {
    const mapFunction = {
      Backspace: deleteExpressions(),
      Delete: deleteExpressions(),
      ".": setFloatingPoint(),
      "+/-": setUnaryOperator(),
      Clear: isReset(),
    };

    key in mapFunction ? mapFunction[key] : updateExpression(operators[key]);
  }
}
