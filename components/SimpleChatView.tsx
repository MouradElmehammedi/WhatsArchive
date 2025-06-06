import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { Message } from "../utils/types";
import ChatMessage from "./ChatMessage";

interface SimpleChatViewProps {
  messages: Message[];
  participants: string[];
}

const SimpleChatView: React.FC<SimpleChatViewProps> = ({ messages, participants }) => {
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    return (
      <ChatMessage
        key={index}
        message={item}
        isCurrentUser={item.sender === "Mourad"}
        showSenderName={participants.length > 2} // Only show names in group chats
      />
    );
  };

  if (messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No messages in this conversation</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => `message-${index}`}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        inverted={false} // Show oldest messages at top
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default SimpleChatView;
