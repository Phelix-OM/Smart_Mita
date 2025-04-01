"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Easing } from "react-native"

interface LiveDataIndicatorProps {
  isLive: boolean
  color?: string
  size?: "small" | "medium" | "large"
}

export const LiveDataIndicator: React.FC<LiveDataIndicatorProps> = ({ isLive, color = "#22c55e", size = "medium" }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (isLive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      // Reset animation when not live
      pulseAnim.setValue(1)
    }

    return () => {
      pulseAnim.stopAnimation()
    }
  }, [isLive, pulseAnim])

  // Determine size
  const getSize = () => {
    switch (size) {
      case "small":
        return { dot: 6, text: 10, container: 20 }
      case "large":
        return { dot: 10, text: 14, container: 28 }
      default: // medium
        return { dot: 8, text: 12, container: 24 }
    }
  }

  const sizeValues = getSize()

  return (
    <View style={[styles.container, { height: sizeValues.container }]}>
      {isLive ? (
        <>
          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: color,
                width: sizeValues.dot,
                height: sizeValues.dot,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Text style={[styles.text, { color, fontSize: sizeValues.text }]}>LIVE</Text>
        </>
      ) : (
        <>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: "#6b7280",
                width: sizeValues.dot,
                height: sizeValues.dot,
              },
            ]}
          />
          <Text style={[styles.text, { color: "#6b7280", fontSize: sizeValues.text }]}>PAUSED</Text>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dot: {
    borderRadius: 50,
    marginRight: 4,
  },
  text: {
    fontFamily: "Poppins-Medium",
    letterSpacing: 0.5,
  },
})

