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

  