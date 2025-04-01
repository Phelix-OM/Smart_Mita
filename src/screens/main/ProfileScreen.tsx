"use client"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import { useLanguage } from "../../contexts/LanguageContext"
import { useNotification } from "../../contexts/NotificationContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"

export default function ProfileScreen() {
  const { t } = useTranslation()
  const { colors, isDarkMode, toggleTheme } = useTheme()
  const { user, logout, updateUserProfile } = useAuth()
  const { locale, setLocale } = useLanguage()
  const { settings, updateSettings } = useNotification()
  const { scaledFontSize, spacing } = useResponsive()

  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false)
  const [editName, setEditName] = useState(user?.name || "")
  const [editEmail, setEditEmail] = useState(user?.email || "")
  const [editPhone, setEditPhone] = useState(user?.phone || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleLogout = () => {
    Alert.alert(
      t("logout"),
      "Are you sure you want to log out?",
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("logout"),
          onPress: () => logout(),
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  const handleLanguageChange = () => {
    Alert.alert(
      t("language"),
      "Select your preferred language",
      [
        {
          text: "English",
          onPress: () => setLocale("en"),
        },
        {
          text: "Kiswahili",
          onPress: () => setLocale("sw"),
        },
        {
          text: t("cancel"),
          style: "cancel",
        },
      ],
      { cancelable: true },
    )
  }

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Error", "Name cannot be empty")
      return
    }

    if (!editEmail.trim() || !editEmail.includes("@")) {
      Alert.alert("Error", "Please enter a valid email")
      return
    }

    setIsSaving(true)
    try {
      const success = await updateUserProfile({
        name: editName,
        email: editEmail,
        phone: editPhone,
      })

      if (success) {
        setIsEditProfileModalVisible(false)
        Alert.alert("Success", "Profile updated successfully")
      } else {
        Alert.alert("Error", "Failed to update profile")
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.profileHeader, { backgroundColor: colors.primary }]}>
        <Image
          source={{ uri: user?.profileImage || "https://media.istockphoto.com/id/1371797889/vector/young-smiling-man-avatar-3d-vector-people-character-illustration-cartoon-minimal-style-3d.jpg?s=612x612&w=0&k=20&c=WykJb6hyEUv8T9k86g-LG9u980sEwqK8FG1m1tXgnSI=" }}
          style={styles.avatar}
        />
        <Text style={[styles.userName, { color: colors.white, fontSize: scaledFontSize(24) }]}>
          {user?.name || "User"}
        </Text>
        <Text style={[styles.userEmail, { color: colors.white, fontSize: scaledFontSize(16) }]}>
          {user?.email || "user@example.com"}
        </Text>
      </View>

      <View style={[styles.settingsContainer, { padding: spacing(2) }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
          {t("accountSettings")}
        </Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => {
            setEditName(user?.name || "")
            setEditEmail(user?.email || "")
            setEditPhone(user?.phone || "")
            setIsEditProfileModalVisible(true)
          }}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="person-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Edit Profile
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]} onPress={handleLanguageChange}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="language-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("language")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {locale === "en" ? "English" : "Kiswahili"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("darkMode")}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={isDarkMode ? colors.primary : "#f4f3f4"}
          />
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
              marginTop: spacing(3),
              fontSize: scaledFontSize(18),
            },
          ]}
        >
          {t("notificationSettings")}
        </Text>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="alert-circle-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("energyAlerts")}
            </Text>
          </View>
          <Switch
            value={settings.energyAlerts}
            onValueChange={(value) => updateSettings({ energyAlerts: value })}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={settings.energyAlerts ? colors.primary : "#f4f3f4"}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="bulb-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("savingsTips")}
            </Text>
          </View>
          <Switch
            value={settings.savingsTips}
            onValueChange={(value) => updateSettings({ savingsTips: value })}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={settings.savingsTips ? colors.primary : "#f4f3f4"}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="refresh-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("systemUpdates")}
            </Text>
          </View>
          <Switch
            value={settings.systemUpdates}
            onValueChange={(value) => updateSettings({ systemUpdates: value })}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={settings.systemUpdates ? colors.primary : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.error + "10",
              marginTop: spacing(3),
              padding: spacing(2),
              borderRadius: spacing(1.5),
            },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error, fontSize: scaledFontSize(16) }]}>{t("logout")}</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditProfileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: scaledFontSize(20) }]}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setIsEditProfileModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text, fontSize: scaledFontSize(16) }]}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                    fontSize: scaledFontSize(16),
                  },
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text, fontSize: scaledFontSize(16) }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                    fontSize: scaledFontSize(16),
                  },
                ]}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Phone (optional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                    fontSize: scaledFontSize(16),
                  },
                ]}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: isSaving ? 0.7 : 1,
                  },
                ]}
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={[styles.modalButtonText, { color: colors.white }]}>Save Changes</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.background }]}
                onPress={() => setIsEditProfileModalVisible(false)}
                disabled={isSaving}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "white",
  },
  userName: {
    fontFamily: "Poppins-Bold",
    marginTop: 12,
  },
  userEmail: {
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  settingsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: "Poppins-Medium",
  },
  settingValue: {
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoutText: {
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "Poppins-Bold",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: "Poppins-Regular",
  },
  modalButtonContainer: {
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
})

