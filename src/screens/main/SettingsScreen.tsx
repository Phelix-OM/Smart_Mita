"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Share,
} from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import { useLanguage } from "../../contexts/LanguageContext"
import { useNotification } from "../../contexts/NotificationContext"
import { useUtility } from "../../contexts/UtilityContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Notifications from "expo-notifications"
import DateTimePicker from "@react-native-community/datetimepicker"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function SettingsScreen() {
  const { t } = useTranslation()
  const { colors, isDarkMode, toggleTheme } = useTheme()
  const { logout, user } = useAuth()
  const { locale, setLocale } = useLanguage()
  const { settings, updateSettings, requestPermissions } = useNotification()
  const { currency, setCurrency } = useUtility()
  const { scaledFontSize, spacing } = useResponsive()

  const [isLoading, setIsLoading] = useState(false)
  const [temperatureUnit, setTemperatureUnit] = useState("celsius")
  const [energyUnit, setEnergyUnit] = useState("kWh")
  const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null)
  const [isQuietHoursModalVisible, setIsQuietHoursModalVisible] = useState(false)
  const [startHour, setStartHour] = useState(22)
  const [startMinute, setStartMinute] = useState(0)
  const [endHour, setEndHour] = useState(7)
  const [endMinute, setEndMinute] = useState(0)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const [appVersion, setAppVersion] = useState("1.0.0")
  const [appSize, setAppSize] = useState("0 MB")
  const [cacheSize, setCacheSize] = useState("0 MB")
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false)
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false)
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false)

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load temperature unit
        const savedTempUnit = await AsyncStorage.getItem("temperatureUnit")
        if (savedTempUnit) {
          setTemperatureUnit(savedTempUnit)
        }

        // Load energy unit
        const savedEnergyUnit = await AsyncStorage.getItem("energyUnit")
        if (savedEnergyUnit) {
          setEnergyUnit(savedEnergyUnit)
        }

        // Check notification permission
        const { status } = await Notifications.getPermissionsAsync()
        setNotificationPermission(status === "granted")

        // Parse quiet hours
        if (settings.quietHoursStart) {
          const [hours, minutes] = settings.quietHoursStart.split(":").map(Number)
          setStartHour(hours)
          setStartMinute(minutes)
        }

        if (settings.quietHoursEnd) {
          const [hours, minutes] = settings.quietHoursEnd.split(":").map(Number)
          setEndHour(hours)
          setEndMinute(minutes)
        }

        // Simulate getting app info
        setAppSize("24.5 MB")
        setCacheSize("3.2 MB")
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    loadSettings()
  }, [settings.quietHoursStart, settings.quietHoursEnd])

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

  const handleCurrencyChange = () => {
    Alert.alert(
      "Currency",
      "Select your preferred currency",
      [
        {
          text: "Kenyan Shilling (KES)",
          onPress: () => setCurrency("KES"),
        },
        {
          text: "US Dollar (USD)",
          onPress: () => setCurrency("USD"),
        },
        {
          text: "Euro (EUR)",
          onPress: () => setCurrency("EUR"),
        },
        {
          text: t("cancel"),
          style: "cancel",
        },
      ],
      { cancelable: true },
    )
  }

  const handleTemperatureUnitChange = async () => {
    const newUnit = temperatureUnit === "celsius" ? "fahrenheit" : "celsius"
    setTemperatureUnit(newUnit)
    await AsyncStorage.setItem("temperatureUnit", newUnit)

    Alert.alert(
      "Temperature Unit Changed",
      `Temperature will now be displayed in ${newUnit === "celsius" ? "Celsius (°C)" : "Fahrenheit (°F)"}`,
      [{ text: "OK" }],
    )
  }

  const handleEnergyUnitChange = async () => {
    const newUnit = energyUnit === "kWh" ? "MJ" : "kWh"
    setEnergyUnit(newUnit)
    await AsyncStorage.setItem("energyUnit", newUnit)

    Alert.alert("Energy Unit Changed", `Energy will now be displayed in ${newUnit}`, [{ text: "OK" }])
  }

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear temporary data. Your settings and account information will not be affected.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear Cache",
          onPress: async () => {
            setIsLoading(true)
            // Simulate clearing cache
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setCacheSize("0 MB")
            setIsLoading(false)
            Alert.alert("Success", "Cache has been cleared successfully")
          },
        },
      ],
      { cancelable: true },
    )
  }

  const handleClearData = () => {
    Alert.alert(
      "Clear App Data",
      "This will reset all your preferences and cached data. This action cannot be undone. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear Data",
          onPress: async () => {
            setIsLoading(true)
            // Simulate clearing data
            await AsyncStorage.clear()
            setTimeout(() => {
              setIsLoading(false)
              Alert.alert("Success", "App data has been cleared successfully. The app will now restart.", [
                { text: "OK", onPress: () => logout() },
              ])
            }, 1500)
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      // Simulate exporting data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would generate a file with the user's data
      // For this demo, we'll just show a success message

      // You could also use the Share API to let users share their data
      await Share.share({
        title: "SmartMita Energy Data",
        message: "Here is my energy consumption data from SmartMita.",
      })

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      Alert.alert("Error", "Failed to export data. Please try again.")
    }
  }

  const handleRequestNotificationPermission = async () => {
    const granted = await requestPermissions()
    setNotificationPermission(granted)

    if (granted) {
      Alert.alert("Success", "Notification permissions granted!")
    } else {
      Alert.alert(
        "Permission Denied",
        "Please enable notifications in your device settings to receive important updates about your energy usage.",
      )
    }
  }

  const handleSaveQuietHours = async () => {
    const startTime = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`

    await updateSettings({
      quietHoursStart: startTime,
      quietHoursEnd: endTime,
    })

    setIsQuietHoursModalVisible(false)
  }

  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTimePicker(Platform.OS === "ios")
    if (selectedDate) {
      setStartHour(selectedDate.getHours())
      setStartMinute(selectedDate.getMinutes())
    }
  }

  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTimePicker(Platform.OS === "ios")
    if (selectedDate) {
      setEndHour(selectedDate.getHours())
      setEndMinute(selectedDate.getMinutes())
    }
  }

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "Check out SmartMita, the app that helps you monitor and reduce your energy consumption! Download it now: https://smartmita.com",
      })
    } catch (error) {
      Alert.alert("Error", "Failed to share app")
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: scaledFontSize(24) }]}>Settings</Text>
      </View>

      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>Account</Text>

        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.profileIconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <Text style={[styles.profileInitials, { color: colors.primary, fontSize: scaledFontSize(24) }]}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text, fontSize: scaledFontSize(18) }]}>
              {user?.name || "User"}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {user?.email || "user@example.com"}
            </Text>
          </View>
          <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: `${colors.primary}15` }]}>
            <Text style={[styles.editProfileText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.sectionTitle, { color: colors.text, fontSize: scaledFontSize(18), marginTop: spacing(3) }]}
        >
          App Preferences
        </Text>

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
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {isDarkMode ? "Enabled" : "Disabled"}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={isDarkMode ? colors.primary : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]} onPress={handleCurrencyChange}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="cash-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>Currency</Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {currency}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={handleTemperatureUnitChange}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="thermometer-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Temperature Unit
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {temperatureUnit === "celsius" ? "Celsius (°C)" : "Fahrenheit (°F)"}
            </Text>
          </View>
          <Switch
            value={temperatureUnit === "celsius"}
            onValueChange={handleTemperatureUnitChange}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={temperatureUnit === "celsius" ? colors.primary : "#f4f3f4"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={handleEnergyUnitChange}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="flash-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>Energy Unit</Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {energyUnit}
            </Text>
          </View>
          <Switch
            value={energyUnit === "kWh"}
            onValueChange={handleEnergyUnitChange}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={energyUnit === "kWh" ? colors.primary : "#f4f3f4"}
          />
        </TouchableOpacity>

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

        {notificationPermission === false && (
          <TouchableOpacity
            style={[styles.permissionBanner, { backgroundColor: `${colors.warning}15` }]}
            onPress={handleRequestNotificationPermission}
          >
            <Ionicons name="notifications-off" size={24} color={colors.warning} style={styles.permissionIcon} />
            <View style={styles.permissionContent}>
              <Text style={[styles.permissionTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Notifications Disabled
              </Text>
              <Text style={[styles.permissionText, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Enable notifications to get updates about your energy usage
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.warning} />
          </TouchableOpacity>
        )}

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Push Notifications
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {notificationPermission ? "Enabled" : "Disabled"}
            </Text>
          </View>
          <Switch
            value={notificationPermission === true}
            onValueChange={handleRequestNotificationPermission}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={notificationPermission === true ? colors.primary : "#f4f3f4"}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="alert-circle-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("energyAlerts")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              Get notified about unusual energy usage
            </Text>
          </View>
          <Switch
            value={settings.energyAlerts}
            onValueChange={(value) => updateSettings({ energyAlerts: value })}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={settings.energyAlerts ? colors.primary : "#f4f3f4"}
            disabled={!notificationPermission}
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
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              Receive daily energy-saving tips
            </Text>
          </View>
          <Switch
            value={settings.savingsTips}
            onValueChange={(value) => updateSettings({ savingsTips: value })}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={settings.savingsTips ? colors.primary : "#f4f3f4"}
            disabled={!notificationPermission}
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
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              Get notified about app updates
            </Text>
          </View>
          <Switch
            value={settings.systemUpdates}
            onValueChange={(value) => updateSettings({ systemUpdates: value })}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={settings.systemUpdates ? colors.primary : "#f4f3f4"}
            disabled={!notificationPermission}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>Quiet Hours</Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {settings.quietHoursEnabled ? `${settings.quietHoursStart} - ${settings.quietHoursEnd}` : "Disabled"}
            </Text>
          </View>
          <View style={styles.settingActions}>
            <Switch
              value={settings.quietHoursEnabled}
              onValueChange={(value) => updateSettings({ quietHoursEnabled: value })}
              trackColor={{ false: "#767577", true: colors.primary + "80" }}
              thumbColor={settings.quietHoursEnabled ? colors.primary : "#f4f3f4"}
              disabled={!notificationPermission}
            />
            {settings.quietHoursEnabled && (
              <TouchableOpacity style={styles.editButton} onPress={() => setIsQuietHoursModalVisible(true)}>
                <Ionicons name="pencil" size={18} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
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
          Data Management
        </Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={handleExportData}
          disabled={isLoading}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="download-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>Export Data</Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              Export your energy consumption data
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={handleClearCache}
          disabled={isLoading}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.warning}15` }]}>
            <Ionicons name="trash-bin-outline" size={24} color={colors.warning} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>Clear Cache</Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {cacheSize} of temporary data
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.warning} />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={handleClearData}
          disabled={isLoading}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.error}15` }]}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Clear App Data
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              Reset all preferences and cached data
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          )}
        </TouchableOpacity>

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
          About
        </Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => setIsAboutModalVisible(true)}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              About SmartMita
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              Version {appVersion}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => setIsPrivacyModalVisible(true)}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="shield-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Privacy Policy
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              View our privacy policy
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => setIsHelpModalVisible(true)}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Help & Support
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              Get help with using the app
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]} onPress={handleShareApp}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="share-social-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>Share App</Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              Share SmartMita with friends
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

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

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Quiet Hours Modal */}
      <Modal
        visible={isQuietHoursModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsQuietHoursModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Set Quiet Hours
              </Text>
              <TouchableOpacity onPress={() => setIsQuietHoursModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDescription, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              Notifications will not be sent during these hours
            </Text>

            <View style={styles.timePickerContainer}>
              <View style={styles.timePickerSection}>
                <Text style={[styles.timePickerLabel, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                  Start Time
                </Text>
                <TouchableOpacity
                  style={[styles.timePickerButton, { backgroundColor: colors.background }]}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={[styles.timePickerText, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                    {formatTime(startHour, startMinute)}
                  </Text>
                  <Ionicons name="time-outline" size={20} color={colors.primary} />
                </TouchableOpacity>

                {showStartTimePicker && (
                  <DateTimePicker
                    value={new Date(new Date().setHours(startHour, startMinute))}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onStartTimeChange}
                  />
                )}
              </View>

              <View style={styles.timePickerSection}>
                <Text style={[styles.timePickerLabel, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                  End Time
                </Text>
                <TouchableOpacity
                  style={[styles.timePickerButton, { backgroundColor: colors.background }]}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={[styles.timePickerText, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                    {formatTime(endHour, endMinute)}
                  </Text>
                  <Ionicons name="time-outline" size={20} color={colors.primary} />
                </TouchableOpacity>

                {showEndTimePicker && (
                  <DateTimePicker
                    value={new Date(new Date().setHours(endHour, endMinute))}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onEndTimeChange}
                  />
                )}
              </View>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveQuietHours}
              >
                <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>
                  Save
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.background }]}
                onPress={() => setIsQuietHoursModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={isAboutModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAboutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                About SmartMita
              </Text>
              <TouchableOpacity onPress={() => setIsAboutModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.aboutContent}>
              <View style={styles.appInfoContainer}>
                <View style={[styles.appIconContainer, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.appIconText, { color: colors.white, fontSize: scaledFontSize(24) }]}>SM</Text>
                </View>
                <Text style={[styles.appName, { color: colors.text, fontSize: scaledFontSize(20) }]}>SmartMita</Text>
                <Text style={[styles.appVersion, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                  Version {appVersion}
                </Text>
              </View>

              <Text style={[styles.aboutText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                SmartMita is an energy monitoring application designed to help users track, understand, and optimize
                their energy consumption.
              </Text>

              <Text style={[styles.aboutText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                With SmartMita, you can:
              </Text>

              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    Monitor your real-time energy usage
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    Compare your consumption with similar households
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    Receive personalized energy-saving tips
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    Get alerts about unusual energy usage
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    Track your energy costs and potential savings
                  </Text>
                </View>
              </View>

              <Text style={[styles.copyrightText, { color: colors.textSecondary, fontSize: scaledFontSize(12) }]}>
                © 2023 SmartMita. All rights reserved.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary, marginTop: 16 }]}
              onPress={() => setIsAboutModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={isPrivacyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Privacy Policy
              </Text>
              <TouchableOpacity onPress={() => setIsPrivacyModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.privacyContent}>
              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Introduction
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                SmartMita is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and
                safeguard your information when you use our mobile application.
              </Text>

              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Information We Collect
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                We collect information that you provide directly to us, such as when you create an account, connect to
                utility providers, or contact us for support.
              </Text>

              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                How We Use Your Information
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                We use the information we collect to provide, maintain, and improve our services, to develop new
                features, and to protect SmartMita and our users.
              </Text>

              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Data Security
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                We take reasonable measures to help protect your personal information from loss, theft, misuse,
                unauthorized access, disclosure, alteration, and destruction.
              </Text>

              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Changes to This Policy
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page.
              </Text>

              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Contact Us
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                If you have any questions about this Privacy Policy, please contact us at privacy@smartmita.com.
              </Text>

              <Text style={[styles.privacyDate, { color: colors.textSecondary, fontSize: scaledFontSize(12) }]}>
                Last updated: March 25, 2023
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary, marginTop: 16 }]}
              onPress={() => setIsPrivacyModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Help & Support Modal */}
      <Modal
        visible={isHelpModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Help & Support
              </Text>
              <TouchableOpacity onPress={() => setIsHelpModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.helpContent}>
              <Text style={[styles.helpTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Frequently Asked Questions
              </Text>

              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                  How do I connect my utility provider?
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                  Go to the Dashboard, tap on "Connect Utility" and follow the instructions to link your utility
                  account.
                </Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                  Why am I not receiving notifications?
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                  Check your notification settings in the app and ensure notifications are enabled in your device
                  settings.
                </Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                  How accurate is the energy usage data?
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                  The data is as accurate as what your utility provider supplies. We update it in real-time when
                  available.
                </Text>
              </View>

              <Text style={[styles.helpTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Contact Support
              </Text>

              <TouchableOpacity style={[styles.supportButton, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="mail" size={20} color={colors.primary} style={styles.supportButtonIcon} />
                <Text style={[styles.supportButtonText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                  Email Support
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.supportButton, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="chatbubbles" size={20} color={colors.primary} style={styles.supportButtonIcon} />
                <Text style={[styles.supportButtonText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                  Live Chat
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.supportButton, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="call" size={20} color={colors.primary} style={styles.supportButtonIcon} />
                <Text style={[styles.supportButtonText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                  Call Support
                </Text>
              </TouchableOpacity>

              <Text style={[styles.supportHours, { color: colors.textSecondary, fontSize: scaledFontSize(12) }]}>
                Support hours: Monday-Friday, 8:00 AM - 6:00 PM EAT
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary, marginTop: 16 }]}
              onPress={() => setIsHelpModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
  },
  sectionTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    fontFamily: "Poppins-Bold",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: "Poppins-Bold",
  },
  profileEmail: {
    fontFamily: "Poppins-Regular",
  },
  editProfileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editProfileText: {
    fontFamily: "Poppins-Medium",
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
  settingActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  permissionIcon: {
    marginRight: 12,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  permissionText: {
    fontFamily: "Poppins-Regular",
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
  modalDescription: {
    fontFamily: "Poppins-Regular",
    marginBottom: 20,
  },
  timePickerContainer: {
    marginBottom: 20,
  },
  timePickerSection: {
    marginBottom: 16,
  },
  timePickerLabel: {
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  timePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  timePickerText: {
    fontFamily: "Poppins-Regular",
  },
  modalButtonContainer: {
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
  },
  aboutContent: {
    maxHeight: 400,
  },
  appInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appIconText: {
    fontFamily: "Poppins-Bold",
  },
  appName: {
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  appVersion: {
    fontFamily: "Poppins-Regular",
  },
  aboutText: {
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
    lineHeight: 22,
  },
  featureList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  copyrightText: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 16,
  },
  privacyContent: {
    maxHeight: 400,
  },
  privacyTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
    marginTop: 16,
  },
  privacyText: {
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
    lineHeight: 22,
  },
  privacyDate: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 16,
  },
  helpContent: {
    maxHeight: 400,
  },
  helpTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 12,
    marginTop: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  faqAnswer: {
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  supportButtonIcon: {
    marginRight: 8,
  },
  supportButtonText: {
    fontFamily: "Poppins-Medium",
  },
  supportHours: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 16,
  },
})

