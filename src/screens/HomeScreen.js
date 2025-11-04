import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

// Replace with your actual backend URL
const API_URL = "http://localhost:3000/api";
// For Android emulator, use: http://10.0.2.2:3000/api
// For iOS simulator, use: http://localhost:3000/api
// For physical device, use: http://YOUR_IP:3000/api

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [featuredCocktails, setFeaturedCocktails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      // Fetch random recipes
      const recipesRes = await fetch(`${API_URL}/recipes/random?number=6`);
      if (!recipesRes.ok) {
        const errorText = await recipesRes.text();
        console.error("Recipes API error:", recipesRes.status, errorText);
        setTrendingRecipes([]);
      } else {
        const recipesData = await recipesRes.json();
        setTrendingRecipes(recipesData.recipes || []);
      }

      // Fetch random cocktails (making 6 separate requests)
      const cocktailsPromises = Array(6)
        .fill()
        .map(async () => {
          try {
            const res = await fetch(`${API_URL}/cocktails/random`);
            if (res.ok) {
              return await res.json();
            }
            return null;
          } catch (err) {
            console.error("Cocktail fetch error:", err);
            return null;
          }
        });
      const cocktailsData = await Promise.all(cocktailsPromises);
      setFeaturedCocktails(
        cocktailsData.map((d) => d?.drinks?.[0]).filter(Boolean)
      );
    } catch (error) {
      console.error("Error loading home data:", error);
      setTrendingRecipes([]);
      setFeaturedCocktails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    // Navigate to ExploreTab (search screen) with the query
    navigation.navigate("ExploreTab", { query: searchQuery });
  };

  const navigateToRecipe = (recipeId) => {
    navigation.navigate("RecipeDetail", { id: recipeId });
  };

  const navigateToCocktail = (cocktailId) => {
    navigation.navigate("CocktailDetail", { id: cocktailId });
  };

  const RecipeCard = ({ item, type = "recipe" }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        type === "recipe"
          ? navigateToRecipe(item.id)
          : navigateToCocktail(item.idDrink)
      }
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image || item.strDrinkThumb }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title || item.strDrink}
        </Text>
        {type === "recipe" && (
          <View style={styles.cardMeta}>
            <Text style={styles.cardMetaText}>
              ⏱️ {item.readyInMinutes || 30} min
            </Text>
            <Text style={styles.cardMetaText}>
              🍽️ {item.servings || 4} servings
            </Text>
          </View>
        )}
        {type === "cocktail" && (
          <Text style={styles.cardMetaText}>🍸 {item.strCategory}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const CategoryButton = ({ emoji, label, color, onPress }) => (
    <TouchableOpacity style={styles.categoryButton} onPress={onPress}>
      <View style={[styles.categoryIcon, { backgroundColor: color }]}>
        <Text style={styles.categoryEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.categoryLabel}>{label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading delicious content...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Evening! 🌙</Text>
            <Text style={styles.title}>What are you craving?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("ProfileTab")}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

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
          />
        </View>

        {/* Quick Categories */}
        <View style={styles.categoriesContainer}>
          <CategoryButton
            emoji="🍳"
            label="Recipes"
            color="#FF6B6B20"
            onPress={() => navigation.navigate("ExploreTab")}
          />
          <CategoryButton
            emoji="🍹"
            label="Cocktails"
            color="#4ECDC420"
            onPress={() => navigation.navigate("ExploreTab")}
          />
          <CategoryButton
            emoji="📈"
            label="Trending"
            color="#FFD93D20"
            onPress={() => console.log("Show trending")}
          />
          <CategoryButton
            emoji="✨"
            label="Random"
            color="#A78BFA20"
            onPress={loadHomeData}
          />
        </View>

        {/* Trending Recipes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Recipes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ExploreTab")}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {trendingRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id || index}
                item={recipe}
                type="recipe"
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Cocktails Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🍹 Featured Cocktails</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ExploreTab")}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {featuredCocktails.map((cocktail, index) => (
              <RecipeCard
                key={cocktail.idDrink || index}
                item={cocktail}
                type="cocktail"
              />
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions Banner */}
        <View style={styles.bannerContainer}>
          <TouchableOpacity
            style={styles.banner}
            onPress={() => navigation.navigate("ExploreTab", { 
              initialQuery: "ingredients" 
            })}
            activeOpacity={0.8}
          >
            <Text style={styles.bannerTitle}>Cook with what you have! 🥘</Text>
            <Text style={styles.bannerText}>
              Find recipes using ingredients in your pantry
            </Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Search by Ingredients</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 24,
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
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 32,
    justifyContent: "space-between",
  },
  categoryButton: {
    alignItems: "center",
    width: (width - 64) / 4,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#E5E5E5",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardMetaText: {
    fontSize: 14,
    color: "#666",
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  banner: {
    backgroundColor: "#FF6B6B",
    borderRadius: 16,
    padding: 24,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.9,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#FF6B6B",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default HomeScreen;
