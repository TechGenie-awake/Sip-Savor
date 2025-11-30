import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SavedContext } from "../context/SavedContext";
import { Ionicons } from "@expo/vector-icons";

const PlannerScreen = ({ navigation }) => {
  const { plannerItems, removeFromPlanner } = useContext(SavedContext);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("RecipeDetail", { id: item.recipe.id })
      }
    >
      <View style={styles.dateBadge}>
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
          })}
        </Text>
      </View>
      <Image source={{ uri: item.recipe.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.mealType}>{item.mealType}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {item.recipe.title}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeFromPlanner(item.id)}
      >
        <Ionicons name="close-circle" size={24} color="#CCC" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meal Planner</Text>
      </View>

      {plannerItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>Your planner is empty.</Text>
          <Text style={styles.emptySubText}>
            Plan your meals ahead to save time!
          </Text>
        </View>
      ) : (
        <FlatList
          data={plannerItems.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    alignItems: "center",
    paddingRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateBadge: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 20,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
  },
  dateText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 12,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  mealType: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  removeBtn: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
});

export default PlannerScreen;
