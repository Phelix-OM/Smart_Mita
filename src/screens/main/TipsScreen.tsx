"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"

type TipCategory = "all" | "appliances" | "cooling" | "lighting" | "standby" | "seasonal"

interface Tip {
  id: string
  title: string
  description: string
  category: TipCategory
  icon: string
  savings: string
  difficulty: "easy" | "medium" | "hard"
  isFavorite?: boolean
  imageUrl?: string
}

export default function TipsScreen() {
  const { t } = useTranslation()
  const { colors, isDarkMode } = useTheme()
  const { scaledFontSize, spacing, isSmallScreen, dimensions } = useResponsive()

  const [selectedCategory, setSelectedCategory] = useState<TipCategory>("all")
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tipOfTheDay, setTipOfTheDay] = useState<Tip | null>(null)
  const [tips, setTips] = useState<Tip[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  // Categories for filtering
  const categories = [
    { key: "all", label: "All Tips", icon: "list-outline" },
    { key: "appliances", label: "Appliances", icon: "home-outline" },
    { key: "cooling", label: "Cooling", icon: "snow-outline" },
    { key: "lighting", label: "Lighting", icon: "bulb-outline" },
    { key: "standby", label: "Standby Power", icon: "power-outline" },
    { key: "seasonal", label: "Seasonal", icon: "calendar-outline" },
  ]

  // Default placeholder image for tips
  const defaultPlaceholderImage = "https://media.istockphoto.com/id/1439843828/photo/close-up-photo-of-lightbulb-with-growing-plant-inside-and-coin-stacks-as-a-symbol-of-money.jpg?s=612x612&w=0&k=20&c=5y97BclN5WVA-A9zgNXtwiZYns95rML0-aOK_VB5aLE="

  // Category-specific placeholder images
  const categoryPlaceholders = {
    appliances: "https://media.istockphoto.com/id/2037146628/photo/modern-simple-small-kitchen-corner-in-the-grey-and-white-kitchen-kitchen.jpg?s=612x612&w=0&k=20&c=5cndnH5TyASWJNN_a9MILOS5hdq5ak3wOz6PY2mLyWI=",
    cooling: "https://media.istockphoto.com/id/1368514998/photo/hand-adjusting-temperature-on-air-conditioner.jpg?s=612x612&w=0&k=20&c=sx_08JADhXZFKFadmJE9vfjF43C5ru5X96YPHLo-EPE=",
    lighting: "https://media.istockphoto.com/id/1934009962/photo/a-young-woman-is-changing-a-light-bulb-from-an-incandescent-bulb-to-an-led-bulb.jpg?s=612x612&w=0&k=20&c=k-_RQk6SnZZSpb8FKCDr_vjumt_-_JTNmFDdzoyqQ60=",
    standby: "https://media.istockphoto.com/id/111857959/photo/womans-hand-pulling-two-electrical-cords-plugs-from-socket.jpg?s=612x612&w=0&k=20&c=QbNGrtUXjWBVKd3OWAau0oRpip94tUXydIaQpHW0wdg=",
    seasonal: "https://media.istockphoto.com/id/2140183630/photo/repairman-using-a-screwdriver-disassembles-a-washing-machine-for-repair.jpg?s=612x612&w=0&k=20&c=vpLsKVsKm8LEUIBknDNzyrB8jQQHVL2Ib8oG72ymazM=",
  }

  // Get placeholder image based on category
  const getPlaceholderImage = (category: TipCategory): string => {
    if (category === "all") return defaultPlaceholderImage
    return categoryPlaceholders[category] || defaultPlaceholderImage
  }

  const allTips: Tip[] = [
    {
      id: "1",
      title: "Optimize AC Temperature",
      description:
        "Set your AC to 24°C instead of 20°C. Each degree increase can save approximately 3-5% on cooling costs. Using a fan along with your AC can help distribute cool air more efficiently.",
      category: "cooling",
      icon: "snow-outline",
      savings: "Up to 15% on cooling costs",
      difficulty: "easy",
      imageUrl: getPlaceholderImage("cooling"),
    },
    {
      id: "2",
      title: "Switch to LED Lighting",
      description:
        "Replace traditional incandescent bulbs with LED lights. LEDs use up to 80% less energy and last 25 times longer than incandescent lighting. They also produce less heat, reducing cooling costs.",
      category: "lighting",
      icon: "bulb-outline",
      savings: "Up to 80% on lighting costs",
      difficulty: "medium",
      imageUrl: getPlaceholderImage("lighting"),
    },
    {
      id: "3",
      title: "Eliminate Standby Power",
      description:
        "Unplug devices when not in use or use smart power strips to cut power to devices when they're not needed. Many electronics continue to draw power even when turned off.",
      category: "standby",
      icon: "power-outline",
      savings: "5-10% on electricity bill",
      difficulty: "easy",
      imageUrl: getPlaceholderImage("standby"),
    },
    {
      id: "4",
      title: "Maintain Your Refrigerator",
      description:
        "Keep refrigerator coils clean and ensure door seals are tight. Set the temperature between 3-5°C for the fridge and -18°C for the freezer. Keep the refrigerator away from heat sources.",
      category: "appliances",
      icon: "thermometer-outline",
      savings: "Up to 15% on refrigeration costs",
      difficulty: "medium",
      imageUrl: getPlaceholderImage("appliances"),
    },
    {
      id: "5",
      title: "Use Cold Water for Laundry",
      description:
        "Wash clothes in cold water whenever possible. Modern detergents work well in cold water, and heating water accounts for about 90% of the energy your washing machine uses.",
      category: "appliances",
      icon: "water-outline",
      savings: "Up to 90% on laundry energy costs",
      difficulty: "easy",
      imageUrl: getPlaceholderImage("appliances"),
    },
    {
      id: "6",
      title: "Install Ceiling Fans",
      description:
        "Use ceiling fans to circulate air and reduce the need for air conditioning. In summer, run fans counterclockwise to create a cooling breeze. In winter, run them clockwise to circulate warm air.",
      category: "cooling",
      icon: "repeat-outline",
      savings: "Up to 40% on cooling costs",
      difficulty: "hard",
      imageUrl: getPlaceholderImage("cooling"),
    },
    {
      id: "7",
      title: "Use Natural Light",
      description:
        "Open curtains and blinds during the day to use natural light instead of electric lighting. Consider light-colored window treatments that allow natural light to enter while providing privacy. Position desks and reading areas near windows to maximize natural light use.",
      category: "lighting",
      icon: "sunny-outline",
      savings: "10-25% on lighting costs",
      difficulty: "easy",
      imageUrl: getPlaceholderImage("lighting"),
    },
    {
      id: "8",
      title: "Seasonal HVAC Maintenance",
      description:
        "Schedule regular maintenance for your heating and cooling systems before peak seasons. Clean or replace air filters monthly during heavy use periods. Seal any leaks in ducts and ensure proper insulation.",
      category: "seasonal",
      icon: "calendar-outline",
      savings: "Up to 20% on heating/cooling costs",
      difficulty: "medium",
      imageUrl: getPlaceholderImage("seasonal"),
    },
    {
      id: "9",
      title: "Use Smart Power Strips",
      description:
        "Invest in smart power strips that can automatically cut power to devices when they're not in use. This eliminates phantom energy use from electronics in standby mode.",
      category: "standby",
      icon: "flash-outline",
      savings: "Up to 12% on electricity bill",
      difficulty: "easy",
      imageUrl: getPlaceholderImage("standby"),
    },
    {
      id: "10",
      title: "Optimize Water Heater Settings",
      description:
        "Lower your water heater temperature to 120°F (49°C). Insulate your water heater and the first few feet of hot water pipes. Consider a timer to turn off the water heater when not in use.",
      category: "appliances",
      icon: "water-outline",
      savings: "7-15% on water heating costs",
      difficulty: "medium",
      imageUrl: getPlaceholderImage("appliances"),
    },
  ]

  useEffect(() => {
    // Initialize tips and tip of the day
    setTips(allTips)
    setTipOfTheDay(allTips[Math.floor(Math.random() * allTips.length)])
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Refresh tip of the day
      setTipOfTheDay(allTips[Math.floor(Math.random() * allTips.length)])
    } catch (error) {
      console.error("Failed to refresh data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const toggleFavorite = (tipId: string) => {
    if (favorites.includes(tipId)) {
      setFavorites(favorites.filter((id) => id !== tipId))
    } else {
      setFavorites([...favorites, tipId])
    }
  }

  const filteredTips = selectedCategory === "all" ? tips : tips.filter((tip) => tip.category === selectedCategory)

  // Function to handle image loading errors
  const handleImageError = (tipId: string) => {
    console.warn(`Failed to load image for tip ${tipId}, using fallback`)
    // You could update the tip's image to a local fallback here if needed
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: scaledFontSize(24) }]}>
          Energy-Saving Tips
        </Text>
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* Tip of the Day */}
        {tipOfTheDay && (
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.tipOfDayCard, { borderRadius: spacing(2) }]}
          >
            <View style={styles.tipOfDayHeader}>
              <View style={styles.tipOfDayTitleContainer}>
                <Ionicons name="bulb" size={24} color="#FFFFFF" style={styles.tipOfDayIcon} />
                <Text style={[styles.tipOfDayTitle, { color: "#FFFFFF", fontSize: scaledFontSize(18) }]}>
                  Tip of the Day
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.favoriteButton, { backgroundColor: "rgba(255, 255, 255, 0.2)" }]}
                onPress={() => toggleFavorite(tipOfTheDay.id)}
              >
                <Ionicons
                  name={favorites.includes(tipOfTheDay.id) ? "heart" : "heart-outline"}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            <Text style={[styles.tipOfDayText, { color: "#FFFFFF", fontSize: scaledFontSize(16) }]}>
              {tipOfTheDay.title}
            </Text>

            <Text style={[styles.tipOfDayDescription, { color: "#FFFFFF", fontSize: scaledFontSize(14) }]}>
              {tipOfTheDay.description}
            </Text>

            <View style={styles.tipOfDayFooter}>
              <View style={[styles.savingsTag, { backgroundColor: "rgba(255, 255, 255, 0.2)" }]}>
                <Ionicons name="trending-down" size={16} color="#FFFFFF" style={styles.savingsIcon} />
                <Text style={[styles.savingsText, { color: "#FFFFFF", fontSize: scaledFontSize(12) }]}>
                  {tipOfTheDay.savings}
                </Text>
              </View>

              <View style={[styles.difficultyTag, { backgroundColor: "rgba(255, 255, 255, 0.2)" }]}>
                <Text style={[styles.difficultyText, { color: "#FFFFFF", fontSize: scaledFontSize(12) }]}>
                  {tipOfTheDay.difficulty.charAt(0).toUpperCase() + tipOfTheDay.difficulty.slice(1)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        )}

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && [styles.activeCategoryButton, { backgroundColor: colors.primary }],
                {
                  borderColor: colors.border,
                  backgroundColor: selectedCategory === category.key ? colors.primary : colors.card,
                },
              ]}
              onPress={() => setSelectedCategory(category.key as TipCategory)}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={selectedCategory === category.key ? colors.white : colors.text}
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.key ? colors.white : colors.text,
                    fontSize: scaledFontSize(14),
                  },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tips List */}
        <View style={styles.tipsContainer}>
          {filteredTips.map((tip) => (
            <View key={tip.id} style={[styles.tipCard, { backgroundColor: colors.card }]}>
              <View style={styles.tipHeader}>
                <View style={[styles.tipIconContainer, { backgroundColor: `${colors.primary}20` }]}>
                  <Ionicons name={tip.icon as any} size={24} color={colors.primary} />
                </View>

                <View style={styles.tipTitleContainer}>
                  <Text style={[styles.tipTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                    {tip.title}
                  </Text>
                  <View style={styles.tipTags}>
                    <View style={[styles.tipTag, { backgroundColor: `${colors.primary}15` }]}>
                      <Text style={[styles.tipTagText, { color: colors.primary, fontSize: scaledFontSize(12) }]}>
                        {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.tipTag,
                        {
                          backgroundColor:
                            tip.difficulty === "easy"
                              ? `${colors.success}15`
                              : tip.difficulty === "medium"
                                ? `${colors.warning}15`
                                : `${colors.error}15`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tipTagText,
                          {
                            color:
                              tip.difficulty === "easy"
                                ? colors.success
                                : tip.difficulty === "medium"
                                  ? colors.warning
                                  : colors.error,
                            fontSize: scaledFontSize(12),
                          },
                        ]}
                      >
                        {tip.difficulty.charAt(0).toUpperCase() + tip.difficulty.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(tip.id)}>
                  <Ionicons
                    name={favorites.includes(tip.id) ? "heart" : "heart-outline"}
                    size={20}
                    color={favorites.includes(tip.id) ? colors.error : colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {tip.imageUrl && (
                <Image
                  source={{ uri: tip.imageUrl }}
                  style={styles.tipImage}
                  resizeMode="cover"
                  onError={() => handleImageError(tip.id)}
                />
              )}

              <Text style={[styles.tipDescription, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                {tip.description}
              </Text>

              <View style={styles.tipFooter}>
                <View style={[styles.savingsContainer, { backgroundColor: `${colors.success}15` }]}>
                  <Ionicons name="trending-down" size={16} color={colors.success} style={styles.savingsIcon} />
                  <Text style={[styles.savingsLabel, { color: colors.success, fontSize: scaledFontSize(12) }]}>
                    {tip.savings}
                  </Text>
                </View>

                <TouchableOpacity style={[styles.implementButton, { backgroundColor: `${colors.primary}15` }]}>
                  <Text style={[styles.implementButtonText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                    Implement
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

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
  tipOfDayCard: {
    padding: 20,
    marginBottom: 20,
  },
  tipOfDayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tipOfDayTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipOfDayIcon: {
    marginRight: 8,
  },
  tipOfDayTitle: {
    fontFamily: "Poppins-Bold",
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  tipOfDayText: {
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },
  tipOfDayDescription: {
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
    lineHeight: 22,
  },
  tipOfDayFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  savingsTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
  },
  savingsIcon: {
    marginRight: 4,
  },
  savingsText: {
    fontFamily: "Poppins-Medium",
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  difficultyText: {
    fontFamily: "Poppins-Medium",
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  activeCategoryButton: {
    borderWidth: 0,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontFamily: "Poppins-Medium",
  },
  tipsContainer: {
    marginBottom: 16,
  },
  tipCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipTitleContainer: {
    flex: 1,
  },
  tipTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  tipTags: {
    flexDirection: "row",
  },
  tipTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  tipTagText: {
    fontFamily: "Poppins-Medium",
  },
  tipImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#F0F0F0", // Light background while loading
  },
  tipDescription: {
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
    marginBottom: 16,
  },
  tipFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  savingsLabel: {
    fontFamily: "Poppins-Medium",
    marginLeft: 4,
  },
  implementButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  implementButtonText: {
    fontFamily: "Poppins-Medium",
  },
})

