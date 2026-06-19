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
    showAlert("Please enter a title for this time entry.");
    return;
  }

  if (hours === 0 && minutes === 0) {
    showAlert("Please enter a valid time.");
    return;
  }

  if (minutes > 59 || hours > 999) {
    showAlert("Invalid time values.");
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
      <li class="time-entry" data-entryid="${entry.id}">
        <!-- Hidden backgrounds revealed during swipe -->
        <div class="swipe-bg swipe-bg-delete">
          <div class="swipe-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </div>
        </div>
        <div class="swipe-bg swipe-bg-edit">
          <div class="swipe-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </div>
        </div>
        
        <!-- Wrapper for the sliding content -->
        <div class="time-entry-content">
          <div class="time-entry-title">${entry.title}</div>
          <div class="time-entry-time">
            ${entry.hours.toString().padStart(2, "0")}:${entry.minutes.toString().padStart(2, "0")}
          </div>
        </div>
      </li>
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

function showAlert(message) {
  const modal = document.getElementById("customAlert");
  const messageEl = document.getElementById("alertMessage");
  const closeBtn = document.getElementById("alertCloseBtn");

  messageEl.textContent = message;
  modal.classList.add("show");
  document.body.classList.add("modal-open");

  // Close on button click
  closeBtn.onclick = () => {
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
  };

  // Close on clicking outside content
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      document.body.classList.remove("modal-open");
    }
  };

  // Close on Escape key
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      modal.classList.remove("show");
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleEsc);
    }
  };
  window.addEventListener("keydown", handleEsc);
}

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

const timeEntriesList = document.getElementById("timesList");
let startX = 0;
let startY = 0;
let currentX = 0;
let isDragging = false;
let currentTimeEntry = null;
let currentContent = null;

// --- TOUCH EVENTS (Mobile) ---
timeEntriesList.addEventListener(
  "touchstart",
  (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    currentTimeEntry = e.target.closest("li.time-entry");

    if (currentTimeEntry) {
      currentContent = currentTimeEntry.querySelector(".time-entry-content");
      isDragging = true;
      currentContent.style.transition = "none";
      currentContent.classList.add("is-dragging"); // Lift the card
    }
  },
  { passive: true },
);

timeEntriesList.addEventListener(
  "touchmove",
  (e) => {
    if (!isDragging || !currentContent) return;

    const touch = e.touches[0];
    currentX = touch.clientX;
    const diffX = currentX - startX;
    const diffY = touch.clientY - startY;

    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
      isDragging = false;
      currentContent.style.transition = "transform 0.3s ease";
      currentContent.style.transform = `translateX(0)`;
      currentContent.classList.remove("is-dragging"); // Drop the card
      return;
    }

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      e.preventDefault();
    }

    let translateX = diffX;
    const maxDrag = 120;
    if (Math.abs(translateX) > maxDrag) {
      translateX = Math.sign(translateX) * maxDrag;
    }

    currentContent.style.transform = `translateX(${translateX}px)`;

    // --- VISUAL FEEDBACK: Trigger "active" state if threshold reached ---
    const deleteBg = currentTimeEntry.querySelector(".swipe-bg-delete");
    const editBg = currentTimeEntry.querySelector(".swipe-bg-edit");

    if (translateX > 60) {
      deleteBg.classList.add("active");
      editBg.classList.remove("active");
    } else if (translateX < -60) {
      editBg.classList.add("active");
      deleteBg.classList.remove("active");
    } else {
      deleteBg.classList.remove("active");
      editBg.classList.remove("active");
    }
  },
  { passive: false },
);

timeEntriesList.addEventListener("touchend", (e) => {
  if (!isDragging || !currentContent || !currentTimeEntry) return;

  isDragging = false;
  currentContent.classList.remove("is-dragging"); // Drop the card

  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;
  const threshold = 80;
  const entryId = Number(currentTimeEntry.getAttribute("data-entryid"));

  currentContent.style.transition =
    "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  // Clean up active states
  const deleteBg = currentTimeEntry.querySelector(".swipe-bg-delete");
  const editBg = currentTimeEntry.querySelector(".swipe-bg-edit");
  deleteBg.classList.remove("active");
  editBg.classList.remove("active");

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      currentContent.style.transform = `translateX(100%)`;
      setTimeout(() => {
        deleteTime(entryId);
      }, 300);
    } else {
      currentContent.style.transform = `translateX(-100%)`;
      setTimeout(() => {
        editTime(entryId);
        setTimeout(() => {
          currentContent.style.transform = `translateX(0)`;
        }, 200);
      }, 300);
    }
  } else {
    currentContent.style.transform = `translateX(0)`;
  }

  currentTimeEntry = null;
  currentContent = null;
});

// --- MOUSE EVENTS (Desktop Testing) ---
timeEntriesList.addEventListener("mousedown", (e) => {
  startX = e.clientX;
  startY = e.clientY;
  currentTimeEntry = e.target.closest("li.time-entry");

  if (currentTimeEntry) {
    currentContent = currentTimeEntry.querySelector(".time-entry-content");
    isDragging = true;
    currentContent.style.transition = "none";
    currentContent.classList.add("is-dragging"); // Lift the card

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
});

function handleMouseMove(e) {
  if (!isDragging || !currentContent) return;

  currentX = e.clientX;
  const diffX = currentX - startX;
  const diffY = e.clientY - startY;

  if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
    isDragging = false;
    currentContent.style.transition = "transform 0.3s ease";
    currentContent.style.transform = `translateX(0)`;
    currentContent.classList.remove("is-dragging"); // Drop the card
    return;
  }

  let translateX = diffX;
  const maxDrag = 120;
  if (Math.abs(translateX) > maxDrag) {
    translateX = Math.sign(translateX) * maxDrag;
  }

  currentContent.style.transform = `translateX(${translateX}px)`;

  // --- VISUAL FEEDBACK: Trigger "active" state if threshold reached ---
  const deleteBg = currentTimeEntry.querySelector(".swipe-bg-delete");
  const editBg = currentTimeEntry.querySelector(".swipe-bg-edit");

  if (translateX > 60) {
    deleteBg.classList.add("active");
    editBg.classList.remove("active");
  } else if (translateX < -60) {
    editBg.classList.add("active");
    deleteBg.classList.remove("active");
  } else {
    deleteBg.classList.remove("active");
    editBg.classList.remove("active");
  }
}

function handleMouseUp(e) {
  if (!isDragging || !currentContent || !currentTimeEntry) return;

  isDragging = false;
  currentContent.classList.remove("is-dragging"); // Drop the card

  const endX = e.clientX;
  const diff = endX - startX;
  const threshold = 80;
  const entryId = Number(currentTimeEntry.getAttribute("data-entryid"));

  currentContent.style.transition =
    "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  // Clean up active states
  const deleteBg = currentTimeEntry.querySelector(".swipe-bg-delete");
  const editBg = currentTimeEntry.querySelector(".swipe-bg-edit");
  deleteBg.classList.remove("active");
  editBg.classList.remove("active");

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      currentContent.style.transform = `translateX(100%)`;
      setTimeout(() => {
        deleteTime(entryId);
      }, 300);
    } else {
      currentContent.style.transform = `translateX(-100%)`;
      setTimeout(() => {
        editTime(entryId);
        setTimeout(() => {
          currentContent.style.transform = `translateX(0)`;
        }, 200);
      }, 300);
    }
  } else {
    currentContent.style.transform = `translateX(0)`;
  }

  currentTimeEntry = null;
  currentContent = null;

  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
}
