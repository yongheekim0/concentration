// constant variables
const boardElement = document.getElementById("board");
const playSetup = {
  cards24: {
    numbers: 24,
    layout() {
      boardElement.style.gridTemplateColumns = "repeat(6, 16vmin)";
      boardElement.style.gridTemplateRows = "repeat(4, 16vmin)";
    },
  },
  cards16: {
    numbers: 16,
    layout() {
      boardElement.style.gridTemplateColumns = "repeat(4, 16vmin)";
      boardElement.style.gridTemplateRows = "repeat(4, 16vmin)";
    },
  },
};
const flippingBackDelay = 1000;
const pairDisappearDelay = 300;

// cache
const cards = document.getElementsByClassName("card");
const frontOfCards = document.getElementsByClassName("front");
const backOfcards = document.getElementsByClassName("back");
const turnsElement = document.getElementById("turns");
const buttonNormal = document.getElementById("mode-normal");
const buttonEasy = document.getElementById("mode-easy");

// state variables

let turnsStart = 0;
let cardNumbers;

// renders
init();
function init() {
  messageRender();
  easyMode();
  normalMode();
}
// event listners
document.querySelector("button").addEventListener("click", function () {
  [...cards].forEach((element) => (element.style.visibility = "visible"));
  shuffleAndImageRender();
  resetTurns();
});

function easyMode() {
  buttonEasy.addEventListener("click", function () {
    removeMessage();
    if (cardNumbers === playSetup.cards16.numbers) return;
    [...cards].forEach((element) => element.remove());
    cardNumbers = playSetup.cards16.numbers;
    playSetup.cards16.layout();
    renderCards();
    shuffleAndImageRender();
    checkCards();
    resetTurns();
  });
}

function normalMode() {
  buttonNormal.addEventListener("click", function () {
    removeMessage();
    if (cardNumbers === playSetup.cards24.numbers) return;
    [...cards].forEach((element) => element.remove());
    cardNumbers = playSetup.cards24.numbers;
    playSetup.cards24.layout();
    renderCards();
    shuffleAndImageRender();
    checkCards();
    resetTurns();
  });
}

let compareTwoCards = [];
function checkCards() {
  [...frontOfCards].forEach((element) =>
    element.addEventListener("click", function (event) {
      if (compareTwoCards.length === 2) return;
      console.log("clicked");
      addTurns();
      event.target.parentNode.classList.toggle("is-flipped");
      compareTwoCards.push(event.target.parentNode);
      if (
        compareTwoCards[0].className.includes("is-flipped") &&
        compareTwoCards[1] === undefined
      )
        return;
      if (compareTwoCards[1]) {
        if (compareTwoCards[0].className === compareTwoCards[1].className) {
          pairMatched();
          result();
        } else {
          flippingBack();
        }
      }
    })
  );
}

// functions

function flippingBack() {
  setTimeout(function () {
    [...compareTwoCards].forEach((element) =>
      element.classList.toggle("is-flipped")
    );
    compareTwoCards = [];
  }, flippingBackDelay);
}

function pairMatched() {
  setTimeout(function () {
    [...compareTwoCards].forEach(
      (element) => (element.style.visibility = "hidden")
    );
    compareTwoCards = [];
    result();
  }, pairDisappearDelay);
}

function renderCards() {
  for (let i = 0; i < cardNumbers; i++) {
    const card = document.createElement("div");
    document
      .getElementById("board")
      .appendChild(card)
      .setAttribute("class", "card");
  }
  [...document.getElementsByClassName("card")].forEach((element) => {
    const frontFace = document.createElement("div");
    const backFace = document.createElement("div");
    element.appendChild(frontFace).setAttribute("class", "card__face front");
    element.appendChild(backFace).setAttribute("class", "card__face back");
  });
}

function shuffleAndImageRender() {
  let numbers = [];
  for (let i = 0; i < cardNumbers / 2; i++) {
    numbers.push(i);
    numbers.push(i);
  }

  const shuffledNumbers = numbers
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  for (let i = 0; i < cardNumbers; i++) {
    [...frontOfCards][i].setAttribute(
      "class",
      `card__face ${shuffledNumbers[i]} front`
    );
    [...cards][i].setAttribute("class", `card ${shuffledNumbers[i]}`);
    [...backOfcards][i].innerText = shuffledNumbers[i];
  }
}

function result() {
  if ([...cards].every((element) => element.style.visibility === "hidden")) {
    setTimeout(() => {
      [...cards].forEach((element) => (element.style.visibility = "visible"));
    }, 500);
  }
}

function addTurns() {
  turnsStart += 1;
  turnsElement.innerText = `Turns: ${turnsStart}`;
}

function resetTurns() {
  turnsStart = 0;
  turnsElement.innerText = `Turns: ${turnsStart}`;
}

function messageRender() {
  const message = document.createElement("h3");
  boardElement.appendChild(message);
  message.innerHTML = "Choose Difficulty";
  message.style.textAlign = "center";
  message.style.lineHeight = "30vmin";
  message.style.fontSize = "3vmin";
  message.style.letterSpacing = "1vmin";
}
function removeMessage() {
  document.querySelector("h3").style.display = "none";
}
