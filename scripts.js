let timeEntries = [];
let totalMinutes = 0;
let editingId = null;

// Load data from local storage when the page loads
function loadFromLocalStorage() {
  const savedData = localStorage.getItem("timeEntries");
  if (savedData) {
    timeEntries = JSON.parse(savedData);
    // Recalculate total minutes
    totalMinutes = timeEntries.reduce(
      (total, entry) => total + entry.totalMinutes,
      0,
    );
  }
}

// Save data to local storage
function saveToLocalStorage() {
  localStorage.setItem("timeEntries", JSON.stringify(timeEntries));
}

function addTime() {
  const title = document.getElementById("title").value.trim();
  const hours = parseInt(document.getElementById("hours").value) || 0;
  const minutes = parseInt(document.getElementById("minutes").value) || 0;

  if (!title) {
    alert("Please enter a title for this time entry.");
    return;
  }

  if (hours === 0 && minutes === 0) {
    alert("Please enter a valid time.");
    return;
  }

  if (minutes > 59 || hours > 999) {
    alert("Invalid time values.");
    return;
  }

  // 🔄 EDIT MODE
  if (editingId !== null) {
    const entry = timeEntries.find((e) => e.id === editingId);

    // remove old total
    totalMinutes -= entry.totalMinutes;

    // update entry
    entry.title = title;
    entry.hours = hours;
    entry.minutes = minutes;
    entry.totalMinutes = hours * 60 + minutes;

    // add new total
    totalMinutes += entry.totalMinutes;

    editingId = null;
    document.querySelector(".btn").textContent = "Add Time";
  }
  // ➕ ADD MODE
  else {
    const entry = {
      id: Date.now(),
      title,
      hours,
      minutes,
      totalMinutes: hours * 60 + minutes,
    };

    timeEntries.push(entry);
    totalMinutes += entry.totalMinutes;
  }

  updateDisplay();
  clearInputs();
  saveToLocalStorage();
}

function deleteTime(id) {
  const entryIndex = timeEntries.findIndex((entry) => entry.id === id);
  if (entryIndex > -1) {
    totalMinutes -= timeEntries[entryIndex].totalMinutes;
    timeEntries.splice(entryIndex, 1);
    updateDisplay();
    saveToLocalStorage(); // Save after deleting
  }
}

function clearAll() {
  if (confirm("Are you sure you want to clear all time entries?")) {
    timeEntries = [];
    totalMinutes = 0;
    updateDisplay();
    saveToLocalStorage(); // Save after clearing
    editingId = null;
    document.querySelector(".btn").textContent = "Add Time";
  }
}

function updateDisplay() {
  updateTotalTime();
  updateTimesList();
}

function updateTotalTime() {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  document.getElementById("totalTime").textContent = `${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function updateTimesList() {
  const listElement = document.getElementById("timesList");
  const clearBtn = document.getElementById("clearBtn");

  if (timeEntries.length === 0) {
    listElement.innerHTML =
      '<div class="empty-state">No time entries yet. Add some times to get started!</div>';
    clearBtn.style.display = "none";
  } else {
    listElement.innerHTML = timeEntries
      .map(
        (entry) => `
      <div class="time-entry">
        <div class="time-entry-title">${entry.title}</div>
        <div class="time-entry-time">
          ${entry.hours.toString().padStart(2, "0")}:${entry.minutes
            .toString()
            .padStart(2, "0")}
        </div>

        <button class="edit-btn" onclick="editTime(${entry.id})">✏️</button>
        <button class="delete-btn" onclick="deleteTime(${entry.id})">×</button>
      </div>
    `,
      )
      .join("");
    clearBtn.style.display = "block";
  }
}

function editTime(id) {
  const entry = timeEntries.find((e) => e.id === id);
  if (!entry) return;

  document.getElementById("title").value = entry.title;
  document.getElementById("hours").value = entry.hours;
  document.getElementById("minutes").value = entry.minutes;

  editingId = id;
  document.querySelector(".btn").textContent = "Update Time";
}

function clearInputs() {
  document.getElementById("title").value = "";
  document.getElementById("hours").value = "";
  document.getElementById("minutes").value = "";
}

// Add keyboard support
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTime();
  }
});

// Initialize the app
function init() {
  loadFromLocalStorage();
  updateDisplay();
}

// Call init when the page loads
window.onload = init;

// register the service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./serviceworker.js")
      .then(() => {
        console.log("✅ Service Worker registered");
      })
      .catch((err) => {
        console.error("❌ Service Worker registration failed:", err);
      });
  });
}
