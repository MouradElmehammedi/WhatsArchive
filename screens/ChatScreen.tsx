import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import SimpleChatView from "../components/SimpleChatView";
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

  // Determine initial user (default to the first participant that isn't Mourad)
  const getInitialUser = () => {
    const nonMouradParticipants = participants.filter((p) => p !== "Mourad");
    return nonMouradParticipants[0] || participants[0] || "You";
  };

  const [currentUser, setCurrentUser] = useState<string>(getInitialUser());

  // Transform messages to include position information
  const transformedMessages = useMemo(() => {
    return chatData.map((message) => ({
      ...message,
      position: message.sender === "Mourad" ? "left" : "right",
      isCurrentUser: message.sender === currentUser,
    }));
  }, [chatData, currentUser]);

  const handleUserSelection = () => {
    if (participants.length <= 2) {
      const buttons = participants.map((participant) => ({
        text: participant,
        onPress: () => setCurrentUser(participant),
      }));

      buttons.push({
        text: "Cancel",
        onPress: () => {},
      });

      Alert.alert("Select Your Identity", "Which participant are you in this conversation?", buttons);
    }
  };

  return (
    <View style={styles.container}>
      <SimpleChatView messages={transformedMessages} participants={participants} currentUserName={currentUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  userSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  userSelectorText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  changeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ChatScreen;
