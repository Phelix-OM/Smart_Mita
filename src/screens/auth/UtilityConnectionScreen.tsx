"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, TextInput } from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useUtility } from "../../contexts/UtilityContext"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export default function UtilityConnectionScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { availableUtilities, connectUtility } = useUtility()
  const navigation = useNavigation()

  const [selectedUtility, setSelectedUtility] = useState<string | null>(null)
  const [accountNumber, setAccountNumber] = useState("")
  const [meterNumber, setMeterNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [accountError, setAccountError] = useState("")
  const [meterError, setMeterError] = useState("")

  const validateForm = () => {
    let isValid = true

    if (!accountNumber) {
      setAccountError("Account number is required")
      isValid = false
    } else {
      setAccountError("")
    }

    if (!meterNumber) {
      setMeterError("Meter number is required")
      isValid = false
    } else {
      setMeterError("")
    }

    return isValid
  }

  const handleConnect = async () => {
    if (!selectedUtility || !validateForm()) return

    setIsLoading(true)
    try {
      const success = await connectUtility(selectedUtility, accountNumber, meterNumber)
      if (success) {
        setIsConnected(true)
      } else {
        // Show error
      }
    } catch (error) {
      console.error("Failed to connect utility:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" as never }],
    })
  }

  const renderUtilityItem = ({ item }: { item: (typeof availableUtilities)[0] }) => (
    <TouchableOpacity
      style={[
        styles.utilityItem,
        {
          backgroundColor: colors.card,
          borderColor: selectedUtility === item.id ? colors.primary : colors.border,
          borderWidth: selectedUtility === item.id ? 2 : 1,
          transform: selectedUtility === item.id ? [{ scale: 1.02 }] : [],
        },
      ]}
      onPress={() => setSelectedUtility(item.id)}
    >
      <View style={[styles.utilityLogoContainer, { backgroundColor: `${colors.primary}10` }]}>
        <Image source={{ uri: item.logo }} style={styles.utilityLogo} resizeMode="contain" />
      </View>
      <View style={styles.utilityInfo}>
        <Text style={[styles.utilityName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.utilityCountry, { color: colors.textSecondary }]}>{item.country}</Text>
        <View style={styles.featuresContainer}>
          {item.supportedFeatures.includes("real-time") && (
            <View style={[styles.featureTag, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={[styles.featureText, { color: colors.primary }]}>Real-time</Text>
            </View>
          )}
          {item.supportedFeatures.includes("neighborhood-comparison") && (
            <View style={[styles.featureTag, { backgroundColor: `${colors.tertiary}15` }]}>
              <Text style={[styles.featureText, { color: colors.tertiary }]}>Comparison</Text>
            </View>
          )}
        </View>
      </View>
      {selectedUtility === item.id && (
        <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
          <Ionicons name="checkmark" size={16} color={colors.white} />
        </View>
      )}
    </TouchableOpacity>
  )

  if (isConnected) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={[styles.successContainer, { borderColor: colors.border }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.successIcon, { backgroundColor: `${colors.success}20` }]}>
            <Ionicons name="checkmark-circle" size={64} color={colors.white} />
          </View>
          <Text style={[styles.successTitle, { color: colors.white }]}>{t("utilityConnected")}</Text>
          <Text style={[styles.successDescription, { color: colors.white }]}>
            You can now start tracking your energy consumption and get personalized insights to save energy and reduce
            your bills.
          </Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.white }]} onPress={handleContinue}>
            <Text style={[styles.buttonText, { color: colors.primary }]}>Continue to Dashboard</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Connect Your Utility Provider</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Link your utility account to get real-time energy data and personalized insights
      </Text>

      <FlatList
        data={availableUtilities}
        renderItem={renderUtilityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.utilityList}
      />

      {selectedUtility && (
        <LinearGradient
          colors={[colors.cardGradientStart, colors.cardGradientEnd]}
          style={[styles.formContainer, { borderColor: colors.border }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.formTitle, { color: colors.text }]}>Account Details</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Account Number</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: accountError ? colors.error : colors.border,
                },
              ]}
              placeholder="Enter your account number"
              placeholderTextColor={colors.textSecondary}
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
            {accountError ? <Text style={[styles.errorText, { color: colors.error }]}>{accountError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Meter Number</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: meterError ? colors.error : colors.border,
                },
              ]}
              placeholder="Enter your meter number"
              placeholderTextColor={colors.textSecondary}
              value={meterNumber}
              onChangeText={setMeterNumber}
            />
            {meterError ? <Text style={[styles.errorText, { color: colors.error }]}>{meterError}</Text> : null}
          </View>
        </LinearGradient>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: selectedUtility ? colors.primary : colors.primary + "50",
              opacity: selectedUtility ? 1 : 0.7,
            },
          ]}
          onPress={handleConnect}
          disabled={!selectedUtility || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.white }]}>{t("connectAccount")}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipContainer} onPress={handleContinue}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 24,
  },
  utilityList: {
    paddingBottom: 20,
  },
  utilityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  utilityLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    padding: 8,
  },
  utilityLogo: {
    width: 44,
    height: 44,
  },
  utilityInfo: {
    flex: 1,
  },
  utilityName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 2,
  },
  utilityCountry: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  featureTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  featureText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  formContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 10,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 6,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 20,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  skipContainer: {
    alignItems: "center",
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  successDescription: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
})

