"use client"

import { useState, useEffect, useCallback } from "react"
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
  TextInput,
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
import { useLiveDataSettings } from "../../hooks/useLiveDataSettings"
import Slider from "@react-native-community/slider"

export default function SettingsScreen() {
  const { t } = useTranslation()
  const { colors, isDarkMode, toggleTheme } = useTheme()
  const { logout, user, updateUserProfile } = useAuth()
  const { locale, setLocale } = useLanguage()
  const { settings, updateSettings, requestPermissions } = useNotification()
  const { currency, setCurrency } = useUtility()
  const { scaledFontSize, spacing } = useResponsive()

  // Live data simulation settings
  const {
    isSimulationEnabled,
    updateInterval,
    fluctuationRange,
    toggleSimulation,
    setUpdateInterval,
    setFluctuationRange,
  } = useLiveDataSettings()

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
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false)
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false)
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false)
  const [isSimulationSettingsModalVisible, setIsSimulationSettingsModalVisible] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedEmail, setEditedEmail] = useState("")

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

  // Initialize edit profile form when modal opens
  useEffect(() => {
    if (isEditProfileModalVisible && user) {
      setEditedName(user.name || "")
      setEditedEmail(user.email || "")
    }
  }, [isEditProfileModalVisible, user])

  const handleLogout = useCallback(() => {
    Alert.alert(
      t("logout"),
      t("logoutConfirmation"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("logout"),
          onPress: async () => {
            setIsLoading(true)
            try {
              // Call logout directly without setTimeout
              await logout()
              console.log("Logout completed in SettingsScreen")
            } catch (error) {
              console.error("Error during logout:", error)
            } finally {
              setIsLoading(false)
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }, [t, logout])

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale)
    setIsLanguageModalVisible(false)
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    setIsCurrencyModalVisible(false)
  }

  const handleTemperatureUnitChange = async () => {
    const newUnit = temperatureUnit === "celsius" ? "fahrenheit" : "celsius"
    setTemperatureUnit(newUnit)
    await AsyncStorage.setItem("temperatureUnit", newUnit)

    Alert.alert(
      t("temperatureUnitChanged"),
      t("temperatureUnitChangedMessage", { unit: newUnit === "celsius" ? "Celsius (°C)" : "Fahrenheit (°F)" }),
      [{ text: "OK" }],
    )
  }

  const handleEnergyUnitChange = async () => {
    const newUnit = energyUnit === "kWh" ? "MJ" : "kWh"
    setEnergyUnit(newUnit)
    await AsyncStorage.setItem("energyUnit", newUnit)

    Alert.alert(t("energyUnitChanged"), t("energyUnitChangedMessage", { unit: newUnit }), [{ text: "OK" }])
  }

  const handleClearCache = () => {
    Alert.alert(
      t("clearCache"),
      t("clearCacheConfirmation"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("clearCache"),
          onPress: async () => {
            setIsLoading(true)
            // Simulate clearing cache
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setCacheSize("0 MB")
            setIsLoading(false)
            Alert.alert(t("success"), t("cacheCleared"))
          },
        },
      ],
      { cancelable: true },
    )
  }

  const handleClearData = () => {
    Alert.alert(
      t("clearAppData"),
      t("clearAppDataConfirmation"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("clearData"),
          onPress: async () => {
            setIsLoading(true)
            // Simulate clearing data
            await AsyncStorage.clear()
            setTimeout(() => {
              setIsLoading(false)
              Alert.alert(t("success"), t("appDataCleared"), [{ text: "OK", onPress: () => logout() }])
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
      Alert.alert(t("error"), t("exportDataError"))
    }
  }

  const handleRequestNotificationPermission = async () => {
    const granted = await requestPermissions()
    setNotificationPermission(granted)

    if (granted) {
      Alert.alert(t("success"), t("notificationPermissionGranted"))
    } else {
      Alert.alert(t("permissionDenied"), t("notificationPermissionDeniedMessage"))
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

  const handleSaveSimulationSettings = () => {
    setIsSimulationSettingsModalVisible(false)
    Alert.alert("Simulation Settings", "Your simulation settings have been updated.")
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
      Alert.alert(t("error"), t("shareAppError"))
    }
  }

  const handleSaveProfile = () => {
    if (!editedName.trim()) {
      Alert.alert(t("error"), t("nameRequired"))
      return
    }

    if (!editedEmail.trim() || !editedEmail.includes("@")) {
      Alert.alert(t("error"), t("validEmailRequired"))
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      updateUserProfile({
        name: editedName,
        email: editedEmail,
      })
      setIsLoading(false)
      setIsEditProfileModalVisible(false)
      Alert.alert(t("success"), t("profileUpdated"))
    }, 1000)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: scaledFontSize(24) }]}>{t("settings")}</Text>
      </View>

      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>{t("account")}</Text>

        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.profileIconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <Text style={[styles.profileInitials, { color: colors.primary, fontSize: scaledFontSize(24) }]}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text, fontSize: scaledFontSize(18) }]}>
              {user?.name || t("user")}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {user?.email || "user@example.com"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.editProfileButton, { backgroundColor: `${colors.primary}15` }]}
            onPress={() => setIsEditProfileModalVisible(true)}
          >
            <Text style={[styles.editProfileText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
              {t("edit")}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.sectionTitle, { color: colors.text, fontSize: scaledFontSize(18), marginTop: spacing(3) }]}
        >
          {t("appPreferences")}
        </Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => setIsLanguageModalVisible(true)}
        >
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
              {isDarkMode ? t("enabled") : t("disabled")}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={isDarkMode ? colors.primary : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => setIsCurrencyModalVisible(true)}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="cash-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("currency")}
            </Text>
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
              {t("temperatureUnit")}
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
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("energyUnit")}
            </Text>
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

        {/* Live Data Simulation Settings */}
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
          Live Data Simulation
        </Text>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="pulse" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Live Data Simulation
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {isSimulationEnabled ? "Enabled" : "Disabled"}
            </Text>
          </View>
          <Switch
            value={isSimulationEnabled}
            onValueChange={toggleSimulation}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={isSimulationEnabled ? colors.primary : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => setIsSimulationSettingsModalVisible(true)}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="options-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Simulation Settings
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              Update interval: {updateInterval / 1000}s, Fluctuation: {fluctuationRange}%
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
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
                {t("notificationsDisabled")}
              </Text>
              <Text style={[styles.permissionText, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                {t("enableNotificationsMessage")}
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
              {t("pushNotifications")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {notificationPermission ? t("enabled") : t("disabled")}
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
              {t("energyAlertsDescription")}
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
              {t("savingsTipsDescription")}
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
              {t("systemUpdatesDescription")}
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
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("quietHours")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {settings.quietHoursEnabled ? `${settings.quietHoursStart} - ${settings.quietHoursEnd}` : t("disabled")}
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
          {t("dataManagement")}
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
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("exportData")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {t("exportDataDescription")}
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
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("clearCache")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {cacheSize} {t("ofTemporaryData")}
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
              {t("clearAppData")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {t("clearAppDataDescription")}
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
          {t("about")}
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
              {t("aboutSmartMita")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {t("version")} {appVersion}
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
              {t("privacyPolicy")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {t("viewPrivacyPolicy")}
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
              {t("helpAndSupport")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {t("getHelpWithApp")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]} onPress={handleShareApp}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="share-social-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("shareApp")}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {t("shareAppDescription")}
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

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditProfileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditProfileModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                {t("editProfile")}
              </Text>
              <TouchableOpacity onPress={() => setIsEditProfileModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text, fontSize: scaledFontSize(16) }]}>{t("name")}</Text>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                    fontSize: scaledFontSize(16),
                  },
                ]}
                value={editedName}
                onChangeText={setEditedName}
                placeholder={t("enterName")}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                {t("emailAddress")}
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                    fontSize: scaledFontSize(16),
                  },
                ]}
                value={editedEmail}
                onChangeText={setEditedEmail}
                placeholder={t("enterEmail")}
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveProfile}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>
                    {t("save")}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.background }]}
                onPress={() => setIsEditProfileModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={[styles.modalButtonText, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                {t("selectLanguage")}
              </Text>
              <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.languageList}>
              <TouchableOpacity
                style={[styles.languageItem, locale === "en" && { backgroundColor: `${colors.primary}15` }]}
                onPress={() => handleLanguageChange("en")}
              >
                <Text
                  style={[
                    styles.languageName,
                    { color: locale === "en" ? colors.primary : colors.text, fontSize: scaledFontSize(16) },
                  ]}
                >
                  English
                </Text>
                {locale === "en" && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.languageItem, locale === "sw" && { backgroundColor: `${colors.primary}15` }]}
                onPress={() => handleLanguageChange("sw")}
              >
                <Text
                  style={[
                    styles.languageName,
                    { color: locale === "sw" ? colors.primary : colors.text, fontSize: scaledFontSize(16) },
                  ]}
                >
                  Kiswahili
                </Text>
                {locale === "sw" && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary, marginTop: 16 }]}
              onPress={() => setIsLanguageModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>
                {t("close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Currency Modal */}
      <Modal
        visible={isCurrencyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCurrencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                {t("selectCurrency")}
              </Text>
              <TouchableOpacity onPress={() => setIsCurrencyModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.currencyList}>
              <TouchableOpacity
                style={[styles.currencyItem, currency === "KES" && { backgroundColor: `${colors.primary}15` }]}
                onPress={() => handleCurrencyChange("KES")}
              >
                <Text
                  style={[
                    styles.currencyName,
                    { color: currency === "KES" ? colors.primary : colors.text, fontSize: scaledFontSize(16) },
                  ]}
                >
                  Kenyan Shilling (KES)
                </Text>
                {currency === "KES" && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.currencyItem, currency === "USD" && { backgroundColor: `${colors.primary}15` }]}
                onPress={() => handleCurrencyChange("USD")}
              >
                <Text
                  style={[
                    styles.currencyName,
                    { color: currency === "USD" ? colors.primary : colors.text, fontSize: scaledFontSize(16) },
                  ]}
                >
                  US Dollar (USD)
                </Text>
                {currency === "USD" && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.currencyItem, currency === "EUR" && { backgroundColor: `${colors.primary}15` }]}
                onPress={() => handleCurrencyChange("EUR")}
              >
                <Text
                  style={[
                    styles.currencyName,
                    { color: currency === "EUR" ? colors.primary : colors.text, fontSize: scaledFontSize(16) },
                  ]}
                >
                  Euro (EUR)
                </Text>
                {currency === "EUR" && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary, marginTop: 16 }]}
              onPress={() => setIsCurrencyModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>
                {t("close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Simulation Settings Modal */}
      <Modal
        visible={isSimulationSettingsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSimulationSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Simulation Settings
              </Text>
              <TouchableOpacity onPress={() => setIsSimulationSettingsModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.sliderContainer}>
              <Text style={[styles.sliderLabel, { color: colors.text }]}>Update Interval</Text>
              <Text style={[styles.sliderValue, { color: colors.primary }]}>{updateInterval / 1000} seconds</Text>
              <Slider
                style={styles.slider}
                minimumValue={1000}
                maximumValue={10000}
                step={1000}
                value={updateInterval}
                onValueChange={setUpdateInterval}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
              />
              <View style={styles.sliderLegend}>
                <Text style={{ color: colors.textSecondary }}>Faster (1s)</Text>
                <Text style={{ color: colors.textSecondary }}>Slower (10s)</Text>
              </View>
            </View>

            <View style={styles.sliderContainer}>
              <Text style={[styles.sliderLabel, { color: colors.text }]}>Fluctuation Range</Text>
              <Text style={[styles.sliderValue, { color: colors.primary }]}>{fluctuationRange}%</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                step={1}
                value={fluctuationRange}
                onValueChange={setFluctuationRange}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
              />
              <View style={styles.sliderLegend}>
                <Text style={{ color: colors.textSecondary }}>Subtle (1%)</Text>
                <Text style={{ color: colors.textSecondary }}>Dramatic (20%)</Text>
              </View>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveSimulationSettings}
              >
                <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>
                  Save Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.background }]}
                onPress={() => setIsSimulationSettingsModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                {t("setQuietHours")}
              </Text>
              <TouchableOpacity onPress={() => setIsQuietHoursModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDescription, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {t("quietHoursDescription")}
            </Text>

            <View style={styles.timePickerContainer}>
              <View style={styles.timePickerSection}>
                <Text style={[styles.timePickerLabel, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                  {t("startTime")}
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
                  {t("endTime")}
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
                  {t("save")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.background }]}
                onPress={() => setIsQuietHoursModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                  {t("cancel")}
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
                {t("aboutSmartMita")}
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
                  {t("version")} {appVersion}
                </Text>
              </View>

              <Text style={[styles.aboutText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                {t("aboutDescription")}
              </Text>

              <Text style={[styles.aboutText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                {t("withSmartMita")}
              </Text>

              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    {t("feature1")}
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    {t("feature2")}
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    {t("feature3")}
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    {t("feature4")}
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    {t("feature5")}
                  </Text>
                </View>
              </View>

              <Text style={[styles.copyrightText, { color: colors.textSecondary, fontSize: scaledFontSize(12) }]}>
                © 2025 SmartMita. {t("allRightsReserved")}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary, marginTop: 16 }]}
              onPress={() => setIsAboutModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>
                {t("close")}
              </Text>
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
                {t("privacyPolicy")}
              </Text>
              <TouchableOpacity onPress={() => setIsPrivacyModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.privacyContent}>
              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                {t("introduction")}
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                {t("privacyIntro")}
              </Text>

              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                {t("informationWeCollect")}
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                {t("informationWeCollectText")}
              </Text>

              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                {t("howWeUseYourInformation")}
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                {t("howWeUseYourInformationText")}
              </Text>

              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                {t("dataSecurity")}
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                {t("dataSecurityText")}
              </Text>

              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                {t("changesToThisPolicy")}
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                {t("changesToThisPolicyText")}
              </Text>

              <Text style={[styles.privacyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                {t("contactUs")}
              </Text>
              <Text style={[styles.privacyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                {t("contactUsText")}
              </Text>

              <Text style={[styles.privacyDate, { color: colors.textSecondary, fontSize: scaledFontSize(12) }]}>
                {t("lastUpdated")}: March 25, 2025
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary, marginTop: 16 }]}
              onPress={() => setIsPrivacyModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>
                {t("close")}
              </Text>
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
                {t("helpAndSupport")}
              </Text>
              <TouchableOpacity onPress={() => setIsHelpModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.helpContent}>
              <Text style={[styles.helpTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                {t("frequentlyAskedQuestions")}
              </Text>

              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                  {t("faq1Question")}
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                  {t("faq1Answer")}
                </Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                  {t("faq2Question")}
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                  {t("faq2Answer")}
                </Text>
              </View>

              <View style={styles.faqItem}>
                <Text style={[styles.faqQuestion, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                  {t("faq3Question")}
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                  {t("faq3Answer")}
                </Text>
              </View>

              <Text style={[styles.helpTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                {t("contactSupport")}
              </Text>

              <TouchableOpacity style={[styles.supportButton, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="mail" size={20} color={colors.primary} style={styles.supportButtonIcon} />
                <Text style={[styles.supportButtonText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                  {t("emailSupport")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.supportButton, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="chatbubbles" size={20} color={colors.primary} style={styles.supportButtonIcon} />
                <Text style={[styles.supportButtonText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                  {t("liveChat")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.supportButton, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="call" size={20} color={colors.primary} style={styles.supportButtonIcon} />
                <Text style={[styles.supportButtonText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                  {t("callSupport")}
                </Text>
              </TouchableOpacity>

              <Text style={[styles.supportHours, { color: colors.textSecondary, fontSize: scaledFontSize(12) }]}>
                {t("supportHours")}: Monday-Friday, 8:00 AM - 6:00 PM EAT
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary, marginTop: 16 }]}
              onPress={() => setIsHelpModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>
                {t("close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: `${colors.background}80` }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
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
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  formInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: "Poppins-Regular",
  },
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  languageName: {
    fontFamily: "Poppins-Medium",
  },
  currencyList: {
    maxHeight: 300,
  },
  currencyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  currencyName: {
    fontFamily: "Poppins-Medium",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    marginBottom: 8,
  },
  sliderValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    marginBottom: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
})

