// Zegar w stopce
function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  clock.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Walidacja formularza i zapamiętanie emaila
const form = document.getElementById('contactForm');
if (form) {
  const emailField = document.getElementById('email');
  const savedEmail = localStorage.getItem('userEmail');
  if (savedEmail) emailField.value = savedEmail;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = emailField.value.trim();
    const message = document.getElementById('message').value.trim(); //trim usunie zbędne spacje na początku i końcu (fajniutkie do walidacji)

    if (!email || !message) {
      document.getElementById('formResponse').textContent = 'Fill in all the required boxes!';
      return;
    }

    localStorage.setItem('userEmail', email); // zapiszą się oba pola w przeglądarce 
    document.getElementById('formResponse').textContent = 'Thank you for your message!';
    form.reset();
  });
}

//efekty do many 

document.addEventListener("DOMContentLoaded", () => {
  const manaLinks = document.querySelectorAll(".mana-link");

  manaLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const img = link.querySelector(".mana");
      img.classList.add("zoom");

      // Efekt zanikania całej strony po chwili
      setTimeout(() => {
        document.body.classList.add("fade-out");
      }, 300);

      // Po zakończeniu efektu przechodzimy na stronę
      setTimeout(() => {
        window.location.href = link.href;
      }, 900);
    });
  });
});


// Losowanie karty

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  
  // Lista losowych frontów (dodaj swoje pliki)
  const cardImages = [
    "images/sacred-cat.jpg",
    "images/one-with-nothing.jpg",
    "images/arbor-elf.png",
    "images/azorius-huildgate.png",
    "images/brainstorm.jpg",
    "images/counterspell.jpg",
    "images/grab-the-prize.jpg",
    "images/journey-to-nowhere.png",
    "images/lorien-revealed.jpg",
    "images/modern-age.png",
    "images/outlaw-medic.jpg",
    "images/preordain.png",
    "images/prismatic-strands.png",
    "images/squadron-hawk.png",

  ];
  
  cards.forEach(card => {
    const backImg = card.querySelector(".card-back img");

    card.addEventListener("click", () => {
      if (!card.classList.contains("flipped")) {
        // Losujemy nową kartę
        const randomImage = cardImages[Math.floor(Math.random() * cardImages.length)];
        backImg.src = randomImage;
      }
      // Obrót
      card.classList.toggle("flipped"); // usuwamy lub dodajemy klasę flipped
    });
  });
});


