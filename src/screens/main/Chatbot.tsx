import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ChatbotAssistant = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const fadeAnim = new Animated.Value(0);

  // Comprehensive AI response generation
  const generateAIResponse = (userMessage) => {
    const responseCategories = {
      greeting: [
        'Hello there! It\'s great to meet you.',
        'Hi! I\'m your friendly AI assistant.',
        'Greetings! What can I do for you today?',
        'Welcome! I\'m excited to help you.',
        'Good day! How can I assist you?',
        'Hey there! Ready to make your day easier.',
        'Hi friend! What brings you here today?',
        'Hello! I\'m your digital companion.',
        'Greetings from the world of AI!',
        'Welcome aboard! How can I help?',
        'Hi there! Ready to tackle any challenge.',
        'Hello! I\'m here to make your life simpler.',
        'Greetings! Your personal AI assistant at your service.',
        'Hi! Let\'s solve something amazing today.',
        'Welcome! I\'m all ears and algorithms.'
      ],
      help: [
        'I\'m here to assist you with anything you need!',
        'How can I make your day easier?',
        'Let me help you find the information you\'re looking for.',
        'What can I help you with today?',
        'I\'m ready to provide top-notch assistance.',
        'Your mission is my priority. How can I help?',
        'Feeling stuck? I\'m here to guide you.',
        'Need some expert advice? You\'ve come to the right place.',
        'Let\'s work together to solve your challenge.',
        'I\'m fully equipped to help you out.',
        'Your success is my ultimate goal.',
        'How can I support you right now?',
        'I\'m all about finding smart solutions.',
        'Bring on your questions – I\'m ready!',
        'Looking to simplify something? I\'m your assistant.'
      ],
      uncertain: [
        'Hmm, that\'s an interesting question...',
        'Let me think about that for a moment.',
        'I\'m processing your request carefully.',
        'Fascinating query! Give me a second to analyze.',
        'Interesting challenge you\'ve presented.',
        'Let me dig deep into my knowledge base.',
        'That\'s a thought-provoking question.',
        'Hmm, let me connect the dots for you.',
        'Intriguing! Allow me to investigate.',
        'Processing your unique request...',
        'Analyzing the details of your query.',
        'Fascinating approach! Let me help you.',
        'Diving into the depths of your question.',
        'Creating a comprehensive response for you.',
        'Let\'s unpack this together.'
      ],
      energy: [
        'Energy management is crucial for sustainability!',
        'Smart energy solutions can make a huge difference.',
        'Let\'s optimize your energy consumption.',
        'Efficient energy use is key to reducing costs and environmental impact.',
        'How can we make your energy usage smarter?',
        'I\'m passionate about innovative energy solutions.',
        'Every kilowatt saved is a step towards a greener future.',
        'Energy efficiency is more than just saving money.',
        'Let\'s explore how technology can improve energy management.',
        'Smart meters, renewable energy, conservation – I\'m your expert!',
        'Understanding energy consumption is the first step to optimization.',
        'Your energy, your control – let me help you manage it.',
        'From solar to smart grids, I can explain it all.',
        'Energy management: where technology meets sustainability.',
        'Let\'s make your energy usage as smart as possible!'
      ],
      general: [
        'Interesting! Tell me more about that.',
        'I\'m here and ready to help in any way I can.',
        'Let\'s dive deeper into your thoughts.',
        'Your perspective is valuable to me.',
        'I\'m listening and ready to assist.',
        'How can I support you right now?',
        'I\'m all ears and ready to help.',
        'Your input is important to me.',
        'Let\'s explore this together.',
        'I\'m here to provide insights and support.',
        'What would you like to know more about?',
        'I\'m committed to helping you find answers.',
        'Your curiosity is inspiring!',
        'Let\'s break this down together.',
        'I\'m fully engaged and ready to help.'
      ]
    };

    // Advanced message categorization
    const categorizeMessage = (message) => {
      const lowercaseMessage = message.toLowerCase();
      
      // Specific category matching
      if (/\b(hi|hello|hey|greetings)\b/.test(lowercaseMessage)) return 'greeting';
      if (/\b(help|assist|how|what|why|can you)\b/.test(lowercaseMessage)) return 'help';
      if (/\b(energy|power|electricity|consumption|solar|grid)\b/.test(lowercaseMessage)) return 'energy';
      
      // Fallback categories
      return Math.random() > 0.5 ? 'uncertain' : 'general';
    };

    // Response generation logic
    const category = categorizeMessage(userMessage);
    const responses = responseCategories[category];
    
    // Add contextual flair
    const contextualResponses = responses.map(response =>
      `${response} Hello Regarding your message about "${userMessage}", I'm ready to help! `
    );
    
    // Random response selection with context
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = { sender: 'user', text: inputText };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Generate AI response with slight delay
    setTimeout(() => {
      const aiResponse = {
        sender: 'ai',
        text: generateAIResponse(inputText)
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);

    setInputText('');
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    Animated.timing(fadeAnim, {
      toValue: isModalVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Floating Chatbot Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={toggleModal}
          >
            
        <Image
          source={require('C:\\Users\\Administrator\\QUANTUM\\smartmita\\assets\\images\\chatbot2.png')}
          style={styles.robotIcon}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1]
              })
            }
          ]}
        >
          <LinearGradient
            colors={['#F0F4F8', '#DCE6F0']}
            style={styles.chatContainer}
          >
            {/* Chat Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>🤖 AI Assistant</Text>
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.closeButton}>✖</Text>
              </TouchableOpacity>
            </View>

            {/* Messages Scroll View */}
            <ScrollView
              style={styles.messagesContainer}
              ref={ref => {this.scrollView = ref}}
              onContentSizeChange={() =>
                this.scrollView.scrollToEnd({animated: true})
              }
            >
              {messages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageWrapper,
                    message.sender === 'user'
                      ? styles.userMessageWrapper
                      : styles.aiMessageWrapper
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'user'
                        ? styles.userMessage
                        : styles.aiMessage
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000
  },
  floatingButton: {
    width: 70,
    height: 70,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5
    },
    TextIcon: {
        fontSize: 20,
        fontFamily:'Arial'
        
  },
  robotIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
    chatContainer: {
    width:300,
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
        padding: 15,
    backgroundColor: 'white'
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  closeButton: {
    color: 'red',
    fontSize: 18
  },
  messagesContainer: {
    flex: 1,
    marginVertical: 10
  },
  messageWrapper: {
    marginVertical: 5,
    maxWidth: '80%'
  },
  userMessageWrapper: {
    alignSelf: 'flex-end'
  },
  aiMessageWrapper: {
    alignSelf: 'flex-start'
  },
  messageText: {
    padding: 10,
    borderRadius: 10
  },
  userMessage: {
    backgroundColor: '#E6F2FF',
    color: '#0066CC'
  },
  aiMessage: {
    backgroundColor: '#F0F0F0',
    color: '#333'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default ChatbotAssistant;