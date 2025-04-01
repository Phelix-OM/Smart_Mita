"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"

export default function EducationScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const [selectedTab, setSelectedTab] = useState("tips")

  // Mock data for energy saving tips
  const tips = [
    {
      id: "1",
      title: "Optimize Your Thermostat",
      description:
        "Set your thermostat to 24°C in summer and 20°C in winter to save up to 10% on heating and cooling costs.",
      icon: "thermometer-outline" as const,
    },
    {
      id: "2",
      title: "Unplug Standby Devices",
      description: "Devices on standby can account for up to 10% of your energy bill. Unplug them when not in use.",
      icon: "power-outline" as const,
    },
    {
      id: "3",
      title: "Use Energy-Efficient Lighting",
      description: "LED bulbs use up to 80% less energy than traditional incandescent bulbs and last much longer.",
      icon: "bulb-outline" as const,
    },
    {
      id: "4",
      title: "Wash Clothes in Cold Water",
      description: "Using cold water for laundry can save up to 90% of the energy used for washing clothes.",
      icon: "water-outline" as const,
    },
  ]

  // Mock data for articles
  const articles = [
    {
      id: "1",
      title: "Understanding Your Energy Bill",
      description: "Learn how to read and understand your energy bill to identify opportunities for savings.",
      image: "@/assets/images/electricalbill.png",
      readTime: "5 min",
    },
    {
      id: "2",
      title: "The Future of Renewable Energy",
      description: "Explore how renewable energy sources are transforming the global energy landscape.",
      image: "/placeholder.svg",
      readTime: "8 min",
    },
    {
      id: "3",
      title: "Smart Home Energy Solutions",
      description: "Discover how smart home technology can help you manage and reduce your energy consumption.",
      image: "/placeholder.svg",
      readTime: "6 min",
    },
  ]

  // Mock data for videos
  const videos = [
    {
      id: "1",
      title: "Home Energy Audit: DIY Guide",
      description: "Learn how to conduct a simple energy audit of your home to identify energy waste.",
      thumbnail: "/placeholder.svg",
      duration: "12:34",
    },
    {
      id: "2",
      title: "Energy-Efficient Appliances Explained",
      description: "Understanding energy ratings and how to choose the most efficient appliances for your home.",
      thumbnail: "/placeholder.svg",
      duration: "8:45",
    },
    {
      id: "3",
      title: "Seasonal Energy Saving Tips",
      description: "Practical tips for saving energy during different seasons of the year.",
      thumbnail: "/placeholder.svg",
      duration: "15:20",
    },
  ]

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "tips" && { backgroundColor: colors.primary }]}
          onPress={() => setSelectedTab("tips")}
        >
          <Text style={[styles.tabText, { color: selectedTab === "tips" ? colors.white : colors.text }]}>
            {t("energyTips")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "articles" && { backgroundColor: colors.primary }]}
          onPress={() => setSelectedTab("articles")}
        >
          <Text style={[styles.tabText, { color: selectedTab === "articles" ? colors.white : colors.text }]}>
            {t("articles")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "videos" && { backgroundColor: colors.primary }]}
          onPress={() => setSelectedTab("videos")}
        >
          <Text style={[styles.tabText, { color: selectedTab === "videos" ? colors.white : colors.text }]}>
            {t("videos")}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "tips" && (
        <View style={styles.tipsContainer}>
          {tips.map((tip) => (
            <View key={tip.id} style={[styles.tipCard, { backgroundColor: colors.card }]}>
              <View style={[styles.tipIconContainer, { backgroundColor: colors.primary + "20" }]}>
                <Ionicons name={tip.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, { color: colors.text }]}>{tip.title}</Text>
                <Text style={[styles.tipDescription, { color: colors.text }]}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {selectedTab === "articles" && (
        <View style={styles.articlesContainer}>
          {articles.map((article) => (
            <TouchableOpacity key={article.id} style={[styles.articleCard, { backgroundColor: colors.card }]}>
              <Image source={{ uri: article.image }} style={styles.articleImage} resizeMode="cover" />
              <View style={styles.articleContent}>
                <Text style={[styles.articleTitle, { color: colors.text }]}>{article.title}</Text>
                <Text style={[styles.articleDescription, { color: colors.text }]}>{article.description}</Text>
                <View style={styles.articleFooter}>
                  <Text style={[styles.articleReadTime, { color: colors.text + "80" }]}>{article.readTime}</Text>
                  <TouchableOpacity>
                    <Text style={[styles.readMoreButton, { color: colors.primary }]}>{t("readMore")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedTab === "videos" && (
        <View style={styles.videosContainer}>
          {videos.map((video) => (
            <TouchableOpacity key={video.id} style={[styles.videoCard, { backgroundColor: colors.card }]}>
              <View style={styles.thumbnailContainer}>
                <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} resizeMode="cover" />
                <View style={[styles.playButton, { backgroundColor: colors.primary }]}>
                  <Ionicons name="play" size={20} color={colors.white} />
                </View>
                <View style={[styles.durationBadge, { backgroundColor: colors.black + "80" }]}>
                  <Text style={[styles.durationText, { color: colors.white }]}>{video.duration}</Text>
                </View>
              </View>
              <View style={styles.videoContent}>
                <Text style={[styles.videoTitle, { color: colors.text }]}>{video.title}</Text>
                <Text style={[styles.videoDescription, { color: colors.text }]}>{video.description}</Text>
                <TouchableOpacity style={[styles.watchButton, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.watchButtonText, { color: colors.white }]}>{t("watchNow")}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  tabText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  tipsContainer: {
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
  articlesContainer: {
    marginBottom: 16,
  },
  articleCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  articleImage: {
    width: "100%",
    height: 160,
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  articleReadTime: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  readMoreButton: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  videosContainer: {
    marginBottom: 16,
  },
  videoCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  thumbnailContainer: {
    position: "relative",
  },
  videoThumbnail: {
    width: "100%",
    height: 180,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  videoContent: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
    marginBottom: 12,
  },
  watchButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  watchButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
})

