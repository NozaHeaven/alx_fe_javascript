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

// Modify the addQuote function to save quotes to local storage
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

// Load the quotes from local storage when the page is loaded
window.onload = function() {
  loadQuotes();
  createAddQuoteForm();  // Ensure the form is generated after loading quotes
};

// Call the createAddQuoteForm function to render the form dynamically
createAddQuoteForm();

// Function to save the last viewed quote in session storage
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Modify showRandomQuote function to save the last viewed quote in session storage
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Select the quoteDisplay div and update its content
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <strong>${randomQuote.category}</strong></p>`;

  // Save the last viewed quote in session storage
  saveLastViewedQuote(randomQuote);
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

// Create an export button in HTML
const exportButton = document.createElement('button');
exportButton.textContent = 'Export Quotes';
exportButton.addEventListener('click', exportToJsonFile);
document.body.appendChild(exportButton);
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

// Create a file input element in HTML
const importInput = document.createElement('input');
importInput.setAttribute('type', 'file');
importInput.setAttribute('accept', '.json');
importInput.addEventListener('change', importFromJsonFile);
document.body.appendChild(importInput);


  