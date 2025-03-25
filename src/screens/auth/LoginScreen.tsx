"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useAuth } from "../../contexts/AuthContext"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"

export default function LoginScreen() {
  const { login } = useAuth()
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { scaledFontSize, spacing, isSmallScreen } = useResponsive()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = () => {
    let isValid = true

    // Email validation
    if (!email) {
      setEmailError(t("requiredField"))
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t("invalidEmail"))
      isValid = false
    } else {
      setEmailError("")
    }

    // Password validation
    if (!password) {
      setPasswordError(t("requiredField"))
      isValid = false
    } else {
      setPasswordError("")
    }

    return isValid
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (!success) {
        Alert.alert(t("errorOccurred"), t("invalidCredentials"))
      }
    } catch (error) {
      Alert.alert(t("errorOccurred"), t("tryAgainLater"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={[
              styles.logo,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              },
            ]}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: colors.primary, fontSize: scaledFontSize(28) }]}>SmartMita</Text>
        </View>

        <Text style={[styles.title, { color: colors.text, fontSize: scaledFontSize(24) }]}>{t("login")}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: scaledFontSize(16) }]}>
          Welcome back! Please enter your details
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text, fontSize: scaledFontSize(16) }]}>{t("email")}</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: emailError ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, fontSize: scaledFontSize(16) }]}
                placeholder={t("email")}
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {emailError ? (
              <Text style={[styles.errorText, { color: colors.error, fontSize: scaledFontSize(14) }]}>
                {emailError}
              </Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text, fontSize: scaledFontSize(16) }]}>{t("password")}</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: passwordError ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, fontSize: scaledFontSize(16) }]}
                placeholder={t("password")}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={[styles.errorText, { color: colors.error, fontSize: scaledFontSize(14) }]}>
                {passwordError}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword" as never)}
            style={styles.forgotPasswordContainer}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
              {t("forgotPassword")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                height: spacing(7),
                borderRadius: spacing(1.5),
              },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>
                {t("signIn")}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("noAccount")}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}>
              <Text style={[styles.registerLink, { color: colors.primary, fontSize: scaledFontSize(16) }]}>
                {t("signUp")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    borderRadius: 20,
  },
  appName: {
    fontFamily: "Poppins-Bold",
    letterSpacing: 1,
  },
  title: {
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    marginBottom: 32,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: "Poppins-Regular",
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: "Poppins-Medium",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  registerText: {
    fontFamily: "Poppins-Regular",
    marginRight: 4,
  },
  registerLink: {
    fontFamily: "Poppins-Medium",
  },
})

