import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { recipeAPI } from "../services/api";
import { SavedContext } from "../context/SavedContext";
import {
  Clock,
  Users,
  ChefHat,
  Heart,
  Share2,
  Utensils,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Flame,
  Wheat,
  Beef,
  Droplet,
  CheckCircle,
  Circle,
  ShoppingCart,
  PlayCircle,
  Bookmark,
  BookmarkMinus,
} from "lucide-react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RecipeDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { addToSaved, removeFromSaved, isSaved, addToPlanner } =
    useContext(SavedContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);

  const isFavorite = isSaved(Number(id));

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    setLoading(true);
    const result = await recipeAPI.getById(id);

    if (!result.success) {
      setError(result.error || "Failed to load recipe.");
      setLoading(false);
      return;
    }

    setRecipe(result.data.recipe || result.data);
    setLoading(false);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromSaved(recipe.id);
    } else {
      addToSaved(recipe);
    }
  };

  const handleAddToPlanner = () => {
    // For simplicity, adding to "Today"
    const today = new Date().toISOString();
    addToPlanner(recipe, today, "Dinner");
    alert("Added to Planner for Today!");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this recipe: ${recipe.title}`,
        url: recipe.sourceUrl || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const adjustServings = (increase) => {
    const newMultiplier = increase
      ? servingMultiplier + 0.5
      : Math.max(0.5, servingMultiplier - 0.5);
    setServingMultiplier(newMultiplier);
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleStep = (stepNumber) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const toggleInstructions = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setInstructionsExpanded(!instructionsExpanded);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "#4CAF50",
      medium: "#FF9800",
      hard: "#F44336",
    };
    return colors[difficulty?.toLowerCase()] || "#999";
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Cooking up the recipe...</Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "Recipe not found"}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.retryBtn}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const adjustedServings = Math.round(
    (recipe.servings || 2) * servingMultiplier
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Header with Gradient */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.gradient}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>

          {/* Floating Action Buttons */}
          <View style={styles.floatingButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleFavorite}
            >
              <Heart
                size={24}
                color={isFavorite ? "#FF6B6B" : "#333"}
                fill={isFavorite ? "#FF6B6B" : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <Share2 size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title & Basic Info */}
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>

          {/* Meta Info with Pills */}
          <View style={styles.metaRow}>
            <View style={styles.pill}>
              <Clock size={14} color="#555" />
              <Text style={styles.pillText}>
                {recipe.readyInMinutes || 30} min
              </Text>
            </View>
            <View style={styles.pill}>
              <Users size={14} color="#555" />
              <Text style={styles.pillText}>{adjustedServings} servings</Text>
            </View>
            {recipe.difficulty && (
              <View
                style={[
                  styles.pill,
                  { backgroundColor: getDifficultyColor(recipe.difficulty) },
                ]}
              >
                <ChefHat size={14} color="#FFF" />
                <Text style={styles.pillTextWhite}>
                  {recipe.difficulty || "Medium"}
                </Text>
              </View>
            )}
          </View>

          {/* Tags */}
          {recipe.dishTypes?.length > 0 && (
            <View style={styles.tagsRow}>
              {recipe.dishTypes.slice(0, 3).map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Quick Stats */}
        {recipe.nutrition && (
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionTitle}>Nutrition (per serving)</Text>
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionItem}>
                <Flame size={20} color="#FF6B6B" />
                <Text style={styles.nutritionValue}>
                  {Math.round(recipe.nutrition.calories || 250)}
                </Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Beef size={20} color="#FF6B6B" />
                <Text style={styles.nutritionValue}>
                  {Math.round(recipe.nutrition.protein || 15)}g
                </Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Wheat size={20} color="#FF6B6B" />
                <Text style={styles.nutritionValue}>
                  {Math.round(recipe.nutrition.carbs || 30)}g
                </Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Droplet size={20} color="#FF6B6B" />
                <Text style={styles.nutritionValue}>
                  {Math.round(recipe.nutrition.fat || 10)}g
                </Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
          </View>
        )}

        {/* Summary */}
        {recipe.summary && (
          <View style={styles.summaryCard}>
            <Text style={styles.summary}>
              {recipe.summary.replace(/<[^>]+>/g, "")}
            </Text>
          </View>
        )}

        {/* Serving Adjuster */}
        <View style={styles.servingAdjuster}>
          <Text style={styles.servingText}>Adjust Servings:</Text>
          <View style={styles.servingControls}>
            <TouchableOpacity
              style={styles.servingBtn}
              onPress={() => adjustServings(false)}
            >
              <Text style={styles.servingBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.servingValue}>{adjustedServings}</Text>
            <TouchableOpacity
              style={styles.servingBtn}
              onPress={() => adjustServings(true)}
            >
              <Text style={styles.servingBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ingredients with Checkboxes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Utensils size={20} color="#222" />
              <Text style={styles.sectionTitle}>Ingredients</Text>
            </View>
            <TouchableOpacity style={styles.addToListBtn}>
              <ShoppingCart size={14} color="#FFF" />
              <Text style={styles.addToListText}>List</Text>
            </TouchableOpacity>
          </View>

          {recipe.extendedIngredients?.map((ing, index) => {
            const adjustedAmount = (ing.amount || 1) * servingMultiplier;
            const isChecked = checkedIngredients[index];

            return (
              <TouchableOpacity
                key={index}
                style={styles.ingredient}
                onPress={() => toggleIngredient(index)}
              >
                <View
                  style={[styles.checkbox, isChecked && styles.checkboxChecked]}
                >
                  {isChecked && <CheckCircle size={16} color="#FFF" />}
                </View>
                <Text
                  style={[
                    styles.ingredientText,
                    isChecked && styles.ingredientTextChecked,
                  ]}
                >
                  {adjustedAmount.toFixed(1)} {ing.unit || ""} {ing.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Equipment Needed */}
        {recipe.equipment?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <ChefHat size={20} color="#222" />
              <Text style={styles.sectionTitle}>Equipment Needed</Text>
            </View>
            <View style={styles.equipmentRow}>
              {recipe.equipment.map((item, i) => (
                <View key={i} style={styles.equipmentItem}>
                  <Text style={styles.equipmentText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Instructions with Collapsible View */}
        {recipe.analyzedInstructions?.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={toggleInstructions}
              activeOpacity={0.7}
            >
              <View style={styles.sectionTitleRow}>
                <CheckCircle size={20} color="#222" />
                <Text style={styles.sectionTitle}>Instructions</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.progressText}>
                  {Object.values(completedSteps).filter(Boolean).length}/
                  {recipe.analyzedInstructions[0].steps.length}
                </Text>
                {instructionsExpanded ? (
                  <ChevronUp size={20} color="#666" />
                ) : (
                  <ChevronDown size={20} color="#666" />
                )}
              </View>
            </TouchableOpacity>

            {instructionsExpanded && (
              <View style={styles.instructionsContainer}>
                {recipe.analyzedInstructions[0].steps.map((step) => {
                  const isCompleted = completedSteps[step.number];

                  return (
                    <TouchableOpacity
                      key={step.number}
                      style={[
                        styles.stepItem,
                        isCompleted && styles.stepCompleted,
                      ]}
                      onPress={() => toggleStep(step.number)}
                    >
                      <View
                        style={[
                          styles.stepNumberCircle,
                          isCompleted && styles.stepNumberCircleCompleted,
                        ]}
                      >
                        <Text
                          style={[
                            styles.stepNumber,
                            isCompleted && styles.stepNumberCompleted,
                          ]}
                        >
                          {isCompleted ? "✓" : step.number}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.stepText,
                          isCompleted && styles.stepTextCompleted,
                        ]}
                      >
                        {step.step}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            {!instructionsExpanded && (
              <Text style={styles.collapsedHint}>
                Tap to view {recipe.analyzedInstructions[0].steps.length} steps
              </Text>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
      {/* Action Buttons */}
      <View style={styles.stickyActionBar}>
      <TouchableOpacity
        style={styles.stickyButton}
        onPress={() => navigation.navigate("CookingMode", { recipe })}
      >
        <PlayCircle size={20} color="#FFF" />
        <Text style={styles.stickyButtonText}>Cook</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.stickyButton, styles.stickyButtonPrimary]}
        onPress={toggleFavorite}
      >
        {isFavorite ? (
          <BookmarkMinus size={20} color="#FFF" />
        ) : (
          <Bookmark size={20} color="#FFF" />
        )}
        <Text style={styles.stickyButtonText}>
          {isFavorite ? "Saved" : "Save"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.stickyButton}
        onPress={handleAddToPlanner}
      >
        <Calendar size={20} color="#FFF" />
        <Text style={styles.stickyButtonText}>Plan</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: "#666",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  imageWrapper: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtons: {
    position: "absolute",
    top: 40,
    right: 20,
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pillText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  pillTextWhite: {
    fontSize: 13,
    color: "#FFF",
    fontWeight: "600",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#FF6B6B",
    textTransform: "capitalize",
  },
  nutritionCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  nutritionItem: {
    alignItems: "center",
    gap: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#666",
  },
  summaryCard: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  summary: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  servingAdjuster: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: "#FFF9F0",
    marginHorizontal: 20,
    borderRadius: 12,
  },
  servingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  servingControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  servingBtn: {
    width: 32,
    height: 32,
    backgroundColor: "#FF6B6B",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  servingBtnText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  servingValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  addToListBtn: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addToListText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  progressText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
    marginRight: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  ingredient: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#DDD",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  ingredientText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  ingredientTextChecked: {
    color: "#999",
    textDecorationLine: "line-through",
  },
  equipmentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  equipmentItem: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  equipmentText: {
    fontSize: 14,
    color: "#555",
  },
  instructionsContainer: {
    marginTop: 8,
  },
  collapsedHint: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginTop: -8,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#FAFAFA",
    padding: 16,
    borderRadius: 12,
  },
  stepCompleted: {
    backgroundColor: "#F0F8F0",
  },
  stepNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberCircleCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  stepNumberCompleted: {
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  stepTextCompleted: {
    color: "#666",
    textDecorationLine: "line-through",
  },
  stickyActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  stickyButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    gap: 4,
  },
  stickyButtonPrimary: {
    backgroundColor: "#FF6B6B",
  },
  stickyButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default RecipeDetailScreen;
