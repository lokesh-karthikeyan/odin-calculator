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

  if (displayContent.every((item) => item === "")) {
    display.textContent = "0";
  } else {
    let context = displayContent.filter((item) => item !== "").join("");

    if (context.length > 3) {
      let context = numberFormat(context);
    }
    display.textContent = context;
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
