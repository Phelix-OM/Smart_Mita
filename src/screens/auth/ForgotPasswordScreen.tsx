"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useNavigation } from "@react-navigation/native"
import Ionicons from "react-native-vector-icons/Ionicons"

export default function ForgotPasswordScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

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

    return isValid
  }

  const handleResetPassword = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // In a real app, you would make an API call to your backend
      // This is just a mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (error) {
      Alert.alert(t("errorOccurred"), t("tryAgainLater"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!isSubmitted ? (
        <>
          <Text style={[styles.title, { color: colors.text }]}>{t("resetPassword")}</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t("email")}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: emailError ? colors.error : colors.border,
                  },
                ]}
                placeholder={t("email")}
                placeholderTextColor={colors.text + "80"}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {emailError ? <Text style={[styles.errorText, { color: colors.error }]}>{emailError}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.white }]}>{t("resetPassword")}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
              <Text style={[styles.backText, { color: colors.primary }]}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.successContainer}>
          <Ionicons name="mail-outline" size={64} color={colors.primary} />
          <Text style={[styles.successTitle, { color: colors.text }]}>Check Your Email</Text>
          <Text style={[styles.successDescription, { color: colors.text }]}>
            We've sent password reset instructions to {email}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("Login" as never)}
          >
            <Text style={[styles.buttonText, { color: colors.white }]}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
  backContainer: {
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginTop: 24,
    marginBottom: 16,
  },
  successDescription: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 32,
  },
})

