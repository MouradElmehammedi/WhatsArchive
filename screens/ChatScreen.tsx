import React, { useMemo } from "react";
import { View, StyleSheet, Text, SafeAreaView, StatusBar } from "react-native";
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

  // Transform messages to include position information
  const transformedMessages = useMemo(() => {
    return chatData.map((message: Message) => ({
      ...message,
      position: message.sender === "Mourad" ? "right" : "left",
      isCurrentUser: message.sender === "Mourad",
    }));
  }, [chatData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
       
      <SimpleChatView messages={transformedMessages} participants={participants} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECE5DD",
  },
  header: {
    backgroundColor: "#075E54",
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#128C7E",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
  },
});

export default ChatScreen;
