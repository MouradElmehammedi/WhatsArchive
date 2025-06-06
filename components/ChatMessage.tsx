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
  const formatTimestamp = (date: Date | string | undefined) => {
    if (!date) return "Unknown time";
    
    try {
      const messageDate = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const isToday = messageDate.toDateString() === now.toDateString();
      const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === messageDate.toDateString();

      const timeStr = messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      
      if (isToday) {
        return `Today, ${timeStr}`;
      } else if (isYesterday) {
        return `Yesterday, ${timeStr}`;
      } else {
        return messageDate.toLocaleDateString([], { 
          month: 'short', 
          day: 'numeric',
          hour: "2-digit", 
          minute: "2-digit"
        });
      }
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };

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
          {formatTimestamp(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 2,
    marginHorizontal: 8,
    paddingHorizontal: 4,
  },
  currentUserMessage: {
    alignItems: "flex-end",
  },
  otherUserMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  currentUserBubble: {
    backgroundColor: "#DCF8C6",
    borderTopRightRadius: 0,
  },
  otherUserBubble: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 0,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#075E54",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: "#000000",
  },
  otherUserText: {
    color: "#000000",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.7,
    alignSelf: "flex-end",
  },
  currentUserTimestamp: {
    color: "#667781",
  },
  otherUserTimestamp: {
    color: "#667781",
  },
});

export default ChatMessage;
