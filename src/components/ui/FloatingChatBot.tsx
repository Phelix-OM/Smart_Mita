"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BunnyAvatar } from "./BunnyAvatar"

// Define message type
interface ChatMessage {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

// Energy-related keywords for response matching
const ENERGY_KEYWORDS = [
  "energy",
  "electricity",
  "power",
  "consumption",
  "usage",
  "bill",
  "cost",
  "saving",
  "efficient",
  "solar",
  "renewable",
  "green",
  "sustainable",
  "kilowatt",
  "kwh",
  "meter",
  "appliance",
  "device",
  "monitor",
  "track",
  "reduce",
  "compare",
  "benchmark",
  "average",
  "tips",
  "advice",
  "help",
]

// Greeting keywords
const GREETING_KEYWORDS = [
  "hi",
  "hello",
  "hey",
  "greetings",
  "howdy",
  "hola",
  "good morning",
  "good afternoon",
  "good evening",
  "what's up",
  "sup",
]

// Farewell keywords
const FAREWELL_KEYWORDS = [
  "bye",
  "goodbye",
  "see you",
  "later",
  "farewell",
  "adios",
  "ciao",
  "take care",
  "until next time",
  "have a good day",
]

// Thank you keywords
const THANK_YOU_KEYWORDS = ["thanks", "thank you", "appreciate", "grateful", "thx", "ty"]

// Help keywords
const HELP_KEYWORDS = [
  "help",
  "assist",
  "support",
  "guide",
  "how to",
  "what can you do",
  "what do you do",
  "capabilities",
  "features",
]

// Energy saving tips
const ENERGY_SAVING_TIPS = [
  "Turn off lights when not in use to save up to 10% on your electricity bill.",
  "Set your air conditioner to 24°C instead of 20°C to save up to 20% on cooling costs.",
  "Unplug devices when not in use to eliminate standby power consumption.",
  "Replace traditional bulbs with LED lights to save up to 80% on lighting costs.",
  "Use a programmable thermostat to automatically adjust temperature settings.",
  "Wash clothes in cold water to save energy used for heating.",
  "Air dry clothes instead of using a dryer when possible.",
  "Keep your refrigerator coils clean to improve efficiency.",
  "Use power strips to easily turn off multiple devices at once.",
  "Install weatherstripping around doors and windows to prevent air leaks.",
  "Use ceiling fans to circulate air and reduce the need for air conditioning.",
  "Cook with lids on pots to reduce cooking time and energy use.",
  "Run dishwashers and washing machines only when full.",
  "Use natural light during the day instead of artificial lighting.",
  "Regularly maintain your HVAC system for optimal efficiency.",
]

// App feature explanations
const APP_FEATURES = [
  "You can track your daily, weekly, and monthly energy consumption in the Dashboard.",
  "The Analytics screen shows detailed breakdowns of your energy usage by device.",
  "Compare your energy usage with similar households in the Benchmark section.",
  "Set up alerts for unusual energy consumption patterns in Settings.",
  "View personalized energy-saving recommendations based on your usage patterns.",
  "Connect your utility account to get real-time energy data.",
  "Export your energy data for further analysis.",
  "Set energy-saving goals and track your progress over time.",
  "Receive notifications about potential energy-saving opportunities.",
  "Use the device detection feature to identify energy-hungry appliances.",
]

/**
 * Generate a chatbot response based on user input and conversation history
 */
const generateChatbotResponse = async (userMessage: string, conversationHistory: ChatMessage[]): Promise<string> => {
  // Convert user message to lowercase for easier matching
  const message = userMessage.toLowerCase()

  // Add a small delay to simulate processing time (300-800ms)
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 300))

  // Check for greetings
  if (GREETING_KEYWORDS.some((keyword) => message.includes(keyword))) {
    return "Hello there! I'm Bunny, your energy assistant. How can I help you with your energy management today?"
  }

  // Check for farewells
  if (FAREWELL_KEYWORDS.some((keyword) => message.includes(keyword))) {
    return "Goodbye! Feel free to chat with me anytime you need help with your energy management."
  }

  // Check for thank you
  if (THANK_YOU_KEYWORDS.some((keyword) => message.includes(keyword))) {
    return "You're welcome! I'm happy to help. Is there anything else you'd like to know about your energy usage?"
  }

  // Check for help request
  if (HELP_KEYWORDS.some((keyword) => message.includes(keyword))) {
    return "I can help you understand your energy usage, provide energy-saving tips, explain app features, and answer questions about your energy consumption. What would you like to know?"
  }

  // Check for energy saving tips request
  if (
    message.includes("tip") ||
    message.includes("advice") ||
    message.includes("suggestion") ||
    (message.includes("how") && message.includes("save"))
  ) {
    // Return a random energy saving tip
    return ENERGY_SAVING_TIPS[Math.floor(Math.random() * ENERGY_SAVING_TIPS.length)]
  }

  // Check for app features question
  if (
    message.includes("feature") ||
    message.includes("do") ||
    message.includes("function") ||
    message.includes("capability") ||
    message.includes("what can") ||
    message.includes("how to use")
  ) {
    // Return a random app feature explanation
    return APP_FEATURES[Math.floor(Math.random() * APP_FEATURES.length)]
  }

  // Check for bill-related questions
  if (
    message.includes("bill") ||
    message.includes("cost") ||
    message.includes("price") ||
    message.includes("expensive") ||
    message.includes("charge")
  ) {
    return "Your estimated bill based on current usage is shown on the Dashboard. You can also see a cost breakdown by device in the Analytics section. Would you like me to explain how to reduce your energy costs?"
  }

  // Check for comparison questions
  if (
    message.includes("compare") ||
    message.includes("benchmark") ||
    message.includes("neighbor") ||
    message.includes("average") ||
    message.includes("normal")
  ) {
    return "You can compare your energy usage with similar households in the Benchmark section. Your current usage is about 15% below the neighborhood average, which is great! Keep up the good work."
  }

  // Check for device-specific questions
  if (
    message.includes("device") ||
    message.includes("appliance") ||
    message.includes("refrigerator") ||
    message.includes("ac") ||
    message.includes("air conditioner") ||
    message.includes("heater") ||
    message.includes("tv") ||
    message.includes("computer")
  ) {
    return "Your device usage breakdown is available in the Analytics section. Currently, your air conditioner is using the most energy (about 45% of total), followed by water heating (28%). Would you like specific tips to reduce consumption for these devices?"
  }

  // Check if message contains any energy-related keywords
  const containsEnergyKeyword = ENERGY_KEYWORDS.some((keyword) => message.includes(keyword))

  if (containsEnergyKeyword) {
    return "Based on your energy data, you're using about 28.5 kWh daily, which is 5.2% less than last week. Great job! Would you like to see more detailed analytics or get tips on how to save even more?"
  }

  // Default response for messages that don't match any patterns
  return "I'm not sure I understand. As your energy assistant, I can help with questions about your energy usage, provide saving tips, or explain app features. How can I assist you with your energy management?"
}

