/**
 * DishDiary - Add Recipe Page Logic
 * Powers live preview, sample image selection, and saving
 * custom recipes to localStorage before routing to recipe-detail.html.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const form = document.getElementById("standaloneAddRecipeForm");
  const titleInput = document.getElementById("recipeTitleInput");
  const categoryInput = document.getElementById("recipeCategoryInput");
  const difficultyInput = document.getElementById("recipeDifficultyInput");
  const prepTimeInput = document.getElementById("recipePrepTimeInput");
  const cookTimeInput = document.getElementById("recipeCookTimeInput");
  const servingsInput = document.getElementById("recipeServingsInput");
  const descInput = document.getElementById("recipeDescriptionInput");
  const imageInput = document.getElementById("recipeImageInput");
  const ingredientsInput = document.getElementById("recipeIngredientsInput");
  const instructionsInput = document.getElementById("recipeInstructionsInput");
  const authorNameInput = document.getElementById("authorNameInput");
  const authorRoleInput = document.getElementById("authorRoleInput");

  // Preview Card Elements
  const previewTitle = document.getElementById("previewTitle");
  const previewCategory = document.getElementById("previewCategory");
  const previewDifficulty = document.getElementById("previewDifficulty");
  const previewDesc = document.getElementById("previewDescription");
  const previewImg = document.getElementById("previewImg");
  const previewTotalTime = document.getElementById("previewTotalTime");

  const defaultSampleImg = "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80";

  // Update Live Preview Function
  const updateLivePreview = () => {
    const titleVal = titleInput.value.trim() || "Your Recipe Title Here";
    const catVal = categoryInput.value || "Dinner";
    const diffVal = difficultyInput.value || "Easy";
    const prep = parseInt(prepTimeInput.value, 10) || 15;
    const cook = parseInt(cookTimeInput.value, 10) || 25;
    const descVal = descInput.value.trim() || "A brief description of your delicious culinary creation will appear here.";
    const imgVal = imageInput.value.trim() || defaultSampleImg;

    previewTitle.textContent = titleVal;
    previewCategory.textContent = catVal;
    previewDifficulty.textContent = diffVal;
    previewDifficulty.className = `badge badge-difficulty ${diffVal.toLowerCase()}`;
    previewDesc.textContent = descVal;
    previewTotalTime.textContent = `${prep + cook} mins total`;

    // Try setting image with error fallback
    const tempImg = new Image();
    tempImg.onload = () => { previewImg.src = imgVal; };
    tempImg.onerror = () => { previewImg.src = defaultSampleImg; };
    tempImg.src = imgVal;
  };

  // Bind Input Listeners for Live Preview
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

  // Form Submit Handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const difficulty = difficultyInput.value;
    const prepTime = parseInt(prepTimeInput.value, 10) || 15;
    const cookTime = parseInt(cookTimeInput.value, 10) || 20;
    const servings = parseInt(servingsInput.value, 10) || 4;
    const imageUrl = imageInput.value.trim() || defaultSampleImg;
    const description = descInput.value.trim();
    const rawIngredients = ingredientsInput.value.trim();
    const rawInstructions = instructionsInput.value.trim();
    const author = authorNameInput.value.trim() || "You (Chef)";
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
      authorRole,
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
      image: imageUrl,
      description,
      ingredients: rawIngredients.split("\n").filter(l => l.trim().length > 0),
      instructions: rawInstructions.split("\n").filter(l => l.trim().length > 0)
    };

    // Save to LocalStorage
    try {
      const stored = localStorage.getItem("dishdiary_custom_recipes");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newRecipe);
      localStorage.setItem("dishdiary_custom_recipes", JSON.stringify(list));
    } catch (err) {
      console.error("Failed to save recipe", err);
    }

    // Show toast and redirect to the newly created recipe details page
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>Recipe published! Opening details page...</span>
    `;
    document.getElementById("toastContainer").appendChild(toast);

    setTimeout(() => {
      window.location.href = `./recipe-detail.html?id=${encodeURIComponent(newRecipe.id)}`;
    }, 900);
  });
});
