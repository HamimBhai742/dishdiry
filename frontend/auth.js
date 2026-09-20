/**
 * DishDiary - Authentication Controller (Login & Registration)
 * Interacts with backend Express + MongoDB Atlas Auth API:
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/register
 */

const API_BASE = "http://localhost:5942/api/v1";

class AuthManager {
  constructor() {
    this.currentMode = "signin"; // "signin" | "signup"

    this.cacheDom();
    this.bindEvents();
    this.checkUrlMode();
    this.checkExistingSession();
  }

  cacheDom() {
    this.titleEl = document.getElementById("authTitle");
    this.subtitleEl = document.getElementById("authSubtitle");
    this.tabSignIn = document.getElementById("tabSignIn");
    this.tabSignUp = document.getElementById("tabSignUp");
    this.signInForm = document.getElementById("signInForm");
    this.signUpForm = document.getElementById("signUpForm");
    this.alertBanner = document.getElementById("authAlertBanner");
    this.alertMessage = document.getElementById("authAlertMessage");
    this.switchPrompt = document.getElementById("authSwitchPrompt");
    this.switchModeLink = document.getElementById("switchModeLink");

    // Inputs
    this.loginEmail = document.getElementById("loginEmail");
    this.loginPassword = document.getElementById("loginPassword");
    this.loginSubmitBtn = document.getElementById("loginSubmitBtn");

    this.registerName = document.getElementById("registerName");
    this.registerEmail = document.getElementById("registerEmail");
    this.registerPassword = document.getElementById("registerPassword");
    this.registerSubmitBtn = document.getElementById("registerSubmitBtn");

    this.togglePwdBtns = document.querySelectorAll(".auth-toggle-pwd");
    this.googleBtn = document.getElementById("googleAuthBtn");
    this.appleBtn = document.getElementById("appleAuthBtn");
    this.forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  }

