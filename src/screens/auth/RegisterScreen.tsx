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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native"
import { useAuth } from "../../contexts/AuthContext"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"

export default function RegisterScreen() {
  const { register } = useAuth()
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { scaledFontSize, spacing } = useResponsive()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const validateForm = () => {
    let isValid = true

    // Name validation
    if (!name) {
      setNameError(t("requiredField"))
      isValid = false
    } else {
      setNameError("")
    }

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
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      isValid = false
    } else {
      setPasswordError("")
    }

    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError(t("requiredField"))
      isValid = false
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t("passwordMismatch"))
      isValid = false
    } else {
      setConfirmPasswordError("")
    }

    return isValid
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const success = await register(name, email, password)
      if (success) {
        navigation.navigate("UtilityConnection" as never)
      } else {
        Alert.alert(t("errorOccurred"), t("tryAgainLater"))
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
            source={require("@/assets/images/logo.png")}
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
        </View>

        <Text style={[styles.title, { color: colors.text, fontSize: scaledFontSize(24) }]}>{t("register")}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: scaledFontSize(16) }]}>
          Create an account to get started
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text, fontSize: scaledFontSize(16) }]}>{t("fullName")}</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: nameError ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, fontSize: scaledFontSize(16) }]}
                placeholder={t("fullName")}
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>
            {nameError ? (
              <Text style={[styles.errorText, { color: colors.error, fontSize: scaledFontSize(14) }]}>{nameError}</Text>
            ) : null}
          </View>

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

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("confirmPassword")}
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: confirmPasswordError ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, fontSize: scaledFontSize(16) }]}
                placeholder={t("confirmPassword")}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={[styles.errorText, { color: colors.error, fontSize: scaledFontSize(14) }]}>
                {confirmPasswordError}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                height: spacing(7),
                borderRadius: spacing(1.5),
              },
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.white, fontSize: scaledFontSize(16) }]}>
                {t("signUp")}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("haveAccount")}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
              <Text style={[styles.loginLink, { color: colors.primary, fontSize: scaledFontSize(16) }]}>
                {t("signIn")}
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
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  title: {
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
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
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontFamily: "Poppins-Regular",
    marginRight: 4,
  },
  loginLink: {
    fontFamily: "Poppins-Medium",
  },
})

