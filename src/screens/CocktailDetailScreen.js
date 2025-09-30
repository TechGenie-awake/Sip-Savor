import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CocktailDetailScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Cocktail Detail Screen - Will build UI next</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CocktailDetailScreen;
