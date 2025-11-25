require("dotenv").config();
const { cocktailDBService } = require("./src/services/externalAPIs");

async function testCocktailAPI() {
  console.log("Testing CocktailDB API...");
  try {
    console.log("Fetching random cocktail...");
    const data = await cocktailDBService.getRandomCocktail();
    console.log("Success! Result:", JSON.stringify(data, null, 2));
    
    if (data.drinks && data.drinks.length > 0) {
      console.log("Cocktail found:", data.drinks[0].strDrink);
    } else {
      console.error("No drinks found in response.");
    }
  } catch (error) {
    console.error("Error fetching cocktail:", error);
  }
}

testCocktailAPI();
