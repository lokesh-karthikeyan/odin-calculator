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
    completeExpressionss();
    displayExpressions();
  },
};

const proxyForExpressions = new Proxy(expressions, proxyHandler);

function completeExpressionss() {
  let expressionValues = [
    ...(proxyForExpressions.expressionOne +
      proxyForExpressions.operator +
      proxyForExpressions.expressionTwo),
  ];
  return expressionValues;
}

function arrayToString(array) {
  return array.map((item) => item.split(""));
}

function displayExpressions() {
  let display = document.querySelector(".display h2");
  let completeExpressions = Object.values(expressions);

  const addDisplayContext = {
    Yes: (display.textContent = "0"),

    No() {
      // let context = completeExpressions
      //   .filter((item) => item !== "")
      //   .join("")
      //   .split("");

      formatNumbers();
      display.textContent = completeExpressionss().join("");
    },
  };
  console.log(completeExpressionss());
  completeExpressions.every((item) => item === "")
    ? addDisplayContext["Yes"]
    : addDisplayContext["No"]();

  // console.log(completeExpressions);
  // let output = formatNumbers([...completeExpressions]);
  // console.log(`output ${output}`);
  // display.textContent = output;
}

function checkExpressions(key) {
  let operandOne = proxyForExpressions.expressionOne;
  let sign = proxyForExpressions.operator;
  let operandTwo = proxyForExpressions.expressionTwo;

  let operandOneLength;
  let signLength;
  let operandTwoLength;

  if (operandOne.length > 0) operandOneLength = "1";
  else operandOneLength = "0";
  if (sign.length > 0) signLength = "1";
  else signLength = "0";
  if (operandTwo.length > 0) operandTwoLength = "1";
  else operandTwoLength = "0";

  let positions = operandOneLength + signLength + operandTwoLength;

  if (key >= 0 && key <= 9) {
    numericHandler(key, positions);
  } else {
    operatorHandler(key, positions);
  }
}

function numericHandler(key, positionCode) {
  const mapMethods = {
    operandOne() {
      proxyForExpressions.expressionOne += key;
    },
    sign() {
      proxyForExpressions.operator += key;
    },
    operandTwo() {
      proxyForExpressions.expressionTwo += key;
    },
  };

  const mapExpressions = {
    "000"() {
      mapMethods["operandOne"]();
    },
    100() {
      mapMethods["operandOne"]();
    },
  };

  mapExpressions[positionCode]();
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
