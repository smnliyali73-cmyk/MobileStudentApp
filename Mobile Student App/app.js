
"use strict";

// ========================================
// MOBILE STUDENT APP — app.js
// ========================================

// Get HTML elements
const form = document.getElementById("studentForm");
const message = document.getElementById("message");
const list = document.getElementById("studentList");

const STORAGE_KEY = "students";

// ========================================
// CHECK THAT REQUIRED HTML ELEMENTS EXIST
// ========================================

if (!form || !message || !list) {
  console.error(
    "App initialization failed: studentForm, message, or studentList is missing from index.html."
  );
} else {
  initializeApp();
}

// ========================================
// INITIALIZE APPLICATION
// ========================================

function initializeApp() {
  form.addEventListener("submit", handleRegistration);
  displayStudents();
  registerServiceWorker();
}

// ========================================
// DISPLAY STATUS MESSAGES
// ========================================

function showMessage(text, type = "info") {
  message.textContent = text;
  message.dataset.type = type;
}

// ========================================
// GET STUDENTS FROM LOCAL STORAGE
// ========================================

function getStudents() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return [];
    }

    const students = JSON.parse(savedData);

    if (!Array.isArray(students)) {
      console.error("Saved student data is not a valid list.");
      return [];
    }

    return students;
  } catch (error) {
    console.error("Could not read saved students:", error);
    showMessage(
      "Unable to access saved students. Please check your browser storage.",
      "error"
    );
    return [];
  }
}

// ========================================
// SAVE STUDENTS TO LOCAL STORAGE
// ========================================

function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return true;
  } catch (error) {
    console.error("Could not save students:", error);

    showMessage(
      "Unable to save registration. Check your browser storage settings.",
      "error"
    );

    return false;
  }
}

// ========================================
// DISPLAY REGISTERED STUDENTS
// ========================================

function displayStudents() {
  const students = getStudents();

  list.replaceChildren();

  if (students.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No students registered yet.";
    list.appendChild(emptyItem);
    return;
  }

  students.forEach((student) => {
    const item = document.createElement("li");

    item.textContent =
      `${student.id} — ${student.name} ` +
      `(${student.programme}, Year ${student.year})`;

    list.appendChild(item);
  });
}

// ========================================
// HANDLE STUDENT REGISTRATION
// ========================================

function handleRegistration(event) {
  event.preventDefault();

  // Read and clean form values
  const student = {
    id: document.getElementById("studentID").value.trim(),
    name: document.getElementById("studentName").value.trim(),
    programme: document.getElementById("programme").value.trim(),
    year: Number(document.getElementById("year").value)
  };

  // Validate required fields
  if (
    !student.id ||
    !student.name ||
    !student.programme ||
    !Number.isInteger(student.year) ||
    student.year < 1 ||
    student.year > 8
  ) {
    showMessage(
      "Complete all fields and enter a valid year between 1 and 8.",
      "error"
    );
    return;
  }

  // Get existing registrations
  const students = getStudents();

  // Prevent duplicate Student IDs
  const duplicate = students.some(
    (existingStudent) =>
      String(existingStudent.id).toLowerCase() ===
      student.id.toLowerCase()
  );

  if (duplicate) {
    showMessage(
      "That Student ID is already registered.",
      "error"
    );
    return;
  }

  // Add the new student
  students.push(student);

  // Save before clearing the form
  if (!saveStudents(students)) {
    return;
  }

  // Reset form and refresh student list
  form.reset();
  displayStudents();

  showMessage(
    "Registration saved successfully on this device.",
    "success"
  );
}

// ========================================
// REGISTER SERVICE WORKER
// ========================================

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.info("Service workers are not supported by this browser.");
    return;
  }

  // Service workers require localhost or a secure HTTPS context.
  if (!window.isSecureContext) {
    console.info(
      "Service worker not registered. Open the app through localhost or HTTPS."
    );
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registration =
        await navigator.serviceWorker.register("./sw.js");

      console.info(
        "Service worker registered successfully:",
        registration.scope
      );
    } catch (error) {
      console.error(
        "Service worker registration failed:",
        error
      );
    }
  });
}