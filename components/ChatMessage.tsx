import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Message } from "../utils/types";
import MediaMessage from "./MediaMessage";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  showSenderName?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser, showSenderName = true }) => {
  return (
    <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
      <View style={[styles.messageBubble, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
        {!isCurrentUser && showSenderName && <Text style={styles.senderName}>{message.sender}</Text>}

        {message.isMedia ? (
          <MediaMessage message={message} />
        ) : (
          <Text style={[styles.messageText, isCurrentUser ? styles.currentUserText : styles.otherUserText]}>{message.content}</Text>
        )}

        <Text style={[styles.timestamp, isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp]}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  currentUserMessage: {
    alignItems: "flex-end",
  },
  otherUserMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentUserBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: "white",
  },
  otherUserText: {
    color: "#000",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  currentUserTimestamp: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  otherUserTimestamp: {
    color: "#666",
  },
});

export default ChatMessage;
