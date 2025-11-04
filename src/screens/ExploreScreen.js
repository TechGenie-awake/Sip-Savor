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
} from "react-native";

const API_URL = "http://localhost:3000/api";
// For Android emulator, use: http://10.0.2.2:3000/api
// For iOS simulator, use: http://localhost:3000/api
// For physical device, use: http://YOUR_IP:3000/api

const ExploreScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
      // Search recipes and cocktails in parallel
      const [recipesRes, cocktailsRes] = await Promise.all([
        fetch(`${API_URL}/recipes/search?query=${encodeURIComponent(query)}&number=10`).catch(
          () => ({ ok: false })
        ),
        fetch(`${API_URL}/cocktails/search?name=${encodeURIComponent(query)}`).catch(
          () => ({ ok: false })
        ),
      ]);

      if (recipesRes.ok) {
        const recipesData = await recipesRes.json();
        setRecipes(recipesData.results || []);
      } else {
        setRecipes([]);
      }

      if (cocktailsRes.ok) {
        const cocktailsData = await cocktailsRes.json();
        setCocktails(cocktailsData.drinks || []);
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

  // Get initial query from route params (when navigating from HomeScreen)
  // Use useFocusEffect to handle params when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.query) {
        const query = route.params.query;
        setSearchQuery(query);
        performSearch(query);
        // Clear params after using them to avoid re-searching on every focus
        navigation.setParams({ query: undefined });
      }
    }, [route?.params?.query, performSearch, navigation])
  );

  const handleSearch = () => {
    performSearch(searchQuery);
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
          <Text style={styles.cardMetaText}>
            🍽️ {item.servings || 4} servings
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes or cocktails..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus={!route?.params?.query}
          />
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
          <ScrollView
            style={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Recipes Section */}
            {recipes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🍳 Recipes ({recipes.length})</Text>
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
                <Text style={styles.sectionTitle}>🍹 Cocktails ({cocktails.length})</Text>
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
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching for something else
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateText}>Start searching for recipes and cocktails</Text>
            <Text style={styles.emptyStateSubtext}>
              Enter a search term above to find what you're looking for
            </Text>
          </View>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 20,
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
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    marginLeft: 8,
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
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
  noResultsIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default ExploreScreen;