  bindEvents() {
    this.tabSignIn.addEventListener("click", () => this.setMode("signin"));
    this.tabSignUp.addEventListener("click", () => this.setMode("signup"));

    if (this.switchModeLink) {
      this.switchModeLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.setMode(this.currentMode === "signin" ? "signup" : "signin");
      });
    }

    // Toggle password visibility
    this.togglePwdBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;

        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        
        btn.innerHTML = isPassword
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      });
    });

    // Form submissions
    this.signInForm.addEventListener("submit", (e) => this.handleSignIn(e));
    this.signUpForm.addEventListener("submit", (e) => this.handleSignUp(e));

    // Social buttons demo
    if (this.googleBtn) {
      this.googleBtn.addEventListener("click", () => this.handleSocialMock("Google"));
    }
    if (this.appleBtn) {
      this.appleBtn.addEventListener("click", () => this.handleSocialMock("Apple"));
    }

    if (this.forgotPasswordBtn) {
      this.forgotPasswordBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showAlert("info", "Please contact support@dishdiary.com to reset your chef password.");
      });
    }
  }

  checkUrlMode() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode === "signup") {
      this.setMode("signup");
    } else {
      this.setMode("signin");
    }
  }

  checkExistingSession() {
    const token = localStorage.getItem("dishdiary_token");
    const user = localStorage.getItem("dishdiary_user");
    if (token && user) {
      try {
        const u = JSON.parse(user);
        this.showAlert("success", `You are already logged in as ${u.name || "Chef"}.`);
      } catch (e) {}
    }
  }

  setMode(mode) {
    this.currentMode = mode;
    this.hideAlert();

    if (mode === "signin") {
      this.tabSignIn.classList.add("active");
      this.tabSignUp.classList.remove("active");
      this.tabSignIn.setAttribute("aria-selected", "true");
      this.tabSignUp.setAttribute("aria-selected", "false");

      this.signInForm.style.display = "flex";
      this.signUpForm.style.display = "none";

      this.titleEl.textContent = "Welcome Back";
      this.subtitleEl.textContent = "Sign in with your email to access your saved recipes & notes.";
      this.switchPrompt.innerHTML = `Don't have an account? <a id="switchModeLink">Sign up for free</a>`;
    } else {
      this.tabSignUp.classList.add("active");
      this.tabSignIn.classList.remove("active");
      this.tabSignUp.setAttribute("aria-selected", "true");
      this.tabSignIn.setAttribute("aria-selected", "false");

      this.signUpForm.style.display = "flex";
      this.signInForm.style.display = "none";

      this.titleEl.textContent = "Create an Account";
      this.subtitleEl.textContent = "Join culinary foodies and start sharing your secret recipes.";
      this.switchPrompt.innerHTML = `Already have an account? <a id="switchModeLink">Sign in here</a>`;
    }

    // Re-bind footer toggle link
    const newSwitch = document.getElementById("switchModeLink");
    if (newSwitch) {
      newSwitch.addEventListener("click", (e) => {
        e.preventDefault();
        this.setMode(this.currentMode === "signin" ? "signup" : "signin");
      });
    }
  }

  showAlert(type, message) {
    this.alertBanner.className = `auth-alert-banner ${type}`;
    this.alertMessage.textContent = message;
    this.alertBanner.style.display = "flex";
  }

  hideAlert() {
    this.alertBanner.style.display = "none";
    this.alertBanner.className = "auth-alert-banner";
  }

  // =========================================================
  // SIGN IN LOGIC (POST /api/v1/auth/login)
  // =========================================================
  async handleSignIn(e) {
    e.preventDefault();
    this.hideAlert();

    const email = this.loginEmail.value.trim();
    const password = this.loginPassword.value;

    if (!email || !password) {
      this.showAlert("error", "Please provide both your email and password.");
      return;
    }

    this.setButtonLoading(this.loginSubmitBtn, true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save access token & user state
        localStorage.setItem("dishdiary_token", result.data.accessToken);
        localStorage.setItem("dishdiary_user", JSON.stringify(result.data.user));

        this.showAlert("success", `Welcome back, ${result.data.user.name}! Redirecting...`);
        this.showToast(`Logged in as ${result.data.user.name}`);

        setTimeout(() => {
          const params = new URLSearchParams(window.location.search);
          const redirectUrl = params.get("redirect") || "./index.html";
          window.location.href = redirectUrl;
        }, 800);
      } else {
        const errorMsg = result.message || "Invalid credentials. Please verify your email and password.";
        this.showAlert("error", errorMsg);
      }
    } catch (err) {
      console.warn("Backend login connection issue:", err);
      // Fallback check in case backend server is temporarily paused
      this.showAlert("error", "Unable to connect to server. Ensure backend is running on http://localhost:5942");
    } finally {
      this.setButtonLoading(this.loginSubmitBtn, false);
    }
  }

  // =========================================================
  // SIGN UP LOGIC (POST /api/v1/auth/register)
  // =========================================================
  async handleSignUp(e) {
    e.preventDefault();
    this.hideAlert();

    const name = this.registerName.value.trim();
    const email = this.registerEmail.value.trim();
    const password = this.registerPassword.value;

    if (!name || !email || !password) {
      this.showAlert("error", "Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      this.showAlert("error", "Password must be at least 6 characters long.");
      return;
    }

    this.setButtonLoading(this.registerSubmitBtn, true);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.showAlert("success", "Account created successfully! Logging you in...");

        // Automatically log the user in
        try {
          const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const loginData = await loginRes.json();

          if (loginRes.ok && loginData.success) {
            localStorage.setItem("dishdiary_token", loginData.data.accessToken);
            localStorage.setItem("dishdiary_user", JSON.stringify(loginData.data.user));

            setTimeout(() => {
              window.location.href = "./index.html";
            }, 800);
            return;
          }
        } catch (autoLoginErr) {}

        // Fallback: switch to signin tab with prefilled email
        setTimeout(() => {
          this.setMode("signin");
          this.loginEmail.value = email;
          this.showAlert("success", "Registration complete! Please enter your password to sign in.");
        }, 1000);

      } else {
        const errorMsg = result.message || "Registration failed. Please check your information.";
        this.showAlert("error", errorMsg);
      }
    } catch (err) {
      console.warn("Backend registration error:", err);
      this.showAlert("error", "Could not connect to backend server. Make sure server is running on port 5942.");
    } finally {
      this.setButtonLoading(this.registerSubmitBtn, false);
    }
  }

  // Social Auth Mock
  handleSocialMock(provider) {
    this.showAlert("success", `${provider} authentication authorized. Signing in...`);
    const mockUser = {
      name: `${provider} Chef`,
      email: `chef@${provider.toLowerCase()}.com`,
      role: "user",
    };
    localStorage.setItem("dishdiary_token", "demo_token_" + Date.now());
    localStorage.setItem("dishdiary_user", JSON.stringify(mockUser));

    setTimeout(() => {
      window.location.href = "./index.html";
    }, 700);
  }

  setButtonLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
      btn.classList.add("loading");
      btn.disabled = true;
    } else {
      btn.classList.remove("loading");
      btn.disabled = false;
    }
  }

  showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AuthManager();
});
