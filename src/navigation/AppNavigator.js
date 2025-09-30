import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import Screens
import OnboardingScreen from "../screens/OnboardingScreen";
import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import SavedScreen from "../screens/SavedScreen";
import PlannerScreen from "../screens/PlannerScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import RecipeDetailFullScreen from "../screens/RecipeDetailFullScreen";
import CocktailDetailScreen from "../screens/CocktailDetailScreen";
import { colors } from "../styles/theme";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "ExploreTab") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "SavedTab") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "PlannerTab") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={{ tabBarLabel: "Explore" }}
      />
      <Tab.Screen
        name="SavedTab"
        component={SavedScreen}
        options={{ tabBarLabel: "Saved" }}
      />
      <Tab.Screen
        name="PlannerTab"
        component={PlannerScreen}
        options={{ tabBarLabel: "Planner" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        {/* Onboarding & Auth Screens */}
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen name="Auth" component={AuthScreen} />

        {/* Main App with Bottom Tabs */}
        <Stack.Screen name="Main" component={TabNavigator} />

        {/* Detail Screens (Modal style) */}
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="RecipeDetailFull"
          component={RecipeDetailFullScreen}
          options={{
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="CocktailDetail"
          component={CocktailDetailScreen}
          options={{
            presentation: "card",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
