// constant variables
const howManyCards = 24;

// cache
const cards = document.getElementsByClassName("card");
const frontOfCards = document.getElementsByClassName("front");
const backOfcards = document.getElementsByClassName("back");

// state variables
const cardsSelected = {
  first: null,
  second: null,
};
// event listners
document.querySelector("button").addEventListener("click", function () {
  shuffleAndImageRender();
  [...cards].forEach((element) => (element.style.visibility = "visible"));
});

// renders
init();
function init() {
  renderCards();
  shuffleAndImageRender();
  checkCards();
  //renderFlipEffect();
}
// functions

let compareTwoCards = [];
function checkCards() {
  [...frontOfCards].forEach((element) =>
    element.addEventListener("click", function (event) {
      event.target.parentNode.classList.toggle("is-flipped");
      compareTwoCards.push(event.target.parentNode);
      if (compareTwoCards[1]) {
        if (compareTwoCards[0].className === compareTwoCards[1].className) {
          pairMatched();
        } else {
          flippingBack();
        }
      }
    })
  );
}
function flippingBack() {
  setTimeout(function () {
    [...compareTwoCards].forEach((element) =>
      element.classList.toggle("is-flipped")
    );
    compareTwoCards = [];
  }, 1500);
}

function pairMatched() {
  setTimeout(function () {
    [...compareTwoCards].forEach(
      (element) => (element.style.visibility = "hidden")
    );
    compareTwoCards = [];
  }, 1500);
}

function renderCards() {
  for (let i = 0; i < howManyCards; i++) {
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
  for (let i = 0; i < howManyCards / 2; i++) {
    numbers.push(i);
    numbers.push(i);
  }

  const shuffledNumbers = numbers
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  for (let i = 0; i < howManyCards; i++) {
    [...frontOfCards][i].setAttribute(
      "class",
      `card__face ${shuffledNumbers[i]} front`
    );
    [...cards][i].setAttribute("class", `card ${shuffledNumbers[i]}`);
    [...backOfcards][i].innerText = shuffledNumbers[i];
  }
}

/* function renderFlipEffect() {
  [...cards].forEach((card) => {
    card.addEventListener("click", function () {
      card.classList.toggle("is-flipped");
    });
  });
} */
