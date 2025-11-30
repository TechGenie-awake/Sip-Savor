import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [plannerItems, setPlannerItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedSaved = await AsyncStorage.getItem("savedRecipes");
      const storedPlanner = await AsyncStorage.getItem("plannerItems");

      if (storedSaved) {
        setSavedRecipes(JSON.parse(storedSaved));
      }
      if (storedPlanner) {
        setPlannerItems(JSON.parse(storedPlanner));
      }
    } catch (error) {
      console.error("Failed to load saved data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToSaved = async (recipe) => {
    try {
      // Check if already saved
      if (savedRecipes.some((r) => r.id === recipe.id)) return;

      const newSaved = [...savedRecipes, recipe];
      setSavedRecipes(newSaved);
      await AsyncStorage.setItem("savedRecipes", JSON.stringify(newSaved));
    } catch (error) {
      console.error("Failed to save recipe", error);
    }
  };

  const removeFromSaved = async (recipeId) => {
    try {
      const newSaved = savedRecipes.filter((r) => r.id !== recipeId);
      setSavedRecipes(newSaved);
      await AsyncStorage.setItem("savedRecipes", JSON.stringify(newSaved));
    } catch (error) {
      console.error("Failed to remove recipe", error);
    }
  };

  const isSaved = (recipeId) => {
    return savedRecipes.some((r) => r.id === recipeId);
  };

  const addToPlanner = async (recipe, date, mealType = "Dinner") => {
    try {
      const newItem = {
        id: Date.now().toString(), // Simple unique ID
        recipe,
        date, // ISO string or simple date string
        mealType,
      };
      
      const newPlanner = [...plannerItems, newItem];
      setPlannerItems(newPlanner);
      await AsyncStorage.setItem("plannerItems", JSON.stringify(newPlanner));
    } catch (error) {
      console.error("Failed to add to planner", error);
    }
  };

  const removeFromPlanner = async (itemId) => {
    try {
      const newPlanner = plannerItems.filter((item) => item.id !== itemId);
      setPlannerItems(newPlanner);
      await AsyncStorage.setItem("plannerItems", JSON.stringify(newPlanner));
    } catch (error) {
      console.error("Failed to remove from planner", error);
    }
  };

  return (
    <SavedContext.Provider
      value={{
        savedRecipes,
        plannerItems,
        isLoading,
        addToSaved,
        removeFromSaved,
        isSaved,
        addToPlanner,
        removeFromPlanner,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};
