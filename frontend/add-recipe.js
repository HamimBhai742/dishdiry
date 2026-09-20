/**
 * DishDiary - Add Recipe Page Logic
 * Features:
 * - Dynamic Ingredient Row Builder with Amount + Name + Quick Pantry Chips
 * - Dynamic Step-by-Step Cards Builder with Formatting (Bold, Italic, Timer, Pro Tip)
 * - Two-way sync between Row/Card Builders and Bulk Textarea modes
 * - Real-time Live Preview Card
 * - Sample culinary photos
 * - Persistence to localStorage and routing to recipe-detail.html
 */

document.addEventListener("DOMContentLoaded", () => {
  // Core Elements
  const form = document.getElementById("standaloneAddRecipeForm");
  const titleInput = document.getElementById("recipeTitleInput");
  const categoryInput = document.getElementById("recipeCategoryInput");
  const difficultyInput = document.getElementById("recipeDifficultyInput");
  const prepTimeInput = document.getElementById("recipePrepTimeInput");
  const cookTimeInput = document.getElementById("recipeCookTimeInput");
  const servingsInput = document.getElementById("recipeServingsInput");
  const descInput = document.getElementById("recipeDescriptionInput");
  const imageInput = document.getElementById("recipeImageInput");
  const authorNameInput = document.getElementById("authorNameInput");
  const authorRoleInput = document.getElementById("authorRoleInput");

  // Ingredients Elements
  const ingRowsList = document.getElementById("ingredientsRowsList");
  const addIngRowBtn = document.getElementById("addIngredientRowBtn");
  const ingModeRowsBtn = document.getElementById("ingModeRowsBtn");
  const ingModeTextBtn = document.getElementById("ingModeTextBtn");
  const ingRowsWrapper = document.getElementById("ingredientsRowsWrapper");
  const ingTextareaWrapper = document.getElementById("ingredientsTextareaWrapper");
  const ingTextarea = document.getElementById("recipeIngredientsInput");

  // Instructions Elements
  const stepsCardsList = document.getElementById("instructionsCardsList");
  const addStepBtn = document.getElementById("addInstructionStepBtn");
  const stepModeCardsBtn = document.getElementById("stepModeCardsBtn");
  const stepModeTextBtn = document.getElementById("stepModeTextBtn");
  const stepsCardsWrapper = document.getElementById("instructionsCardsWrapper");
  const stepsTextareaWrapper = document.getElementById("instructionsTextareaWrapper");
  const stepsTextarea = document.getElementById("recipeInstructionsInput");

  // Preview Card Elements
  const previewTitle = document.getElementById("previewTitle");
  const previewCategory = document.getElementById("previewCategory");
  const previewDifficulty = document.getElementById("previewDifficulty");
  const previewDesc = document.getElementById("previewDescription");
  const previewImg = document.getElementById("previewImg");
  const previewTotalTime = document.getElementById("previewTotalTime");

  const defaultSampleImg = "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80";

  // Track active input focus for toolbar insertions
  let lastActiveInput = null;

  // =========================================================
  // 1. INGREDIENTS ROW BUILDER LOGIC
  // =========================================================

  const createIngredientRow = (amount = "", name = "") => {
    const row = document.createElement("div");
    row.className = "ingredient-row-item";
    row.innerHTML = `
      <input type="text" class="ing-amount-input" placeholder="e.g. 2 tbsp" value="${amount}">
      <input type="text" class="ing-name-input" placeholder="Ingredient name (e.g. extra virgin olive oil)" value="${name}">
      <button type="button" class="row-delete-btn" title="Remove ingredient">✕</button>
    `;

    const amtInp = row.querySelector(".ing-amount-input");
    const nameInp = row.querySelector(".ing-name-input");
    const delBtn = row.querySelector(".row-delete-btn");

    // Track focused input for toolbar
    [amtInp, nameInp].forEach(inp => {
      inp.addEventListener("focus", () => { lastActiveInput = inp; });
      inp.addEventListener("input", syncIngredientsToTextarea);
    });

    // Enter in name field spawns next row
    nameInp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const nextRow = createIngredientRow();
        ingRowsList.appendChild(nextRow);
        nextRow.querySelector(".ing-amount-input").focus();
        syncIngredientsToTextarea();
      }
    });

    delBtn.addEventListener("click", () => {
      if (ingRowsList.children.length > 1) {
        row.remove();
        syncIngredientsToTextarea();
      }
    });

    return row;
  };

  const syncIngredientsToTextarea = () => {
    const lines = [];
    ingRowsList.querySelectorAll(".ingredient-row-item").forEach(row => {
      const amt = row.querySelector(".ing-amount-input").value.trim();
      const name = row.querySelector(".ing-name-input").value.trim();
      if (amt && name) {
        lines.push(`${amt} ${name}`);
      } else if (name) {
        lines.push(name);
      } else if (amt) {
        lines.push(amt);
      }
    });
    ingTextarea.value = lines.join("\n");
  };

  const syncTextareaToIngredients = () => {
    const lines = ingTextarea.value.split("\n").filter(l => l.trim().length > 0);
    ingRowsList.innerHTML = "";
    if (lines.length === 0) {
      ingRowsList.appendChild(createIngredientRow());
      return;
    }

    lines.forEach(line => {
      // Split first token if likely an amount (e.g. "2 tbsp olive oil" -> "2 tbsp", "olive oil")
      const parts = line.split(" ");
      let amt = "";
      let name = line;

      if (parts.length >= 2 && (/^\d/.test(parts[0]) || parts[0].includes("/") || parts[0].includes("tbsp") || parts[0].includes("tsp") || parts[0].includes("cup") || parts[0].includes("g") || parts[0].includes("ml") || parts[0].includes("lbs"))) {
        if (parts.length >= 3 && (parts[1].toLowerCase().includes("tbsp") || parts[1].toLowerCase().includes("tsp") || parts[1].toLowerCase().includes("cup") || parts[1].toLowerCase().includes("oz") || parts[1].toLowerCase().includes("g") || parts[1].toLowerCase().includes("lbs"))) {
          amt = parts[0] + " " + parts[1];
          name = parts.slice(2).join(" ");
        } else {
          amt = parts[0];
          name = parts.slice(1).join(" ");
        }
      }

      ingRowsList.appendChild(createIngredientRow(amt, name));
    });
  };

  addIngRowBtn.addEventListener("click", () => {
    const newRow = createIngredientRow();
    ingRowsList.appendChild(newRow);
    newRow.querySelector(".ing-amount-input").focus();
  });

  // Toggle Ingredients Mode (Row Builder vs Bulk Text)
  ingModeRowsBtn.addEventListener("click", () => {
    ingModeRowsBtn.classList.add("active");
    ingModeTextBtn.classList.remove("active");
    syncTextareaToIngredients();
    ingRowsWrapper.classList.remove("hidden");
    ingTextareaWrapper.classList.add("hidden");
  });

  ingModeTextBtn.addEventListener("click", () => {
    ingModeTextBtn.classList.add("active");
    ingModeRowsBtn.classList.remove("active");
    syncIngredientsToTextarea();
    ingRowsWrapper.classList.add("hidden");
    ingTextareaWrapper.classList.remove("hidden");
  });

  // Toolbar Format buttons for Ingredients
  document.querySelectorAll(".editor-toolbar .toolbar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      const target = lastActiveInput || ingRowsList.querySelector(".ing-name-input");
      if (!target) return;

      const val = target.value;
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || val.length;
      const selected = val.substring(start, end);

      if (tag === "bold") {
        target.value = val.substring(0, start) + `<b>${selected || 'bold text'}</b>` + val.substring(end);
      } else if (tag === "italic") {
        target.value = val.substring(0, start) + `<i>${selected || 'italic text'}</i>` + val.substring(end);
      } else if (tag === "header") {
        target.value = `[For ${selected || 'the Sauce'}]`;
      }

      target.focus();
      syncIngredientsToTextarea();
    });
  });

  // Quick Pantry Chips
  document.querySelectorAll(".quick-pantry-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const text = chip.dataset.text;
      const row = createIngredientRow("", text);
      ingRowsList.appendChild(row);
      syncIngredientsToTextarea();
    });
  });

  // =========================================================
  // 2. INSTRUCTIONS STEP CARDS BUILDER LOGIC
  // =========================================================

  const recalculateStepNumbers = () => {
    stepsCardsList.querySelectorAll(".step-card-editor").forEach((card, index) => {
      card.querySelector(".step-card-num").textContent = index + 1;
    });
  };

  const createInstructionCard = (text = "") => {
    const card = document.createElement("div");
    card.className = "step-card-editor";
    card.innerHTML = `
      <div class="step-card-num">1</div>
      <div class="step-card-body">
        <textarea class="step-textarea" rows="2" placeholder="Describe this cooking step (e.g. Boil potatoes in salted water until tender)...">${text}</textarea>
        <div class="step-card-actions">
          <div class="step-quick-tags">
            <button type="button" class="step-tag-btn" data-tag="timer">+ ⏱️ 15m Timer</button>
            <button type="button" class="step-tag-btn" data-tag="tip">+ 💡 Pro Tip</button>
            <button type="button" class="step-tag-btn" data-tag="bold">Bold</button>
          </div>
          <button type="button" class="row-delete-btn step-delete-btn" title="Delete step">✕</button>
        </div>
      </div>
    `;

    const textarea = card.querySelector(".step-textarea");
    const delBtn = card.querySelector(".step-delete-btn");

    textarea.addEventListener("focus", () => { lastActiveInput = textarea; });
    textarea.addEventListener("input", syncStepsToTextarea);

    card.querySelectorAll(".step-tag-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.tag;
        if (type === "timer") {
          textarea.value += " [timer: 15 mins]";
        } else if (type === "tip") {
          textarea.value += " [tip: Secret chef technique]";
        } else if (type === "bold") {
          textarea.value += " <b>Important Note</b>";
        }
        textarea.focus();
        syncStepsToTextarea();
      });
    });

    delBtn.addEventListener("click", () => {
      if (stepsCardsList.children.length > 1) {
        card.remove();
        recalculateStepNumbers();
        syncStepsToTextarea();
      }
    });

    return card;
  };

  const syncStepsToTextarea = () => {
    const steps = [];
    stepsCardsList.querySelectorAll(".step-card-editor").forEach(card => {
      const val = card.querySelector(".step-textarea").value.trim();
      if (val) steps.push(val);
    });
    stepsTextarea.value = steps.join("\n");
  };

  const syncTextareaToSteps = () => {
    const lines = stepsTextarea.value.split("\n").filter(l => l.trim().length > 0);
    stepsCardsList.innerHTML = "";
    if (lines.length === 0) {
      stepsCardsList.appendChild(createInstructionCard());
      recalculateStepNumbers();
      return;
    }

    lines.forEach(line => {
      stepsCardsList.appendChild(createInstructionCard(line));
    });
    recalculateStepNumbers();
  };

  addStepBtn.addEventListener("click", () => {
    const newCard = createInstructionCard();
    stepsCardsList.appendChild(newCard);
    recalculateStepNumbers();
    newCard.querySelector(".step-textarea").focus();
  });

  // Toggle Steps Mode (Step Cards vs Bulk Text)
  stepModeCardsBtn.addEventListener("click", () => {
    stepModeCardsBtn.classList.add("active");
    stepModeTextBtn.classList.remove("active");
    syncTextareaToSteps();
    stepsCardsWrapper.classList.remove("hidden");
    stepsTextareaWrapper.classList.add("hidden");
  });

  stepModeTextBtn.addEventListener("click", () => {
    stepModeTextBtn.classList.add("active");
    stepModeCardsBtn.classList.remove("active");
    syncStepsToTextarea();
    stepsCardsWrapper.classList.add("hidden");
    stepsTextareaWrapper.classList.remove("hidden");
  });

  // Toolbar Format buttons for Instructions
  document.querySelectorAll("[data-step-format]").forEach(btn => {
    btn.addEventListener("click", () => {
      const fmt = btn.dataset.stepFormat;
      const target = (lastActiveInput && lastActiveInput.classList.contains("step-textarea"))
        ? lastActiveInput
        : stepsCardsList.querySelector(".step-textarea");

      if (!target) return;

      if (fmt === "bold") target.value += " <b>bold step</b>";
      else if (fmt === "italic") target.value += " <i>italic detail</i>";
      else if (fmt === "timer") target.value += " [timer: 20 mins]";
      else if (fmt === "tip") target.value += " [tip: Don't overcrowd the pan for crispiness!]";
      else if (fmt === "temp") target.value += " [temp: 425°F / 220°C]";

      target.focus();
      syncStepsToTextarea();
    });
  });

  // =========================================================
  // 3. INITIAL SEED ROWS & CARDS
  // =========================================================

  const seedIngredients = [
    { amt: "400g", name: "fettuccine or tagliatelle pasta" },
    { amt: "2 tbsp", name: "extra virgin olive oil" },
    { amt: "300g", name: "mixed mushrooms (cremini, shiitake)" },
    { amt: "3 cloves", name: "garlic, finely minced" },
    { amt: "1/2 cup", name: "heavy whipping cream" },
    { amt: "To taste", name: "Fresh thyme leaves, sea salt & cracked black pepper" }
  ];

  seedIngredients.forEach(item => {
    ingRowsList.appendChild(createIngredientRow(item.amt, item.name));
  });
  syncIngredientsToTextarea();

  const seedSteps = [
    "Bring a large pot of cold salted water to a rolling boil and cook pasta al dente [timer: 9 mins].",
    "In a heavy skillet, sear sliced mushrooms in olive oil over high heat until deep golden brown.",
    "Add minced garlic and fresh thyme leaves; cook for 1 minute until fragrant.",
    "Pour in heavy cream and gently simmer for 2 minutes to thicken [timer: 2 mins]. [tip: Save 1/2 cup pasta water!]",
    "Toss pasta directly into the velvety sauce with grated parmesan. Garnish with parsley and serve piping hot."
  ];

  seedSteps.forEach(step => {
    stepsCardsList.appendChild(createInstructionCard(step));
  });
  recalculateStepNumbers();
  syncStepsToTextarea();

  // =========================================================
  // 4. REAL-TIME LIVE PREVIEW
  // =========================================================

  const updateLivePreview = () => {
    const titleVal = titleInput.value.trim() || "Creamy Truffle Wild Mushroom Tagliatelle";
    const catVal = categoryInput.value || "Dinner";
    const diffVal = difficultyInput.value || "Easy";
    const prep = parseInt(prepTimeInput.value, 10) || 15;
    const cook = parseInt(cookTimeInput.value, 10) || 25;
    const descVal = descInput.value.trim() || "A velvety garlic and herb cream sauce tossed with pan-seared mushrooms and artisan egg pasta.";
    const imgVal = imageInput.value.trim() || defaultSampleImg;

    previewTitle.textContent = titleVal;
    previewCategory.textContent = catVal;
    previewDifficulty.textContent = diffVal;
    previewDifficulty.className = `badge badge-difficulty ${diffVal.toLowerCase()}`;
    previewDesc.textContent = descVal;
    previewTotalTime.textContent = `${prep + cook} mins total`;

    const tempImg = new Image();
    tempImg.onload = () => { previewImg.src = imgVal; };
    tempImg.onerror = () => { previewImg.src = defaultSampleImg; };
    tempImg.src = imgVal;
  };

  [titleInput, categoryInput, difficultyInput, prepTimeInput, cookTimeInput, descInput, imageInput].forEach(el => {
    el.addEventListener("input", updateLivePreview);
    el.addEventListener("change", updateLivePreview);
  });

  // Sample Image Buttons
  document.querySelectorAll(".sample-img-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      imageInput.value = btn.dataset.url;
      updateLivePreview();
    });
  });

  // Load Saved Recipes Count for Navbar
  try {
    const saved = localStorage.getItem("dishdiary_bookmarks");
    const count = saved ? JSON.parse(saved).length : 1;
    const countEl = document.getElementById("savedCount");
    if (countEl) countEl.textContent = count;
  } catch (e) {}

  // Check logged-in session to auto-fill author
  try {
    const userJson = localStorage.getItem("dishdiary_user");
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.name && authorNameInput) {
        authorNameInput.value = user.name;
        updateLivePreview();
      }
    }
  } catch (e) {}

  // =========================================================
  // 5. FORM SUBMISSION & LOCALSTORAGE PERSISTENCE
  // =========================================================

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    syncIngredientsToTextarea();
    syncStepsToTextarea();

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const difficulty = difficultyInput.value;
    const prepTime = parseInt(prepTimeInput.value, 10) || 15;
    const cookTime = parseInt(cookTimeInput.value, 10) || 20;
    const servings = parseInt(servingsInput.value, 10) || 4;
    const imageUrl = imageInput.value.trim() || defaultSampleImg;
    const description = descInput.value.trim();
    const rawIngredients = ingTextarea.value.trim();
    const rawInstructions = stepsTextarea.value.trim();
    const userJson = localStorage.getItem("dishdiary_user");
    let currentUser = null;
    try {
      currentUser = userJson ? JSON.parse(userJson) : null;
    } catch (e) {}

    const author = (currentUser && currentUser.name)
      ? currentUser.name
      : (authorNameInput.value.trim() || "You (Chef)");
    const authorRole = authorRoleInput.value.trim() || "Home Chef";

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
      author,
      authorEmail: currentUser ? currentUser.email : "",
      userId: currentUser ? currentUser.id : "",
      authorRole,
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
      image: imageUrl,
      description,
      ingredients: rawIngredients.split("\n").filter(l => l.trim().length > 0),
      instructions: rawInstructions.split("\n").filter(l => l.trim().length > 0)
    };

    // Attempt to persist to MongoDB Atlas backend API
    try {
      const res = await fetch("http://localhost:5000/api/v1/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newRecipe.title,
          category: newRecipe.category,
          difficulty: newRecipe.difficulty,
          prepTime: newRecipe.prepTime,
          cookTime: newRecipe.cookTime,
          servings: newRecipe.servings,
          rating: newRecipe.rating,
          reviewsCount: newRecipe.reviewsCount,
          author: newRecipe.author,
          authorRole: newRecipe.authorRole,
          authorAvatar: newRecipe.authorAvatar,
          image: newRecipe.image,
          description: newRecipe.description,
          ingredients: newRecipe.ingredients,
          instructions: newRecipe.instructions,
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && (json.data.id || json.data._id)) {
          const apiId = json.data.id || json.data._id;
          newRecipe.id = apiId;
          console.log("[DishDiary] Successfully saved recipe to MongoDB Atlas:", apiId);

          // Track in my_recipe_ids
          try {
            const myIds = JSON.parse(localStorage.getItem("dishdiary_my_recipe_ids") || "[]");
            if (!myIds.includes(apiId)) {
              myIds.unshift(apiId);
              localStorage.setItem("dishdiary_my_recipe_ids", JSON.stringify(myIds));
            }
          } catch (idErr) {}
        }
      }
    } catch (apiErr) {
      console.log("[DishDiary] Backend API offline; saved locally to localStorage fallback");
    }

    // Save to LocalStorage cache
    try {
      const stored = localStorage.getItem("dishdiary_custom_recipes");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newRecipe);
      localStorage.setItem("dishdiary_custom_recipes", JSON.stringify(list));

      // Track in my_recipe_ids
      const myIds = JSON.parse(localStorage.getItem("dishdiary_my_recipe_ids") || "[]");
      if (!myIds.includes(newRecipe.id)) {
        myIds.unshift(newRecipe.id);
        localStorage.setItem("dishdiary_my_recipe_ids", JSON.stringify(myIds));
      }
    } catch (err) {
      console.error("Failed to save recipe locally", err);
    }

    // Show toast and redirect
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>Recipe published to database! Opening your delicious recipe...</span>
    `;
    document.getElementById("toastContainer").appendChild(toast);

    setTimeout(() => {
      window.location.href = `./recipe-detail.html?id=${encodeURIComponent(newRecipe.id)}`;
    }, 800);
  });
});
