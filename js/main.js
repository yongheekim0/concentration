// constant variables

// cache
const cards = document.getElementsByClassName("card");

// state variables
const cardsSelected = {
  first: null,
  second: null,
};
// event listners

[...cards].forEach((card) => {
  card.addEventListener("click", function () {
    card.classList.toggle("is-flipped");
  });
});

// renders
init();
function init() {
  //allCardsInvisible();
  suffleCards();
}
// functions

/* function allCardsInvisible() {
  cardImageElements.forEach((element) => {
    element.style.visibility = "hidden";
  });
} */

function suffleCards() {}
