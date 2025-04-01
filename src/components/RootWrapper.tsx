import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import FloatingChatbot from "@/src/components/ui/FloatingChatBot";

interface RootWrapperProps {
  children: ReactNode;
}

const RootWrapper = ({ children }: RootWrapperProps) => {
  return (
    <View style={styles.container}>
      {children}
      <FloatingChatbot />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Important for absolute positioning of children
  },
});

export default RootWrapper;