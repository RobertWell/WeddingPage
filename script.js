const surveyForm = document.querySelector("#survey-form");

if (surveyForm) {
  surveyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(surveyForm);
    const name = formData.get("name") || "朋友";
    alert(`${name}，謝謝你的回覆！之後我們會把表單串接到 Google Sheets。`);
    surveyForm.reset();
  });
}
