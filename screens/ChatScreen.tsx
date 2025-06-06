import React, { useMemo, useRef } from "react";
import { View, StyleSheet, Text, SafeAreaView, StatusBar, ImageBackground, TouchableOpacity } from "react-native";
import SimpleChatView, { SimpleChatViewRef } from "../components/SimpleChatView";
import { Message } from "../utils/types";

interface ChatScreenProps {
  route: {
    params: {
      chatData: Message[];
      contactName: string;
      participants: string[];
    };
  };
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }: any) => {
  const { chatData, contactName, participants } = route.params;
  const chatViewRef = useRef<SimpleChatViewRef>(null);

  // Transform messages to include position information
  const transformedMessages = useMemo(() => {
    return chatData.map((message: Message) => ({
      ...message,
      position: message.sender === "Mourad" ? "right" : "left",
      isCurrentUser: message.sender === "Mourad",
    }));
  }, [chatData]);

  const handleScrollToTop = () => {
    chatViewRef.current?.scrollToTop();
  };

  const handleScrollToBottom = () => {
    chatViewRef.current?.scrollToBottom();
  };

  return (
    <ImageBackground 
      source={require("../assets/chats-bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#075E54" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{contactName}</Text>
          <View style={styles.navButtons}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleScrollToTop}
            >
              <Text style={styles.navButtonText}>↑</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleScrollToBottom}
            >
              <Text style={styles.navButtonText}>↓</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SimpleChatView 
          ref={chatViewRef}
          messages={transformedMessages} 
          participants={participants}
          onScrollToTop={() => console.log('Scrolled to top')}
          onScrollToBottom={() => console.log('Scrolled to bottom')}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#075E54",
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#128C7E",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
