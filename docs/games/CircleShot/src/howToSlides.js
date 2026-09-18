let howtoIndex = 0;

export function setupHowToSlides() {
  const slides = document.querySelectorAll(".howto-slide");
  const slideCount = slides.length;
  const wrapper = document.getElementById("howtoSlides");

  function updateSlide() {
    wrapper.style.transform = `translateX(${-howtoIndex * 100}%)`;
  }

  document.getElementById("howtoPrev").addEventListener("click", () => {
    if (howtoIndex > 0) {
      howtoIndex--;
      updateSlide();
    }
  });

  document.getElementById("howtoNext").addEventListener("click", () => {
    if (howtoIndex < slideCount - 1) {
      howtoIndex++;
      updateSlide();
    }
  });

  document.getElementById("howtoClose").addEventListener("click", () => {
    document.getElementById("howtoModal").style.display = "none";
    howtoIndex = 0;
    updateSlide();
  });

  updateSlide();
}


