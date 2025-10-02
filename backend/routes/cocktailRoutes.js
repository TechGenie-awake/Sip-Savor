const express = require("express");
const router = express.Router();
const { cocktailDBService } = require("../src/services/externalAPIs");

// Search cocktails by name
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    const data = await cocktailDBService.searchByName(name);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cocktail by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await cocktailDBService.getCocktailById(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get random cocktail
router.get("/random", async (req, res) => {
  try {
    const data = await cocktailDBService.getRandomCocktail();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter by ingredient
router.get("/by-ingredient", async (req, res) => {
  try {
    const { ingredient } = req.query;
    const data = await cocktailDBService.filterByIngredient(ingredient);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter by category
router.get("/by-category", async (req, res) => {
  try {
    const { category } = req.query;
    const data = await cocktailDBService.filterByCategory(category);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter by alcoholic type
router.get("/by-alcoholic", async (req, res) => {
  try {
    const { alcoholic } = req.query;
    const data = await cocktailDBService.filterByAlcoholic(alcoholic);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
