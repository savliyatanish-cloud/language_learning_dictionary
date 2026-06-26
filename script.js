const wordInput = document.getElementById("wordInput");
const translationInput = document.getElementById("translationInput");
const categoryInput = document.getElementById("categoryInput");
const addWordBtn = document.getElementById("addWordBtn");
const filterCategory = document.getElementById("filterCategory");
const wordList = document.getElementById("wordList");

let words = JSON.parse(localStorage.getItem("languageWords")) || [];

function saveWords() {
  localStorage.setItem("languageWords", JSON.stringify(words));
}

function renderWords() {
  const selectedCategory = filterCategory.value;
  wordList.innerHTML = "";

  const filteredWords = words.filter((item) => {
    return selectedCategory === "All" || item.category === selectedCategory;
  });

  if (filteredWords.length === 0) {
    wordList.innerHTML = "<li>No words found.</li>";
    return;
  }

  filteredWords.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="item-info">
        <strong>${item.word}</strong>
        <span>${item.translation}</span>
        <span class="category-badge">${item.category}</span>
      </div>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    wordList.appendChild(li);
  });
}

addWordBtn.addEventListener("click", () => {
  const word = wordInput.value.trim();
  const translation = translationInput.value.trim();
  const category = categoryInput.value;

  if (word === "" || translation === "") {
    alert("Please enter both word and translation.");
    return;
  }

  words.push({ word, translation, category });
  saveWords();
  renderWords();

  wordInput.value = "";
  translationInput.value = "";
  categoryInput.value = "Vocabulary";
});

filterCategory.addEventListener("change", renderWords);

wordList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const visibleItems = words.filter((item) => {
      return filterCategory.value === "All" || item.category === filterCategory.value;
    });

    const clickedIndex = Number(event.target.getAttribute("data-index"));
    const itemToDelete = visibleItems[clickedIndex];

    const actualIndex = words.findIndex((item) => {
      return (
        item.word === itemToDelete.word &&
        item.translation === itemToDelete.translation &&
        item.category === itemToDelete.category
      );
    });

    if (actualIndex !== -1) {
      words.splice(actualIndex, 1);
      saveWords();
      renderWords();
    }
  }
});

renderWords();
