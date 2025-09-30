import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ExploreScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Explore Screen - Will build UI next</Text>
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

export default ExploreScreen;
