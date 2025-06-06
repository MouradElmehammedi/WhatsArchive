import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView, StatusBar, ImageBackground, TouchableOpacity, TextInput, Keyboard } from "react-native";
import SimpleChatView, { SimpleChatViewRef } from "../components/SimpleChatView";
import { Message } from "../utils/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

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
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const { chatData, contactName, participants } = route.params;
  const chatViewRef = useRef<SimpleChatViewRef>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const searchInputRef = useRef<TextInput>(null);

  // Transform messages to include position information
  const transformedMessages = useMemo(() => {
    return chatData.map((message: Message) => ({
      ...message,
      position: message.sender === "Mourad" ? "right" : "left",
      isCurrentUser: message.sender === "Mourad",
    }));
  }, [chatData]);

  // Set up the header with search icon
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setIsSearchVisible(true);
            // Focus the search input after a short delay
            setTimeout(() => searchInputRef.current?.focus(), 100);
          }}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>🔍</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleScrollToTop = () => {
    chatViewRef.current?.scrollToTop();
  };

  const handleScrollToBottom = () => {
    chatViewRef.current?.scrollToBottom();
  };

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
      return;
    }

    const results = transformedMessages
      .map((msg: Message & { position: string; isCurrentUser: boolean }, index: number) => ({
        index,
        content: msg.content.toLowerCase(),
      }))
      .filter((msg: { index: number; content: string }) => msg.content.includes(text.toLowerCase()))
      .map((msg: { index: number; content: string }) => msg.index);

    setSearchResults(results);
    setCurrentSearchIndex(results.length > 0 ? 0 : -1);
  };

  // Navigate to next/previous search result
  const navigateSearchResult = (direction: "next" | "prev") => {
    if (searchResults.length === 0) return;

    let newIndex = currentSearchIndex;
    if (direction === "next") {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
    }

    setCurrentSearchIndex(newIndex);
    const messageIndex = searchResults[newIndex];
    
    // Scroll to the message
    chatViewRef.current?.scrollToIndex?.(messageIndex);
  };

  // Render search bar
  const renderSearchBar = () => { 
    return (
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search in conversation"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          /> 
        </View>
        {searchQuery.trim() !== "" && (
          <View style={styles.searchControls}>
            <Text style={styles.searchResults}>
              {searchResults.length > 0
                ? `${currentSearchIndex + 1}/${searchResults.length}`
                : "No results"}
            </Text>
            <View style={styles.searchButtons}>
              <TouchableOpacity
                onPress={() => navigateSearchResult("prev")}
                disabled={searchResults.length === 0}
                style={[
                  styles.searchButton,
                  searchResults.length === 0 && styles.searchButtonDisabled,
                ]}
              >
                <Text style={styles.searchButtonText}>↑</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigateSearchResult("next")}
                disabled={searchResults.length === 0}
                style={[
                  styles.searchButton,
                  searchResults.length === 0 && styles.searchButtonDisabled,
                ]}
              >
                <Text style={styles.searchButtonText}>↓</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground 
      source={require("../assets/chats-bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={[styles.container, { paddingTop: top + 10 }]}>
        <StatusBar backgroundColor="#075E54" barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{contactName}</Text>
          </View>
          <View style={styles.navButtons}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleScrollToTop}
            >
              <Text style={styles.navButtonText}>↑</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleScrollToBottom}
            >
              <Text style={styles.navButtonText}>↓</Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderSearchBar()}
        <SimpleChatView 
          ref={chatViewRef}
          messages={transformedMessages} 
          participants={participants}
          onScrollToTop={() => console.log('Scrolled to top')}
          onScrollToBottom={() => console.log('Scrolled to bottom')}
          searchResults={searchResults}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: "#075E54",
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#128C7E",
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButton: {
    marginRight: 15,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  closeButtonText: {
    color: "#075E54",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  searchResults: {
    color: "#075E54",
    fontSize: 14,
  },
  searchButtons: {
    flexDirection: "row",
  },
  searchButton: {
    padding: 5,
    marginLeft: 10,
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    color: "#075E54",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChatScreen;
