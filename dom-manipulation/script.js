// Array to store the quotes with category
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" },
];

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
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  // Only add the quote if both text and category are filled in
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    alert("New quote added!");

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please fill in both fields!");
  }
}

// Attach event listener to the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call the createAddQuoteForm function to render the form dynamically
createAddQuoteForm();

  