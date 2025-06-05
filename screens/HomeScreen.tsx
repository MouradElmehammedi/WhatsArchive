import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const handleUpload = () => {
    // TODO: Implement ZIP upload
    console.log("Upload button pressed");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WhatsArchive Viewer</Text>
      <Button title="Upload WhatsApp Export (ZIP)" onPress={handleUpload} />
      {/* TODO: Add list of conversations after upload */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
