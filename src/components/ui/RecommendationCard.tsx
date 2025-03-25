"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"

type RecommendationProps = {
  title: string
  description: string
  savingsAmount: number
  savingsUnit: string
  iconName: string
  onImplement: () => void
}

export const RecommendationCard: React.FC<RecommendationProps> = ({
  title,
  description,
  savingsAmount,
  savingsUnit,
  iconName,
  onImplement,
}) => {
  const { colors } = useTheme()
  const { scaledFontSize, spacing, isSmallScreen } = useResponsive()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          padding: spacing(2),
          borderRadius: spacing(2),
          marginBottom: spacing(2),
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${colors.tertiary}20`,
              width: isSmallScreen ? 40 : 48,
              height: isSmallScreen ? 40 : 48,
              borderRadius: isSmallScreen ? 20 : 24,
            },
          ]}
        >
          <Ionicons name={iconName} size={isSmallScreen ? 20 : 24} color={colors.tertiary} />
        </View>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: scaledFontSize(16),
              },
            ]}
          >
            {title}
          </Text>
          <View style={styles.savingsContainer}>
            <Ionicons name="flash" size={14} color={colors.tertiary} style={styles.savingsIcon} />
            <Text
              style={[
                styles.savingsText,
                {
                  color: colors.tertiary,
                  fontSize: scaledFontSize(14),
                },
              ]}
            >
              Save up to {savingsAmount} {savingsUnit}
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={[
          styles.description,
          {
            color: colors.textSecondary,
            fontSize: scaledFontSize(14),
            marginBottom: spacing(2),
          },
        ]}
      >
        {description}
      </Text>
      <TouchableOpacity
        style={[
          styles.implementButton,
          {
            backgroundColor: `${colors.tertiary}20`,
            paddingVertical: spacing(1),
            paddingHorizontal: spacing(2),
            borderRadius: spacing(1),
          },
        ]}
        onPress={onImplement}
      >
        <Text
          style={[
            styles.implementButtonText,
            {
              color: colors.tertiary,
              fontSize: scaledFontSize(14),
            },
          ]}
        >
          Implement
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.5,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    marginBottom: 12,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  savingsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  savingsIcon: {
    marginRight: 4,
  },
  savingsText: {
    fontFamily: "Poppins-Medium",
  },
  description: {
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
  implementButton: {
    alignSelf: "flex-start",
  },
  implementButtonText: {
    fontFamily: "Poppins-Medium",
  },
})

