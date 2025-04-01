"use client"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { useLanguage } from "../contexts/LanguageContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { useTheme } from "../contexts/ThemeContext"

export default function LanguageSelectionScreen() {
  const { setLocale, i18n } = useLanguage()
  const { colors } = useTheme()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.appName, { color: colors.primary }]}>Smartmita</Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{i18n.t("languageSelection")}</Text>

      <View style={styles.languageOptions}>
        <TouchableOpacity
          style={[styles.languageButton, { backgroundColor: colors.card }]}
          onPress={() => setLocale("en")}
        >
          <Text style={[styles.languageText, { color: colors.text }]}>{i18n.t("english")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.languageButton, { backgroundColor: colors.card }]}
          onPress={() => setLocale("sw")}
        >
          <Text style={[styles.languageText, { color: colors.text }]}>{i18n.t("swahili")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Medium",
    marginBottom: 40,
    textAlign: "center",
  },
  languageOptions: {
    width: "100%",
    maxWidth: 300,
  },
  languageButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  languageText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
})

