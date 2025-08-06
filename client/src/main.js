import "./style.css";

const form = document.querySelector("form");
const textarea = form.querySelector("textarea");
const submitButton = document.querySelector("button");
submitButton.disabled = true;

textarea.addEventListener("input", () => {
  submitButton.disabled = textarea.value.trim() === "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showSpinner();

  try {
    const formData = new FormData(form);
    const response = await fetch("http://localhost:3000/dream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData.get("prompt"),
      }),
    });
    const { imageUrl } = await response.json();
    const result = document.querySelector("#result");
    result.innerHTML = `<img src="${imageUrl}" alt="Generated Image" />`;
  } catch (error) {
    console.error("Error generating image:", error);
  } finally {
    hideSpinner();
    form.reset();
    submitButton.disabled = true;
  }
});

function showSpinner() {
  const button = document.querySelector("button");
  button.disabled = true;
  button.innerHTML = 'Dreaming... <span class="spinner">🧠</span>';
}

function hideSpinner() {
  const button = document.querySelector("button");
  button.disabled = false;
  button.innerHTML = "Dream";
}