const FloatingChatbot: React.FC = () => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Hi there! I'm Bunny, your energy assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current
  const modalScale = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(1)).current
  const listRef = useRef<FlatList>(null)

  // Track keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true)
    })
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false)
    })

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // Button press animation
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  // Open/close chat modal with animation
  const toggleChat = () => {
    animateButton()

    if (isOpen) {
      Animated.timing(modalScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsOpen(false))
    } else {
      setIsOpen(true)
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }

  // Floating button animation
  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    )

    floatAnimation.start()

    return () => {
      floatAnimation.stop()
    }
  }, [fadeAnim])

  // Send message handler
  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsTyping(true)

    // Scroll to bottom
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true })
    }, 100)

    try {
      // Generate bot response
      const response = await generateChatbotResponse(message, messages)

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)

      // Scroll to bottom again after bot response
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true })
      }, 100)
    } catch (error) {
      console.error("Error generating response:", error)
      setIsTyping(false)

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    }
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Render message item
  const renderMessageItem = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user"
          ? [styles.userBubble, { backgroundColor: colors.primary }]
          : [styles.botBubble, { backgroundColor: colors.card }],
      ]}
    >
      {item.sender === "bot" && (
        <View style={styles.avatarContainer}>
          <BunnyAvatar size={30} />
        </View>
      )}
      <View style={styles.messageContent}>
        <Text style={[styles.messageText, { color: item.sender === "user" ? colors.white : colors.text }]}>
          {item.text}
        </Text>
        <Text
          style={[styles.timestamp, { color: item.sender === "user" ? colors.white + "90" : colors.textSecondary }]}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  )

  return (
    <>
      {/* Floating Chat Button */}
      <Animated.View
        style={[
          styles.floatingButton,
          {
            backgroundColor: colors.primary || '#6366f1', // Fallback color
            transform: [{ scale: buttonScale }, { translateY: fadeAnim }],
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={toggleChat} style={styles.buttonTouchable}>
          <BunnyAvatar size={50} />
        </TouchableOpacity>
      </Animated.View>

      {/* Chat Modal */}
      <Modal visible={isOpen} transparent animationType="none">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.chatContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                transform: [{ scale: modalScale }],
                maxHeight: keyboardVisible
                  ? Dimensions.get("window").height - 150
                  : Dimensions.get("window").height - 100,
              },
            ]}
          >
            {/* Chat Header */}
            <View style={[styles.chatHeader, { backgroundColor: colors.primary }]}>
              <View style={styles.headerContent}>
                <BunnyAvatar size={36} />
                <Text style={styles.chatTitle}>Bunny Assistant</Text>
              </View>
              <TouchableOpacity onPress={toggleChat} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
              ref={listRef}
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Typing Indicator */}
            {isTyping && (
              <View style={[styles.typingIndicator, { backgroundColor: colors.card }]}>
                <Text style={[styles.typingText, { color: colors.textSecondary }]}>Bunny is typing...</Text>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, { backgroundColor: colors.primary }]} />
                  <View style={[styles.typingDot, { backgroundColor: colors.primary, opacity: 0.7 }]} />
                  <View style={[styles.typingDot, { backgroundColor: colors.primary, opacity: 0.4 }]} />
                </View>
              </View>
            )}

            {/* Input Area */}
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="Type a message..."
                placeholderTextColor={colors.textSecondary}
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: colors.primary }]}
                onPress={handleSendMessage}
                disabled={!message.trim() || isTyping}
              >
                <Ionicons name="send" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20, // Fixed position from bottom
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10, // Increased elevation for Android
    zIndex: 9999, // Very high z-index
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonTouchable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  chatContainer: {
    width: "90%",
    maxWidth: 400,
    height: "80%",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    marginBottom: 12,
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: "50%",
  },
  typingText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginRight: 8,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontFamily: "Poppins-Regular",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
})

export default FloatingChatbot