// ==================== services/api.js ====================

// Centralized API service for all backend calls

// Update this based on your environment
const getBaseURL = () => {
  // Detect if running in web browser
  const isWeb = typeof window !== 'undefined' && window.document;
  
  if (isWeb) {
    // Web browser - use localhost
    return 'http://localhost:3000/api';
  }
  
  // For React Native
  // iOS simulator uses localhost
  // Android emulator uses 10.0.2.2
  const Platform = require('react-native').Platform;
  
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  } else {
    // iOS or other platforms
    return 'http://localhost:3000/api';
  }
  
  // For physical devices, you would need to use your computer's IP
  // return "http://192.168.128.144:3000/api";
  
  // Production
  // return 'https://your-backend.railway.app/api';
};

const API_URL = getBaseURL();

// Generic fetch wrapper with error handling and timeout
const apiRequest = async (endpoint, options = {}) => {
  const timeout = 30000; // 30 seconds timeout
  
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`API Timeout (${endpoint}): Request took longer than ${timeout}ms`);
      return {
        success: false,
        error: 'Request timeout. Please check your connection and try again.'
      };
    }
    console.error(`API Error (${endpoint}):`, error);
    return {
      success: false,
      error: error.message || 'An error occurred'
    };
  }
};

// ==================== Recipe APIs ====================
export const recipeAPI = {
  // Search recipes
  search: async ({ query, cuisine, diet, maxReadyTime, number = 10 }) => {
    const params = new URLSearchParams({
      ...(query && { query }),
      ...(cuisine && { cuisine }),
      ...(diet && { diet }),
      ...(maxReadyTime && { maxReadyTime }),
      number: number.toString(),
    });

    return apiRequest(`/recipes/search?${params}`);
  },

  // Get recipe by ID
  getById: async (id) => {
    return apiRequest(`/recipes/${id}`);
  },

  // Get random recipes
  getRandom: async (number = 10, tags = '') => {
    const params = new URLSearchParams({
      number: number.toString(),
      ...(tags && { tags }),
    });

    return apiRequest(`/recipes/random?${params}`);
  },

  // Find by ingredients
  findByIngredients: async (ingredients, number = 10) => {
    return apiRequest('/recipes/by-ingredients', {
      method: 'POST',
      body: JSON.stringify({ ingredients, number }),
    });
  },

  // Get similar recipes
  getSimilar: async (id, number = 10) => {
    return apiRequest(`/recipes/${id}/similar?number=${number}`);
  },
};

// ==================== Cocktail APIs ====================
export const cocktailAPI = {
  // Search cocktails by name
  search: async (name) => {
    return apiRequest(`/cocktails/search?name=${encodeURIComponent(name)}`);
  },

  // Get cocktail by ID
  getById: async (id) => {
    return apiRequest(`/cocktails/${id}`);
  },

  // Get random cocktail
  getRandom: async () => {
    return apiRequest('/cocktails/random');
  },

  // Filter by ingredient
  filterByIngredient: async (ingredient) => {
    return apiRequest(`/cocktails/by-ingredient?ingredient=${encodeURIComponent(ingredient)}`);
  },

  // Filter by category
  filterByCategory: async (category) => {
    return apiRequest(`/cocktails/by-category?category=${encodeURIComponent(category)}`);
  },

  // Filter by alcoholic type
  filterByAlcoholic: async (alcoholic) => {
    return apiRequest(`/cocktails/by-alcoholic?alcoholic=${encodeURIComponent(alcoholic)}`);
  },
};

// ==================== User/Auth APIs (TODO) ====================
export const userAPI = {
  // Login
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register
  register: async (email, password, fullName) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName
      }),
    });
  },

  // Get profile
  getProfile: async (token) => {
    return apiRequest('/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// ==================== Favorites APIs (TODO) ====================
export const favoritesAPI = {
  // Get all favorites
  getAll: async (token, type = 'all') => {
    return apiRequest(`/favorites?type=${type}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Add favorite
  add: async (token, itemType, itemId, notes = '') => {
    return apiRequest('/favorites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        item_type: itemType,
        item_id: itemId,
        notes
      }),
    });
  },

  // Remove favorite
  remove: async (token, favoriteId) => {
    return apiRequest(`/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// ==================== Example Usage ====================
/*
// In your components:

import { recipeAPI, cocktailAPI } from '../services/api';

// Load recipes
const loadRecipes = async () => {
  const result = await recipeAPI.getRandom(10);
  if (result.success) {
    setRecipes(result.data.recipes);
  } else {
    console.error('Failed to load recipes:', result.error);
  }
};

// Load cocktails
const loadCocktails = async () => {
  const result = await cocktailAPI.getRandom();
  if (result.success) {
    setCocktail(result.data.drinks[0]);
  } else {
    console.error('Failed to load cocktail:', result.error);
  }
};

// Search recipes
const searchRecipes = async (query) => {
  const result = await recipeAPI.search({
    query,
    cuisine: 'italian',
    number: 20
  });

  if (result.success) {
    setSearchResults(result.data.results);
  }
};
*/

export default {
  recipeAPI,
  cocktailAPI,
  userAPI,
  favoritesAPI,
};

