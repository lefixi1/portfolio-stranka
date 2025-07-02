document.addEventListener("DOMContentLoaded", function () {
  const accordion = document.getElementById("faqAccordion");

  if (!accordion) return;

  accordion.addEventListener("click", function (e) {
    const button = e.target.closest(".accordion-button");
    if (!button || !accordion.contains(button)) return;

    const item = button.closest(".accordion-item");
    const content = item.querySelector(".accordion-content");

    const allContents = accordion.querySelectorAll(".accordion-content");
    const allButtons = accordion.querySelectorAll(".accordion-button");

    for (let cont of allContents) {
      if (cont !== content) {
        cont.classList.remove("show");
      }
    }

    for (let btn of allButtons) {
      if (btn !== button) {
        btn.classList.remove("active");
      }
    }

    button.classList.toggle("active");
    content.classList.toggle("show");
  });
});
