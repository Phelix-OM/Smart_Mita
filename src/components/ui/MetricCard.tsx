"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "../../contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"
import { useUtility } from "../../contexts/UtilityContext"

type MetricCardProps = {
  title: string
  value: string
  unit: string
  subtitle: string
  icon: React.ReactNode
  changePercentage?: number
  changeText?: string
  isCurrency?: boolean
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  changePercentage,
  changeText,
  isCurrency = false,
}) => {
  const { colors } = useTheme()
  const { currency } = useUtility()
  const { scaledFontSize, spacing, isSmallScreen } = useResponsive()

  const isPositiveChange = changePercentage && changePercentage > 0
  const isNegativeChange = changePercentage && changePercentage < 0

  // Format currency if needed
  const formattedValue = isCurrency ? `${currency} ${Number.parseFloat(value).toLocaleString()}` : value

  return (
    <LinearGradient
      colors={[colors.cardGradientStart, colors.cardGradientEnd]}
      style={[
        styles.container,
        {
          borderColor: colors.border,
          padding: spacing(2),
          borderRadius: spacing(2),
        },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
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
        <View style={styles.iconContainer}>{icon}</View>
      </View>
      <View style={styles.valueContainer}>
        <Text
          style={[
            styles.value,
            {
              color: colors.text,
              fontSize: scaledFontSize(28),
            },
          ]}
        >
          {isCurrency ? formattedValue : `${formattedValue} `}
          {!isCurrency && (
            <Text style={[styles.unit, { color: colors.textSecondary, fontSize: scaledFontSize(16) }]}>{unit}</Text>
          )}
        </Text>
      </View>
      <Text
        style={[
          styles.subtitle,
          {
            color: colors.textSecondary,
            fontSize: scaledFontSize(14),
          },
        ]}
      >
        {subtitle}
      </Text>
      {changePercentage !== undefined && (
        <View style={styles.changeContainer}>
          {isPositiveChange && <Ionicons name="arrow-up" size={14} color={colors.increase} style={styles.changeIcon} />}
          {isNegativeChange && (
            <Ionicons name="arrow-down" size={14} color={colors.decrease} style={styles.changeIcon} />
          )}
          <Text
            style={[
              styles.changeText,
              {
                color: isPositiveChange ? colors.increase : isNegativeChange ? colors.decrease : colors.textSecondary,
                fontSize: scaledFontSize(14),
              },
            ]}
          >
            {isPositiveChange ? "+" : ""}
            {changePercentage}% {changeText || ""}
          </Text>
        </View>
      )}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontFamily: "Poppins-Medium",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  valueContainer: {
    marginBottom: 4,
  },
  value: {
    fontFamily: "Poppins-Bold",
  },
  unit: {
    fontFamily: "Poppins-Regular",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  changeIcon: {
    marginRight: 4,
  },
  changeText: {
    fontFamily: "Poppins-Medium",
  },
})

