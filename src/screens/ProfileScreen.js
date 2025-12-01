import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { SavedContext } from "../context/SavedContext";
import { colors } from "../styles/theme";
import { User, Heart, Calendar, Folder, LogOut, ChevronRight } from "lucide-react-native";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { savedRecipes, plannerItems } = useContext(SavedContext);

  const [showLogoutSheet, setShowLogoutSheet] = useState(false);

  const initials =
    user?.fullName?.charAt(0)?.toUpperCase() ??
    user?.email?.charAt(0)?.toUpperCase() ??
    "?";

  const favoritesCount = savedRecipes?.length || 0;
  const plannerCount = plannerItems?.length || 0;
  const collectionsCount = 0; // Coming soon

  const handleLogout = async () => {
    setShowLogoutSheet(false);
    await logout();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* Header Banner */}
      <View style={styles.banner} />

      <View style={styles.container}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{user?.fullName || "User"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Heart size={22} color={colors.primary.main} />
            <Text style={styles.statNumber}>{favoritesCount}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>

          <View style={styles.statBox}>
            <Calendar size={22} color={colors.primary.main} />
            <Text style={styles.statNumber}>{plannerCount}</Text>
            <Text style={styles.statLabel}>Planner</Text>
          </View>

          <View style={styles.statBox}>
            <Folder size={22} color={colors.primary.main} />
            <Text style={styles.statNumber}>{collectionsCount}</Text>
            <Text style={styles.statLabel}>Collections</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          <MenuItem label="Settings" icon={<ChevronRight size={20} />} />
          <MenuItem label="Help & Support" icon={<ChevronRight size={20} />} />
          <MenuItem label="About App" icon={<ChevronRight size={20} />} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setShowLogoutSheet(true)}
        >
          <LogOut size={18} color="#FF5A5A" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Bottom Sheet */}
      <Modal
        transparent
        visible={showLogoutSheet}
        animationType="slide"
        onRequestClose={() => setShowLogoutSheet(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowLogoutSheet(false)} />

        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Log Out?</Text>
          <Text style={styles.sheetSubtitle}>
            Are you sure you want to sign out of your account?
          </Text>

          <TouchableOpacity style={styles.sheetLogoutBtn} onPress={handleLogout}>
            <Text style={styles.sheetLogoutText}>Yes, Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sheetCancelBtn}
            onPress={() => setShowLogoutSheet(false)}
          >
            <Text style={styles.sheetCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Reusable Menu Item Component
const MenuItem = ({ label, icon }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuLabel}>{label}</Text>
    {icon}
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  banner: {
    height: 160,
    backgroundColor: colors.primary.main,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  container: {
    marginTop: -60,
    paddingHorizontal: 20,
  },

  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  avatarContainer: {
    marginBottom: 10,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 38,
    color: "#FFF",
    fontWeight: "bold",
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },

  email: {
    fontSize: 14,
    color: "#666",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 25,
  },

  statBox: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#666",
  },

  menuCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 5,
    marginBottom: 25,
  },

  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  menuLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  logoutBtn: {
    backgroundColor: "#FFECEC",
    paddingVertical: 15,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  logoutText: {
    color: "#FF5A5A",
    fontWeight: "700",
    fontSize: 15,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sheet: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },

  sheetSubtitle: {
    color: "#666",
    fontSize: 14,
    marginBottom: 20,
  },

  sheetLogoutBtn: {
    backgroundColor: "#FF5A5A",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  sheetLogoutText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },

  sheetCancelBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CCC",
  },

  sheetCancelText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
});

export default ProfileScreen;
