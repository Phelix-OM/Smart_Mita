"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image, Platform } from "react-native"
import { useAuth } from "../contexts/AuthContext"
import { useTranslation } from "../hooks/useTranslation"
import { useTheme } from "../contexts/ThemeContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { useResponsive } from "../hooks/useResponsive"

const { width, height } = Dimensions.get("window")

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth()
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { spacing } = useResponsive()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const onboardingData = [
    {
      id: "1",
      title: t("onboardingTitle1"),
      description: t("onboardingDesc1"),
      image: require("../../assets/images/onboarding1.png"),
    },
    {
      id: "2",
      title: t("onboardingTitle2"),
      description: t("onboardingDesc2"),
      image: require("../../assets/images/onboarding2.png"),
    },
    {
      id: "3",
      title: t("onboardingTitle3"),
      description: t("onboardingDesc3"),
      image: require("../../assets/images/onboarding3.png"),
    },
  ]

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      })
    } else {
      completeOnboarding()
    }
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  const renderItem = ({ item }: { item: (typeof onboardingData)[0] }) => {
    return (
      <View style={[styles.slide, { backgroundColor: colors.background, width }]}>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
        </View>
      </View>
    )
  }

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? colors.primary : colors.border,
                width: index === currentIndex ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.skipContainer}>
        {currentIndex < onboardingData.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={[styles.skipText, { color: colors.primary }]}>{t("skip")}</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width)
          setCurrentIndex(index)
        }}
      />

      {renderDots()}

      <View style={[styles.buttonContainer, { marginBottom: Platform.OS === "ios" ? spacing(6) : spacing(4) }]}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 8,
              elevation: 5,
            },
          ]}
          onPress={handleNext}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>
            {currentIndex === onboardingData.length - 1 ? t("getStarted") : t("next")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    alignItems: "flex-end",
    padding: 16,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 0.6,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  image: {
    width: width * 0.85,
    height: height * 0.4,
    maxHeight: 400,
    borderRadius: 20,
    // Add a subtle shadow to make images pop
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  contentContainer: {
    flex: 0.4,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 30,
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    width: "100%",
  },
  button: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.5,
  },
})

