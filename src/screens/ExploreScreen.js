import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { recipeAPI, cocktailAPI } from "../services/api";



const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // 2 columns with proper spacing

const FALLBACK_COCKTAILS = [
  {
    idDrink: "11060",
    strDrink: "Margarita",
    strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/5n43dt1582476043.jpg",
    strCategory: "Ordinary Drink",
  },
  {
    idDrink: "11118",
    strDrink: "Blue Margarita",
    strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/bry4qe1582751040.jpg",
    strCategory: "Ordinary Drink",
  },
  {
    idDrink: "17196",
    strDrink: "Cosmopolitan",
    strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/kpsajh1643797264.jpg",
    strCategory: "Cocktail",
  },
  {
    idDrink: "11690",
    strDrink: "Mai Tai",
    strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/twyrrp1439907470.jpg",
    strCategory: "Ordinary Drink",
  },
];

const ExploreScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Default content (trending/popular)
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [popularCocktails, setPopularCocktails] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // Categories for quick access
  const categories = [
    { name: "Breakfast", emoji: "🍳", query: "breakfast" },
    { name: "Lunch", emoji: "🥗", query: "lunch" },
    { name: "Dinner", emoji: "🍽️", query: "dinner" },
    { name: "Dessert", emoji: "🍰", query: "dessert" },
    { name: "Vegan", emoji: "🌱", query: "vegan" },
    { name: "Cocktails", emoji: "🍹", query: "cocktail" },
    { name: "Italian", emoji: "🍝", query: "italian" },
    { name: "Asian", emoji: "🍜", query: "asian" },
  ];

  // Load trending content on mount
  useEffect(() => {
    loadTrendingContent();
  }, []);

  const loadTrendingContent = async () => {
    try {
      setLoadingTrending(true);

      // Fetch trending recipes and popular cocktails
      const [recipesRes, cocktailsPromises] = await Promise.all([
        recipeAPI.getRandom(8),
        Promise.all(
          Array(8)
            .fill()
            .map(() => cocktailAPI.getRandom())
        ),
      ]);

      if (recipesRes.success) {
        setTrendingRecipes(recipesRes.data.recipes || []);
      }

      const cocktails = cocktailsPromises
        .map((res) => (res.success ? res.data?.drinks?.[0] : null))
        .filter(Boolean);
      
      if (cocktails.length > 0) {
        setPopularCocktails(cocktails);
      } else {
        setPopularCocktails(FALLBACK_COCKTAILS);
      }
    } catch (error) {
      console.error("Error loading trending content:", error);
    } finally {
      setLoadingTrending(false);
    }
  };

  const performSearch = React.useCallback(async (query) => {
    if (!query.trim()) {
      setRecipes([]);
      setCocktails([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const [recipesRes, cocktailsRes] = await Promise.all([
        recipeAPI.search({ query, number: 12 }),
        cocktailAPI.search(query),
      ]);

      if (recipesRes.success) {
        setRecipes(recipesRes.data.results || []);
      } else {
        setRecipes([]);
      }

      if (cocktailsRes.success) {
        setCocktails(cocktailsRes.data.drinks || []);
      } else {
        setCocktails([]);
      }
    } catch (error) {
      console.error("Error performing search:", error);
      setRecipes([]);
      setCocktails([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.query) {
        const query = route.params.query;
        setSearchQuery(query);
        performSearch(query);
        navigation.setParams({ query: undefined });
      }
    }, [route?.params?.query, performSearch, navigation])
  );

  const handleSearch = () => {
    performSearch(searchQuery);
  };

  const handleCategoryPress = (query) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setRecipes([]);
    setCocktails([]);
    setHasSearched(false);
  };

  const navigateToRecipe = (recipeId) => {
    navigation.navigate("RecipeDetail", { id: recipeId });
  };

  const navigateToCocktail = (cocktailId) => {
    navigation.navigate("CocktailDetail", { id: cocktailId });
  };

  const RecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateToRecipe(item.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardMetaText}>
            ⏱️ {item.readyInMinutes || 30} min
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CocktailCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateToCocktail(item.idDrink)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.strDrinkThumb }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.strDrink}
        </Text>
        <Text style={styles.cardMetaText}>🍸 {item.strCategory || "Cocktail"}</Text>
      </View>
    </TouchableOpacity>
  );

  const CategoryChip = ({ category }) => (
    <TouchableOpacity
      style={styles.categoryChip}
      onPress={() => handleCategoryPress(category.query)}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSubtitle}>
            Discover recipes & cocktails
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes or cocktails..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : hasSearched ? (
          // Search Results
          <ScrollView
            style={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Back to Explore Button */}
            <TouchableOpacity style={styles.backButton} onPress={clearSearch}>
              <Ionicons name="arrow-back" size={20} color="#FF6B6B" />
              <Text style={styles.backButtonText}>Back to Explore</Text>
            </TouchableOpacity>

            {/* Recipes Section */}
            {recipes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  🍳 Recipes ({recipes.length})
                </Text>
                <View style={styles.resultsGrid}>
                  {recipes.map((recipe, index) => (
                    <RecipeCard key={recipe.id || index} item={recipe} />
                  ))}
                </View>
              </View>
            )}

            {/* Cocktails Section */}
            {cocktails.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  🍹 Cocktails ({cocktails.length})
                </Text>
                <View style={styles.resultsGrid}>
                  {cocktails.map((cocktail, index) => (
                    <CocktailCard key={cocktail.idDrink || index} item={cocktail} />
                  ))}
                </View>
              </View>
            )}

            {/* No Results */}
            {recipes.length === 0 && cocktails.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={64} color="#E0E0E0" />
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching for something else
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          // Default Explore Content
          <ScrollView
            style={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 Quick Search</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              >
                {categories.map((category, index) => (
                  <CategoryChip key={index} category={category} />
                ))}
              </ScrollView>
            </View>

            {loadingTrending ? (
              <View style={styles.trendingLoadingContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={styles.loadingText}>Loading trending content...</Text>
              </View>
            ) : (
              <>
                {/* Trending Recipes */}
                {trendingRecipes.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      🔥 Trending Recipes
                    </Text>
                    <View style={styles.resultsGrid}>
                      {trendingRecipes.map((recipe, index) => (
                        <RecipeCard key={recipe.id || index} item={recipe} />
                      ))}
                    </View>
                  </View>
                )}

                {/* Popular Cocktails */}
                {popularCocktails.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      🍹 Popular Cocktails
                    </Text>
                    <View style={styles.resultsGrid}>
                      {popularCocktails.map((cocktail, index) => (
                        <CocktailCard
                          key={cocktail.idDrink || index}
                          item={cocktail}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}

            {/* Bottom Spacing */}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  trendingLoadingContainer: {
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "600",
    marginLeft: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  categoriesScroll: {
    gap: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#E5E5E5",
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardMetaText: {
    fontSize: 12,
    color: "#666",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default ExploreScreen;