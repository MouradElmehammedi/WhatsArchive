import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const ChatScreen = ({ route }: any) => {
  const { chatData, contactName } = route.params;

  // TODO: Transform chatData to GiftedChat format
  const messages = [
    {
      _id: 1,
      text: "Hello",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: contactName,
      },
    },
  ];

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        user={{ _id: 1 }} // Current user ID
        showUserAvatar
        renderUsernameOnMessage
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
