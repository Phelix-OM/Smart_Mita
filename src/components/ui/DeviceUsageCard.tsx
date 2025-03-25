"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"

type DeviceUsageProps = {
  deviceName: string
  usagePercentage: number
  usageValue: number
  usageUnit: string
  iconName: string
  color?: string
}

export const DeviceUsageCard: React.FC<DeviceUsageProps> = ({
  deviceName,
  usagePercentage,
  usageValue,
  usageUnit,
  iconName,
  color,
}) => {
  const { colors } = useTheme()
  const { scaledFontSize, spacing, isSmallScreen } = useResponsive()
  const deviceColor = color || colors.primary

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          padding: spacing(2),
          borderRadius: spacing(1.5),
          marginBottom: spacing(1.5),
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${deviceColor}20`,
              width: isSmallScreen ? 32 : 36,
              height: isSmallScreen ? 32 : 36,
              borderRadius: isSmallScreen ? 16 : 18,
            },
          ]}
        >
          <Ionicons name={iconName} size={isSmallScreen ? 18 : 20} color={deviceColor} />
        </View>
        <View style={styles.deviceInfo}>
          <Text
            style={[
              styles.deviceName,
              {
                color: colors.text,
                fontSize: scaledFontSize(16),
              },
            ]}
          >
            {deviceName}
          </Text>
          <Text
            style={[
              styles.usageValue,
              {
                color: colors.textSecondary,
                fontSize: scaledFontSize(13),
              },
            ]}
          >
            {usageValue} {usageUnit}
          </Text>
        </View>
        <Text
          style={[
            styles.percentage,
            {
              color: deviceColor,
              fontSize: scaledFontSize(16),
            },
          ]}
        >
          {usagePercentage}%
        </Text>
      </View>
      <View
        style={[
          styles.progressBarContainer,
          {
            backgroundColor: `${deviceColor}20`,
            height: isSmallScreen ? 6 : 8,
            borderRadius: isSmallScreen ? 3 : 4,
          },
        ]}
      >
        <View style={[styles.progressBar, { width: `${usagePercentage}%`, backgroundColor: deviceColor }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  usageValue: {
    fontFamily: "Poppins-Regular",
  },
  percentage: {
    fontFamily: "Poppins-Bold",
  },
  progressBarContainer: {
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
})

