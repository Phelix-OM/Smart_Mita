"use client"

import  React from "react"
import { View, StyleSheet } from "react-native"
import Svg, { Circle, Ellipse, Path } from "react-native-svg"

interface BunnyAvatarProps {
  size: number
}

export const BunnyAvatar: React.FC<BunnyAvatarProps> = ({ size }) => {
  // Scale all dimensions based on the size prop
  const scale = size / 100

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Background Circle */}
        <Circle cx="50" cy="50" r="50" fill="#FFFFFF" />

        {/* Bunny Face */}
        <Circle cx="50" cy="55" r="40" fill="#F8E6FF" />

        {/* Ears */}
        <Ellipse cx="30" cy="20" rx="15" ry="25" fill="#F8E6FF" />
        <Ellipse cx="70" cy="20" rx="15" ry="25" fill="#F8E6FF" />

        {/* Inner Ears */}
        <Ellipse cx="30" cy="20" rx="8" ry="18" fill="#FFCCE5" />
        <Ellipse cx="70" cy="20" rx="8" ry="18" fill="#FFCCE5" />

        {/* Eyes */}
        <Circle cx="35" cy="50" r="5" fill="#333333" />
        <Circle cx="65" cy="50" r="5" fill="#333333" />

        {/* Eye Highlights */}
        <Circle cx="33" cy="48" r="2" fill="#FFFFFF" />
        <Circle cx="63" cy="48" r="2" fill="#FFFFFF" />

        {/* Nose */}
        <Ellipse cx="50" cy="60" rx="6" ry="4" fill="#FFCCE5" />

        {/* Mouth */}
        <Path d="M40,65 Q50,75 60,65" stroke="#333333" strokeWidth="2" fill="none" />

        {/* Whiskers */}
        <Path d="M30,60 L15,55 M30,65 L15,65 M30,70 L15,75" stroke="#333333" strokeWidth="1.5" fill="none" />
        <Path d="M70,60 L85,55 M70,65 L85,65 M70,70 L85,75" stroke="#333333" strokeWidth="1.5" fill="none" />

        {/* Cheeks */}
        <Circle cx="30" cy="65" r="7" fill="#FFCCE5" opacity="0.6" />
        <Circle cx="70" cy="65" r="7" fill="#FFCCE5" opacity="0.6" />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
})

