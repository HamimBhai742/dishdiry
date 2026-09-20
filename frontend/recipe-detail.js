/**
 * DishDiary - Dedicated Recipe Detail Page Logic
 * Loads recipe by ?id= from URL parameter, syncs with localStorage,
 * powers the live cooking timer, and renders related recipes.
 */

// Shared Default Recipes Dataset
const DEFAULT_RECIPES = [
  {
    id: "dish-1",
    title: "Crispy Smashed Potatoes with Herb Butter",
    category: "Quick & Easy",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 35,
    servings: 4,
    rating: 4.9,
    reviewsCount: 142,
    author: "Sarah Jenkins",
    authorRole: "Culinary Editor",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&h=800&q=85",
    description: "Tender baby Yukon gold potatoes gently smashed to perfection, roasted until deeply golden and crispy, then drizzled with aromatic garlic rosemary herb butter and flaked sea salt.",
    ingredients: [
      "1.5 lbs baby Yukon Gold or red potatoes",
      "3 tbsp unsalted butter, melted",
      "2 tbsp extra virgin olive oil",
      "3 cloves garlic, finely minced",
      "1 tbsp freshly chopped rosemary",
      "1 tbsp chopped fresh parsley",
      "1/2 tsp sea salt flakes & cracked black pepper",
      "Grated Parmesan cheese (optional garnish)"
    ],
    instructions: [
      "Place potatoes in a large pot with cold salted water. Bring to a rolling boil and simmer for 15-20 minutes until fork-tender.",
      "Drain thoroughly and allow to steam-dry for 5 minutes.",
      "Preheat your oven to 425°F (220°C) and oil a heavy-duty baking sheet.",
      "Arrange potatoes on the sheet and use the flat bottom of a glass or mug to gently smash each potato to about 1/2-inch thickness.",
      "Whisk together melted butter, olive oil, minced garlic, rosemary, salt, and pepper. Brush generously over potatoes.",
      "Roast for 30-35 minutes until the edges are deep golden-brown and crackling crisp. Garnish with parsley and serve hot."
    ]
  },
  {
    id: "dish-2",
    title: "Fresh Herb & Citrus Garden Salad with Garlic Emulsion",
    category: "Lunch",
    difficulty: "Easy",
    prepTime: 12,
    cookTime: 0,
    servings: 2,
    rating: 4.8,
    reviewsCount: 89,
    author: "Elena Rostova",
    authorRole: "Plant-Based Chef",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&h=800&q=85",
    description: "Crisp market greens paired with sweet citrus ribbons, fresh dill, basil, and an emulsified roasted garlic vinaigrette.",
    ingredients: [
      "5 cups mixed baby greens & arugula",
      "1 cup fresh cilantro, mint, and dill sprigs",
      "1 blood orange, segmented",
      "1/4 cup toasted pumpkin seeds",
      "3 tbsp cold-pressed olive oil",
      "1 tbsp aged white balsamic vinegar",
      "1 tsp Dijon mustard",
      "Pinch of sea salt"
    ],
    instructions: [
      "Wash and thoroughly spin dry all greens and tender fresh herbs.",
      "In a small mixing jar, shake olive oil, vinegar, Dijon mustard, and salt until emulsified.",
      "Toss greens gently with dressing just before plating.",
      "Top with blood orange segments and toasted pumpkin seeds."
    ]
  },
  {
    id: "dish-3",
    title: "Creamy Tuscan Garlic Chicken with Sun-Dried Tomatoes",
    category: "Dinner",
    difficulty: "Intermediate",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    rating: 4.9,
    reviewsCount: 215,
    author: "Marco Bellini",
    authorRole: "Executive Chef",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&h=800&q=85",
    description: "Pan-seared golden chicken breasts in a velvety garlic cream sauce laced with wilted baby spinach and tangy sun-dried tomatoes.",
    ingredients: [
      "2 large chicken breasts, sliced horizontally into cutlets",
      "2 tbsp butter & 1 tbsp olive oil",
      "4 cloves garlic, minced",
      "1 cup heavy whipping cream",
      "1/2 cup chicken broth",
      "1/2 cup grated Parmigiano-Reggiano",
      "1/2 cup sun-dried tomatoes, sliced",
      "2 cups fresh baby spinach"
    ],
    instructions: [
      "Season chicken cutlets with Italian herb blend, salt, and pepper.",
      "Heat olive oil in a skillet over medium-high heat. Sear chicken 5 minutes per side until golden. Remove to plate.",
      "Melt butter in the same pan; sauté garlic for 1 minute until fragrant.",
      "Pour in chicken broth, heavy cream, and sun-dried tomatoes. Simmer gently for 3 minutes.",
      "Stir in Parmesan cheese until melted and smooth.",
      "Add spinach and return chicken to pan. Simmer for 3 minutes until spinach is wilted."
    ]
  },
  {
    id: "dish-4",
    title: "Artisan Sourdough Margherita Pizza",
    category: "Dinner",
    difficulty: "Intermediate",
    prepTime: 30,
    cookTime: 12,
    servings: 3,
    rating: 4.9,
    reviewsCount: 178,
    author: "Sarah Jenkins",
    authorRole: "Baker & Food Stylist",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&h=800&q=85",
    description: "Slow-fermented sourdough crust topped with San Marzano tomato puree, buffalo mozzarella rounds, and torn sweet basil leaves.",
    ingredients: [
      "1 ball artisan sourdough pizza dough (room temperature)",
      "1/2 cup San Marzano crushed tomatoes",
      "150g fresh buffalo mozzarella, torn",
      "Handful fresh sweet basil leaves",
      "2 tbsp extra virgin olive oil",
      "Coarse sea salt"
    ],
    instructions: [
      "Preheat oven with a pizza stone at 500°F (260°C) for at least 45 minutes.",
      "Stretch dough gently by hand on floured parchment paper.",
      "Spread tomato sauce in a circular motion, leaving 1-inch crust edge.",
      "Scatter torn mozzarella across sauce.",
      "Bake for 10-12 minutes until crust blistered and cheese is bubbling.",
      "Garnish immediately with fresh basil and olive oil."
    ]
  },
  {
    id: "dish-5",
    title: "Brioche French Toast with Wild Berry Compote",
    category: "Breakfast",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    rating: 4.7,
    reviewsCount: 94,
    author: "David Miller",
    authorRole: "Pastry Specialist",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1484723091739-004a8024e759?auto=format&fit=crop&w=1200&h=800&q=85",
    description: "Thick-cut golden brioche slices soaked in vanilla bean custard, pan-caramelized in butter, and crowned with warm berry reduction.",
    ingredients: [
      "4 thick slices brioche bread",
      "3 large eggs",
      "1/2 cup whole milk or light cream",
      "1 tsp pure vanilla extract",
      "1/2 tsp ground cinnamon",
      "2 tbsp butter for frying",
      "1 cup mixed berries (blueberries, raspberries)",
      "2 tbsp pure maple syrup"
    ],
    instructions: [
      "In a shallow dish, whisk eggs, milk, vanilla, and cinnamon until blended.",
      "Soak brioche slices for 40 seconds per side.",
      "Melt butter in a skillet over medium heat.",
      "Cook bread 3-4 minutes per side until deep golden and puffed.",
      "Simmer berries with maple syrup in a saucepan for 3 minutes.",
      "Pour warm berries over toast and dust with powdered sugar."
    ]
  },
  {
    id: "dish-6",
    title: "Spiced Honey Glazed Wild Salmon",
    category: "Dinner",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    rating: 4.8,
    reviewsCount: 163,
    author: "Marco Bellini",
    authorRole: "Executive Chef",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&h=800&q=85",
    description: "Pan-roasted Atlantic salmon fillets basted with a sticky honey, smoked paprika, Dijon, and fresh lime glaze.",
    ingredients: [
      "2 wild salmon fillets (approx. 6 oz each)",
      "2 tbsp raw honey",
      "1 tbsp low-sodium soy sauce",
      "1 tsp Dijon mustard",
      "1/2 tsp smoked paprika & garlic powder",
      "1 tbsp olive oil",
      "Fresh lime wedges & chives"
    ],
    instructions: [
      "Pat salmon fillets dry with paper towels. Season with salt and pepper.",
      "Whisk honey, soy sauce, Dijon, garlic powder, and paprika.",
      "Heat olive oil in a nonstick pan over medium-high heat.",
      "Sear salmon skin-side down for 4 minutes, flip and cook 3 minutes.",
      "Pour glaze into pan, reducing into a bubbly lacquer over salmon for 1 minute."
    ]
  },
  {
    id: "dish-7",
    title: "Silky Belgian Dark Chocolate Mousse",
    category: "Dessert",
    difficulty: "Intermediate",
    prepTime: 20,
    cookTime: 0,
    servings: 4,
    rating: 4.9,
    reviewsCount: 110,
    author: "David Miller",
    authorRole: "Pastry Specialist",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&h=800&q=85",
    description: "Decadent 70% dark chocolate folded into airy whipped cream and egg whites, finished with sea salt flakes.",
    ingredients: [
      "200g high-quality dark chocolate (70%)",
      "3 large eggs, separated",
      "1/4 cup granulated sugar",
      "1 cup chilled heavy cream",
      "1 tsp espresso powder",
      "Cocoa powder for dusting"
    ],
    instructions: [
      "Melt chopped chocolate in a heatproof bowl over a pot of barely simmering water.",
      "Whip heavy cream to soft peaks and chill.",
      "Whip egg whites with sugar until glossy medium peaks form.",
      "Whisk egg yolks into slightly cooled melted chocolate.",
      "Gently fold egg whites into chocolate mixture, followed by whipped cream.",
      "Divide into glasses and chill for at least 3 hours."
    ]
  },
  {
    id: "dish-8",
    title: "Sparkling Rosemary Grapefruit Mocktail",
    category: "Drinks",
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    rating: 4.6,
    reviewsCount: 52,
    author: "Elena Rostova",
    authorRole: "Plant-Based Chef",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&h=800&q=85",
    description: "Freshly squeezed pink grapefruit juice shaken with homemade rosemary syrup, topped with effervescent sparkling soda.",
    ingredients: [
      "1 cup fresh pink grapefruit juice",
      "2 tbsp rosemary simple syrup",
      "1 cup premium sparkling water",
      "Crushed ice",
      "Fresh rosemary sprigs & grapefruit wheel garnish"
    ],
    instructions: [
      "Fill two highball glasses generously with crushed ice.",
      "Divide grapefruit juice and rosemary syrup between glasses.",
      "Top with sparkling water and stir with a bar spoon.",
      "Clap a rosemary sprig to release oils and insert as garnish."
    ]
  }
];

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

