import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import { Chat } from "../utils/types";
import { loadConversations, saveConversation, deleteConversation, clearAllConversations } from "../utils/storage";
import { parseChatFile } from "../utils/parsers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
};

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { top } = useSafeAreaInsets();
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load previously extracted conversations on app start
  useEffect(() => {
    loadSavedConversations();
  }, []);

  const loadSavedConversations = async () => {
    try {
      const loadedConversations = await loadConversations();
      setConversations(loadedConversations);
    } catch (err) {
      console.error("Failed to load saved conversations:", err);
      setError("Failed to load saved conversations. Please try again.");
    }
  };

  const handleUpload = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Pick a text file
      const res = await DocumentPicker.getDocumentAsync({
        type: "text/plain",
        copyToCacheDirectory: true,
      });

      if (res.canceled) {
        setIsLoading(false);
        return;
      }

      const fileUri = res.assets[0].uri;
      const fileName = res.assets[0].name || "Unknown";

      // 2. Read the chat file
      const content = await FileSystem.readAsStringAsync(fileUri);

      // 3. Parse the chat file
      const { messages, participants } = parseChatFile(content);

      // Extract contact name from filename or use participants
      let contactName = fileName.replace("_chat.txt", "").replace(".txt", "") || "Unknown";

      // If the filename doesn't provide a good name, use participants
      if (contactName === "chat" || contactName === "_chat" || contactName === "Unknown") {
        contactName = participants.chatTitle;
      }

      const conversation: Chat = {
        contactName,
        messages,
        participants: participants.participants,
      };

      // Save the parsed conversation
      await saveConversation(conversation);
      await loadSavedConversations(); // Reload all conversations
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Upload failed:", err);
      setError("Failed to process the chat file. Please ensure you selected a valid WhatsApp chat export text file.");
    }
  };

  const handleDeleteConversation = async (contactName: string) => {
    Alert.alert(
      "Delete Conversation",
      `Are you sure you want to delete the conversation with ${contactName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteConversation(contactName);
            if (success) {
              await loadSavedConversations();
            } else {
              setError("Failed to delete conversation. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleClearAll = async () => {
    Alert.alert(
      "Clear All Conversations",
      "Are you sure you want to delete all conversations? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            const success = await clearAllConversations();
            if (success) {
              setConversations([]);
            } else {
              setError("Failed to clear conversations. Please try again.");
            }
          },
        },
      ]
    );
  };

  const renderConversationItem = ({ item, index }: { item: Chat; index: number }) => (
    <TouchableOpacity
      key={index}
      style={styles.conversationItem}
      onPress={() =>
        navigation.navigate("Chat", {
          chatData: item.messages,
          contactName: item.contactName,
          participants: item.participants || [item.contactName],
        })
      }
      onLongPress={() => handleDeleteConversation(item.contactName)}
    >
      <View style={styles.conversationItemContent}>
        <Avatar name={item.contactName} />
        <View style={styles.conversationTextContainer}>
          <Text style={styles.conversationName}>{item.contactName}</Text>
          <Text style={styles.conversationPreview}>
            {item.messages.length > 0 ? item.messages[item.messages.length - 1].content.substring(0, 30) + "..." : "No messages"}
          </Text>
          <Text style={styles.conversationMeta}>
            {item.messageCount} messages • Last updated: {new Date(item.lastUpdated || "").toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: top + 10 }]}>
      <Text style={styles.title}>iChatView</Text>

      <View style={styles.uploadSection}>
        <Button color="#075E54" title="Upload Chat File (.txt)" onPress={handleUpload} disabled={isLoading} />
        <Text style={styles.helpText}>
          📝 Currently supports individual WhatsApp chat export text files.{"\n"}
          💡 To export: Open WhatsApp → Chat → More → Export Chat → Without Media
        </Text>
      </View>

      {isLoading && <ActivityIndicator style={styles.loader} size="large" />}

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>Conversations</Text>
        {conversations.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.contactName}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No conversations found. Upload a WhatsApp export to get started.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearAllButton: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "600",
  },
  conversationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  conversationItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  conversationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  conversationPreview: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  conversationMeta: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#075E54",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  loader: {
    marginVertical: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  uploadSection: {
    marginBottom: 20,
  },
  helpText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 16,
  },
});

export default HomeScreen;
