const axios = require("axios");

// Spoonacular API Service
class SpoonacularService {
  constructor() {
    this.apiKey = process.env.SPOONACULAR_API_KEY;
    this.baseURL = "https://api.spoonacular.com";
    this.client = axios.create({
      baseURL: this.baseURL,
      params: {
        apiKey: this.apiKey,
      },
    });
  }

  // Search recipes with filters
  async searchRecipes({
    query,
    cuisine,
    diet,
    maxReadyTime,
    offset = 0,
    number = 10,
  }) {
    try {
      const response = await this.client.get("/recipes/complexSearch", {
        params: {
          query,
          cuisine,
          diet,
          maxReadyTime,
          offset,
          number,
          addRecipeInformation: true,
          fillIngredients: true,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "searchRecipes");
    }
  }

  // Get recipe details by ID
  async getRecipeById(id) {
    try {
      const response = await this.client.get(`/recipes/${id}/information`, {
        params: {
          includeNutrition: true,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "getRecipeById");
    }
  }

  // Get random recipes
  async getRandomRecipes(number = 10, tags = "") {
    try {
      const response = await this.client.get("/recipes/random", {
        params: {
          number,
          tags,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "getRandomRecipes");
    }
  }

  // Find recipes by ingredients
  async findByIngredients(ingredients, number = 10) {
    try {
      const response = await this.client.get("/recipes/findByIngredients", {
        params: {
          ingredients: ingredients.join(","),
          number,
          ranking: 2, // Maximize used ingredients
          ignorePantry: true,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "findByIngredients");
    }
  }

  // Get similar recipes
  async getSimilarRecipes(id, number = 10) {
    try {
      const response = await this.client.get(`/recipes/${id}/similar`, {
        params: {
          number,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "getSimilarRecipes");
    }
  }

  // Get nutrition information
  async getNutritionInfo(id) {
    try {
      const response = await this.client.get(
        `/recipes/${id}/nutritionWidget.json`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "getNutritionInfo");
    }
  }

  handleError(error, method) {
    console.error(`Spoonacular API Error in ${method}:`, error.message);
    if (error.response) {
      const { status, data } = error.response;
      return {
        success: false,
        error: {
          code: `SPOONACULAR_${status}`,
          message: data.message || "Spoonacular API error",
          status,
        },
      };
    }
    return {
      success: false,
      error: {
        code: "SPOONACULAR_ERROR",
        message: error.message || "Unknown error occurred",
      },
    };
  }
}

// CocktailDB API Service
class CocktailDBService {
  constructor() {
    this.apiKey = process.env.COCKTAILDB_API_KEY || "1";
    this.baseURL = `https://www.thecocktaildb.com/api/json/v1/${this.apiKey}`;
    this.client = axios.create({
      baseURL: this.baseURL,
    });
  }

  // Search cocktails by name
  async searchByName(name) {
    try {
      const response = await this.client.get("/search.php", {
        params: { s: name },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "searchByName");
    }
  }

  // Get cocktail by ID
  async getCocktailById(id) {
    try {
      const response = await this.client.get("/lookup.php", {
        params: { i: id },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "getCocktailById");
    }
  }

  // Get random cocktail
  async getRandomCocktail() {
    try {
      const response = await this.client.get("/random.php");
      return response.data;
    } catch (error) {
      throw this.handleError(error, "getRandomCocktail");
    }
  }

  // Filter cocktails by ingredient
  async filterByIngredient(ingredient) {
    try {
      const response = await this.client.get("/filter.php", {
        params: { i: ingredient },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "filterByIngredient");
    }
  }

  // Filter by category
  async filterByCategory(category) {
    try {
      const response = await this.client.get("/filter.php", {
        params: { c: category },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "filterByCategory");
    }
  }

  // Filter by alcoholic type
  async filterByAlcoholic(alcoholic) {
    try {
      const response = await this.client.get("/filter.php", {
        params: { a: alcoholic },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "filterByAlcoholic");
    }
  }

  // Filter by glass type
  async filterByGlass(glass) {
    try {
      const response = await this.client.get("/filter.php", {
        params: { g: glass },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "filterByGlass");
    }
  }

  // List all categories
  async listCategories() {
    try {
      const response = await this.client.get("/list.php", {
        params: { c: "list" },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "listCategories");
    }
  }

  // List all ingredients
  async listIngredients() {
    try {
      const response = await this.client.get("/list.php", {
        params: { i: "list" },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "listIngredients");
    }
  }

  // List all glasses
  async listGlasses() {
    try {
      const response = await this.client.get("/list.php", {
        params: { g: "list" },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "listGlasses");
    }
  }

  handleError(error, method) {
    console.error(`CocktailDB API Error in ${method}:`, error.message);
    if (error.response) {
      const { status, data } = error.response;
      return {
        success: false,
        error: {
          code: `COCKTAILDB_${status}`,
          message: data.message || "CocktailDB API error",
          status,
        },
      };
    }
    return {
      success: false,
      error: {
        code: "COCKTAILDB_ERROR",
        message: error.message || "Unknown error occurred",
      },
    };
  }
}

// Export instances
const spoonacularService = new SpoonacularService();
const cocktailDBService = new CocktailDBService();

module.exports = {
  spoonacularService,
  cocktailDBService,
};
