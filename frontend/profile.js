/**
 * DishDiary - Chef Profile Page Logic
 * Manages user profile information, published recipes, saved dishes, and profile editing.
 */

const API_BASE = "http://localhost:5942/api/v1";

// Reusable Logout Confirmation Modal
function showLogoutConfirmModal(onConfirm) {
  let existingModal = document.getElementById("logoutConfirmModal");
  if (existingModal) existingModal.remove();

  const backdrop = document.createElement("div");
  backdrop.id = "logoutConfirmModal";
  backdrop.className = "confirm-modal-backdrop";
  backdrop.innerHTML = `
    <div class="confirm-modal-card">
      <div class="confirm-modal-icon danger">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </div>
      <h3 class="confirm-modal-title">Sign Out of DishDiary?</h3>
      <p class="confirm-modal-desc">Are you sure you want to sign out? You will need to sign back in to publish dishes or access your saved bookmarks.</p>
      <div class="confirm-modal-actions">
        <button type="button" class="btn btn-outline" id="cancelLogoutModalBtn">Cancel</button>
        <button type="button" class="btn btn-primary" id="confirmLogoutModalBtn" style="background: #dc2626; border-color: #dc2626; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);">
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => {
    backdrop.classList.add("fade-out");
    setTimeout(() => backdrop.remove(), 150);
  };

  backdrop.querySelector("#cancelLogoutModalBtn").addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  backdrop.querySelector("#confirmLogoutModalBtn").addEventListener("click", () => {
    close();
    if (typeof onConfirm === "function") onConfirm();
  });
}
window.showLogoutConfirmModal = showLogoutConfirmModal;

class ProfileManager {
  constructor() {
    this.user = null;
    this.token = null;
    this.allRecipes = [];
    this.myRecipes = [];
    this.savedRecipes = [];
    this.recipeToDeleteId = null;

    this.init();
  }

  async init() {
    this.checkSession();
    this.bindEvents();
    this.renderUserProfile();
    await this.fetchRemoteUserProfile();
    await this.loadAllRecipes();
    this.renderMyRecipes();
    this.renderSavedRecipes();
    this.updateStats();
  }

  checkSession() {
    this.token = localStorage.getItem("dishdiary_token");
    const userJson = localStorage.getItem("dishdiary_user");

    if (userJson) {
      try {
        this.user = JSON.parse(userJson);
      } catch (e) {
        this.user = null;
      }
    }

    // Default mock user if not logged in so the page can be previewed
    if (!this.user) {
      this.user = {
        name: "Chef",
        email: "chef@dishdiary.com",
        role: "user",
        bio: "Passionate Home Cook & Recipe Creator",
        authorRole: "Home Chef",
        createdAt: new Date().toISOString(),
      };
    }

    this.renderNavbarUser();
  }

  renderNavbarUser() {
    const navUserSlot = document.getElementById("navUserSlot");
    const signInBtn = document.getElementById("signInBtn");
    if (!navUserSlot) return;

    if (this.token && this.user) {
      const initial = (this.user.name || "C").charAt(0).toUpperCase();
      const avatarHtml = this.user.avatarUrl
        ? `<img src="${this.user.avatarUrl}" class="nav-user-avatar" style="object-fit: cover; border-radius: 50%;" alt="Avatar">`
        : `<div class="nav-user-avatar">${initial}</div>`;
      const userPill = document.createElement("div");
      userPill.className = "nav-user-pill";
      userPill.id = "navUserPill";
      userPill.innerHTML = `
        ${avatarHtml}
        <span class="nav-user-name">${this.user.name || "Chef"}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        <div class="nav-user-menu" id="navUserMenu">
          <div style="padding: 6px 12px; font-size: 0.78rem; color: #94a3b8; border-bottom: 1px solid #f1f5f9;">
            Chef Account<br><strong style="color: #334155;">${this.user.email || ""}</strong>
          </div>
          <a href="./add-recipe.html" class="nav-user-item" id="menuAddRecipeBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>Add Recipe</span>
          </a>
          <a href="./profile.html" class="nav-user-item active" id="menuProfileBtn" style="color: var(--primary); font-weight: 700;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>My Profile</span>
          </a>
          <div style="height: 1px; background: #f1f5f9; margin: 4px 0;"></div>
          <button type="button" class="nav-user-item logout" id="menuLogoutBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Sign Out</span>
          </button>
        </div>
      `;

      navUserSlot.innerHTML = "";
      navUserSlot.appendChild(userPill);

      userPill.addEventListener("click", (e) => {
        if (e.target.closest("#menuLogoutBtn")) return;
        const menu = document.getElementById("navUserMenu");
        if (menu) menu.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (!userPill.contains(e.target)) {
          const menu = document.getElementById("navUserMenu");
          if (menu) menu.classList.remove("show");
        }
      });

      const menuLogoutBtn = document.getElementById("menuLogoutBtn");
      if (menuLogoutBtn) {
        menuLogoutBtn.addEventListener("click", () => this.handleSignOut());
      }
    } else if (signInBtn) {
      signInBtn.addEventListener("click", () => {
        window.location.href = "./login.html?redirect=profile.html";
      });
    }

    // Update saved count in navbar
    try {
      const saved = JSON.parse(localStorage.getItem("dishdiary_bookmarks") || "[]");
      const savedCountEl = document.getElementById("savedCount");
      if (savedCountEl) savedCountEl.textContent = saved.length;
    } catch (e) {}
  }

  async fetchRemoteUserProfile() {
    if (!this.token) return;

    try {
      const res = await fetch(`${API_BASE}/user/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.user = { ...this.user, ...json.data };
          localStorage.setItem("dishdiary_user", JSON.stringify(this.user));
          this.renderUserProfile();
        }
      }
    } catch (e) {
      console.warn("Could not sync remote user profile:", e);
    }
  }

  renderUserProfile() {
    const user = this.user || {};
    const name = user.name || "Chef";
    const initial = name.charAt(0).toUpperCase();
    const role = user.authorRole || user.role || "Verified Chef";
    const bio = user.bio || "Passionate Home Cook & Culinary Creator";
    const email = user.email || "chef@dishdiary.com";

    // Hero Profile Card elements
    const initialsEl = document.getElementById("profileAvatarInitials");
    const avatarImg = document.getElementById("profileAvatarImg");
    const displayName = document.getElementById("profileDisplayName");
    const rolePill = document.getElementById("profileRolePill");
    const bioText = document.getElementById("profileBioText");
    const emailText = document.getElementById("profileEmailText");
    const joinDateText = document.getElementById("profileJoinDateText");

    if (user.avatarUrl && avatarImg) {
      avatarImg.src = user.avatarUrl;
      avatarImg.style.display = "block";
      if (initialsEl) initialsEl.style.display = "none";
    } else {
      if (avatarImg) avatarImg.style.display = "none";
      if (initialsEl) {
        initialsEl.textContent = initial;
        initialsEl.style.display = "flex";
      }
    }

    if (displayName) displayName.textContent = name;
    if (rolePill) rolePill.textContent = role;
    if (bioText) bioText.textContent = bio;
    if (emailText) emailText.textContent = email;

    // Format join date
    let joinFormatted = "Member since 2026";
    if (user.createdAt) {
      try {
        const date = new Date(user.createdAt);
        joinFormatted = `Member since ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
      } catch (e) {}
    }
    if (joinDateText) joinDateText.textContent = joinFormatted;

    // Tab 3 Details Table
    const detailFullName = document.getElementById("detailFullName");
    const detailEmail = document.getElementById("detailEmail");
    const detailRole = document.getElementById("detailRole");
    const detailBio = document.getElementById("detailBio");
    const detailUserId = document.getElementById("detailUserId");
    const detailCreatedAt = document.getElementById("detailCreatedAt");

    if (detailFullName) detailFullName.textContent = name;
    if (detailEmail) detailEmail.textContent = email;
    if (detailRole) detailRole.textContent = role;
    if (detailBio) detailBio.textContent = bio;
    if (detailUserId) detailUserId.textContent = user.id || user._id || "dish_user_local";
    if (detailCreatedAt) detailCreatedAt.textContent = joinFormatted;
  }

  bindEvents() {
    // Tab switching
    const tabBtns = document.querySelectorAll(".profile-tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const targetTab = btn.dataset.tab;
        document.querySelectorAll(".profile-tab-panel").forEach((panel) => {
          panel.classList.remove("active");
        });

        if (targetTab === "myRecipes") {
          document.getElementById("panelMyRecipes")?.classList.add("active");
        } else if (targetTab === "savedDishes") {
          document.getElementById("panelSavedDishes")?.classList.add("active");
        } else if (targetTab === "accountDetails") {
          document.getElementById("panelAccountDetails")?.classList.add("active");
        }
      });
    });

    // Edit Profile Modal buttons
    const openEditBtn = document.getElementById("openEditProfileBtn");
    const detailEditBtn = document.getElementById("detailEditProfileBtn");
    const editModal = document.getElementById("editProfileModal");
    const closeEditBtn = document.getElementById("closeEditProfileBtn");
    const cancelEditBtn = document.getElementById("cancelEditProfileBtn");
    const editForm = document.getElementById("editProfileForm");

    const openModal = () => {
      if (!editModal) return;
      const nameInput = document.getElementById("editNameInput");
      const roleInput = document.getElementById("editRoleInput");
      const bioInput = document.getElementById("editBioInput");
      const avatarInput = document.getElementById("editAvatarInput");

      if (nameInput) nameInput.value = this.user?.name || "";
      if (roleInput) roleInput.value = this.user?.authorRole || this.user?.role || "Verified Chef";
      if (bioInput) bioInput.value = this.user?.bio || "";
      if (avatarInput) avatarInput.value = this.user?.avatarUrl || "";

      editModal.classList.add("show");
    };

    const closeModal = () => {
      if (editModal) editModal.classList.remove("show");
    };

    if (openEditBtn) openEditBtn.addEventListener("click", openModal);
    if (detailEditBtn) detailEditBtn.addEventListener("click", openModal);
    if (closeEditBtn) closeEditBtn.addEventListener("click", closeModal);
    if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeModal);

    if (editForm) {
      editForm.addEventListener("submit", (e) => this.handleSaveProfile(e));
    }

    // Delete Recipe Modal buttons
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const deleteModal = document.getElementById("deleteRecipeModal");

    if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener("click", () => {
        if (deleteModal) deleteModal.classList.remove("show");
        this.recipeToDeleteId = null;
      });
    }

    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener("click", () => this.handleConfirmDelete());
    }

    // Avatar Photo Change via Camera Button
    const avatarCameraBtn = document.getElementById("avatarCameraBtn");
    const avatarFileInput = document.getElementById("avatarFileInput");

    if (avatarCameraBtn && avatarFileInput) {
      avatarCameraBtn.addEventListener("click", () => {
        avatarFileInput.click();
      });

      avatarFileInput.addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
          this.showToast("Please select a valid image file (PNG, JPG, WEBP).");
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          this.showToast("Image size should be under 10MB.");
          return;
        }

        const originalBtnHtml = avatarCameraBtn.innerHTML;
        avatarCameraBtn.disabled = true;
        avatarCameraBtn.classList.add("uploading");
        avatarCameraBtn.innerHTML = `<span class="btn-spinner" style="width: 14px; height: 14px; border-width: 2px;"></span>`;

        // Local instant preview
        const reader = new FileReader();
        reader.onload = (ev) => {
          const avatarImg = document.getElementById("profileAvatarImg");
          const initialsEl = document.getElementById("profileAvatarInitials");
          if (avatarImg) {
            avatarImg.src = ev.target.result;
            avatarImg.style.display = "block";
          }
          if (initialsEl) initialsEl.style.display = "none";
        };
        reader.readAsDataURL(file);

        // Upload to backend Cloudinary endpoint
        const formData = new FormData();
        formData.append("image", file);

        try {
          const res = await fetch(`${API_BASE}/upload`, {
            method: "POST",
            body: formData,
          });

          const json = await res.json();
          if (res.ok && json.success && json.data?.url) {
            const uploadedUrl = json.data.url;
            this.user = {
              ...this.user,
              avatarUrl: uploadedUrl,
            };
            localStorage.setItem("dishdiary_user", JSON.stringify(this.user));

            if (this.token) {
              fetch(`${API_BASE}/user/me`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${this.token}`,
                },
                body: JSON.stringify({ avatarUrl: uploadedUrl }),
              }).catch(() => {});
            }

            this.renderUserProfile();
            this.renderNavbarUser();
            this.showToast("Profile photo updated successfully!");
          } else {
            throw new Error(json.message || "Failed to upload photo");
          }
        } catch (err) {
          console.warn("Avatar upload error:", err);
          this.showToast("Failed to upload avatar to Cloudinary");
        } finally {
          avatarCameraBtn.disabled = false;
          avatarCameraBtn.classList.remove("uploading");
          avatarCameraBtn.innerHTML = originalBtnHtml;
          avatarFileInput.value = "";
        }
      });
    }

    // Sign Out Button
    const logoutBtn = document.getElementById("profileLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.handleSignOut());
    }
  }

  async loadAllRecipes() {
    let apiRecipes = [];
    try {
      const res = await fetch(`${API_BASE}/recipes?limit=100`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          apiRecipes = json.data;
        }
      }
    } catch (e) {
      console.warn("Backend recipes API offline, reading local data");
    }

    // Read custom recipes from localStorage
    let customRecipes = [];
    try {
      customRecipes = JSON.parse(localStorage.getItem("dishdiary_custom_recipes") || "[]");
    } catch (e) {}

    // Combine unique recipes
    const map = new Map();
    [...customRecipes, ...apiRecipes].forEach((r) => {
      const id = r.id || r._id;
      if (id && !map.has(id)) {
        map.set(id, r);
      }
    });

    this.allRecipes = Array.from(map.values());

    // Filter "My Recipes"
    let myRecipeIds = [];
    try {
      myRecipeIds = JSON.parse(localStorage.getItem("dishdiary_my_recipe_ids") || "[]");
    } catch (e) {}

    const userName = (this.user?.name || "").toLowerCase();
    const userEmail = (this.user?.email || "").toLowerCase();
    const userId = this.user?.id || this.user?._id;

    this.myRecipes = this.allRecipes.filter((r) => {
      const rId = r.id || r._id;
      if (myRecipeIds.includes(rId)) return true;
      if (userId && r.userId === userId) return true;
      if (userEmail && r.authorEmail && r.authorEmail.toLowerCase() === userEmail) return true;
      if (userName && r.author && r.author.toLowerCase() === userName) return true;
      return false;
    });

    // Filter "Saved Recipes"
    let bookmarkedIds = [];
    try {
      bookmarkedIds = JSON.parse(localStorage.getItem("dishdiary_bookmarks") || "[]");
    } catch (e) {}

    this.savedRecipes = this.allRecipes.filter((r) => {
      const rId = r.id || r._id;
      return bookmarkedIds.includes(rId);
    });
  }

  renderMyRecipes() {
    const grid = document.getElementById("myRecipesGrid");
    const emptyState = document.getElementById("myRecipesEmptyState");
    const badge = document.getElementById("tabMyRecipesBadge");
    const stat = document.getElementById("statMyRecipesCount");

    if (badge) badge.textContent = this.myRecipes.length;
    if (stat) stat.textContent = this.myRecipes.length;

    if (!grid) return;

    if (this.myRecipes.length === 0) {
      grid.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    grid.innerHTML = this.myRecipes
      .map((r) => {
        const id = r.id || r._id;
        const totalTime = (r.prepTime || 15) + (r.cookTime || 20);
        const image = r.image || "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80";

        return `
          <div class="profile-recipe-card" data-recipe-id="${id}">
            <div class="profile-recipe-thumb-wrap">
              <img src="${image}" alt="${r.title}" class="profile-recipe-thumb" loading="lazy">
              <span class="profile-card-chip">${r.category || "Main"}</span>
            </div>
            <div class="profile-recipe-body">
              <h3 class="profile-recipe-title">${r.title}</h3>
              <div class="profile-recipe-meta">
                <span>⏱️ ${totalTime} mins</span>
                <span>🔥 ${r.difficulty || "Easy"}</span>
                <span>⭐ ${r.rating || "5.0"}</span>
              </div>
              <div class="profile-recipe-actions">
                <a href="./recipe-detail.html?id=${encodeURIComponent(id)}" class="btn btn-outline btn-sm profile-recipe-btn-view">
                  View Recipe
                </a>
                <button type="button" class="profile-recipe-btn-del" title="Delete Recipe" onclick="profileApp.promptDeleteRecipe('${id}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  renderSavedRecipes() {
    const grid = document.getElementById("savedDishesGrid");
    const emptyState = document.getElementById("savedDishesEmptyState");
    const badge = document.getElementById("tabSavedBadge");
    const stat = document.getElementById("statSavedCount");

    if (badge) badge.textContent = this.savedRecipes.length;
    if (stat) stat.textContent = this.savedRecipes.length;

    if (!grid) return;

    if (this.savedRecipes.length === 0) {
      grid.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    grid.innerHTML = this.savedRecipes
      .map((r) => {
        const id = r.id || r._id;
        const totalTime = (r.prepTime || 15) + (r.cookTime || 20);
        const image = r.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80";

        return `
          <div class="profile-recipe-card">
            <div class="profile-recipe-thumb-wrap">
              <img src="${image}" alt="${r.title}" class="profile-recipe-thumb" loading="lazy">
              <span class="profile-card-chip">${r.category || "Saved"}</span>
            </div>
            <div class="profile-recipe-body">
              <h3 class="profile-recipe-title">${r.title}</h3>
              <div class="profile-recipe-meta">
                <span>⏱️ ${totalTime} mins</span>
                <span>👨‍🍳 ${r.author || "Chef"}</span>
                <span>⭐ ${r.rating || "4.8"}</span>
              </div>
              <div class="profile-recipe-actions">
                <a href="./recipe-detail.html?id=${encodeURIComponent(id)}" class="btn btn-outline btn-sm profile-recipe-btn-view">
                  View Recipe
                </a>
                <button type="button" class="profile-recipe-btn-del" title="Remove Bookmark" onclick="profileApp.removeBookmark('${id}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  updateStats() {
    // Compute total estimated cook time
    let totalMinutes = 0;
    this.myRecipes.forEach((r) => {
      totalMinutes += (r.prepTime || 15) + (r.cookTime || 20);
    });

    const hours = (totalMinutes / 60).toFixed(1);
    const cookHoursEl = document.getElementById("statCookTimeHours");
    if (cookHoursEl) cookHoursEl.textContent = totalMinutes > 0 ? `${hours}h` : "1.2h";
  }

  async handleSaveProfile(e) {
    e.preventDefault();
    const saveBtn = document.getElementById("saveProfileBtn");
    const nameInput = document.getElementById("editNameInput");
    const roleInput = document.getElementById("editRoleInput");
    const bioInput = document.getElementById("editBioInput");
    const avatarInput = document.getElementById("editAvatarInput");

    const newName = nameInput?.value.trim() || this.user.name;
    const newRole = roleInput?.value.trim() || "Verified Chef";
    const newBio = bioInput?.value.trim() || "";
    const newAvatar = avatarInput?.value.trim() || "";

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<span class="btn-spinner"></span> <span>Saving...</span>`;
    }

    this.user = {
      ...this.user,
      name: newName,
      authorRole: newRole,
      bio: newBio,
      avatarUrl: newAvatar,
    };

    localStorage.setItem("dishdiary_user", JSON.stringify(this.user));

    // If logged in to backend, sync with PATCH /api/v1/user/me
    if (this.token) {
      try {
        await fetch(`${API_BASE}/user/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ name: newName }),
        });
      } catch (err) {
        console.warn("Could not sync profile name to backend API:", err);
      }
    }

    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span>Save Profile</span>`;
    }

    const editModal = document.getElementById("editProfileModal");
    if (editModal) editModal.classList.remove("show");

    this.renderUserProfile();
    this.renderNavbarUser();
    this.showToast("Profile details updated successfully!");
  }

  promptDeleteRecipe(id) {
    this.recipeToDeleteId = id;
    const modal = document.getElementById("deleteRecipeModal");
    if (modal) modal.classList.add("show");
  }

  async handleConfirmDelete() {
    const id = this.recipeToDeleteId;
    if (!id) return;

    const confirmBtn = document.getElementById("confirmDeleteBtn");
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<span class="btn-spinner"></span> <span>Deleting...</span>`;
    }

    // Try deleting from backend
    try {
      await fetch(`${API_BASE}/recipes/${id}`, {
        method: "DELETE",
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      });
    } catch (e) {
      console.warn("Backend delete error:", e);
    }

    // Remove from local custom recipes
    try {
      const stored = JSON.parse(localStorage.getItem("dishdiary_custom_recipes") || "[]");
      const updated = stored.filter((r) => (r.id || r._id) !== id);
      localStorage.setItem("dishdiary_custom_recipes", JSON.stringify(updated));

      const myIds = JSON.parse(localStorage.getItem("dishdiary_my_recipe_ids") || "[]");
      const updatedIds = myIds.filter((myId) => myId !== id);
      localStorage.setItem("dishdiary_my_recipe_ids", JSON.stringify(updatedIds));
    } catch (e) {}

    // Update state
    this.myRecipes = this.myRecipes.filter((r) => (r.id || r._id) !== id);
    this.allRecipes = this.allRecipes.filter((r) => (r.id || r._id) !== id);

    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<span>Delete Recipe</span>`;
    }

    const modal = document.getElementById("deleteRecipeModal");
    if (modal) modal.classList.remove("show");

    this.recipeToDeleteId = null;
    this.renderMyRecipes();
    this.updateStats();
    this.showToast("Recipe deleted successfully");
  }

  removeBookmark(id) {
    try {
      const saved = JSON.parse(localStorage.getItem("dishdiary_bookmarks") || "[]");
      const updated = saved.filter((bId) => bId !== id);
      localStorage.setItem("dishdiary_bookmarks", JSON.stringify(updated));

      this.savedRecipes = this.savedRecipes.filter((r) => (r.id || r._id) !== id);
      this.renderSavedRecipes();

      const savedCountEl = document.getElementById("savedCount");
      if (savedCountEl) savedCountEl.textContent = updated.length;

      this.showToast("Dish removed from bookmarks");
    } catch (e) {}
  }

  handleSignOut() {
    showLogoutConfirmModal(() => {
      localStorage.removeItem("dishdiary_token");
      localStorage.removeItem("dishdiary_user");
      this.showToast("Signed out successfully");
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 500);
    });
  }

  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;
    const container = document.getElementById("toastContainer");
    if (container) {
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
    }
  }
}

// Instantiate globally so inline onclick can access profileApp
let profileApp;
document.addEventListener("DOMContentLoaded", () => {
  profileApp = new ProfileManager();
});
