// constant variables
const howManyCards = 24;

// cache
const cards = document.getElementsByClassName("card");
const backOfcards = document.getElementsByClassName("back");

// state variables
const cardsSelected = {
  first: null,
  second: null,
};
// event listners

// renders
init();
function init() {
  renderCards();
  shuffleAndImageRender();
  renderFlip();
}
// functions

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
    [...cards][i].setAttribute("class", `card ${shuffledNumbers[i]}`);
    [...backOfcards][i].innerText = shuffledNumbers[i];
  }
}

function renderFlip() {
  [...cards].forEach((card) => {
    card.addEventListener("click", function () {
      card.classList.toggle("is-flipped");
    });
  });
}
