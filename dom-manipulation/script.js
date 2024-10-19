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

// Function to create the form for adding new quotes
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
async function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();

    // Post the new quote to the server
    await postQuoteToServer(newQuote);

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

    if (Array.isArray(importedQuotes)) {
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      populateCategories(); // Refresh the category filter after import
      filterQuotes(); // Update the displayed quotes
    } else {
      alert('Invalid file format.');
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from the simulated server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Simulated endpoint
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    // Transform the fetched data to match your quotes structure
    const fetchedQuotes = data.map(item => ({
      text: item.title, // Use title as quote text
      category: 'General' // Assign a default category or modify as needed
    }));
    
    // Merge quotes with local quotes, resolving conflicts
    mergeQuotes(fetchedQuotes);
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

// Function to merge server quotes with local quotes
function mergeQuotes(fetchedQuotes) {
  fetchedQuotes.forEach(fetchedQuote => {
    const existingQuoteIndex = quotes.findIndex(quote => quote.text === fetchedQuote.text);
    
    if (existingQuoteIndex !== -1) {
      // Conflict resolution: prompt user for action
      const userChoice = confirm(`Conflict: The quote "${fetchedQuote.text}" already exists. Do you want to replace it with the server version?`);
      if (userChoice) {
        quotes[existingQuoteIndex] = fetchedQuote; // Replace local quote with server quote
        console.log(`Replaced local quote with server quote: "${fetchedQuote.text}"`);
      } else {
        console.log(`Kept local version of quote: "${fetchedQuote.text}"`);
      }
    } else {
      quotes.push(fetchedQuote);
      console.log(`New quote added from server: "${fetchedQuote.text}"`);
    }
  });
  
  saveQuotes(); // Save updated quotes to local storage
  filterQuotes(); // Update the displayed quotes
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quote),
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    console.log('Quote posted to server:', data);
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}

// Function to sync quotes between local storage and server
async function syncQuotes() {
  await fetchQuotesFromServer(); // Fetch new quotes from the server
  saveQuotes(); // Save current quotes to local storage
}

// Attach event listener to the export button
document.getElementById('exportQuotesButton').addEventListener('click', exportToJsonFile);

// Attach event listener to the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call fetchQuotesFromServer on window load and set up periodic fetching
window.onload = function() {
  loadQuotes();
  createAddQuoteForm();
  populateCategories();
  fetchQuotesFromServer(); // Initial fetch
  setInterval(syncQuotes, 60000); // Sync quotes with server every minute
};
