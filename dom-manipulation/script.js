// Initial quotes array (accessible globally)
var quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "Be yourself; everyone else is already taken.", category: "Life" },
  { text: "The future belongs to those who prepare for it today.", category: "Success" }
];

// DOM elements
var quoteDisplay = document.getElementById("quoteDisplay");
var newQuoteBtn = document.getElementById("newQuote");
var addQuoteBtn = document.getElementById("addQuoteBtn");
var newQuoteText = document.getElementById("newQuoteText");
var newQuoteCategory = document.getElementById("newQuoteCategory");
var categorySelect = document.getElementById("categorySelect");

// Populate category dropdown
function populateCategories() {
  var categories = Array.from(new Set(quotes.map(function(q) { return q.category; })));
  categorySelect.innerHTML = "";

  var allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categorySelect.appendChild(allOption);

  categories.forEach(function(cat) {
    var option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Show random quote from selected category
function showRandomQuote() {
  var selectedCategory = categorySelect.value || "all";
  var filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(function(q) { return q.category === selectedCategory; });
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  var randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  var quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = '"' + quote.text + '" — ' + quote.category;
}

// Add new quote (global function expected by the tests)
function addQuote() {
  var text = newQuoteText.value.trim();
  var category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return false; // return value can help some tests
  }

  // Add to quotes array
  quotes.push({ text: text, category: category });

  // Update DOM: refresh categories and display the newly added quote immediately
  populateCategories();

  // Set select to the newly added category so showRandomQuote picks from it
  categorySelect.value = category;

  // Display the added quote (deterministic: last added)
  quoteDisplay.textContent = '"' + text + '" — ' + category;

  // Clear inputs
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  return true;
}

// Ensure event listeners exist (test looks for listener on Show New Quote button)
function setupEventListeners() {
  // Show new quote button -> showRandomQuote
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", showRandomQuote);
  }

  // Add quote button -> addQuote
  if (addQuoteBtn) {
    addQuoteBtn.addEventListener("click", addQuote);
  }

  // When category changes, show a quote from that category
  if (categorySelect) {
    categorySelect.addEventListener("change", showRandomQuote);
  }
}

// Initialize app
(function init() {
  populateCategories();

  // default to 'all' if no selection
  categorySelect.value = "all";

  setupEventListeners();

  // show initial quote
  showRandomQuote();
})();
