/**
 * DishDiary - Interactive Application Logic
 * Supports category filtering, live search, bookmarking, 
 * interactive cooking timer, detail modals, and localStorage persistence.
 */

// Initial Seed Database (Rich culinary dataset matching Figma aesthetic)
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
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
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
    author: "Chef Sarah Jenkins",
    authorRole: "Baker & Food Stylist",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
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

// App State Management
class DishDiaryApp {
  constructor() {
    this.recipes = this.loadStoredRecipes();
    this.savedIds = new Set(this.loadSavedRecipeIds());
    this.activeCategory = "All";
    this.searchQuery = "";
    this.sortBy = "latest";
    this.timerInterval = null;
    this.timerSecondsRemaining = 0;

    this.cacheDom();
    this.bindEvents();
    this.setupHeroCarousel();
    this.render();
    this.fetchRecipesFromAPI();
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
            <a href="#recipes" class="nav-user-item" id="menuMyRecipesBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span>My Recipes</span>
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

        // Hide "Add Recipe" button on navbar when user is logged in
        const addRecipeBtn = document.getElementById("openAddRecipeBtn");
        if (addRecipeBtn) addRecipeBtn.style.display = "none";

        const mobileAddRecipeBtn = document.getElementById("mobileAddRecipeBtn");
        if (mobileAddRecipeBtn) mobileAddRecipeBtn.style.display = "none";

        userPill.addEventListener("click", (e) => {
          if (e.target.closest("#logoutBtn") || e.target.closest("#menuAddRecipeBtn")) return;
          const menu = document.getElementById("navUserMenu");
          if (menu) menu.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
          if (!userPill.contains(e.target)) {
            const menu = document.getElementById("navUserMenu");
            if (menu) menu.classList.remove("show");
          }
        });

        // "My Recipes" click inside menu
        const myRecipesBtn = userPill.querySelector("#menuMyRecipesBtn");
        if (myRecipesBtn) {
          myRecipesBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const menu = document.getElementById("navUserMenu");
            if (menu) menu.classList.remove("show");
            this.filterMyRecipes(user.name);
          });
        }

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("dishdiary_token");
            localStorage.removeItem("dishdiary_user");
            this.showToast("Signed out successfully");
            setTimeout(() => window.location.reload(), 500);
          });
        }
        return;
      } catch (e) {
        console.warn("Error parsing user session:", e);
      }
    }

    // Unauthenticated state: route to login
    signInBtn.addEventListener("click", () => {
      window.location.href = "./login.html";
    });
  }

  async fetchRecipesFromAPI() {
    try {
      const res = await fetch("http://localhost:5000/api/v1/recipes");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mongoRecipes = json.data.map(r => ({
            ...r,
            id: r.id || r._id,
          }));
          this.recipes = mongoRecipes;
          this.render();
          console.log(`[DishDiary] Synced ${this.recipes.length} recipes from MongoDB Atlas`);
        }
      }
    } catch (e) {
      console.log("[DishDiary] Running in local offline mode (fallback)");
    }
  }

  // LocalStorage handling
  loadStoredRecipes() {
    try {
      const stored = localStorage.getItem("dishdiary_custom_recipes");
      if (stored) {
        const custom = JSON.parse(stored);
        return [...custom, ...DEFAULT_RECIPES];
      }
    } catch (e) {
      console.warn("Could not read local custom recipes", e);
    }
    return [...DEFAULT_RECIPES];
  }

  saveCustomRecipe(recipe) {
    try {
      const stored = localStorage.getItem("dishdiary_custom_recipes");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(recipe);
      localStorage.setItem("dishdiary_custom_recipes", JSON.stringify(list));
    } catch (e) {
      console.error("Storage error", e);
    }
  }

  loadSavedRecipeIds() {
    try {
      const saved = localStorage.getItem("dishdiary_bookmarks");
      return saved ? JSON.parse(saved) : ["dish-1"];
    } catch (e) {
      return ["dish-1"];
    }
  }

  persistSavedRecipeIds() {
    try {
      localStorage.setItem("dishdiary_bookmarks", JSON.stringify(Array.from(this.savedIds)));
    } catch (e) {
      console.error("Storage error", e);
    }
  }

  cacheDom() {
    this.gridEl = document.getElementById("recipesGrid");
    this.emptyStateEl = document.getElementById("emptyState");
    this.categoryTabs = document.getElementById("categoryTabs");
    this.searchInput = document.getElementById("recipeSearchInput");
    this.clearSearchBtn = document.getElementById("clearSearchBtn");
    this.sortBySelect = document.getElementById("sortBySelect");
    this.countEl = document.getElementById("filteredRecipesCount");
    this.savedCountEl = document.getElementById("savedCount");
    this.mobileSavedCountEl = document.getElementById("mobileSavedCount");

    // Hero Elements
    this.featuredHeroCard = document.getElementById("featuredHeroCard");
    this.cookFeaturedBtn = document.getElementById("cookFeaturedBtn");
    this.featuredBookmarkBtn = document.getElementById("featuredBookmarkBtn");

    // Modals
    this.recipeDetailModal = document.getElementById("recipeDetailModal");
    this.modalDetailContent = document.getElementById("modalDetailContent");
    this.closeDetailModalBtn = document.getElementById("closeDetailModalBtn");

    this.addRecipeModal = document.getElementById("addRecipeModal");
    this.openAddRecipeBtn = document.getElementById("openAddRecipeBtn");
    this.mobileAddRecipeBtn = document.getElementById("mobileAddRecipeBtn");
    this.closeAddRecipeModalBtn = document.getElementById("closeAddRecipeModalBtn");
    this.cancelAddRecipeBtn = document.getElementById("cancelAddRecipeBtn");
    this.addRecipeForm = document.getElementById("addRecipeForm");

    // Mobile Navigation
    this.mobileMenuBtn = document.getElementById("mobileMenuBtn");
    this.mobileMenu = document.getElementById("mobileMenu");
    this.toastContainer = document.getElementById("toastContainer");
    this.savedTabLink = document.getElementById("savedTabLink");
  }

  bindEvents() {
    // Category Tabs
    this.categoryTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".category-pill");
      if (!btn) return;

      this.categoryTabs.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      this.activeCategory = btn.dataset.category;
      this.render();
    });

    // Diet & Mood Cards Click Binding
    document.querySelectorAll(".mood-card").forEach(card => {
      card.addEventListener("click", () => {
        const mood = card.dataset.mood;
        if (!mood) return;

        this.activeCategory = mood;
        this.categoryTabs.querySelectorAll(".category-pill").forEach(p => {
          p.classList.toggle("active", p.dataset.category.toLowerCase() === mood.toLowerCase());
        });
        this.render();
        const recipesSection = document.getElementById("recipes");
        if (recipesSection) recipesSection.scrollIntoView({ behavior: "smooth" });
      });
    });

    // Search Input
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.clearSearchBtn.classList.toggle("show", this.searchQuery.length > 0);
      this.render();
    });

    this.clearSearchBtn.addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchQuery = "";
      this.clearSearchBtn.classList.remove("show");
      this.render();
    });

    // Sorting
    this.sortBySelect.addEventListener("change", (e) => {
      this.sortBy = e.target.value;
      this.render();
    });


    // Reset button in empty state
    document.getElementById("resetFiltersBtn")?.addEventListener("click", () => {
      this.searchQuery = "";
      this.searchInput.value = "";
      this.activeCategory = "All";
      this.categoryTabs.querySelectorAll(".category-pill").forEach(p => {
        p.classList.toggle("active", p.dataset.category === "All");
      });
      this.render();
    });

    // Brand Logo Click
    document.getElementById("brandLogo")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.setActiveNavTab("home");
      this.resetToHomeView();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Navigation Links (Desktop & Mobile)
    const allNavLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    allNavLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const navTarget = link.getAttribute("data-nav");
        if (!navTarget) return;
        e.preventDefault();

        this.setActiveNavTab(navTarget);
        this.mobileMenu.classList.remove("open");

        if (navTarget === "home") {
          this.resetToHomeView();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (navTarget === "explore") {
          const exploreEl = document.getElementById("explore");
          if (exploreEl) exploreEl.scrollIntoView({ behavior: "smooth" });
        } else if (navTarget === "recipes") {
          if (this.activeCategory === "Saved") {
            this.resetToHomeView();
          }
          const recipesEl = document.getElementById("recipes");
          if (recipesEl) recipesEl.scrollIntoView({ behavior: "smooth" });
        } else if (navTarget === "saved") {
          this.filterOnlySaved();
        } else if (navTarget === "community") {
          const communityEl = document.getElementById("community");
          if (communityEl) communityEl.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Setup Scroll Spy to update active tab as user scrolls
    this.setupScrollSpy();

    // Hero Featured CTA (Navigate to dedicated details page for currently active slide)
    this.cookFeaturedBtn?.addEventListener("click", () => {
      const currentRecipe = (this.heroRecipes && this.heroRecipes[this.currentHeroIndex]) 
        ? this.heroRecipes[this.currentHeroIndex] 
        : (this.recipes[0] || { id: "dish-1" });
      window.location.href = `./recipe-detail.html?id=${encodeURIComponent(currentRecipe.id)}`;
    });

    // Hero Bookmark Button
    this.featuredBookmarkBtn?.addEventListener("click", () => {
      const currentRecipe = (this.heroRecipes && this.heroRecipes[this.currentHeroIndex]) 
        ? this.heroRecipes[this.currentHeroIndex] 
        : (this.recipes[0] || { id: "dish-1" });
      this.toggleBookmark(currentRecipe.id);
      this.updateHeroBookmarkState();
    });

    // Hero Favorite / Like Heart Button
    document.getElementById("featuredLikeBtn")?.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      btn.classList.toggle("liked");
      const isLiked = btn.classList.contains("liked");
      this.showToast(isLiked ? "Added to your favorites! ❤️" : "Removed from favorites");
    });

    // Share Hero
    document.getElementById("shareHeroBtn")?.addEventListener("click", () => {
      const currentRecipe = (this.heroRecipes && this.heroRecipes[this.currentHeroIndex]) 
        ? this.heroRecipes[this.currentHeroIndex] 
        : (this.recipes[0] || { id: "dish-1", title: "Crispy Smashed Potatoes" });
      if (navigator.share) {
        navigator.share({
          title: `${currentRecipe.title} - DishDiary`,
          url: `${window.location.origin}${window.location.pathname.replace('index.html', '')}recipe-detail.html?id=${encodeURIComponent(currentRecipe.id)}`
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        this.showToast("Recipe link copied to clipboard!");
      }
    });

    // Add Recipe Button -> Navigate to dedicated creator page
    this.openAddRecipeBtn?.addEventListener("click", () => {
      window.location.href = "./add-recipe.html";
    });
    this.mobileAddRecipeBtn?.addEventListener("click", () => {
      window.location.href = "./add-recipe.html";
    });

    // Detail Modal Close (safe-guarded)
    this.closeDetailModalBtn?.addEventListener("click", () => {
      this.recipeDetailModal?.classList.remove("open");
      this.stopTimer();
    });

    // Backdrop click close (safe-guarded)
    [this.recipeDetailModal, this.addRecipeModal].forEach(modal => {
      modal?.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
          if (modal === this.recipeDetailModal) this.stopTimer();
        }
      });
    });

    // Mobile Menu Toggle
    this.mobileMenuBtn?.addEventListener("click", () => {
      this.mobileMenu?.classList.toggle("open");
    });
  }

  setActiveNavTab(tabKey) {
    this.currentNavTab = tabKey;
    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
      const isMatch = link.getAttribute("data-nav") === tabKey;
      link.classList.toggle("active", isMatch);
    });
  }

  resetToHomeView() {
    if (this.activeCategory === "Saved") {
      this.activeCategory = "All";
      this.categoryTabs.querySelectorAll(".category-pill").forEach(p => {
        p.classList.toggle("active", p.dataset.category === "All");
      });
      this.render();
    }
  }

  setupScrollSpy() {
    const sections = [
      { id: "community", nav: "community" },
      { id: "recipes", nav: "recipes" },
      { id: "explore", nav: "explore" },
      { id: "home", nav: "home" }
    ];

    let isScrollingManual = false;
    window.addEventListener("scroll", () => {
      if (this.activeCategory === "Saved") return; // don't override while viewing saved
      if (isScrollingManual) return;

      const scrollPosition = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && scrollPosition >= el.offsetTop) {
          if (this.currentNavTab !== section.nav) {
            this.setActiveNavTab(section.nav);
          }
          break;
        }
      }
    }, { passive: true });
  }

  filterOnlySaved() {
    this.activeCategory = "Saved";
    this.setActiveNavTab("saved");
    this.categoryTabs.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
    this.render();
    document.getElementById("recipes").scrollIntoView({ behavior: "smooth" });
  }

  filterMyRecipes(userName) {
    this.activeCategory = "My Recipes";
    this.searchQuery = "";
    if (this.searchInput) this.searchInput.value = "";
    if (this.clearSearchBtn) this.clearSearchBtn.classList.remove("show");

    this.categoryTabs?.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
    this.render();

    const recipesEl = document.getElementById("recipes");
    if (recipesEl) recipesEl.scrollIntoView({ behavior: "smooth" });

    this.showToast(`Showing recipes created by ${userName || "you"}`);
  }

  getFilteredRecipes() {
    if (!this.recipes || !Array.isArray(this.recipes)) {
      this.recipes = [...DEFAULT_RECIPES];
    }
    return this.recipes.filter(recipe => {
      if (!recipe) return false;

      // Category filter
      if (this.activeCategory === "Saved") {
        if (!this.savedIds || !this.savedIds.has(recipe.id)) return false;
      } else if (this.activeCategory === "My Recipes") {
        const userJson = localStorage.getItem("dishdiary_user");
        let uName = "";
        let uEmail = "";
        let uId = "";
        try {
          const u = userJson ? JSON.parse(userJson) : null;
          uName = (u?.name || "").trim().toLowerCase();
          uEmail = (u?.email || "").trim().toLowerCase();
          uId = String(u?.id || "");
        } catch (e) {}

        const myIds = JSON.parse(localStorage.getItem("dishdiary_my_recipe_ids") || "[]").map(String);
        const customRecipes = JSON.parse(localStorage.getItem("dishdiary_custom_recipes") || "[]");
        const customIds = customRecipes.map(c => String(c.id));

        const recipeId = String(recipe.id || recipe._id || "");
        const author = (recipe.author || "").trim().toLowerCase();
        const recipeEmail = (recipe.userEmail || recipe.authorEmail || "").trim().toLowerCase();
        const recipeUserId = String(recipe.userId || "");

        // STRICT MATCH: ONLY show recipes created by this specific user
        const isMyId = myIds.includes(recipeId) || customIds.includes(recipeId);
        const isMyUserId = uId && recipeUserId && recipeUserId === uId;
        const isMyEmail = uEmail && recipeEmail && recipeEmail === uEmail;
        const isMyAuthorName = uName && author && (author === uName || author === `chef ${uName}`);

        if (!isMyId && !isMyUserId && !isMyEmail && !isMyAuthorName) {
          return false;
        }
      } else if (this.activeCategory && this.activeCategory !== "All") {
        const cat = (recipe.category || "").toLowerCase();
        const activeCat = this.activeCategory.toLowerCase();
        const matchesCategory = cat.includes(activeCat);
        const title = (recipe.title || "").toLowerCase();
        const isVeg = activeCat === "vegetarian" && (cat.includes("salad") || title.includes("potatoes") || title.includes("avocado") || title.includes("toast"));
        if (!matchesCategory && !isVeg) return false;
      }

      // Search query filter
      if (this.searchQuery) {
        const query = this.searchQuery;
        const inTitle = (recipe.title || "").toLowerCase().includes(query);
        const inDesc = (recipe.description || "").toLowerCase().includes(query);
        const inCat = (recipe.category || "").toLowerCase().includes(query);
        const ingList = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
        const inIngredients = ingList.some(i => (i || "").toLowerCase().includes(query));
        if (!inTitle && !inDesc && !inCat && !inIngredients) return false;
      }

      return true;
    }).sort((a, b) => {
      if (this.sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (this.sortBy === "time") return ((a.prepTime || 0) + (a.cookTime || 0)) - ((b.prepTime || 0) + (b.cookTime || 0));
      return 0; // default latest order
    });
  }

  toggleBookmark(recipeId) {
    if (this.savedIds.has(recipeId)) {
      this.savedIds.delete(recipeId);
      this.showToast("Removed from saved collection");
    } else {
      this.savedIds.add(recipeId);
      this.showToast("Saved to your cookbook!");
    }
    this.persistSavedRecipeIds();
    this.updateBookmarkCounts();
    this.render();
  }

  setupHeroCarousel() {
    this.heroRecipes = [
      {
        id: "dish-1",
        title: "Crispy Smashed Potatoes with Herb Butter",
        description: "Tender baby Yukon gold potatoes gently smashed to perfection, roasted until deeply golden and crispy, then drizzled with aromatic garlic rosemary herb butter and flaked sea salt.",
        prepTime: "15 mins",
        cookTime: "35 mins",
        difficulty: "Easy",
        rating: "4.9",
        reviewsCount: "142 reviews",
        badge: "Featured Recipe",
        dietary: "🌱 Vegetarian",
        servings: "🍽 4 Servings",
        author: "Sarah Jenkins",
        authorSubtitle: "Culinary Editor • Sep 18, 2026",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
        image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&h=1000&q=85"
      },
      {
        id: "dish-3",
        title: "Creamy Garlic Parmesan Tuscan Chicken",
        description: "Pan-seared tender chicken breast smothered in a luscious sun-dried tomato and baby spinach cream sauce, finished with shaved aged Parmigiano Reggiano.",
        prepTime: "10 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        rating: "4.8",
        reviewsCount: "89 reviews",
        badge: "Chef's Choice",
        dietary: "🍗 High Protein",
        servings: "🍽 4 Servings",
        author: "Chef Julian Rossi",
        authorSubtitle: "Master Chef • Sep 19, 2026",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&h=1000&q=85"
      },
      {
        id: "dish-4",
        title: "Artisan Sourdough Margherita Pizza",
        description: "Slow-fermented sourdough crust hand-stretched and fired with San Marzano tomato reduction, torn buffalo mozzarella rounds, and fresh sweet garden basil leaves.",
        prepTime: "30 mins",
        cookTime: "12 mins",
        difficulty: "Intermediate",
        rating: "4.9",
        reviewsCount: "178 reviews",
        badge: "Trending Today",
        dietary: "🍕 Wood Fired",
        servings: "🍽 3 Servings",
        author: "Elena Rostova",
        authorSubtitle: "Artisan Baker • Sep 17, 2026",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&h=1000&q=85"
      },
      {
        id: "dish-5",
        title: "Brioche French Toast with Wild Berry Compote",
        description: "Thick-cut golden brioche slices soaked in vanilla bean custard, pan-caramelized in butter, and crowned with warm berry reduction and powdered sugar.",
        prepTime: "10 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        rating: "4.7",
        reviewsCount: "94 reviews",
        badge: "Breakfast Favorite",
        dietary: "🍓 Sweet Brunch",
        servings: "🍽 2 Servings",
        author: "David Miller",
        authorSubtitle: "Pastry Specialist • Sep 16, 2026",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&h=1000&q=85"
      }
    ];

    this.currentHeroIndex = 0;
    this.heroDuration = 5000; // 5 seconds per slide
    this.heroProgressInterval = null;
    this.heroStartTime = Date.now();
    this.isHeroPaused = false;
    this.currentProgressPercent = 0;

    this.renderHeroDots();
    this.applyHeroSlide(0, false);
    this.startHeroAutoSlide();

    // Pause on hover, resume on mouse leave
    const heroCard = document.getElementById("featuredHeroCard");
    if (heroCard) {
      heroCard.addEventListener("mouseenter", () => {
        this.isHeroPaused = true;
      });
      heroCard.addEventListener("mouseleave", () => {
        this.isHeroPaused = false;
        this.heroStartTime = Date.now() - (this.currentProgressPercent / 100 * this.heroDuration);
      });
    }

    // Hero navigation buttons
    document.getElementById("heroPrevBtn")?.addEventListener("click", () => {
      this.prevHeroSlide();
    });

    document.getElementById("heroNextBtn")?.addEventListener("click", () => {
      this.nextHeroSlide();
    });
  }

  renderHeroDots() {
    const dotsContainer = document.getElementById("heroDotsContainer");
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";

    this.heroRecipes.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `hero-dot ${idx === 0 ? "active" : ""}`;
      dot.setAttribute("aria-label", `Slide ${idx + 1}`);
      dot.addEventListener("click", () => {
        this.applyHeroSlide(idx, true);
        this.startHeroAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });
  }

  startHeroAutoSlide() {
    if (this.heroSlideTimer) clearInterval(this.heroSlideTimer);

    this.heroSlideTimer = setInterval(() => {
      if (!this.isHeroPaused) {
        this.nextHeroSlide();
      }
    }, this.heroDuration);
  }

  prevHeroSlide() {
    const nextIdx = (this.currentHeroIndex - 1 + this.heroRecipes.length) % this.heroRecipes.length;
    this.applyHeroSlide(nextIdx, true);
    this.startHeroAutoSlide();
  }

  nextHeroSlide() {
    const nextIdx = (this.currentHeroIndex + 1) % this.heroRecipes.length;
    this.applyHeroSlide(nextIdx, true);
    this.startHeroAutoSlide();
  }

  applyHeroSlide(index, animate = true) {
    this.currentHeroIndex = index;
    const r = this.heroRecipes[index];
    if (!r) return;

    const infoPanel = document.getElementById("heroInfoPanel");
    const imgEl = document.getElementById("featuredImg");

    if (animate) {
      if (infoPanel) {
        infoPanel.classList.remove("hero-transition-fade");
        void infoPanel.offsetWidth;
        infoPanel.classList.add("hero-transition-fade");
      }
      if (imgEl) {
        imgEl.style.opacity = "0.7";
        setTimeout(() => { imgEl.style.opacity = "1"; }, 150);
      }
    }

    const setSafe = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setSafe("featuredTitle", r.title);
    setSafe("featuredDesc", r.description);
    setSafe("heroBadgeText", r.badge);
    setSafe("heroRatingVal", r.rating);
    setSafe("heroReviewsCount", r.reviewsCount);
    setSafe("heroPrepVal", r.prepTime);
    setSafe("heroCookVal", r.cookTime);
    setSafe("heroDifficultyBadge", r.difficulty);
    setSafe("heroAuthorName", r.author);
    setSafe("heroAuthorSubtitle", r.authorSubtitle);
    setSafe("heroDietaryTag", r.dietary);
    setSafe("heroServingsTag", r.servings);

    const avatarEl = document.getElementById("heroAuthorAvatar");
    if (avatarEl) avatarEl.src = r.authorAvatar;

    if (imgEl) {
      imgEl.src = r.image;
      imgEl.alt = r.title;
    }

    const dots = document.querySelectorAll(".hero-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    this.updateHeroBookmarkState();
  }

  updateBookmarkCounts() {
    const count = this.savedIds ? this.savedIds.size : 0;
    if (this.savedCountEl) this.savedCountEl.textContent = count;
    if (this.mobileSavedCountEl) this.mobileSavedCountEl.textContent = count;
  }

  updateHeroBookmarkState() {
    if (!this.featuredBookmarkBtn) return;
    const currentRecipe = this.heroRecipes ? this.heroRecipes[this.currentHeroIndex] : null;
    const recipeId = currentRecipe ? currentRecipe.id : "dish-1";
    const isSaved = this.savedIds.has(recipeId);
    this.featuredBookmarkBtn.classList.toggle("active", isSaved);
    this.featuredBookmarkBtn.title = isSaved ? "Remove from saved recipes" : "Save this recipe";
  }

  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  handleNewRecipeSubmit(e) {
    e.preventDefault();

    const title = document.getElementById("newTitle").value.trim();
    const category = document.getElementById("newCategory").value;
    const difficulty = document.getElementById("newDifficulty").value;
    const prepTime = parseInt(document.getElementById("newPrepTime").value, 10) || 15;
    const cookTime = parseInt(document.getElementById("newCookTime").value, 10) || 20;
    const servings = parseInt(document.getElementById("newServings").value, 10) || 4;
    const imageUrlInput = document.getElementById("newImageUrl").value.trim();
    const description = document.getElementById("newDescription").value.trim();
    const rawIngredients = document.getElementById("newIngredients").value.trim();
    const rawInstructions = document.getElementById("newInstructions").value.trim();

    const fallbackImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

    const newRecipe = {
      id: "dish-custom-" + Date.now(),
      title,
      category,
      difficulty,
      prepTime,
      cookTime,
      servings,
      rating: 5.0,
      reviewsCount: 1,
      author: "You (Chef)",
      authorRole: "Home Cook",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
      image: imageUrlInput || fallbackImage,
      description,
      ingredients: rawIngredients.split("\n").filter(line => line.trim().length > 0),
      instructions: rawInstructions.split("\n").filter(line => line.trim().length > 0)
    };

    this.recipes.unshift(newRecipe);
    this.saveCustomRecipe(newRecipe);
    this.addRecipeModal.classList.remove("open");
    this.addRecipeForm.reset();

    this.showToast("Your recipe was published to DishDiary!");
    this.render();
    document.getElementById("recipes").scrollIntoView({ behavior: "smooth" });
  }

  openRecipeDetail(recipe) {
    const isBookmarked = this.savedIds.has(recipe.id);
    const totalTime = recipe.prepTime + recipe.cookTime;

    this.modalDetailContent.innerHTML = `
      <div class="modal-detail-hero">
        <img src="${recipe.image}" alt="${recipe.title}" class="modal-detail-img">
      </div>
      <div class="modal-detail-body">
        <div class="detail-header">
          <div class="detail-badges">
            <span class="badge badge-featured">${recipe.category}</span>
            <span class="badge badge-difficulty ${recipe.difficulty.toLowerCase()}">${recipe.difficulty}</span>
            <span class="card-rating">
              <svg width="15" height="15" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <strong>${recipe.rating}</strong> (${recipe.reviewsCount} reviews)
            </span>
          </div>

          <h2 class="detail-title">${recipe.title}</h2>
          <p class="detail-desc">${recipe.description}</p>
        </div>

        <!-- Interactive Cook Timer Widget -->
        <div class="cooking-timer-box">
          <div class="timer-info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div>
              <div style="font-weight:700; font-size: 0.9rem;">Cooking Countdown Timer</div>
              <div class="timer-clock" id="timerDisplay">${recipe.cookTime || 15}:00</div>
            </div>
          </div>
          <div class="timer-actions">
            <button class="btn btn-primary timer-btn" id="startTimerBtn">Start Timer</button>
            <button class="btn btn-outline timer-btn" id="resetTimerBtn">Reset</button>
          </div>
        </div>

        <div class="detail-grid">
          <!-- Ingredients Column -->
          <div class="detail-col">
            <h3 class="detail-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                <path d="M12 6v6l4 2"></path>
              </svg>
              Ingredients (${recipe.servings} Servings)
            </h3>
            <ul class="ingredients-list" id="modalIngredientsList">
              ${recipe.ingredients.map(ing => `
                <li class="ingredient-item">
                  <input type="checkbox">
                  <span>${ing}</span>
                </li>
              `).join("")}
            </ul>
          </div>

          <!-- Instructions Column -->
          <div class="detail-col">
            <h3 class="detail-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Instructions
            </h3>
            <ol class="instructions-list">
              ${recipe.instructions.map(step => `
                <li class="instruction-step">${step}</li>
              `).join("")}
            </ol>
          </div>
        </div>

        <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
          <div class="author-block" style="margin-bottom:0;">
            <img src="${recipe.authorAvatar}" alt="${recipe.author}" class="author-avatar">
            <div class="author-text">
              <span class="author-name">${recipe.author}</span>
              <span class="author-subtitle">${recipe.authorRole}</span>
            </div>
          </div>
          <button class="btn btn-primary" id="modalSaveBtn">
            ${isBookmarked ? '✓ Saved' : '+ Save Recipe'}
          </button>
        </div>
      </div>
    `;

    // Interactive Checkboxes
    const ingItems = this.modalDetailContent.querySelectorAll(".ingredient-item");
    ingItems.forEach(item => {
      const checkbox = item.querySelector("input[type='checkbox']");
      checkbox.addEventListener("change", () => {
        item.classList.toggle("checked", checkbox.checked);
      });
    });

    // Modal Save Button
    const modalSaveBtn = document.getElementById("modalSaveBtn");
    modalSaveBtn.addEventListener("click", () => {
      this.toggleBookmark(recipe.id);
      const isSaved = this.savedIds.has(recipe.id);
      modalSaveBtn.textContent = isSaved ? '✓ Saved' : '+ Save Recipe';
    });

    // Timer Setup
    this.setupTimer(recipe.cookTime || 15);

    this.recipeDetailModal.classList.add("open");
  }

  setupTimer(minutes) {
    this.stopTimer();
    let totalSeconds = minutes * 60;
    this.timerSecondsRemaining = totalSeconds;

    const display = document.getElementById("timerDisplay");
    const startBtn = document.getElementById("startTimerBtn");
    const resetBtn = document.getElementById("resetTimerBtn");

    const updateClock = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    updateClock(totalSeconds);

    let isRunning = false;

    startBtn.addEventListener("click", () => {
      if (!isRunning) {
        isRunning = true;
        startBtn.textContent = "Pause";
        this.timerInterval = setInterval(() => {
          if (this.timerSecondsRemaining > 0) {
            this.timerSecondsRemaining--;
            updateClock(this.timerSecondsRemaining);
          } else {
            this.stopTimer();
            display.textContent = "DONE! 🔔";
            this.showToast("Timer completed! Time to check your dish.");
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
      updateClock(totalSeconds);
    });
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  render() {
    this.updateBookmarkCounts();
    this.updateHeroBookmarkState();

    // Dynamically update section header based on active category
    const titleEl = document.querySelector(".recipes-section .section-title");
    const subEl = document.querySelector(".recipes-section .section-subtitle");
    if (this.activeCategory === "My Recipes") {
      if (titleEl) titleEl.textContent = "My Recipes";
      if (subEl) subEl.textContent = "Dishes created and published by you";
    } else if (this.activeCategory === "Saved") {
      if (titleEl) titleEl.textContent = "Saved Recipes";
      if (subEl) subEl.textContent = "Your personal culinary bookmark collection";
    } else {
      if (titleEl) titleEl.textContent = "Latest Recipes";
      if (subEl) subEl.textContent = "Handcrafted dishes tested by culinary enthusiasts";
    }

    const filtered = this.getFilteredRecipes();
    this.countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      this.gridEl.innerHTML = "";
      if (this.activeCategory === "My Recipes") {
        this.emptyStateEl.innerHTML = `
          <div class="empty-state-icon">👨‍🍳</div>
          <h3>You haven't added any recipes yet</h3>
          <p>Share your favorite cooking secrets and dishes with DishDiary!</p>
          <a href="./add-recipe.html" class="btn btn-primary" style="margin-top: 14px; display: inline-flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>+ Add Your First Recipe</span>
          </a>
        `;
      } else {
        this.emptyStateEl.innerHTML = `
          <div class="empty-state-icon">🍲</div>
          <h3>No matching recipes found</h3>
          <p>Try searching for another keyword or selecting a different category.</p>
          <button class="btn btn-outline" id="resetFiltersBtn">Reset All Filters</button>
        `;
        document.getElementById("resetFiltersBtn")?.addEventListener("click", () => {
          this.activeCategory = "All";
          this.searchQuery = "";
          if (this.searchInput) this.searchInput.value = "";
          this.categoryTabs?.querySelectorAll(".category-pill").forEach(p => p.classList.toggle("active", p.dataset.category === "All"));
          this.render();
        });
      }
      this.emptyStateEl.classList.remove("hidden");
      return;
    }

    this.emptyStateEl.classList.add("hidden");

    this.gridEl.innerHTML = filtered.map(recipe => {
      const isBookmarked = this.savedIds.has(recipe.id);
      return `
        <article class="recipe-card" data-recipe-id="${recipe.id}">
          <div class="card-media">
            <img src="${recipe.image}" alt="${recipe.title}" class="card-img" loading="lazy">
            <span class="card-category-badge">${recipe.category}</span>
            <button class="card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-action="bookmark" title="Bookmark recipe">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <div class="card-body">
            <div class="card-meta-top">
              <span class="badge badge-difficulty ${recipe.difficulty.toLowerCase()}">${recipe.difficulty}</span>
              <div class="card-rating">
                <svg width="14" height="14" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>${recipe.rating}</span>
              </div>
            </div>

            <h3 class="card-title">${recipe.title}</h3>
            <p class="card-desc">${recipe.description}</p>

            <div class="card-footer">
              <div class="card-time">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${recipe.prepTime + recipe.cookTime} mins total</span>
              </div>
              <span style="font-weight:600; color: var(--primary);">View Recipe →</span>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Bind card clicks to navigate to dedicated details page
    this.gridEl.querySelectorAll(".recipe-card").forEach(card => {
      card.addEventListener("click", (e) => {
        const bookmarkBtn = e.target.closest('[data-action="bookmark"]');
        const recipeId = card.dataset.recipeId;

        if (bookmarkBtn) {
          e.stopPropagation();
          this.toggleBookmark(recipeId);
          return;
        }

        window.location.href = `./recipe-detail.html?id=${encodeURIComponent(recipeId)}`;
      });
    });
  }
}

// REST Backend Integration Helper (Ready to connect with scaffolded backend)
window.DishDiaryAPI = {
  baseUrl: "http://localhost:5000/api",
  async fetchRecipes() {
    try {
      const res = await fetch(`${this.baseUrl}/recipes`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.info("Using local DishDiary storage (backend not connected yet)");
    }
    return null;
  }
};

// Initialize Application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new DishDiaryApp();
});
