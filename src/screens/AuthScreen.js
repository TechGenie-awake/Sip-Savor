import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { colors } from "../styles/theme";

const AuthScreen = ({ navigation }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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

  const handleAuth = () => {
    if (!email || !password || (isSignUp && !name)) {
      alert("Please fill in all fields");
      return;
    }
    console.log(isSignUp ? "Signing up..." : "Signing in...");
    navigation.replace("Main");
  };

  const handleSkip = () => {
    navigation.replace("Main");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
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

            <Text style={styles.heroTagline}>UNLIMITED PREMIUM RECIPES</Text>
            <Text style={styles.heroTitle}>
              {isSignUp ? "Start Cooking" : "Welcome Back"}
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {isSignUp && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.text.secondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {!isSignUp && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {/* Primary Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAuth}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isSignUp ? "Sign Up" : "Login"}
              </Text>
            </TouchableOpacity>

            {/* Secondary Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setIsSignUp(!isSignUp)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>
                {isSignUp ? "Login" : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest Button */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  videoContainer: {
    width: 250,
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: colors.background.secondary,
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
    fontSize: 48,
  },
  heroTagline: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary.main,
    letterSpacing: 1.2,
    marginBottom: 6,
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
    textAlign: "center",
  },
  formSection: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 14,
  },
  forgotPasswordText: {
    color: colors.primary.main,
    fontSize: 13,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#FFD166",
    borderRadius: 30,
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#06D6A0",
    borderRadius: 30,
    padding: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: "600",
  },
  guestButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  guestButtonText: {
    color: colors.text.secondary,
    fontSize: 15,
    fontWeight: "600",
  },
});

export default AuthScreen;
