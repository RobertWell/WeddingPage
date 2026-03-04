const surveyForm = document.querySelector("#survey-form");

if (surveyForm) {
  surveyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(surveyForm);
    const name = formData.get("name") || "朋友";
    alert(`✅ ${name}，我們已收到你的回覆，謝謝你！`);
    surveyForm.reset();
  });
}

const revealElements = document.querySelectorAll("[data-reveal]");

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}
