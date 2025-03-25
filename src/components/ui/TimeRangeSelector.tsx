"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { useResponsive } from "../../hooks/useResponsive"

type TimeRange = "day" | "week" | "month" | "year"

type TimeRangeSelectorProps = {
  selectedRange: TimeRange
  onRangeChange: (range: TimeRange) => void
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ selectedRange, onRangeChange }) => {
  const { colors } = useTheme()
  const { isSmallScreen, scaledFontSize, spacing } = useResponsive()

  const ranges: { key: TimeRange; label: string }[] = [
    { key: "day", label: "Day" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
  ]

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.scrollContainer, { backgroundColor: colors.background }]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {ranges.map((range) => (
          <TouchableOpacity
            key={range.key}
            style={[
              styles.rangeButton,
              {
                paddingVertical: spacing(1),
                paddingHorizontal: spacing(1.5),
                marginRight: spacing(0.5),
              },
              selectedRange === range.key && [styles.selectedRange, { backgroundColor: colors.primary }],
            ]}
            onPress={() => onRangeChange(range.key)}
          >
            <Text
              style={[
                styles.rangeText,
                {
                  color: selectedRange === range.key ? colors.white : colors.textSecondary,
                  fontSize: scaledFontSize(isSmallScreen ? 12 : 14),
                },
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 0,
  },
  container: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  rangeButton: {
    borderRadius: 6,
    alignItems: "center",
  },
  selectedRange: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  rangeText: {
    fontFamily: "Poppins-Medium",
  },
})

