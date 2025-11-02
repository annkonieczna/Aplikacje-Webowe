// Zegar w stopce
function updateClock() {
  const now = new Date();
  document.querySelectorAll("#clock").forEach(c => {
    c.textContent = now.toLocaleTimeString();
  });
}
setInterval(updateClock, 1000);
updateClock();

// Walidacja formularza + zapamiętanie emaila
const form = document.getElementById('contactForm');
if (form) {
  const emailField = document.getElementById('email');
  const savedEmail = localStorage.getItem('userEmail');
  if (savedEmail) emailField.value = savedEmail;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = emailField.value.trim();
    const message = document.getElementById('message').value.trim();

    if (!email || !message) {
      document.getElementById('formResponse').textContent = 'Uzupełnij wszystkie pola!';
      return;
    }

    localStorage.setItem('userEmail', email);
    document.getElementById('formResponse').textContent = 'Dziękujemy za wiadomość!';
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const manaLinks = document.querySelectorAll(".mana-link");

  manaLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const img = link.querySelector(".mana");
      img.classList.add("zoom");

      // Dodaj efekt zanikania całej strony po chwili
      setTimeout(() => {
        document.body.classList.add("fade-out");
      }, 300);

      // Po zakończeniu efektu przejdź na stronę
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
    "images/one-with-nothing.jpg"
  ];
  
  cards.forEach(card => {
    const backImg = card.querySelector(".card-back img");

    card.addEventListener("click", () => {
      if (!card.classList.contains("flipped")) {
        // Wylosuj nową kartę
        const randomImage = cardImages[Math.floor(Math.random() * cardImages.length)];
        backImg.src = randomImage;
      }
      // Obrót
      card.classList.toggle("flipped");
    });
  });
});

