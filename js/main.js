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
    numbers: 6,
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

// state variables

let turnsStart = 0;
let cardNumbers = playSetup.cards16.numbers;
playSetup.cards16.layout();

// renders
init();
function init() {
  renderCards();
  shuffleAndImageRender();
  checkCards();
}
// event listners
document.querySelector("button").addEventListener("click", function () {
  [...cards].forEach((element) => (element.style.visibility = "visible"));
  shuffleAndImageRender();
});

let compareTwoCards = [];
function checkCards() {
  [...frontOfCards].forEach((element) =>
    element.addEventListener("click", function (event) {
      if (compareTwoCards.length === 2) return;
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

//turnsElement.innerText = `Turns: ${turnsStart}`;

/* function renderFlipEffect() {
  [...cards].forEach((card) => {
    card.addEventListener("click", function () {
      card.classList.toggle("is-flipped");
    });
  });
} */
