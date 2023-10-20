// constant variables
const boardElement = document.getElementById("board");
const playSetups = {
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

const SOUNDS = {
  click: "assets/sounds/click.wav",
  achievement: "assets/sounds/achievement.wav",
};

const IMAGES = {
  icon0: "assets/images/icon0.png",
  icon1: "assets/images/icon1.png",
  icon2: "assets/images/icon2.png",
  icon3: "assets/images/icon3.png",
  icon4: "assets/images/icon4.png",
  icon5: "assets/images/icon5.png",
  icon6: "assets/images/icon6.png",
  icon7: "assets/images/icon7.png",
  icon8: "assets/images/icon8.png",
  icon9: "assets/images/icon9.png",
  icon10: "assets/images/icon10.png",
  icon11: "assets/images/icon11.png",
};

const audioPlayer = new Audio();
const flippingBackDelay = 800;
const pairDisappearDelay = 300;

// cache
const cardElements = document.getElementsByClassName("card");
const frontFaceElements = document.getElementsByClassName("front");
const backFaceElements = document.getElementsByClassName("back");
const turnsElement = document.getElementById("turns");
const buttonNormal = document.getElementById("mode-normal");
const buttonEasy = document.getElementById("mode-easy");

// state variables

let aPairOfCardsArray = [];
let numberOfTurns = 0;
let numberOfCards;
let timerId;
let second = 0;

// renders
init();
function init() {
  renderMessage();
  easyMode();
  normalMode();
}

function renders() {
  renderCards();
  shuffleCards();
  areThePairMatched();
  resetTurns();
  stopTimer();
  resetTimer();
}
// event listners

function renderButtonFunction() {
  document.querySelector("button").addEventListener("click", function () {
    aPairOfCardsArray = [];
    shuffleCards();
    removeCardAnimation();
    resetTurns();
    stopTimer();
    resetTimer();
  });
}

function easyMode() {
  buttonEasy.addEventListener("click", function () {
    if (numberOfCards === playSetups.cards16.numbers) return;
    removeMessage();
    fetchCardLayout(16);
    renders();
    renderButtonFunction();
  });
}

function normalMode() {
  buttonNormal.addEventListener("click", function () {
    if (numberOfCards === playSetups.cards24.numbers) return;
    removeMessage();
    fetchCardLayout(24);
    renders();
    renderButtonFunction();
  });
}

function fetchCardLayout(presetNumber) {
  [...cardElements].forEach((element) => element.remove());
  numberOfCards = playSetups[`cards${presetNumber}`].numbers;
  playSetups[`cards${presetNumber}`].layout();
}

function areThePairMatched() {
  [...frontFaceElements].forEach((element) =>
    element.addEventListener("click", function (event) {
      if (aPairOfCardsArray.length === 2) return;

      //console.log("clicked");
      countTurns();
      startTimer();
      event.target.parentNode.classList.toggle("is-flipped");
      aPairOfCardsArray.push(event.target.parentNode);
      if (
        aPairOfCardsArray[0].className.includes("is-flipped") &&
        aPairOfCardsArray[1] === undefined
      )
        return;
      if (aPairOfCardsArray[1]) {
        if (aPairOfCardsArray[0].className === aPairOfCardsArray[1].className) {
          pairMatched();
          showAllCardsWhenFinished();
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
    [...aPairOfCardsArray].forEach((element) =>
      element.classList.toggle("is-flipped")
    );
    aPairOfCardsArray = [];
  }, flippingBackDelay);
}

function pairMatched() {
  setTimeout(function () {
    [...aPairOfCardsArray].forEach((element) => {
      element.classList.add("animate__animated");
      element.classList.add("animate__fadeOut");
      audioPlayer.src = SOUNDS.click;
      audioPlayer.play();
    });
    aPairOfCardsArray = [];
    showAllCardsWhenFinished();
  }, pairDisappearDelay);
}

function renderCards() {
  for (let i = 0; i < numberOfCards; i++) {
    const cardDiv = document.createElement("div");
    document
      .getElementById("board")
      .appendChild(cardDiv)
      .setAttribute("class", "card");
  }
  [...document.getElementsByClassName("card")].forEach((element) => {
    const frontFaceDiv = document.createElement("div");
    const backFaceDiv = document.createElement("div");
    element.appendChild(frontFaceDiv).setAttribute("class", "card__face front");
    element.appendChild(backFaceDiv).setAttribute("class", "card__face back");
  });
  [...document.getElementsByClassName("back")].forEach((element) => {
    const img = document.createElement("img");
    element.appendChild(img);
  });
}

function shuffleCards() {
  let numbers = [];
  for (let i = 0; i < numberOfCards / 2; i++) {
    numbers.push(i);
    numbers.push(i);
  }

  const shuffledNumbers = numbers
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  for (let i = 0; i < numberOfCards; i++) {
    [...frontFaceElements][i].setAttribute(
      "class",
      `card__face ${shuffledNumbers[i]} front`
    );
    [...backFaceElements][i].setAttribute(
      "class",
      `card__face ${shuffledNumbers[i]} back`
    );
    [...cardElements][i].setAttribute("class", `card ${shuffledNumbers[i]}`);
    [...document.querySelectorAll("img")][i].setAttribute(
      "src",
      IMAGES[`icon${shuffledNumbers[i]}`]
    );
    //[...backFaceElements][i].innerText = shuffledNumbers[i];
  }
}

function showAllCardsWhenFinished() {
  if (
    [...cardElements].every((element) =>
      element.classList.contains("animate__fadeOut")
    )
  ) {
    setTimeout(() => {
      [...cardElements].forEach((element) =>
        element.classList.remove("animate__fadeOut")
      );
      [...document.querySelectorAll("img")].forEach((element) => {
        element.setAttribute("class", "animate__animated animate__bounce");
      });

      audioPlayer.src = SOUNDS.achievement;
      audioPlayer.pause();
      audioPlayer.play();
    }, 500);
    stopTimer();
    logThePlay();
  }
}

function removeCardAnimation() {
  [...document.querySelectorAll("img")].forEach((element) => {
    element.classList.toggle("animate__bounce");
  });
}

function countTurns() {
  numberOfTurns += 1;
  turnsElement.innerText = `Turns: ${numberOfTurns}`;
}

function resetTurns() {
  numberOfTurns = 0;
  turnsElement.innerText = `Turns: ${numberOfTurns}`;
}

function renderMessage() {
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
  if (numberOfTurns === 1) {
    timerId = setInterval(function () {
      second++;
      document.getElementById("clock").innerHTML = `TIME: ${second} s`;
    }, 1000);
  }
  if (numberOfTurns > 1) return;
}

function stopTimer() {
  clearInterval(timerId);
}

function resetTimer() {
  second = 0;
  document.getElementById("clock").innerHTML = `TIME: ${second} s`;
}

function logThePlay() {
  const playLogList = document.createElement("li");
  let isEasyOrNormal;
  if ([...cardElements].length === 24) {
    isEasyOrNormal = "NORMAL";
  } else isEasyOrNormal = "EASY";
  playLogList.innerHTML = `${isEasyOrNormal} <strong>|</strong> <strong>${numberOfTurns}</strong> turns <strong>${second}</strong>s`;
  if ([...document.querySelectorAll("li")].length > 4) {
    [...document.querySelectorAll("li")][0].remove();
  }
  document.querySelector("ol").appendChild(playLogList);
}
