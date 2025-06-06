import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { Message } from "../utils/types";
import ChatMessage from "./ChatMessage";

interface SimpleChatViewProps {
  messages: Message[];
  participants: string[];
  onScrollToTop?: () => void;
  onScrollToBottom?: () => void;
  searchResults?: number[];
}

export interface SimpleChatViewRef {
  scrollToTop: () => void;
  scrollToBottom: () => void;
  scrollToIndex: (index: number) => void;
}

const SimpleChatView = forwardRef<SimpleChatViewRef, SimpleChatViewProps>(({ 
  messages, 
  participants,
  onScrollToTop,
  onScrollToBottom,
  searchResults = []
}, ref) => {
  const flatListRef = useRef<FlatList>(null);

  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      onScrollToTop?.();
    },
    scrollToBottom: () => {
      if (messages.length > 0) {
        flatListRef.current?.scrollToEnd({ animated: true });
        onScrollToBottom?.();
      }
    },
    scrollToIndex: (index: number) => {
      if (index >= 0 && index < messages.length) {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }));

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    return (
      <ChatMessage
        key={index}
        message={item}
        isCurrentUser={item.sender === "Mourad"}
        showSenderName={participants.length > 2} // Only show names in group chats
        isHighlighted={searchResults.includes(index)}
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
        ref={flatListRef}
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1, 
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
