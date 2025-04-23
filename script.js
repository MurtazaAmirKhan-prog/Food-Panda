import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  db,
  doc,
  setDoc,
  getDoc,
} from "./firebase.js";

// Alerts using SweetAlert
const showAlert = (type, title, text) => Swal.fire({ icon: type, title, text });

// Email check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// DOM elements
const $ = (selector) => document.querySelector(selector);

const elements = {
  signupBtn: $(".sign-up-btn"),
  adminSignupBtn: $("#admin-signup-btn"),
  loginBtn: $(".log-in-btn"),
  signupForm: $("#signup-container"),
  loginForm: $("#login-container"),
  body: $("body"),
  frontPage: $(".FrontPage"),
};

// Current user role (user/admin)
let currentRole = "user";

// Show/hide password
document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.previousElementSibling;
    input.type = input.type === "password" ? "text" : "password";
    btn.querySelector(".eye-icon").src =
      input.type === "text" ? "images/eye-off.png" : "images/eye-on.png";
  });
});

// Show/Hide popups
const togglePopup = (show, formType) => {
  elements.body.style.overflowY = show ? "hidden" : "auto";
  elements.frontPage.style.opacity = show ? "0.5" : "1";
  elements.frontPage.style.pointerEvents = show ? "none" : "auto";

  elements.signupForm.style.display =
    formType === "signup" && show ? "block" : "none";
  elements.loginForm.style.display =
    formType === "login" && show ? "block" : "none";
};

// Clear input fields
const clearInputs = (form) => {
  form.querySelectorAll("input").forEach((input) => (input.value = ""));
};

// Open forms
const openForm = (type = "user") => {
  currentRole = type;
  togglePopup(true, "signup");
  clearInputs(elements.signupForm);
};

const openLogin = () => {
  togglePopup(true, "login");
  clearInputs(elements.loginForm);
};

// Button events
elements.signupBtn.addEventListener("click", () => openForm("user"));
elements.adminSignupBtn.addEventListener("click", () => openForm("admin"));
elements.loginBtn.addEventListener("click", openLogin);

// Close popups
document.querySelectorAll(".close-popup").forEach((btn) => {
  btn.addEventListener("click", () => {
    togglePopup(false);
    clearInputs(document.getElementById(btn.dataset.target));
  });
});

// Switch forms
document.querySelectorAll(".switch-form").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.dataset.target;
    togglePopup(true, target === "signup-container" ? "signup" : "login");
    clearInputs(document.getElementById(target));
  });
});

// Signup
$("#signupBtn").addEventListener("click", async () => {
  const email = $("#su-email").value;
  const password = $("#su-password").value;

  if (!email || !password) {
    return showAlert(
      "error",
      "Missing Fields",
      "Please enter email and password."
    );
  }

  if (!isValidEmail(email)) {
    return showAlert("error", "Invalid Email", "Enter a valid email address.");
  }

  if (password.length < 6) {
    return showAlert(
      "error",
      "Weak Password",
      "Password must be 6 characters at least."
    );
  }

  try {
    elements.signupBtn.disabled = true;

    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: currentRole,
      created_at: new Date().toISOString(),
    });

    await showAlert("success", "Signup Successful", `Welcome, ${user.email}`);
    togglePopup(false);
    window.location.href =
      currentRole === "admin" ? "/admin.html" : "/dishes.html";
  } catch (err) {
    showAlert("error", "Signup Failed", err.message);
  } finally {
    elements.signupBtn.disabled = false;
  }
});

// Login
$("#loginBtn").addEventListener("click", async () => {
  const email = $("#li-email").value;
  const password = $("#li-password").value;

  if (!email || !password) {
    return showAlert(
      "error",
      "Missing Fields",
      "Please enter email and password."
    );
  }

  if (!isValidEmail(email)) {
    return showAlert("error", "Invalid Email", "Enter a valid email address.");
  }

  try {
    elements.loginBtn.disabled = true;

    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const docSnap = await getDoc(doc(db, "users", user.uid));

    if (!docSnap.exists()) {
      throw new Error("User record not found.");
    }

    const role = docSnap.data().role;

    await showAlert(
      "success",
      "Login Successful",
      `Welcome back, ${user.email}`
    );
    togglePopup(false);
    window.location.href = role === "admin" ? "/admin.html" : "/dishes.html";
  } catch (err) {
    showAlert("error", "Login Failed", err.message);
  } finally {
    elements.loginBtn.disabled = false;
  }
});
