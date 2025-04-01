"use client"

import React from "react"
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"
import { Svg, Line, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg"
import { useResponsive } from "../../hooks/useResponsive"

const { width: screenWidth } = Dimensions.get("window")

interface HouseholdComparisonChartProps {
  householdValue: number
  neighborhoodValue: number
  efficientValue: number
  unit: string
  title?: string
  subtitle?: string
}

export const HouseholdComparisonChart: React.FC<HouseholdComparisonChartProps> = ({
  householdValue,
  neighborhoodValue,
  efficientValue,
  unit,
  title,
  subtitle,
}) => {
  const { colors, isDarkMode } = useTheme()
  const { scaledFontSize, spacing, isSmallScreen, dimensions } = useResponsive()
  const width = dimensions.width

  // Animation values
  const householdAnim = React.useRef(new Animated.Value(0)).current
  const neighborhoodAnim = React.useRef(new Animated.Value(0)).current
  const efficientAnim = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(householdAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(neighborhoodAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(efficientAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start()
  }, [householdValue, neighborhoodValue, efficientValue])

  // Find the maximum value for scaling
  const maxValue = Math.max(householdValue, neighborhoodValue, efficientValue) * 1.2

  // Chart dimensions - responsive
  const chartWidth = width - spacing(8)
  const chartHeight = isSmallScreen ? 180 : 220

  // Calculate bar width based on screen size - thinner bars
  const barWidth = Math.min(chartWidth * 0.12, 30) // Cap at 30px for larger screens
  const barSpacing = (chartWidth - barWidth * 3) / 4
  const barRadius = Math.min(barWidth / 2, 8) // Proportional radius, max 8px

  // Calculate bar heights based on values
  const householdHeight = householdAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (householdValue / maxValue) * (chartHeight - spacing(5))],
  })

  const neighborhoodHeight = neighborhoodAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (neighborhoodValue / maxValue) * (chartHeight - spacing(5))],
  })

  const efficientHeight = efficientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (efficientValue / maxValue) * (chartHeight - spacing(5))],
  })

  // Calculate percentages for comparison
  const householdVsNeighborhood = ((householdValue - neighborhoodValue) / neighborhoodValue) * 100
  const householdVsEfficient = ((householdValue - efficientValue) / efficientValue) * 100

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {title && (
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: scaledFontSize(18),
              marginBottom: spacing(0.5),
            },
          ]}
        >
          {title}
        </Text>
      )}

      {subtitle && (
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
              fontSize: scaledFontSize(14),
              marginBottom: spacing(2.5),
            },
          ]}
        >
          {subtitle}
        </Text>
      )}

      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          <Text style={[styles.axisLabel, { color: colors.textSecondary, fontSize: scaledFontSize(10) }]}>
            {Math.round(maxValue)} {unit}
          </Text>
          <Text style={[styles.axisLabel, { color: colors.textSecondary, fontSize: scaledFontSize(10) }]}>
            {Math.round(maxValue / 2)} {unit}
          </Text>
          <Text style={[styles.axisLabel, { color: colors.textSecondary, fontSize: scaledFontSize(10) }]}>
            0 {unit}
          </Text>
        </View>

        {/* Chart area */}
        <View style={styles.chartArea}>
          {/* Grid lines */}
          <Svg width={chartWidth} height={chartHeight}>
            <Defs>
              <SvgGradient id="yourHomeGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.primary} stopOpacity="1" />
                <Stop offset="1" stopColor={colors.primary} stopOpacity="0.6" />
              </SvgGradient>
              <SvgGradient id="neighborhoodGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.secondary} stopOpacity="1" />
                <Stop offset="1" stopColor={colors.secondary} stopOpacity="0.6" />
              </SvgGradient>
              <SvgGradient id="efficientGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.success} stopOpacity="1" />
                <Stop offset="1" stopColor={colors.success} stopOpacity="0.6" />
              </SvgGradient>
            </Defs>

            {/* Grid lines */}
            <Line
              x1="0"
              y1={chartHeight / 2}
              x2={chartWidth}
              y2={chartHeight / 2}
              stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              strokeDasharray="5,5"
            />
            <Line
              x1="0"
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            />
          </Svg>

          {/* Bars */}
          <View style={styles.barsContainer}>
            {/* Your Home Bar */}
            <View style={styles.barGroup}>
              <View style={styles.barLabelContainer}>
                <Animated.View
                  style={[
                    styles.barValueLabel,
                    {
                      backgroundColor: colors.primary,
                      opacity: householdAnim,
                      transform: [
                        {
                          translateY: householdAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                      paddingHorizontal: spacing(1),
                      paddingVertical: spacing(0.25),
                      borderRadius: spacing(1.5),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.barValueText,
                      {
                        color: colors.white,
                        fontSize: scaledFontSize(11),
                      },
                    ]}
                  >
                    {householdValue.toFixed(1)}
                  </Text>
                </Animated.View>
              </View>
              <View style={styles.barWrapper}>
                <Animated.View
                  style={[
                    styles.barBackground,
                    {
                      backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      height: chartHeight - spacing(5),
                      width: barWidth,
                      borderRadius: barRadius,
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: householdHeight,
                      width: barWidth,
                      borderRadius: barRadius,
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[colors.primary, `${colors.primary}90`]}
                    style={[styles.barGradient, { borderRadius: barRadius }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                </Animated.View>
              </View>
              <Text
                style={[
                  styles.barLabel,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(12),
                    marginTop: spacing(1),
                  },
                ]}
              >
                Your Home
              </Text>
            </View>

            {/* Neighborhood Bar */}
            <View style={styles.barGroup}>
              <View style={styles.barLabelContainer}>
                <Animated.View
                  style={[
                    styles.barValueLabel,
                    {
                      backgroundColor: colors.secondary,
                      opacity: neighborhoodAnim,
                      transform: [
                        {
                          translateY: neighborhoodAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                      paddingHorizontal: spacing(1),
                      paddingVertical: spacing(0.25),
                      borderRadius: spacing(1.5),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.barValueText,
                      {
                        color: colors.white,
                        fontSize: scaledFontSize(11),
                      },
                    ]}
                  >
                    {neighborhoodValue.toFixed(1)}
                  </Text>
                </Animated.View>
              </View>
              <View style={styles.barWrapper}>
                <Animated.View
                  style={[
                    styles.barBackground,
                    {
                      backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      height: chartHeight - spacing(5),
                      width: barWidth,
                      borderRadius: barRadius,
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: neighborhoodHeight,
                      width: barWidth,
                      borderRadius: barRadius,
                      backgroundColor: colors.secondary,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[colors.secondary, `${colors.secondary}90`]}
                    style={[styles.barGradient, { borderRadius: barRadius }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                </Animated.View>
              </View>
              <Text
                style={[
                  styles.barLabel,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(12),
                    marginTop: spacing(1),
                  },
                ]}
              >
                Neighborhood
              </Text>
            </View>

            {/* Efficient Homes Bar */}
            <View style={styles.barGroup}>
              <View style={styles.barLabelContainer}>
                <Animated.View
                  style={[
                    styles.barValueLabel,
                    {
                      backgroundColor: colors.success,
                      opacity: efficientAnim,
                      transform: [
                        {
                          translateY: efficientAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                      paddingHorizontal: spacing(1),
                      paddingVertical: spacing(0.25),
                      borderRadius: spacing(1.5),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.barValueText,
                      {
                        color: colors.white,
                        fontSize: scaledFontSize(11),
                      },
                    ]}
                  >
                    {efficientValue.toFixed(1)}
                  </Text>
                </Animated.View>
              </View>
              <View style={styles.barWrapper}>
                <Animated.View
                  style={[
                    styles.barBackground,
                    {
                      backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      height: chartHeight - spacing(5),
                      width: barWidth,
                      borderRadius: barRadius,
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: efficientHeight,
                      width: barWidth,
                      borderRadius: barRadius,
                      backgroundColor: colors.success,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[colors.success, `${colors.success}90`]}
                    style={[styles.barGradient, { borderRadius: barRadius }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                </Animated.View>
              </View>
              <Text
                style={[
                  styles.barLabel,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(12),
                    marginTop: spacing(1),
                  },
                ]}
              >
                Efficient
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Comparison insights */}
      <View style={[styles.insightsContainer, { marginTop: spacing(1.5) }]}>
        <View
          style={[
            styles.insightBadge,
            {
              backgroundColor: householdVsNeighborhood < 0 ? `${colors.success}15` : `${colors.error}15`,
              borderColor: householdVsNeighborhood < 0 ? `${colors.success}30` : `${colors.error}30`,
              paddingHorizontal: spacing(1.5),
              paddingVertical: spacing(0.75),
              borderRadius: spacing(2),
              marginHorizontal: spacing(0.5),
              marginBottom: spacing(1),
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.insightText,
              {
                color: householdVsNeighborhood < 0 ? colors.success : colors.error,
                fontSize: scaledFontSize(11),
              },
            ]}
          >
            {Math.abs(householdVsNeighborhood).toFixed(0)}% {householdVsNeighborhood < 0 ? "less than" : "more than"}{" "}
            neighborhood
          </Text>
        </View>

        <View
          style={[
            styles.insightBadge,
            {
              backgroundColor: householdVsEfficient < 0 ? `${colors.success}15` : `${colors.error}15`,
              borderColor: householdVsEfficient < 0 ? `${colors.success}30` : `${colors.error}30`,
              paddingHorizontal: spacing(1.5),
              paddingVertical: spacing(0.75),
              borderRadius: spacing(2),
              marginHorizontal: spacing(0.5),
              marginBottom: spacing(1),
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.insightText,
              {
                color: householdVsEfficient < 0 ? colors.success : colors.error,
                fontSize: scaledFontSize(11),
              },
            ]}
          >
            {Math.abs(householdVsEfficient).toFixed(0)}% {householdVsEfficient < 0 ? "less than" : "more than"}{" "}
            efficient homes
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
  },
  chartContainer: {
    flexDirection: "row",
  },
  yAxisLabels: {
    width: 50,
    height: "100%",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 8,
    paddingVertical: 10,
  },
  axisLabel: {
    fontFamily: "Poppins-Regular",
  },
  chartArea: {
    flex: 1,
    height: "100%",
  },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
  },
  barGroup: {
    alignItems: "center",
    width: "30%",
  },
  barLabelContainer: {
    height: 24,
    marginBottom: 4,
    alignItems: "center",
  },
  barValueLabel: {
    alignItems: "center",
  },
  barValueText: {
    fontFamily: "Poppins-Medium",
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  barBackground: {
    position: "absolute",
    bottom: 0,
  },
  bar: {
    position: "absolute",
    bottom: 0,
    overflow: "hidden",
  },
  barGradient: {
    width: "100%",
    height: "100%",
  },
  barLabel: {
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  insightsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  insightBadge: {
    marginHorizontal: 4,
  },
  insightText: {
    fontFamily: "Poppins-Medium",
  },
})

