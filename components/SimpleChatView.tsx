import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { Message } from "../utils/types";
import ChatMessage from "./ChatMessage";

interface SimpleChatViewProps {
  messages: Message[];
  participants: string[];
  currentUserName?: string;
}

const SimpleChatView: React.FC<SimpleChatViewProps> = ({ messages, participants, currentUserName }) => {
  // Determine current user based on participants
  // If no currentUserName is provided, try to guess from common patterns
  console.log(messages, participants, currentUserName);
  const determineCurrentUser = (): string => {
    if (currentUserName && currentUserName !== "Mourad") return currentUserName;

    // Look for common patterns that indicate the current user
    const possibleCurrentUsers = participants.filter(
      (name) => name.toLowerCase().includes("Mourad") || name.toLowerCase().includes("me") || name === "Mourad"
    );

    if (possibleCurrentUsers.length > 0) {
      return possibleCurrentUsers[0];
    }

    // For 2-person chats, we need to make a choice
    // We'll use the first participant as default, but this can be customized
    // In a real app, Mourad'd want to let the user choose or detect from export metadata
    return participants[0] || "Mourad";
  };

  const currentUser = determineCurrentUser();

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.sender === currentUser;

    return (
      <ChatMessage
        key={index}
        message={item}
        isCurrentUser={isCurrentUser}
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
