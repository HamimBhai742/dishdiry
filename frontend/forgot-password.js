/**
 * DishDiary - Dedicated Forgot Password & OTP Reset Controller
 */

const API_BASE = window.API_BASE || "http://localhost:5942/api/v1";

class ForgotPasswordController {
  constructor() {
    this.currentStep = 1;
    this.email = "";
    this.otp = "";
    this.timerInterval = null;

    this.cacheDom();
    this.bindEvents();
    this.checkInitialEmail();
  }

  cacheDom() {
    // Step Sections
    this.stepEmailSection = document.getElementById("stepEmailSection");
    this.stepOtpSection = document.getElementById("stepOtpSection");
    this.stepResetSection = document.getElementById("stepResetSection");
    this.stepSuccessSection = document.getElementById("stepSuccessSection");

    // Indicators
    this.dot1 = document.getElementById("dotStep1");
    this.dot2 = document.getElementById("dotStep2");
    this.dot3 = document.getElementById("dotStep3");
    this.dot4 = document.getElementById("dotStep4");

    // Alert
    this.alertBanner = document.getElementById("authAlertBanner");
    this.alertMessage = document.getElementById("authAlertMessage");

    // Step 1 - Email
    this.forgotEmailForm = document.getElementById("forgotEmailForm");
    this.forgotEmailInput = document.getElementById("forgotEmailInput");
    this.sendOtpBtn = document.getElementById("sendOtpBtn");

    // Step 2 - OTP
    this.verifyOtpForm = document.getElementById("verifyOtpForm");
    this.otpCodeInput = document.getElementById("otpCodeInput");
    this.verifyOtpBtn = document.getElementById("verifyOtpBtn");
    this.displayTargetEmail = document.getElementById("displayTargetEmail");
    this.otpTimerDisplay = document.getElementById("otpTimerDisplay");
    this.resendOtpBtn = document.getElementById("resendOtpBtn");
    this.backToEmailStepBtn = document.getElementById("backToEmailStepBtn");

    // Step 3 - Reset
    this.newPasswordForm = document.getElementById("newPasswordForm");
    this.newPasswordInput = document.getElementById("newPasswordInput");
    this.confirmPasswordInput = document.getElementById("confirmPasswordInput");
    this.resetPasswordBtn = document.getElementById("resetPasswordBtn");
    this.togglePwdBtns = document.querySelectorAll(".auth-toggle-pwd");
  }

