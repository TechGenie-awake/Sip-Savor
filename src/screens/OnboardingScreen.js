// src/screens/OnboardingScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { colors } from "../styles/theme";

const OnboardingScreen = ({ navigation }) => {
  const [videoError, setVideoError] = useState(false);

  const videoSource = require("../assets/videos/cooking-intro.mp4");
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // Ensure video plays when component mounts
  React.useEffect(() => {
    if (player) {
      player.play();
    }
  }, [player]);

  const handleGetStarted = () => {
    navigation.replace("Auth");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Video Container */}
        <View style={styles.videoContainer}>
          {!videoError ? (
            <VideoView
              style={styles.video}
              player={player}
              nativeControls={false}
              contentFit="cover"
              allowsFullscreen={false}
              allowsPictureInPicture={false}
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderText}>🍳</Text>
            </View>
          )}
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.tagline}>25K+ PREMIUM RECIPES</Text>
          <Text style={styles.title}>Welcome to{"\n"}Sip & Savor</Text>
          <Text style={styles.description}>
            Discover amazing recipes and cocktails from around the world
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  videoContainer: {
    width: 350,
    height: 400,
    borderRadius: 24,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholderText: {
    fontSize: 64,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  tagline: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary.main,
    letterSpacing: 1.5,
    marginBottom: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 48,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#06D6A0",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: "100%",
    alignItems: "center",
    shadowColor: "#06D6A0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
