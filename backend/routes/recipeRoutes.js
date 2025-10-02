const express = require("express");
const router = express.Router();
const { spoonacularService } = require("../src/services/externalAPIs");

// Search recipes
router.get("/search", async (req, res) => {
  try {
    const { query, cuisine, diet, maxReadyTime, number } = req.query;

    const data = await spoonacularService.searchRecipes({
      query,
      cuisine,
      diet,
      maxReadyTime,
      number: number || 10,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await spoonacularService.getRecipeById(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get random recipes
router.get("/random", async (req, res) => {
  try {
    const { number, tags } = req.query;
    const data = await spoonacularService.getRandomRecipes(number || 10, tags);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find recipes by ingredients
router.post("/by-ingredients", async (req, res) => {
  try {
    const { ingredients, number } = req.body;
    const data = await spoonacularService.findByIngredients(
      ingredients,
      number
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get similar recipes
router.get("/:id/similar", async (req, res) => {
  try {
    const { id } = req.params;
    const { number } = req.query;
    const data = await spoonacularService.getSimilarRecipes(id, number);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
