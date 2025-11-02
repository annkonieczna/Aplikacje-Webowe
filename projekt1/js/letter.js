document.addEventListener("DOMContentLoaded", () => {
  const toggleLetter = document.getElementById("toggleLetter");
  const letterContent = document.getElementById("letterContent");

  if (toggleLetter && letterContent) {
    toggleLetter.addEventListener("click", () => {
      letterContent.classList.toggle("show");
    });
  }
});

