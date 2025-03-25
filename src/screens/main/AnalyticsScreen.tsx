"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useUtility } from "../../contexts/UtilityContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"
import { SafeAreaView } from "react-native-safe-area-context"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import { TimeRangeSelector } from "../../components/ui/TimeRangeSelector"

type TimeRange = "day" | "week" | "month" | "year"
type AnalyticsTab = "overview" | "comparison" | "devices" | "cost"

export default function AnalyticsScreen() {
  const { t } = useTranslation()
  const { colors, isDarkMode } = useTheme()
  const { energyData, deviceUsage, refreshEnergyData } = useUtility()
  const { scaledFontSize, spacing, isSmallScreen, dimensions } = useResponsive()

  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("month")
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshEnergyData()
    } catch (error) {
      console.error("Failed to refresh data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  // Prepare data for the charts based on selected time range
  const getChartData = () => {
    switch (selectedTimeRange) {
      case "day":
        return {
          labels: ["6am", "9am", "12pm", "3pm", "6pm", "9pm"],
          datasets: [
            {
              data: [2.1, 3.5, 5.2, 4.3, 7.1, 6.2],
              color: () => colors.primary,
              strokeWidth: 2,
            },
          ],
          costData: [120, 210, 312, 258, 426, 372],
        }
      case "week":
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              data: [25.3, 22.1, 24.5, 21.8, 26.2, 28.4, 27.1],
              color: () => colors.primary,
              strokeWidth: 2,
            },
          ],
          costData: [1518, 1326, 1470, 1308, 1572, 1704, 1626],
        }
      case "month":
        return {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              data: [175.2, 182.6, 168.9, 190.3],
              color: () => colors.primary,
              strokeWidth: 2,
            },
          ],
          costData: [10512, 10956, 10134, 11418],
        }
      case "year":
        return {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              data: [450, 420, 480, 520, 540, 580, 620, 650, 600, 580, 520, 490],
              color: () => colors.primary,
              strokeWidth: 2,
            },
          ],
          costData: [27000, 25200, 28800, 31200, 32400, 34800, 37200, 39000, 36000, 34800, 31200, 29400],
        }
      default:
        return {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              data: [175.2, 182.6, 168.9, 190.3],
              color: () => colors.primary,
              strokeWidth: 2,
            },
          ],
          costData: [10512, 10956, 10134, 11418],
        }
    }
  }

  const chartData = getChartData()

  // Device usage data for pie chart
  const devicePieData = deviceUsage.map((device, index) => {
    const colorsArray = [colors.primary, colors.secondary, colors.tertiary, colors.warning, colors.error]

    return {
      name: device.name,
      usage: device.usage,
      percentage: device.percentage,
      color: colorsArray[index % colorsArray.length],
      legendFontColor: colors.text,
      legendFontSize: 12,
    }
  })

  // Comparison data
  const comparisonData = {
    labels: ["You", "Neighbors", "Efficient"],
    datasets: [
      {
        data: [28.5, 32.1, 22.3],
        colors: [() => colors.primary, () => colors.secondary, () => colors.tertiary],
      },
    ],
  }

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 1,
    color: () => colors.primary,
    labelColor: () => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      stroke: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    },
  }

  // Tabs configuration
  const tabs = [
    { key: "overview", title: "Overview", icon: "analytics-outline" },
    { key: "comparison", title: "Comparison", icon: "bar-chart-outline" },
    { key: "devices", title: "Devices", icon: "hardware-chip-outline" },
    { key: "cost", title: "Cost", icon: "cash-outline" },
  ]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: scaledFontSize(24) }]}>Analytics</Text>
      </View>

      <View style={[styles.tabsContainer, { backgroundColor: colors.background }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && [
                styles.activeTab,
                {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 2,
                },
              ],
            ]}
            onPress={() => setActiveTab(tab.key as AnalyticsTab)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.key ? colors.primary : colors.textSecondary}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab.key ? colors.primary : colors.textSecondary,
                  fontSize: scaledFontSize(14),
                },
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <TimeRangeSelector selectedRange={selectedTimeRange} onRangeChange={setSelectedTimeRange} />

        {activeTab === "overview" && (
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Energy Consumption
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Your energy usage over time
              </Text>

              <LineChart
                data={chartData}
                width={dimensions.width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix=" kWh"
              />

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.primary, fontSize: scaledFontSize(20) }]}>
                    {selectedTimeRange === "day"
                      ? "28.4"
                      : selectedTimeRange === "week"
                        ? "175.4"
                        : selectedTimeRange === "month"
                          ? "717.0"
                          : "6,650"}
                    <Text style={[styles.statUnit, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                      {" "}
                      kWh
                    </Text>
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                    Total Usage
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.success, fontSize: scaledFontSize(20) }]}>-5.2%</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                    vs Previous
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.primary, fontSize: scaledFontSize(20) }]}>
                    {selectedTimeRange === "day"
                      ? "4.7"
                      : selectedTimeRange === "week"
                        ? "25.1"
                        : selectedTimeRange === "month"
                          ? "179.3"
                          : "554.2"}
                    <Text style={[styles.statUnit, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                      {" "}
                      kWh
                    </Text>
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                    Average
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Energy Efficiency Score
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Your performance compared to similar households
              </Text>

              <View style={styles.scoreContainer}>
                <View style={[styles.scoreCircle, { borderColor: colors.primary }]}>
                  <Text style={[styles.scoreValue, { color: colors.primary, fontSize: scaledFontSize(32) }]}>85</Text>
                  <Text style={[styles.scoreLabel, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                    out of 100
                  </Text>
                </View>

                <View style={styles.scoreDetails}>
                  <View style={styles.scoreItem}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.scoreIcon} />
                    <Text style={[styles.scoreText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                      15% more efficient than neighbors
                    </Text>
                  </View>

                  <View style={styles.scoreItem}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.scoreIcon} />
                    <Text style={[styles.scoreText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                      Reduced consumption by 5.2% this month
                    </Text>
                  </View>

                  <View style={styles.scoreItem}>
                    <Ionicons name="alert-circle" size={20} color={colors.warning} style={styles.scoreIcon} />
                    <Text style={[styles.scoreText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                      AC usage is higher than recommended
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === "comparison" && (
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Neighborhood Comparison
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                How your usage compares to others
              </Text>

              <BarChart
                data={comparisonData}
                width={dimensions.width - 40}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  barPercentage: 0.7,
                  color: (opacity = 1, index = 0) => {
                    const colors = [colors.primary, colors.secondary, colors.tertiary]
                    return colors[index] || colors[0]
                  },
                }}
                style={styles.chart}
                yAxisSuffix=" kWh"
                fromZero
                showValuesOnTopOfBars
              />

              <View style={styles.comparisonLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.legendText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    Your Home
                  </Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors.secondary }]} />
                  <Text style={[styles.legendText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    Neighbors
                  </Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors.tertiary }]} />
                  <Text style={[styles.legendText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                    Efficient Homes
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Historical Comparison
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Your usage compared to previous periods
              </Text>

              <View style={styles.historicalComparison}>
                <View style={styles.comparisonItem}>
                  <Text style={[styles.comparisonLabel, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                    Current {selectedTimeRange}:
                  </Text>
                  <Text style={[styles.comparisonValue, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                    {selectedTimeRange === "day"
                      ? "28.4"
                      : selectedTimeRange === "week"
                        ? "175.4"
                        : selectedTimeRange === "month"
                          ? "717.0"
                          : "6,650"}{" "}
                    kWh
                  </Text>
                </View>

                <View style={styles.comparisonItem}>
                  <Text style={[styles.comparisonLabel, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                    Previous {selectedTimeRange}:
                  </Text>
                  <Text style={[styles.comparisonValue, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                    {selectedTimeRange === "day"
                      ? "30.1"
                      : selectedTimeRange === "week"
                        ? "185.2"
                        : selectedTimeRange === "month"
                          ? "756.3"
                          : "7,012"}{" "}
                    kWh
                  </Text>
                </View>

                <View style={styles.comparisonItem}>
                  <Text style={[styles.comparisonLabel, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                    Change:
                  </Text>
                  <Text style={[styles.comparisonValue, { color: colors.success, fontSize: scaledFontSize(16) }]}>
                    -5.2% (Saved{" "}
                    {selectedTimeRange === "day"
                      ? "1.7"
                      : selectedTimeRange === "week"
                        ? "9.8"
                        : selectedTimeRange === "month"
                          ? "39.3"
                          : "362"}{" "}
                    kWh)
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === "devices" && (
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Device Usage Breakdown
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Energy consumption by device
              </Text>

              <PieChart
                data={devicePieData}
                width={dimensions.width - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="percentage"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />

              <View style={styles.deviceList}>
                {deviceUsage.map((device) => (
                  <View key={device.id} style={styles.deviceItem}>
                    <View style={styles.deviceInfo}>
                      <Ionicons
                        name={
                          device.category === "cooling"
                            ? "snow-outline"
                            : device.category === "heating"
                              ? "water-outline"
                              : device.category === "appliance"
                                ? "thermometer-outline"
                                : device.category === "lighting"
                                  ? "bulb-outline"
                                  : "apps-outline"
                        }
                        size={20}
                        color={colors.primary}
                        style={styles.deviceIcon}
                      />
                      <Text style={[styles.deviceName, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                        {device.name}
                      </Text>
                    </View>
                    <View style={styles.deviceStats}>
                      <Text style={[styles.deviceUsage, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                        {device.usage} {device.unit}
                      </Text>
                      <Text
                        style={[styles.devicePercentage, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}
                      >
                        ({device.percentage}%)
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Device Efficiency Recommendations
              </Text>

              <View style={styles.recommendationList}>
                <View style={styles.recommendationItem}>
                  <Ionicons name="snow" size={20} color={colors.primary} style={styles.recommendationIcon} />
                  <View style={styles.recommendationContent}>
                    <Text style={[styles.recommendationTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                      Air Conditioner
                    </Text>
                    <Text
                      style={[styles.recommendationText, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}
                    >
                      Increase temperature by 2°C to save up to 10% energy
                    </Text>
                  </View>
                </View>

                <View style={styles.recommendationItem}>
                  <Ionicons name="bulb" size={20} color={colors.primary} style={styles.recommendationIcon} />
                  <View style={styles.recommendationContent}>
                    <Text style={[styles.recommendationTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                      Lighting
                    </Text>
                    <Text
                      style={[styles.recommendationText, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}
                    >
                      Replace remaining bulbs with LED to save up to 80% on lighting costs
                    </Text>
                  </View>
                </View>

                <View style={styles.recommendationItem}>
                  <Ionicons name="power" size={20} color={colors.primary} style={styles.recommendationIcon} />
                  <View style={styles.recommendationContent}>
                    <Text style={[styles.recommendationTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                      Standby Power
                    </Text>
                    <Text
                      style={[styles.recommendationText, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}
                    >
                      Use smart power strips to eliminate standby power consumption
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === "cost" && (
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Energy Cost Analysis
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Your energy costs over time
              </Text>

              <BarChart
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      data: chartData.costData,
                      color: () => colors.secondary,
                    },
                  ],
                }}
                width={dimensions.width - 40}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: () => colors.secondary,
                }}
                style={styles.chart}
                yAxisSuffix=" KES"
                verticalLabelRotation={30}
              />

              <View style={styles.costSummary}>
                <View style={styles.costItem}>
                  <Text style={[styles.costLabel, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                    Total Cost:
                  </Text>
                  <Text style={[styles.costValue, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                    {selectedTimeRange === "day"
                      ? "1,698"
                      : selectedTimeRange === "week"
                        ? "10,524"
                        : selectedTimeRange === "month"
                          ? "43,020"
                          : "399,000"}{" "}
                    KES
                  </Text>
                </View>

                <View style={styles.costItem}>
                  <Text style={[styles.costLabel, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                    Average Cost:
                  </Text>
                  <Text style={[styles.costValue, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                    {selectedTimeRange === "day"
                      ? "283"
                      : selectedTimeRange === "week"
                        ? "1,504"
                        : selectedTimeRange === "month"
                          ? "10,755"
                          : "33,250"}{" "}
                    KES
                  </Text>
                </View>

                <View style={styles.costItem}>
                  <Text style={[styles.costLabel, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                    Potential Savings:
                  </Text>
                  <Text style={[styles.costValue, { color: colors.success, fontSize: scaledFontSize(18) }]}>
                    {selectedTimeRange === "day"
                      ? "170"
                      : selectedTimeRange === "week"
                        ? "1,052"
                        : selectedTimeRange === "month"
                          ? "4,302"
                          : "39,900"}{" "}
                    KES
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Cost Breakdown by Device
              </Text>

              <View style={styles.costBreakdown}>
                {deviceUsage.map((device) => (
                  <View key={device.id} style={styles.costBreakdownItem}>
                    <View style={styles.costBreakdownInfo}>
                      <Text style={[styles.costBreakdownName, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                        {device.name}
                      </Text>
                      <View style={[styles.costBreakdownBar, { backgroundColor: `${colors.primary}20` }]}>
                        <View
                          style={[
                            styles.costBreakdownProgress,
                            {
                              backgroundColor: colors.primary,
                              width: `${device.percentage}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <Text style={[styles.costBreakdownValue, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                      {Math.round(device.percentage * 430.2) / 10} KES
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
                Cost Saving Tips
              </Text>

              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Ionicons name="flash" size={20} color={colors.warning} style={styles.tipIcon} />
                  <View style={styles.tipContent}>
                    <Text style={[styles.tipTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                      Off-Peak Usage
                    </Text>
                    <Text style={[styles.tipText, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                      Shift energy-intensive activities to off-peak hours (10PM-6AM) to save up to 20% on costs
                    </Text>
                  </View>
                </View>

                <View style={styles.tipItem}>
                  <Ionicons name="thermometer" size={20} color={colors.warning} style={styles.tipIcon} />
                  <View style={styles.tipContent}>
                    <Text style={[styles.tipTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                      Thermostat Management
                    </Text>
                    <Text style={[styles.tipText, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                      Each degree increase in AC temperature can save approximately 3-5% on cooling costs
                    </Text>
                  </View>
                </View>

                <View style={styles.tipItem}>
                  <Ionicons name="water" size={20} color={colors.warning} style={styles.tipIcon} />
                  <View style={styles.tipContent}>
                    <Text style={[styles.tipTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                      Water Heating
                    </Text>
                    <Text style={[styles.tipText, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                      Reduce water heater temperature to 120°F (49°C) to save up to 10% on water heating costs
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabIcon: {
    marginRight: 4,
  },
  tabText: {
    fontFamily: "Poppins-Medium",
  },
  section: {
    marginTop: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: "Poppins-Bold",
  },
  statUnit: {
    fontFamily: "Poppins-Regular",
  },
  statLabel: {
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  scoreValue: {
    fontFamily: "Poppins-Bold",
  },
  scoreLabel: {
    fontFamily: "Poppins-Regular",
  },
  scoreDetails: {
    flex: 1,
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  scoreIcon: {
    marginRight: 8,
  },
  scoreText: {
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  comparisonLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
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
  historicalComparison: {
    marginTop: 16,
  },
  comparisonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  comparisonLabel: {
    fontFamily: "Poppins-Regular",
  },
  comparisonValue: {
    fontFamily: "Poppins-Medium",
  },
  deviceList: {
    marginTop: 16,
  },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIcon: {
    marginRight: 8,
  },
  deviceName: {
    fontFamily: "Poppins-Medium",
  },
  deviceStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceUsage: {
    fontFamily: "Poppins-Medium",
    marginRight: 4,
  },
  devicePercentage: {
    fontFamily: "Poppins-Regular",
  },
  recommendationList: {
    marginTop: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  recommendationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  recommendationText: {
    fontFamily: "Poppins-Regular",
  },
  costSummary: {
    marginTop: 16,
  },
  costItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  costLabel: {
    fontFamily: "Poppins-Regular",
  },
  costValue: {
    fontFamily: "Poppins-Medium",
  },
  costBreakdown: {
    marginTop: 16,
  },
  costBreakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  costBreakdownInfo: {
    flex: 1,
    marginRight: 16,
  },
  costBreakdownName: {
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  costBreakdownBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  costBreakdownProgress: {
    height: "100%",
  },
  costBreakdownValue: {
    fontFamily: "Poppins-Medium",
    width: 80,
    textAlign: "right",
  },
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  tipText: {
    fontFamily: "Poppins-Regular",
  },
})

