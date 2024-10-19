let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" },
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to dynamically create the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');
  
  const inputQuoteText = document.createElement('input');
  inputQuoteText.setAttribute('id', 'newQuoteText');
  inputQuoteText.setAttribute('type', 'text');
  inputQuoteText.setAttribute('placeholder', 'Enter a new quote');

  const inputQuoteCategory = document.createElement('input');
  inputQuoteCategory.setAttribute('id', 'newQuoteCategory');
  inputQuoteCategory.setAttribute('type', 'text');
  inputQuoteCategory.setAttribute('placeholder', 'Enter quote category');

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(inputQuoteText);
  formContainer.appendChild(inputQuoteCategory);
  formContainer.appendChild(addButton);
}

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <strong>${randomQuote.category}</strong></p>`;

  saveLastViewedQuote(randomQuote);
}

// Function to save the last viewed quote in session storage
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const uniqueCategories = new Set(quotes.map(quote => quote.category));

  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  categoryFilter.value = lastSelectedCategory;
  filterQuotes(); // Filter quotes based on the last selected category
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  quoteDisplay.innerHTML = '';

  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  filteredQuotes.forEach(quote => {
    quoteDisplay.innerHTML += `<p>"${quote.text}" - <strong>${quote.category}</strong></p>`;
  });

  localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();

    const categoryFilter = document.getElementById('categoryFilter');
    if (![...categoryFilter.options].some(option => option.value === newQuoteCategory)) {
      const option = document.createElement('option');
      option.value = newQuoteCategory;
      option.textContent = newQuoteCategory;
      categoryFilter.appendChild(option);
    }

    alert("New quote added!");
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please fill in both fields!");
  }
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json'