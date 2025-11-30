import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // or react-native-vector-icons
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

const { width, height } = Dimensions.get("window");

const CookingModeScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const steps = recipe.analyzedInstructions?.[0]?.steps || [];

  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
const [contentHeight, setContentHeight] = useState(0);
const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    // Keep screen awake during cooking
    activateKeepAwake();
    StatusBar.setHidden(true);

    return () => {
      deactivateKeepAwake();
      StatusBar.setHidden(false);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            Alert.alert("⏰ Timer Done!", "Time's up for this step!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimer(0);
      setIsTimerRunning(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimer(0);
      setIsTimerRunning(false);
    }
  };

  const startTimer = (minutes) => {
    setTimer(minutes * 60);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const exitCookingMode = () => {
    Alert.alert("Exit Cooking Mode?", "Are you sure you want to exit?", [
      { text: "Cancel", style: "cancel" },
      { text: "Exit", onPress: () => navigation.goBack() },
    ]);
  };

  if (steps.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No cooking steps available</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.exitBtn}
        >
          <Text style={styles.exitBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={exitCookingMode} style={styles.exitBtn}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      {/* Main Step Content */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepNumber}>STEP {currentStep + 1}</Text>
        <Text style={styles.stepText}>{step.step}</Text>

        {/* Step Ingredients (if available) */}
        {step.ingredients?.length > 0 && (
          <View style={styles.stepIngredients}>
            <Text style={styles.stepIngredientsTitle}>For this step:</Text>
            {step.ingredients.map((ing, idx) => (
              <Text key={idx} style={styles.stepIngredientItem}>
                • {ing.name}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Timer Section */}
      <View style={styles.timerSection}>
        {timer > 0 ? (
          <>
            <Text style={styles.timerDisplay}>{formatTime(timer)}</Text>
            <View style={styles.timerControls}>
              <TouchableOpacity
                onPress={toggleTimer}
                style={[styles.timerBtn, styles.timerBtnPrimary]}
              >
                <Ionicons
                  name={isTimerRunning ? "pause" : "play"}
                  size={24}
                  color="#FFF"
                />
                <Text style={styles.timerBtnText}>
                  {isTimerRunning ? "Pause" : "Resume"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={resetTimer} style={styles.timerBtn}>
                <Ionicons name="refresh" size={24} color="#FF6B6B" />
                <Text style={styles.timerBtnTextSecondary}>Reset</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.timerPresets}>
            <Text style={styles.timerLabel}>Set Timer:</Text>
            <View style={styles.presetButtons}>
              <TouchableOpacity
                onPress={() => startTimer(5)}
                style={styles.presetBtn}
              >
                <Text style={styles.presetBtnText}>5 min</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => startTimer(10)}
                style={styles.presetBtn}
              >
                <Text style={styles.presetBtnText}>10 min</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => startTimer(15)}
                style={styles.presetBtn}
              >
                <Text style={styles.presetBtnText}>15 min</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => startTimer(30)}
                style={styles.presetBtn}
              >
                <Text style={styles.presetBtnText}>30 min</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={goToPreviousStep}
          disabled={currentStep === 0}
          style={[
            styles.navButton,
            currentStep === 0 && styles.navButtonDisabled,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={32}
            color={currentStep === 0 ? "#CCC" : "#FFF"}
          />
          <Text
            style={[
              styles.navButtonText,
              currentStep === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowIngredients(!showIngredients)}
          style={styles.ingredientsBtn}
        >
          <Ionicons name="list" size={24} color="#FF6B6B" />
          <Text style={styles.ingredientsBtnText}>Ingredients</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNextStep}
          disabled={currentStep === steps.length - 1}
          style={[
            styles.navButton,
            currentStep === steps.length - 1 && styles.navButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.navButtonText,
              currentStep === steps.length - 1 && styles.navButtonTextDisabled,
            ]}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={32}
            color={currentStep === steps.length - 1 ? "#CCC" : "#FFF"}
          />
        </TouchableOpacity>
      </View>

      {/* Ingredients Overlay */}
      {showIngredients && (
  <View style={styles.overlay}>
    <View style={styles.overlayContent}>
      <View style={styles.overlayHeader}>
        <Text style={styles.overlayTitle}>All Ingredients</Text>
        <TouchableOpacity onPress={() => setShowIngredients(false)}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView 
          style={styles.ingredientsList} 
          showsVerticalScrollIndicator={false}
          onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
          onContentSizeChange={(width, height) => setContentHeight(height)}
          onScroll={(e) => setScrollOffset(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
        >
          {recipe.extendedIngredients?.map((ing, idx) => (
            <Text key={idx} style={styles.ingredientItem}>
              • {ing.original || ing.name}
            </Text>
          ))}
        </ScrollView>
        {contentHeight > scrollViewHeight && (
          <View style={styles.customScrollbar}>
            <View 
              style={[
                styles.customScrollbarThumb,
                {
                  height: `${(scrollViewHeight / contentHeight) * 100}%`,
                  top: `${(scrollOffset / contentHeight) * 100}%`,
                }
              ]} 
            />
          </View>
        )}
      </View>
    </View>
  </View>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  exitBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  exitBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  progressContainer: {
    flex: 1,
    marginLeft: 16,
  },
  progressText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6B6B",
    borderRadius: 3,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  stepNumber: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 16,
  },
  stepText: {
    color: "#FFF",
    fontSize: 28,
    lineHeight: 40,
    fontWeight: "500",
  },
  stepIngredients: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
  },
  stepIngredientsTitle: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  stepIngredientItem: {
    color: "#CCC",
    fontSize: 16,
    marginBottom: 4,
  },
  timerSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center",
  },
  timerDisplay: {
    color: "#FF6B6B",
    fontSize: 64,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  timerControls: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  timerBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#2A2A2A",
    gap: 8,
  },
  timerBtnPrimary: {
    backgroundColor: "#FF6B6B",
  },
  timerBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  timerBtnTextSecondary: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
  },
  timerPresets: {
    width: "100%",
  },
  timerLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  presetButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  presetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  presetBtnText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
  },
  navigation: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FF6B6B",
    borderRadius: 28,
    minWidth: 120,
    justifyContent: "center",
  },
  navButtonDisabled: {
    backgroundColor: "#2A2A2A",
  },
  navButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  navButtonTextDisabled: {
    color: "#666",
  },
  ingredientsBtn: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ingredientsBtnText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    width: width * 0.9,
    maxHeight: height * 0.7,
  },
  overlayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  ingredientsList: {
    maxHeight: height * 0.5,
  },
  ingredientItem: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
    lineHeight: 22,
  },
  errorText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
  },
  scrollContainer: {
    flexDirection: 'row',
    maxHeight: height * 0.5,
  },
  ingredientsList: {
    flex: 1,
    paddingRight: 8,
  },
  customScrollbar: {
    width: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginLeft: 8,
    position: 'relative',
  },
  customScrollbarThumb: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
    minHeight: 40,
  },
});

export default CookingModeScreen;
