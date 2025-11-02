// Kategorie rzadkości
const cards = {
  common: [
    { name: "Llanowar Elves", img: "images/llanowarelves.jpg", desc: "Dodaje zieloną manę — klasyczny start dla każdego zielonego decku." },
    { name: "Shock", img: "images/shock.jpg", desc: "Zadaje 2 obrażenia dowolnemu celowi. Tanio i skutecznie." },
    { name: "Cancel", img: "images/cancel.jpg", desc: "Kontruje zaklęcie przeciwnika. Niebieska defensywa." }
  ],
  rare: [
    { name: "Serra Angel", img: "images/serraangel.jpg", desc: "Latająca strażniczka 4/4 — symbol białej many." },
    { name: "Shivan Dragon", img: "images/shivandragon.jpg", desc: "Legenda czerwonej many. Im więcej masz, tym silniejszy smok." }
  ],
  legendary: [
    { name: "Black Lotus", img: "images/blacklotus.jpg", desc: "Najpotężniejszy artefakt w historii MTG." },
    { name: "Jace, the Mind Sculptor", img: "images/jace.jpg", desc: "Najbardziej rozpoznawalny planeswalker w historii gry." }
  ]
};

const openBtn = document.getElementById("openPackBtn");
const cardDisplay = document.getElementById("cardDisplay");
const packAnimation = document.getElementById("packAnimation");

const img = document.getElementById("cardImage");
const nameField = document.getElementById("cardName");
const descField = document.getElementById("cardDesc");
const rarityField = document.getElementById("cardRarity");

const sparkle = new Audio("sounds/sparkle.mp3"); // lekki efekt magiczny
const flip = new Audio("sounds/cardflip.mp3");   // dźwięk obracania karty

openBtn.addEventListener("click", () => {
  // Ukryj poprzednią kartę
  cardDisplay.classList.add("hidden");

  // Animacja otwierania paczki
  packAnimation.classList.remove("hidden");
  sparkle.play();

  // Po 2 sekundach pokaż kartę
  setTimeout(() => {
    packAnimation.classList.add("hidden");
    const randomCard = drawRandomCard();
    showCard(randomCard);
    flip.play();
  }, 2000);
});

function drawRandomCard() {
  const chance = Math.random();
  let rarity, pool;

  if (chance < 0.03) { rarity = "Legendary"; pool = cards.legendary; }
  else if (chance < 0.25) { rarity = "Rare"; pool = cards.rare; }
  else { rarity = "Common"; pool = cards.common; }

  const card = pool[Math.floor(Math.random() * pool.length)];
  card.rarity = rarity;
  return card;
}

function showCard(card) {
  img.src = card.img;
  nameField.textContent = card.name;
  descField.textContent = card.desc;
  rarityField.textContent = `Rzadkość: ${card.rarity}`;
  rarityField.style.color =
    card.rarity === "Legendary" ? "#ffb700" :
    card.rarity === "Rare" ? "#00bfff" : "#ccc";

  cardDisplay.classList.remove("hidden");
  cardDisplay.classList.add("flip");
  setTimeout(() => cardDisplay.classList.remove("flip"), 600);

  // Zapis do localStorage
  localStorage.setItem("lastCard", JSON.stringify(card));
}

// Pokaż poprzednią kartę, jeśli była
window.addEventListener("DOMContentLoaded", () => {
  const last = localStorage.getItem("lastCard");
  if (last) {
    const card = JSON.parse(last);
    showCard(card);
  }
});
