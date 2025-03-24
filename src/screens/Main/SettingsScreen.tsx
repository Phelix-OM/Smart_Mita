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
  ActivityIndicator
} from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import { useLanguage } from "../../contexts/LanguageContext"
import { useNotification } from "../../contexts/NotificationContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SettingsScreen() {
  const { t } = useTranslation()
  const { colors, isDarkMode, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const { locale, setLocale } = useLanguage()
  const { settings, updateSettings } = useNotification()
  const { scaledFontSize, spacing } = useResponsive()
  
  const [isLoading, setIsLoading] = useState(false)
  const [currency, setCurrency] = useState("KES")
  const [temperatureUnit, setTemperatureUnit] = useState("celsius")
  const [energyUnit, setEnergyUnit] = useState("kWh")

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

  const handleTemperatureUnitChange = () => {
    Alert.alert(
      "Temperature Unit",
      "Select your preferred temperature unit",
      [
        {
          text: "Celsius (°C)",
          onPress: () => setTemperatureUnit("celsius"),
        },
        {
          text: "Fahrenheit (°F)",
          onPress: () => setTemperatureUnit("fahrenheit"),
        },
        {
          text: t("cancel"),
          style: "cancel",
        },
      ],
      { cancelable: true },
    )
  }

  const handleEnergyUnitChange = () => {
    Alert.alert(
      "Energy Unit",
      "Select your preferred energy unit",
      [
        {
          text: "Kilowatt-hour (kWh)",
          onPress: () => setEnergyUnit("kWh"),
        },
        {
          text: "Megajoule (MJ)",
          onPress: () => setEnergyUnit("MJ"),
        },
        {
          text: t("cancel"),
          style: "cancel",
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
          onPress: () => {
            setIsLoading(true)
            // Simulate clearing data
            setTimeout(() => {
              setIsLoading(false)
              Alert.alert("Success", "App data has been cleared successfully")
            }, 1500)
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  const handleExportData = () => {
    setIsLoading(true)
    // Simulate exporting data
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert(
        "Data Exported",
        "Your energy consumption data has been exported successfully. You can find the file in your downloads folder."
      )
    }, 1500)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: scaledFontSize(24) }]}>
          Settings
        </Text>
      </View>
      
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
          App Preferences
        </Text>

        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]} 
          onPress={handleLanguageChange}
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
          onPress={handleCurrencyChange}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="cash-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Currency
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
              Temperature Unit
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {temperatureUnit === "celsius" ? "Celsius (°C)" : "Fahrenheit (°F)"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
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
              Energy Unit
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
              {energyUnit}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[
          styles.sectionTitle, 
          { 
            color: colors.text, 
            marginTop: spacing(3),
            fontSize: scaledFontSize(18)
          }
        ]}>
          {t("notificationSettings")}
        </Text>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Push Notifications
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

        <Text style={[
          styles.sectionTitle, 
          { 
            color: colors.text, 
            marginTop: spacing(3),
            fontSize: scaledFontSize(18)
          }
        ]}>
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
            <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              Export Data
            </Text>
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

        <TouchableOpacity
          style={[
            styles.logoutButton, 
            { 
              backgroundColor: colors.error + "10",
              marginTop: spacing(3),
              padding: spacing(2),
              borderRadius: spacing(1.5),
            }
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error, fontSize: scaledFontSize(16) }]}>
            {t("logout")}
          </Text>
        </TouchableOpacity>
        
        <View style={{ height: 20 }} />
      </ScrollView>
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
  }
})