  bindEvents() {
    // Form 1: Email submit
    if (this.forgotEmailForm) {
      this.forgotEmailForm.addEventListener("submit", (e) => this.handleEmailSubmit(e));
    }

    // Form 2: OTP submit
    if (this.verifyOtpForm) {
      this.verifyOtpForm.addEventListener("submit", (e) => this.handleOtpSubmit(e));
    }

    // Resend OTP
    if (this.resendOtpBtn) {
      this.resendOtpBtn.addEventListener("click", () => this.handleResendOtp());
    }

    // Back to Email step
    if (this.backToEmailStepBtn) {
      this.backToEmailStepBtn.addEventListener("click", () => this.goToStep(1));
    }

    // Form 3: Reset password submit
    if (this.newPasswordForm) {
      this.newPasswordForm.addEventListener("submit", (e) => this.handleResetSubmit(e));
    }

    // Sanitize OTP input to digits only
    if (this.otpCodeInput) {
      this.otpCodeInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
      });
    }

    // Password visibility toggle
    this.togglePwdBtns.forEach((btn) => {
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
  }

  checkInitialEmail() {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam && this.forgotEmailInput) {
      this.forgotEmailInput.value = emailParam.trim();
    }
  }

  showAlert(type, message) {
    if (!this.alertBanner) return;
    this.alertBanner.className = `auth-alert-banner ${type}`;
    this.alertMessage.textContent = message;
    this.alertBanner.style.display = "flex";
  }

  hideAlert() {
    if (!this.alertBanner) return;
    this.alertBanner.style.display = "none";
    this.alertBanner.className = "auth-alert-banner";
  }

  goToStep(stepNumber) {
    this.currentStep = stepNumber;
    this.hideAlert();

    // Toggle views
    if (this.stepEmailSection) this.stepEmailSection.style.display = stepNumber === 1 ? "block" : "none";
    if (this.stepOtpSection) this.stepOtpSection.style.display = stepNumber === 2 ? "block" : "none";
    if (this.stepResetSection) this.stepResetSection.style.display = stepNumber === 3 ? "block" : "none";
    if (this.stepSuccessSection) this.stepSuccessSection.style.display = stepNumber === 4 ? "block" : "none";

    // Update dots
    const dots = [this.dot1, this.dot2, this.dot3, this.dot4];
    dots.forEach((dot, index) => {
      if (!dot) return;
      dot.className = "forgot-step-dot";
      if (index + 1 === stepNumber) {
        dot.classList.add("active");
      } else if (index + 1 < stepNumber) {
        dot.classList.add("completed");
      }
    });

    if (stepNumber === 2 && this.otpCodeInput) {
      setTimeout(() => this.otpCodeInput.focus(), 150);
    } else if (stepNumber === 3 && this.newPasswordInput) {
      setTimeout(() => this.newPasswordInput.focus(), 150);
    }
  }

  startTimer(duration = 600) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    let timeLeft = duration;

    const updateTimer = () => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      if (this.otpTimerDisplay) {
        this.otpTimerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }

      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        if (this.otpTimerDisplay) this.otpTimerDisplay.textContent = "Expired";
      } else {
        timeLeft--;
      }
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  async handleEmailSubmit(e) {
    e.preventDefault();
    this.hideAlert();

    const email = this.forgotEmailInput.value.trim();
    if (!email) {
      this.showAlert("error", "Please enter your account email address.");
      return;
    }

    this.setButtonLoading(this.sendOtpBtn, true);

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.email = email;
        if (this.displayTargetEmail) this.displayTargetEmail.textContent = email;
        if (this.otpCodeInput) this.otpCodeInput.value = "";

        this.goToStep(2);
        this.startTimer(600);
        this.showAlert("success", result.message || "A 6-digit verification code has been dispatched to your email!");
      } else {
        this.showAlert("error", result.message || "Unable to send verification code. Please check your email.");
      }
    } catch (err) {
      console.error("Forgot password network error:", err);
      this.showAlert("error", `Cannot connect to server. Please check backend API at ${API_BASE}`);
    } finally {
      this.setButtonLoading(this.sendOtpBtn, false);
    }
  }

  async handleOtpSubmit(e) {
    e.preventDefault();
    this.hideAlert();

    const otp = this.otpCodeInput.value.trim();
    if (!otp || otp.length !== 6) {
      this.showAlert("error", "Please enter a valid 6-digit code.");
      return;
    }

    this.setButtonLoading(this.verifyOtpBtn, true);

    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email, otp }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.otp = otp;
        this.goToStep(3);
        this.showAlert("success", "Code verified! Please create your new secure password.");
      } else {
        this.showAlert("error", result.message || "Invalid or expired verification code.");
      }
    } catch (err) {
      console.error("OTP verification network error:", err);
      this.showAlert("error", "Network error during verification.");
    } finally {
      this.setButtonLoading(this.verifyOtpBtn, false);
    }
  }

  async handleResendOtp() {
    this.hideAlert();
    if (!this.email) {
      this.goToStep(1);
      return;
    }

    if (this.resendOtpBtn) {
      this.resendOtpBtn.disabled = true;
      this.resendOtpBtn.textContent = "Sending...";
    }

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.startTimer(600);
        this.showAlert("success", "A new 6-digit code has been sent to your email!");
      } else {
        this.showAlert("error", result.message || "Failed to resend code.");
      }
    } catch (err) {
      this.showAlert("error", "Network error while resending code.");
    } finally {
      if (this.resendOtpBtn) {
        this.resendOtpBtn.disabled = false;
        this.resendOtpBtn.textContent = "Resend Code";
      }
    }
  }

  async handleResetSubmit(e) {
    e.preventDefault();
    this.hideAlert();

    const newPassword = this.newPasswordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;

    if (!newPassword || newPassword.length < 6) {
      this.showAlert("error", "Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showAlert("error", "Passwords do not match. Please re-enter.");
      return;
    }

    this.setButtonLoading(this.resetPasswordBtn, true);

    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.email,
          otp: this.otp,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.goToStep(4);
      } else {
        this.showAlert("error", result.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.error("Password reset network error:", err);
      this.showAlert("error", "Network error while updating password.");
    } finally {
      this.setButtonLoading(this.resetPasswordBtn, false);
    }
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
}

document.addEventListener("DOMContentLoaded", () => {
  new ForgotPasswordController();
});
