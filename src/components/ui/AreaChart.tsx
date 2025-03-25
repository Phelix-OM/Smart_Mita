"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { useTheme } from "../../contexts/ThemeContext"
import { useResponsive } from "../../hooks/useResponsive"

type AreaChartProps = {
  data: number[]
  labels: string[]
  height?: number
  yAxisSuffix?: string
  yAxisInterval?: number
  chartTitle?: string
  chartDescription?: string
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  labels,
  height = 220,
  yAxisSuffix = "",
  yAxisInterval = 1,
  chartTitle,
  chartDescription,
}) => {
  const { colors, isDarkMode } = useTheme()
  const { dimensions, scaledFontSize, isSmallScreen } = useResponsive()

  // Adjust labels for small screens
  const adjustedLabels = isSmallScreen
    ? labels.filter((_, i) => i % 2 === 0) // Show every other label on small screens
    : labels

  const chartData = {
    labels: adjustedLabels,
    datasets: [
      {
        data,
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  }

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: () => colors.primary,
    labelColor: () => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: isSmallScreen ? "3" : "4",
      strokeWidth: "2",
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      stroke: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    },
    fillShadowGradient: colors.chartBlue,
    fillShadowGradientOpacity: 0.6,
    // Adjust font size for small screens
    labelFontSize: isSmallScreen ? 10 : 12,
  }

  return (
    <View style={styles.container}>
      {chartTitle && (
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: scaledFontSize(18),
            },
          ]}
        >
          {chartTitle}
        </Text>
      )}
      {chartDescription && (
        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
              fontSize: scaledFontSize(14),
            },
          ]}
        >
          {chartDescription}
        </Text>
      )}
      <LineChart
        data={chartData}
        width={dimensions.width - (isSmallScreen ? 40 : 60)}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix={yAxisSuffix}
        yAxisInterval={yAxisInterval}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  description: {
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    paddingRight: 16,
  },
})

