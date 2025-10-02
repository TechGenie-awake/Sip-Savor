require("dotenv").config();
const {
  spoonacularService,
  cocktailDBService,
} = require("./src/services/externalAPIs");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log("\n" + "=".repeat(60));
  log(title, "bright");
  console.log("=".repeat(60) + "\n");
}

async function testSpoonacularAPI() {
  logSection("🍳 TESTING SPOONACULAR API");

  try {
    // Test 1: Search Recipes
    log("Test 1: Searching for pasta recipes...", "cyan");
    const searchResults = await spoonacularService.searchRecipes({
      query: "pasta",
      number: 3,
    });

    if (searchResults.results && searchResults.results.length > 0) {
      log("✓ Search successful!", "green");
      log(`Found ${searchResults.totalResults} recipes`, "yellow");
      log("First 3 results:", "blue");
      searchResults.results.forEach((recipe, index) => {
        console.log(`  ${index + 1}. ${recipe.title} (ID: ${recipe.id})`);
      });
    } else {
      log("✗ No results found", "red");
    }

    // Test 2: Get Recipe Details
    log("\nTest 2: Getting details for first recipe...", "cyan");
    if (searchResults.results && searchResults.results[0]) {
      const recipeId = searchResults.results[0].id;
      const recipeDetails = await spoonacularService.getRecipeById(recipeId);

      log("✓ Recipe details retrieved!", "green");
      console.log("  Title:", recipeDetails.title);
      console.log("  Ready in:", recipeDetails.readyInMinutes, "minutes");
      console.log("  Servings:", recipeDetails.servings);
      console.log(
        "  Ingredients:",
        recipeDetails.extendedIngredients?.length || 0
      );
    }

    // Test 3: Random Recipes
    log("\nTest 3: Getting random recipes...", "cyan");
    const randomRecipes = await spoonacularService.getRandomRecipes(2);

    if (randomRecipes.recipes && randomRecipes.recipes.length > 0) {
      log("✓ Random recipes retrieved!", "green");
      randomRecipes.recipes.forEach((recipe, index) => {
        console.log(`  ${index + 1}. ${recipe.title}`);
      });
    }

    // Test 4: Find by Ingredients
    log("\nTest 4: Finding recipes with chicken and rice...", "cyan");
    const ingredientRecipes = await spoonacularService.findByIngredients(
      ["chicken", "rice"],
      3
    );

    if (ingredientRecipes && ingredientRecipes.length > 0) {
      log("✓ Recipes by ingredients found!", "green");
      ingredientRecipes.forEach((recipe, index) => {
        console.log(`  ${index + 1}. ${recipe.title}`);
        console.log(`     Used ingredients: ${recipe.usedIngredientCount}`);
        console.log(
          `     Missing ingredients: ${recipe.missedIngredientCount}`
        );
      });
    }

    log("\n✓ All Spoonacular tests passed!", "green");
    return true;
  } catch (error) {
    log("\n✗ Spoonacular API test failed!", "red");
    console.error("Error:", error);
    return false;
  }
}

async function testCocktailDBAPI() {
  logSection("🍹 TESTING COCKTAILDB API");

  try {
    // Test 1: Search by Name
    log("Test 1: Searching for margarita cocktails...", "cyan");
    const searchResults = await cocktailDBService.searchByName("margarita");

    if (searchResults.drinks && searchResults.drinks.length > 0) {
      log("✓ Search successful!", "green");
      log(`Found ${searchResults.drinks.length} cocktails`, "yellow");
      log("Results:", "blue");
      searchResults.drinks.slice(0, 3).forEach((drink, index) => {
        console.log(`  ${index + 1}. ${drink.strDrink} (ID: ${drink.idDrink})`);
      });
    } else {
      log("✗ No results found", "red");
    }

    // Test 2: Get Cocktail Details
    log("\nTest 2: Getting details for first cocktail...", "cyan");
    if (searchResults.drinks && searchResults.drinks[0]) {
      const cocktailId = searchResults.drinks[0].idDrink;
      const cocktailDetails = await cocktailDBService.getCocktailById(
        cocktailId
      );

      if (cocktailDetails.drinks && cocktailDetails.drinks[0]) {
        const drink = cocktailDetails.drinks[0];
        log("✓ Cocktail details retrieved!", "green");
        console.log("  Name:", drink.strDrink);
        console.log("  Category:", drink.strCategory);
        console.log("  Alcoholic:", drink.strAlcoholic);
        console.log("  Glass:", drink.strGlass);
      }
    }

    // Test 3: Random Cocktail
    log("\nTest 3: Getting a random cocktail...", "cyan");
    const randomCocktail = await cocktailDBService.getRandomCocktail();

    if (randomCocktail.drinks && randomCocktail.drinks[0]) {
      const drink = randomCocktail.drinks[0];
      log("✓ Random cocktail retrieved!", "green");
      console.log(`  ${drink.strDrink}`);
      console.log(`  Category: ${drink.strCategory}`);
    }

    // Test 4: Filter by Ingredient
    log("\nTest 4: Finding cocktails with vodka...", "cyan");
    const vodkaDrinks = await cocktailDBService.filterByIngredient("vodka");

    if (vodkaDrinks.drinks && vodkaDrinks.drinks.length > 0) {
      log("✓ Cocktails filtered by ingredient!", "green");
      log(`Found ${vodkaDrinks.drinks.length} vodka cocktails`, "yellow");
      vodkaDrinks.drinks.slice(0, 5).forEach((drink, index) => {
        console.log(`  ${index + 1}. ${drink.strDrink}`);
      });
    }

    // Test 5: List Categories
    log("\nTest 5: Listing all categories...", "cyan");
    const categories = await cocktailDBService.listCategories();

    if (categories.drinks && categories.drinks.length > 0) {
      log("✓ Categories retrieved!", "green");
      console.log("  Available categories:", categories.drinks.length);
      categories.drinks.slice(0, 5).forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.strCategory}`);
      });
    }

    log("\n✓ All CocktailDB tests passed!", "green");
    return true;
  } catch (error) {
    log("\n✗ CocktailDB API test failed!", "red");
    console.error("Error:", error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  log("\n" + "█".repeat(60), "bright");
  log("   SIP & SAVOR - API TESTING SUITE", "bright");
  log("█".repeat(60), "bright");

  // Check for API keys
  if (
    !process.env.SPOONACULAR_API_KEY ||
    process.env.SPOONACULAR_API_KEY === "your_spoonacular_api_key_here"
  ) {
    log("\n⚠ WARNING: Spoonacular API key not configured!", "yellow");
    log("Please add your API key to the .env file", "yellow");
  }

  const spoonacularPassed = await testSpoonacularAPI();
  const cocktailDBPassed = await testCocktailDBAPI();

  logSection("📊 TEST SUMMARY");

  console.log(
    "Spoonacular API:",
    spoonacularPassed
      ? colors.green + "✓ PASSED" + colors.reset
      : colors.red + "✗ FAILED" + colors.reset
  );

  console.log(
    "CocktailDB API:",
    cocktailDBPassed
      ? colors.green + "✓ PASSED" + colors.reset
      : colors.red + "✗ FAILED" + colors.reset
  );

  if (spoonacularPassed && cocktailDBPassed) {
    log("\n🎉 All tests passed! APIs are working correctly.", "green");
  } else {
    log("\n⚠ Some tests failed. Please check the errors above.", "red");
  }

  console.log("\n" + "█".repeat(60) + "\n");
}

// Execute tests
runAllTests().catch(console.error);
