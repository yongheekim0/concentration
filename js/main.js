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

const IMAGES = {
  icon0: "assets/icon0.png",
  icon1: "assets/icon1.png",
  icon2: "assets/icon2.png",
  icon3: "assets/icon3.png",
  icon4: "assets/icon4.png",
  icon5: "assets/icon5.png",
  icon6: "assets/icon6.png",
  icon7: "assets/icon7.png",
  icon8: "assets/icon8.png",
  icon9: "assets/icon9.png",
  icon10: "assets/icon10.png",
  icon11: "assets/icon11.png",
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
let timerId;
let second = 0;

// renders
init();
function init() {
  messageRender();
  easyMode();
  normalMode();
}

function renders() {
  renderCards();
  shuffleCards();
  checkCards();
  resetTurns();
  stopTimer();
  resetTimer();
}
// event listners

function button() {
  document.querySelector("button").addEventListener("click", function () {
    [...cards].forEach((element) => (element.style.visibility = "visible"));
    shuffleCards();
    resetTurns();
    stopTimer();
    resetTimer();
  });
}

function easyMode() {
  buttonEasy.addEventListener("click", function () {
    removeMessage();
    if (cardNumbers === playSetup.cards16.numbers) return;
    [...cards].forEach((element) => element.remove());
    cardNumbers = playSetup.cards16.numbers;
    playSetup.cards16.layout();
    renders();
    button();
  });
}

function normalMode() {
  buttonNormal.addEventListener("click", function () {
    removeMessage();
    if (cardNumbers === playSetup.cards24.numbers) return;
    [...cards].forEach((element) => element.remove());
    cardNumbers = playSetup.cards24.numbers;
    playSetup.cards24.layout();
    renders();
    button();
  });
}

let compareTwoCards = [];
function checkCards() {
  [...frontOfCards].forEach((element) =>
    element.addEventListener("click", function (event) {
      if (compareTwoCards.length === 2) return;
      console.log("clicked");
      addTurns();
      startTimer();
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
  [...document.getElementsByClassName("back")].forEach((element) => {
    const img = document.createElement("img");
    element.appendChild(img);
  });
}

function shuffleCards() {
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
    [...backOfcards][i].setAttribute(
      "class",
      `card__face ${shuffledNumbers[i]} back`
    );
    [...cards][i].setAttribute("class", `card ${shuffledNumbers[i]}`);
    [...document.querySelectorAll("img")][i].setAttribute(
      "src",
      IMAGES[`icon${shuffledNumbers[i]}`]
    );
    //[...backOfcards][i].innerText = shuffledNumbers[i];
  }
}

function renderImages() {}

function result() {
  if ([...cards].every((element) => element.style.visibility === "hidden")) {
    setTimeout(() => {
      [...cards].forEach((element) => (element.style.visibility = "visible"));
    }, 500);
    stopTimer();
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

function startTimer() {
  if (turnsStart === 1) {
    timerId = setInterval(function () {
      second++;
      document.getElementById("clock").innerHTML = `TIME: ${second} s`;
    }, 1000);
  }
  if (turnsStart > 1) return;
}

function stopTimer() {
  clearInterval(timerId);
}

function resetTimer() {
  second = 0;
  document.getElementById("clock").innerHTML = `TIME: ${second} s`;
}
