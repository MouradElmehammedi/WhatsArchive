import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import { Chat } from "../utils/types";
import { loadConversations, saveConversation } from "../utils/storage";
import { parseChatFile } from "../utils/parsers";

const HomeScreen = ({ navigation }: { navigation: any }) => {
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
    }
  };

  const handleUpload = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Pick a text file (temporary solution)
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

      // 2. Read the chat file directly
      const content = await FileSystem.readAsStringAsync(fileUri);

      // 3. Parse the chat file using enhanced parser
      const { messages, participants } = parseChatFile(content);

      console.log(messages, participants);

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
      setConversations((prev) => [conversation, ...prev]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Upload failed:", err);
      setError("Failed to process the chat file. Please ensure you selected a valid WhatsApp chat export text file.");
    }
  };

  const renderConversationItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() =>
        navigation.navigate("Chat", {
          chatData: item.messages,
          contactName: item.contactName,
          participants: item.participants || [item.contactName],
        })
      }
    >
      <Text style={styles.conversationName}>{item.contactName}</Text>
      <Text style={styles.conversationPreview}>
        {item.messages.length > 0 ? item.messages[item.messages.length - 1].content.substring(0, 30) + "..." : "No messages"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WhatsArchive Viewer</Text>

      <View style={styles.uploadSection}>
        <Button title="Upload Chat File (.txt)" onPress={handleUpload} disabled={isLoading} />
        <Text style={styles.helpText}>
          📝 Currently supports individual WhatsApp chat export text files.{"\n"}
          💡 To export: Open WhatsApp → Chat → More → Export Chat → Without Media
        </Text>
      </View>

      {isLoading && <ActivityIndicator style={styles.loader} size="large" />}

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.sectionTitle}>Your Conversations</Text>

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 10,
  },
  conversationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
