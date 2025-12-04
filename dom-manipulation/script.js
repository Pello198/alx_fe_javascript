// ----------------------------------------------------
// ✅ Initial Quotes Array
// ----------------------------------------------------
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Dont let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Your limitation—it’s only your imagination.", category: "Self-Improvement" }
];

const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock server

//----------------------------------------------------
// ✅ Utility: Save and Load Quotes
//----------------------------------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) quotes = JSON.parse(stored);
  return quotes;
}

//----------------------------------------------------
// ✅ Display Quotes
//----------------------------------------------------
function displayQuotes(list) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  if (list.length === 0) {
    container.textContent = "No quotes available for this category.";
    return;
  }
  list.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — [${q.category}]`;
    container.appendChild(p);
  });
}

//----------------------------------------------------
// ✅ Show Random Quote
//----------------------------------------------------
function showRandomQuote() {
  if (quotes.length === 0) return;
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  displayQuotes([random]);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

//----------------------------------------------------
// ✅ Add Quote
//----------------------------------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category!");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

//----------------------------------------------------
// ✅ Populate Category Dropdown
//----------------------------------------------------
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

//----------------------------------------------------
// ✅ Filter Quotes
//----------------------------------------------------
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  if (selected === "all") displayQuotes(quotes);
  else displayQuotes(quotes.filter(q => q.category === selected));
}

//----------------------------------------------------
// ✅ Export JSON
//----------------------------------------------------
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

//----------------------------------------------------
// ✅ Import JSON
//----------------------------------------------------
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

//----------------------------------------------------
// ✅ Server Sync
//----------------------------------------------------
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Server fetch failed:", error);
    return [];
  }
}

function mergeQuotes(local, server) {
  const serverTexts = new Set(server.map(q => q.text));
  const uniqueLocal = local.filter(q => !serverTexts.has(q.text));
  return [...server, ...uniqueLocal]; // Server takes precedence
}

async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length === 0) return;

  const localQuotes = loadQuotes();
  const merged = mergeQuotes(localQuotes, serverQuotes);

  if (JSON.stringify(merged) !== JSON.stringify(localQuotes)) {
    quotes = merged;
    saveQuotes();
    notify("Quotes updated from server!");
    populateCategories();
    filterQuotes();
  }
}

//----------------------------------------------------
// ✅ Notifications
//----------------------------------------------------
function notify(msg) {
  const box = document.getElementById("notification");
  box.textContent = msg;
  box.style.display = "block";
  setTimeout(() => (box.style.display = "none"), 4000);
}

//----------------------------------------------------
// ✅ Create Add Quote Form (required by ALX)
//----------------------------------------------------
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteContainer");
  if (!container) return;

  container.innerHTML = `
    <h3>Add a New Quote</h3>
    <input type="text" id="newQuoteText" placeholder="Enter quote" /><br><br>
    <input type="text" id="newQuoteCategory" placeholder="Enter category" /><br><br>
    <button id="addQuoteButton">Add Quote</button>
  `;

  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
}

//----------------------------------------------------
// ✅ Initialize App
//----------------------------------------------------
window.onload = function () {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();

  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  document.getElementById("categoryFilter").value = savedCategory;
  filterQuotes();

  syncWithServer();
  setInterval(syncWithServer, 60000);
};
