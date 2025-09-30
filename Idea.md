# 🍹 Sip & Savor - Recipe Discovery Platform

**Project Overview**

**Student:** Gayatri Jaiswal – 2024-B-29012006B

---

## 🎯 Problem Statement

Home cooks and cocktail enthusiasts struggle to find quality recipes across multiple platforms. They need to switch between different apps for food recipes and cocktail instructions, leading to a fragmented cooking and mixing experience. Users lack a centralized place to save their favorite recipes, plan meals with available ingredients, and discover new culinary creations.

---

## 💡 Proposed Solution

**Sip & Savor** is a unified mobile application that brings together food recipes and cocktail recipes in one elegant platform. Leveraging the Spoonacular API for food recipes and TheCocktailDB API for drink recipes, users can search, discover, save, and organize their favorite recipes with intelligent filters and personalized collections.

---

## ✨ Key Features

* **Unified Search**: Search for both food recipes and cocktails in one place
* **Advanced Filtering**: Filter by cuisine, dietary restrictions, ingredients, and difficulty level
* **Recipe Details**: Comprehensive view with ingredients, instructions, nutritional information, and images
* **Smart Ingredient Search**: Find recipes based on ingredients you already have
* **Save & Organize**: Create custom collections and save favorite recipes
* **Shopping Lists**: Generate shopping lists from selected recipes
* **User Dashboard**: Personalized dashboard with saved recipes and recommendations
* **Meal Planning**: Plan weekly meals and cocktail menus
* **Offline Access**: View saved recipes without internet connection
* **Cross-Platform**: Works seamlessly on iOS, Android, and Web

---

## 👥 Target Audience

* Home cooks seeking diverse recipe inspiration
* Cocktail enthusiasts eager to learn new drink recipes
* Students seeking quick and budget-friendly recipes
* Party hosts planning menus for gatherings
* Dietary-conscious users finding recipes that match specific needs

---

## 🛠️ Technology Stack

### Frontend (Mobile & Web)
* **Framework**: React Native (with React Native Web for web support)
* **UI Library**: React Native Paper / NativeBase
* **Navigation**: React Navigation
* **State Management**: Redux Toolkit / Zustand
* **HTTP Client**: Axios
* **Styling**: StyleSheet / Tailwind CSS (via NativeWind)
* **Icons**: React Native Vector Icons

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **API Integration**: Spoonacular API & TheCocktailDB API
* **Hosting**: Heroku or Render

### Database & Storage
* **Database**: MongoDB Atlas
* **ODM**: Mongoose
* **Local Storage**: AsyncStorage (React Native)
* **Image Storage**: Cloudinary

### Authentication & Security
* **Auth**: JWT (JSON Web Tokens)
* **Password Hashing**: bcrypt
* **Secure Storage**: React Native Keychain / Expo SecureStore

### Mobile Deployment
* **iOS**: App Store (via Xcode)
* **Android**: Google Play Store (via Android Studio)
* **Build Tool**: Expo or React Native CLI

### Web Deployment
* **Hosting**: Vercel / Netlify
* **Web Support**: React Native Web

---

## 🎯 Expected Outcome

A fully functional cross-platform recipe discovery application that seamlessly integrates food and cocktail recipes into one intuitive mobile and web interface. Users will be able to search and filter recipes, save favorites, generate shopping lists, plan meals, and discover new recipes based on available ingredients across iOS, Android, and web platforms.

---

## 📅 Development Timeline

| Week | Phase | Tasks |
|------|-------|-------|
| 1-2 | **Planning & Setup** | React Native project setup, API integration planning, database schema design, UI/UX wireframing, authentication setup |
| 3-4 | **API Integration & Core Features** | Integrate Spoonacular and TheCocktailDB APIs, develop search functionality, create recipe detail screens |
| 5-6 | **User Features** | Implement user dashboard, save/favorite functionality, custom collections, shopping list generation, offline support |
| 7 | **Enhanced Features** | Meal planning, profile management, push notifications, cross-platform optimization |
| 8 | **Testing & Deployment** | Testing on iOS/Android/Web, bug fixes, performance optimization, app store deployment |

---
