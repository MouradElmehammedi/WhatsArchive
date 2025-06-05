import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Message } from "../utils/types";

interface MediaMessageProps {
  message: Message;
}

const MediaMessage: React.FC<MediaMessageProps> = ({ message }) => {
  const getMediaIcon = (mediaType?: string) => {
    switch (mediaType) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      case 'document':
        return '📄';
      default:
        return '📎';
    }
  };

  const getMediaDescription = (mediaType?: string) => {
    switch (mediaType) {
      case 'image':
        return 'Image';
      case 'video':
        return 'Video';
      case 'audio':
        return 'Audio';
      case 'document':
        return 'Document';
      default:
        return 'Media';
    }
  };

  const handleMediaPress = () => {
    const mediaInfo = message.mediaFileName || `${getMediaDescription(message.mediaType)} file`;
    Alert.alert(
      "Media File",
      `${mediaInfo}\n\nNote: Media files are not currently supported in Expo Go. This feature will be available in standalone builds.`,
      [{ text: "OK" }]
    );
  };

  if (!message.isMedia) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.mediaContainer} onPress={handleMediaPress}>
      <View style={styles.mediaContent}>
        <Text style={styles.mediaIcon}>{getMediaIcon(message.mediaType)}</Text>
        <View style={styles.mediaInfo}>
          <Text style={styles.mediaType}>{getMediaDescription(message.mediaType)}</Text>
          {message.mediaFileName && (
            <Text style={styles.mediaFileName} numberOfLines={1}>
              {message.mediaFileName}
            </Text>
          )}
        </View>
      </View>
      {message.content && message.content.trim() !== '' && (
        <Text style={styles.mediaCaption}>{message.content}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mediaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  mediaInfo: {
    flex: 1,
  },
  mediaType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  mediaFileName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  mediaCaption: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default MediaMessage;
