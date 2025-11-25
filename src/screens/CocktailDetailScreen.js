import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cocktailAPI } from "../services/api";

const { width } = Dimensions.get("window");

const CocktailDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadCocktailDetails();
  }, [id]);

  const loadCocktailDetails = async () => {
    try {
      setLoading(true);
      const result = await cocktailAPI.getById(id);
      
      if (result.success && result.data.drinks) {
        setCocktail(result.data.drinks[0]);
      } else {
        setError("Failed to load cocktail details.");
      }
    } catch (err) {
      console.error("Error loading cocktail:", err);
      setError("An error occurred while loading details.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement actual favorite persistence
  };

  const getIngredients = () => {
    if (!cocktail) return [];
    
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      
      if (ingredient) {
        ingredients.push({
          name: ingredient,
          measure: measure || "",
        });
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (error || !cocktail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Cocktail not found"}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ingredients = getIngredients();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: cocktail.strDrinkThumb }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          
          {/* Header Buttons */}
          <SafeAreaView style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#FF6B6B" : "#FFF"} 
              />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Title Overlay */}
          <View style={styles.titleContainer}>
            <Text style={styles.category}>{cocktail.strCategory}</Text>
            <Text style={styles.title}>{cocktail.strDrink}</Text>
            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{cocktail.strAlcoholic}</Text>
              </View>
              {cocktail.strGlass && (
                <View style={[styles.tag, styles.glassTag]}>
                  <Ionicons name="wine-outline" size={12} color="#FFF" style={{marginRight: 4}} />
                  <Text style={styles.tagText}>{cocktail.strGlass}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Ingredients Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {ingredients.map((item, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.ingredientName}>{item.name}</Text>
                  <Text style={styles.ingredientMeasure}>{item.measure}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.instructionsText}>{cocktail.strInstructions}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    height: 400,
    width: width,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerButtons: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10, // Adjust for status bar
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", // Note: Linear gradient requires extra lib in RN, using solid bg fallback or just relying on image overlay
  },
  category: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  glassTag: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 30,
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
  ingredientsList: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF6B6B",
    marginRight: 12,
  },
  ingredientName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    fontWeight: "500",
  },
  ingredientMeasure: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  instructionsText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 26,
  },
});

export default CocktailDetailScreen;
