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
    image: "https://images.unsplash.com/photo-1484723091739-004a8024e759?auto=format&fit=crop&w=800&q=80",
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
    this.render();
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

    // Hero Featured CTA
    // Hero Featured CTA (Navigate to dedicated details page)
    this.cookFeaturedBtn.addEventListener("click", () => {
      const heroRecipe = this.recipes.find(r => r.id === "dish-1") || this.recipes[0];
      window.location.href = `./recipe-detail.html?id=${encodeURIComponent(heroRecipe.id)}`;
    });

    // Hero Bookmark Button
    this.featuredBookmarkBtn.addEventListener("click", () => {
      this.toggleBookmark("dish-1");
      this.updateHeroBookmarkState();
    });

    // Share Hero
    document.getElementById("shareHeroBtn")?.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: "Crispy Smashed Potatoes - DishDiary",
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        this.showToast("Recipe link copied to clipboard!");
      }
    });

    // Add Recipe Modal
    const openAddModal = () => this.addRecipeModal.classList.add("open");
    const closeAddModal = () => this.addRecipeModal.classList.remove("open");

    this.openAddRecipeBtn.addEventListener("click", openAddModal);
    this.mobileAddRecipeBtn.addEventListener("click", () => {
      this.mobileMenu.classList.remove("open");
      openAddModal();
    });
    this.closeAddRecipeModalBtn.addEventListener("click", closeAddModal);
    this.cancelAddRecipeBtn.addEventListener("click", closeAddModal);

    this.addRecipeForm.addEventListener("submit", (e) => this.handleNewRecipeSubmit(e));

    // Detail Modal Close
    this.closeDetailModalBtn.addEventListener("click", () => {
      this.recipeDetailModal.classList.remove("open");
      this.stopTimer();
    });

    // Backdrop click close
    [this.recipeDetailModal, this.addRecipeModal].forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
          if (modal === this.recipeDetailModal) this.stopTimer();
        }
      });
    });

    // Mobile Menu Toggle
    this.mobileMenuBtn.addEventListener("click", () => {
      this.mobileMenu.classList.toggle("open");
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

  getFilteredRecipes() {
    return this.recipes.filter(recipe => {
      // Category filter
      if (this.activeCategory === "Saved") {
        if (!this.savedIds.has(recipe.id)) return false;
      } else if (this.activeCategory !== "All") {
        const matchesCategory = recipe.category.toLowerCase().includes(this.activeCategory.toLowerCase());
        const isVeg = this.activeCategory === "Vegetarian" && (recipe.category.includes("Salad") || recipe.title.includes("Potatoes") || recipe.title.includes("Avocado"));
        if (!matchesCategory && !isVeg) return false;
      }

      // Search query filter
      if (this.searchQuery) {
        const query = this.searchQuery;
        const inTitle = recipe.title.toLowerCase().includes(query);
        const inDesc = recipe.description.toLowerCase().includes(query);
        const inCat = recipe.category.toLowerCase().includes(query);
        const inIngredients = recipe.ingredients.some(i => i.toLowerCase().includes(query));
        if (!inTitle && !inDesc && !inCat && !inIngredients) return false;
      }

      return true;
    }).sort((a, b) => {
      if (this.sortBy === "rating") return b.rating - a.rating;
      if (this.sortBy === "time") return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
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

  updateBookmarkCounts() {
    const count = this.savedIds.size;
    this.savedCountEl.textContent = count;
    this.mobileSavedCountEl.textContent = count;
  }

  updateHeroBookmarkState() {
    const isSaved = this.savedIds.has("dish-1");
    this.featuredBookmarkBtn.classList.toggle("active", isSaved);
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

    const filtered = this.getFilteredRecipes();
    this.countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      this.gridEl.innerHTML = "";
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
