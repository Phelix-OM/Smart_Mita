"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { BarChart } from "react-native-chart-kit"
import { useTheme } from "../../contexts/ThemeContext"
import { useResponsive } from "../../hooks/useResponsive"

type HouseholdComparisonChartProps = {
  householdValue: number
  neighborhoodValue: number
  efficientValue: number
  unit?: string
  title?: string
  subtitle?: string
}

export const HouseholdComparisonChart: React.FC<HouseholdComparisonChartProps> = ({
  householdValue,
  neighborhoodValue,
  efficientValue,
  unit = "kWh",
  title = "Household Comparison",
  subtitle = "Your energy usage compared to others",
}) => {
  const { colors, isDarkMode } = useTheme()
  const { dimensions, scaledFontSize, isSmallScreen } = useResponsive()

  // Prepare data for the chart
  const data = {
    labels: ["Your Home", "Neighborhood", "Efficient"],
    datasets: [
      {
        data: [householdValue, neighborhoodValue, efficientValue],
        colors: [() => colors.primary, () => colors.secondary, () => colors.tertiary],
      },
    ],
  }

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 1,
    color: (opacity = 1, index = 0) => {
      const colorList = [colors.primary, colors.secondary, colors.tertiary]
      return colorList[index] || colors.primary
    },
    labelColor: () => colors.text,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
    propsForBackgroundLines: {
      stroke: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    },
  }

  // Calculate chart width based on screen size
  const chartWidth = dimensions.width - (isSmallScreen ? 40 : 60)

  // Calculate percentage differences
  const householdVsNeighborhood = (((neighborhoodValue - householdValue) / neighborhoodValue) * 100).toFixed(1)
  const householdVsEfficient = (((efficientValue - householdValue) / efficientValue) * 100).toFixed(1)

  const isMoreEfficient = householdValue < neighborhoodValue

  return (
    <View style={styles.container}>
      {title && <Text style={[styles.title, { color: colors.text, fontSize: scaledFontSize(18) }]}>{title}</Text>}

      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>{subtitle}</Text>
      )}

      <View
        style={[
          styles.chartContainer,
          { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginVertical: 16 },
        ]}
      >
        <BarChart
          data={data}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisSuffix={` ${unit}`}
          fromZero
          showValuesOnTopOfBars
          withInnerLines={true}
        />
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.text, fontSize: scaledFontSize(14) }]}>Your Home</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.secondary }]} />
          <Text style={[styles.legendText, { color: colors.text, fontSize: scaledFontSize(14) }]}>Neighborhood</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.tertiary }]} />
          <Text style={[styles.legendText, { color: colors.text, fontSize: scaledFontSize(14) }]}>Efficient Homes</Text>
        </View>
      </View>

      <View
        style={[
          styles.insightCard,
          {
            backgroundColor: isMoreEfficient ? `${colors.success}15` : `${colors.warning}15`,
            borderRadius: 12,
            padding: 16,
            marginTop: 16,
          },
        ]}
      >
        <View style={styles.insightHeader}>
          <View
            style={[
              styles.insightIconContainer,
              { backgroundColor: isMoreEfficient ? colors.success : colors.warning },
            ]}
          >
            <Text style={[styles.insightIcon, { color: colors.white }]}>{isMoreEfficient ? "👍" : "💡"}</Text>
          </View>
          <Text style={[styles.insightTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
            {isMoreEfficient ? "Great job! You're doing better than average" : "There's room for improvement"}
          </Text>
        </View>

        <Text style={[styles.insightText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
          {isMoreEfficient
            ? `Your home is using ${Math.abs(Number(householdVsNeighborhood))}% less energy than the average home in your neighborhood.`
            : `Your home is using ${Math.abs(Number(householdVsNeighborhood))}% more energy than the average home in your neighborhood.`}
        </Text>

        <Text style={[styles.insightText, { color: colors.text, fontSize: scaledFontSize(14), marginTop: 8 }]}>
          {`The most efficient homes in your area use ${Math.abs(Number(householdVsEfficient))}% ${householdValue < efficientValue ? "less" : "more"} energy than your home.`}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
  },
  chartContainer: {
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontFamily: "Poppins-Regular",
  },
  insightCard: {
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  insightIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  insightIcon: {
    fontSize: 16,
  },
  insightTitle: {
    fontFamily: "Poppins-Medium",
    flex: 1,
  },
  insightText: {
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
})