class RecipeDetailPage {
  constructor() {
    this.recipes = this.loadAllRecipes();
    this.savedIds = new Set(this.loadSavedIds());
    this.currentRecipe = this.resolveCurrentRecipe();

    this.timerInterval = null;
    this.timerSecondsRemaining = 0;

    this.init();
    this.fetchRecipeFromAPI();
    this.setupNavbarAuth();
  }

  setupNavbarAuth() {
    const signInBtn = document.getElementById("signInBtn");
    if (!signInBtn) return;

    const userJson = localStorage.getItem("dishdiary_user");
    if (userJson) {
      document.body.classList.add("user-logged-in");
      try {
        const user = JSON.parse(userJson);
        const initial = (user.name || "Chef").charAt(0).toUpperCase();

        const userPill = document.createElement("div");
        userPill.className = "nav-user-pill";
        userPill.id = "navUserPill";
        userPill.title = "View account details";
        userPill.innerHTML = `
          <div class="nav-user-avatar">${initial}</div>
          <span class="nav-user-name">${user.name || "Chef"}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <div class="nav-user-menu" id="navUserMenu">
            <div style="padding: 6px 12px; font-size: 0.78rem; color: #94a3b8; border-bottom: 1px solid #f1f5f9;">
              Chef Account<br><strong style="color: #334155;">${user.email || ""}</strong>
            </div>
            <a href="./add-recipe.html" class="nav-user-item" id="menuAddRecipeBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Add Recipe</span>
            </a>
            <a href="./profile.html" class="nav-user-item" id="menuProfileBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>My Profile</span>
            </a>
            <div style="height: 1px; background: #f1f5f9; margin: 4px 0;"></div>
            <button type="button" class="nav-user-item logout" id="logoutBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Sign Out</span>
            </button>
          </div>
        `;

        signInBtn.replaceWith(userPill);

        // Hide "Add Recipe" button when user is logged in
        const addRecipeBtn = document.querySelector(".nav-actions a[href*='add-recipe.html']");
        if (addRecipeBtn) addRecipeBtn.style.display = "none";

        userPill.addEventListener("click", (e) => {
          if (e.target.closest("#logoutBtn")) return;
          const menu = document.getElementById("navUserMenu");
          if (menu) menu.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
          if (!userPill.contains(e.target)) {
            const menu = document.getElementById("navUserMenu");
            if (menu) menu.classList.remove("show");
          }
        });

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", () => {
            const menu = document.getElementById("navUserMenu");
            if (menu) menu.classList.remove("show");

            showLogoutConfirmModal(() => {
              localStorage.removeItem("dishdiary_token");
              localStorage.removeItem("dishdiary_user");
              setTimeout(() => window.location.reload(), 400);
            });
          });
        }
        return;
      } catch (e) {}
    }

    signInBtn.addEventListener("click", () => {
      window.location.href = "./login.html";
    });
  }

  async fetchRecipeFromAPI() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/recipes/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const remote = {
            ...json.data,
            id: json.data.id || json.data._id,
          };
          this.currentRecipe = remote;
          this.init();
        }
      }
    } catch (e) {
      // Offline mode fallback is already rendered
    }
  }

  loadAllRecipes() {
    try {
      const custom = localStorage.getItem("dishdiary_custom_recipes");
      if (custom) {
        return [...JSON.parse(custom), ...DEFAULT_RECIPES];
      }
    } catch (e) {}
    return [...DEFAULT_RECIPES];
  }

  loadSavedIds() {
    try {
      const saved = localStorage.getItem("dishdiary_bookmarks");
      return saved ? JSON.parse(saved) : ["dish-1"];
    } catch (e) {
      return ["dish-1"];
    }
  }

  saveSavedIds() {
    try {
      localStorage.setItem("dishdiary_bookmarks", JSON.stringify(Array.from(this.savedIds)));
    } catch (e) {}
  }

  resolveCurrentRecipe() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      const found = this.recipes.find(r => r.id === id);
      if (found) return found;
    }
    return this.recipes[0];
  }

  init() {
    this.renderHeader();
    this.renderIngredients();
    this.renderInstructions();
    this.renderRelatedRecipes();
    this.setupTimer();
    this.setupEventListeners();
    this.updateBookmarkState();
  }

  renderHeader() {
    const r = this.currentRecipe;
    document.title = `${r.title} — DishDiary`;

    document.getElementById("breadcrumbTitle").textContent = r.title;
    document.getElementById("detailCategory").textContent = r.category;
    
    const diffEl = document.getElementById("detailDifficulty");
    diffEl.textContent = r.difficulty;
    diffEl.className = `badge badge-difficulty ${r.difficulty.toLowerCase()}`;

    document.getElementById("detailRating").textContent = r.rating;
    document.getElementById("detailReviews").textContent = `(${r.reviewsCount} reviews)`;
    document.getElementById("detailTitle").textContent = r.title;
    document.getElementById("detailDescription").textContent = r.description;

    document.getElementById("detailPrepTime").textContent = `${r.prepTime} mins`;
    document.getElementById("detailCookTime").textContent = `${r.cookTime} mins`;
    document.getElementById("detailTotalTime").textContent = `${r.prepTime + r.cookTime} mins`;
    document.getElementById("detailServings").textContent = `${r.servings} Servings`;

    const avatar = document.getElementById("detailAuthorAvatar");
    avatar.src = r.authorAvatar;
    avatar.alt = r.author;
    document.getElementById("detailAuthorName").textContent = r.author;
    document.getElementById("detailAuthorRole").textContent = r.authorRole;

    const heroImg = document.getElementById("detailHeroImg");
    heroImg.src = r.image;
    heroImg.alt = r.title;

    document.getElementById("ingredientServings").textContent = `${r.servings} Servings`;
    document.getElementById("stepsCount").textContent = `${r.instructions.length} Steps`;
    document.getElementById("savedCount").textContent = this.savedIds.size;
  }

  renderIngredients() {
    const list = document.getElementById("pageIngredientsList");
    list.innerHTML = this.currentRecipe.ingredients.map(raw => {
      const trimmed = raw.trim();
      // Section header detection: e.g. [For the Dough] or [For the Sauce]
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        const headerText = trimmed.replace(/^\[+|\]+$/g, "");
        return `<li class="ingredient-header-item"><strong>${headerText}</strong></li>`;
      }

      return `
        <li class="ingredient-item">
          <input type="checkbox">
          <span>${trimmed}</span>
        </li>
      `;
    }).join("");

    list.querySelectorAll(".ingredient-item").forEach(item => {
      const box = item.querySelector("input[type='checkbox']");
      box?.addEventListener("change", () => {
        item.classList.toggle("checked", box.checked);
      });
    });
  }

  renderInstructions() {
    const list = document.getElementById("pageInstructionsList");
    list.innerHTML = this.currentRecipe.instructions.map(step => {
      let formatted = step;

      // Replace [timer: X mins] or [timer: Xm] with clickable timer badge
      formatted = formatted.replace(/\[timer:\s*(\d+)\s*(?:mins?|m)?\]/gi, (match, mins) => {
        return `<button type="button" class="inline-step-timer" data-timer-mins="${mins}" title="Click to start ${mins}-min timer">⏱️ ${mins} Mins (Start Timer)</button>`;
      });

      // Replace [tip: ...] with pro tip pill
      formatted = formatted.replace(/\[tip:\s*([^\]]+)\]/gi, (match, tipText) => {
        return `<span class="inline-step-tip">💡 <strong>Tip:</strong> ${tipText}</span>`;
      });

      // Replace [heat: ...] or [temp: ...]
      formatted = formatted.replace(/\[(?:heat|temp):\s*([^\]]+)\]/gi, (match, heatText) => {
        return `<span class="inline-step-heat">🔥 ${heatText}</span>`;
      });

      return `<li class="instruction-step"><div class="instruction-step-text">${formatted}</div></li>`;
    }).join("");

    // Bind click handlers to inline timer buttons
    list.querySelectorAll(".inline-step-timer").forEach(btn => {
      btn.addEventListener("click", () => {
        const mins = parseInt(btn.dataset.timerMins, 10);
        if (mins) {
          this.startCustomTimer(mins);
          this.showToast(`Timer set to ${mins} minutes!`);
          document.querySelector(".cooking-timer-card")?.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  startCustomTimer(minutes) {
    this.setupTimer(minutes);
    const startBtn = document.getElementById("pageTimerStartBtn");
    if (startBtn && startBtn.textContent === "Start Timer") {
      startBtn.click();
    }
  }

  renderRelatedRecipes() {
    const grid = document.getElementById("relatedRecipesGrid");
    const related = this.recipes
      .filter(r => r.id !== this.currentRecipe.id)
      .slice(0, 3);

    grid.innerHTML = related.map(r => `
      <a href="./recipe-detail.html?id=${r.id}" class="related-card">
        <img src="${r.image}" alt="${r.title}" class="related-img">
        <div class="related-body">
          <span class="badge badge-difficulty ${r.difficulty.toLowerCase()}">${r.category}</span>
          <h4 class="related-title-text">${r.title}</h4>
          <span class="related-time">${r.prepTime + r.cookTime} mins • ★ ${r.rating}</span>
        </div>
      </a>
    `).join("");
  }

  setupTimer() {
    const cookMinutes = this.currentRecipe.cookTime || 15;
    const totalSeconds = cookMinutes * 60;
    this.timerSecondsRemaining = totalSeconds;

    const clock = document.getElementById("pageTimerClock");
    const startBtn = document.getElementById("pageTimerStartBtn");
    const resetBtn = document.getElementById("pageTimerResetBtn");

    const updateDisplay = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      clock.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    updateDisplay(totalSeconds);

    let isRunning = false;

    startBtn.addEventListener("click", () => {
      if (!isRunning) {
        isRunning = true;
        startBtn.textContent = "Pause Timer";
        this.timerInterval = setInterval(() => {
          if (this.timerSecondsRemaining > 0) {
            this.timerSecondsRemaining--;
            updateDisplay(this.timerSecondsRemaining);
          } else {
            clearInterval(this.timerInterval);
            clock.textContent = "DONE! 🔔";
            this.showToast("Cooking timer finished! Check your delicious dish.");
          }
        }, 1000);
      } else {
        isRunning = false;
        startBtn.textContent = "Resume";
        clearInterval(this.timerInterval);
      }
    });

    resetBtn.addEventListener("click", () => {
      isRunning = false;
      clearInterval(this.timerInterval);
      this.timerSecondsRemaining = totalSeconds;
      startBtn.textContent = "Start Timer";
      updateDisplay(totalSeconds);
    });
  }

  setupEventListeners() {
    const saveBtn = document.getElementById("detailSaveBtn");
    saveBtn.addEventListener("click", () => {
      const id = this.currentRecipe.id;
      if (this.savedIds.has(id)) {
        this.savedIds.delete(id);
        this.showToast("Removed from saved recipes");
      } else {
        this.savedIds.add(id);
        this.showToast("Saved to your cookbook!");
      }
      this.saveSavedIds();
      this.updateBookmarkState();
      document.getElementById("savedCount").textContent = this.savedIds.size;
    });

    document.getElementById("detailShareBtn").addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: this.currentRecipe.title,
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        this.showToast("Recipe link copied to clipboard!");
      }
    });
  }

  updateBookmarkState() {
    const saveBtn = document.getElementById("detailSaveBtn");
    const isSaved = this.savedIds.has(this.currentRecipe.id);
    saveBtn.classList.toggle("saved", isSaved);
    saveBtn.querySelector("span").textContent = isSaved ? "Saved to Cookbook" : "Save Recipe";
  }

  showToast(message) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new RecipeDetailPage();
});
