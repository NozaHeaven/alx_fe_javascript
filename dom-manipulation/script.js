// Array to store the quotes with category
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
  // Create form elements
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

  // Append form elements to the container
  formContainer.appendChild(inputQuoteText);
  formContainer.appendChild(inputQuoteCategory);
  formContainer.appendChild(addButton);
}

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Select the quoteDisplay div and update its content
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <strong>${randomQuote.category}</strong></p>`;

  // Save the last viewed quote in session storage
  saveLastViewedQuote(randomQuote);
}

// Function to save the last viewed quote in session storage
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  // Only add the quote if both text and category are filled in
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();  // Save updated quotes array to local storage
    alert("New quote added!");

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please fill in both fields!");
  }
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // Pretty-print the JSON
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();

  URL.revokeObjectURL(url); // Free up memory
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);

    // Validate if it's an array and update quotes
    if (Array.isArray(importedQuotes)) {
      quotes.push(...importedQuotes);
      saveQuotes(); // Save the newly imported quotes to local storage
      alert('Quotes imported successfully!');
    } else {
      alert('Invalid file format.');
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Attach event listener to the export button
document.getElementById('exportQuotesButton').addEventListener('click', exportToJsonFile);

// Attach event listener to the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Load the quotes from local storage when the page is loaded
window.onload = function() {
  loadQuotes();
  createAddQuoteForm();  // Ensure the form is generated after loading quotes
};

  