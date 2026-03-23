const surveyForm = document.querySelector("[data-rsvp-form]");

const syncIntegerCounterState = (counter) => {
  const input = counter.querySelector("[data-counter-input]");
  const decrementButton = counter.querySelector('[data-counter-action="decrement"]');
  if (!input || !decrementButton) return;

  const min = Number.parseInt(input.min || "0", 10);
  const value = Number.parseInt(input.value || `${min}`, 10);
  decrementButton.disabled = value <= min;
};

document.querySelectorAll("[data-integer-counter]").forEach((counter) => {
  const input = counter.querySelector("[data-counter-input]");
  if (!input) return;

  const min = Number.parseInt(input.min || "0", 10);
  const sanitizeValue = (rawValue) => {
    const parsed = Number.parseInt(rawValue, 10);
    input.value = String(Number.isNaN(parsed) ? min : Math.max(min, parsed));
    syncIntegerCounterState(counter);
  };

  counter.querySelectorAll("[data-counter-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentValue = Number.parseInt(input.value || `${min}`, 10);
      const delta = button.dataset.counterAction === "increment" ? 1 : -1;
      sanitizeValue(String(currentValue + delta));
    });
  });

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  });
  input.addEventListener("change", () => sanitizeValue(input.value));
  sanitizeValue(input.value);
});

if (surveyForm) {
  surveyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(surveyForm);
    const name = formData.get("name") || "朋友";
    alert(`✅ ${name}，我們已收到你的回覆，謝謝你！`);
    surveyForm.reset();
    document.querySelectorAll("[data-integer-counter]").forEach(syncIntegerCounterState);
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
