import * as FileSystem from "expo-file-system";
import { Chat } from "./types";

const BASE_DIR = FileSystem.documentDirectory + "whatsarchive/";
const CONVERSATIONS_DIR = BASE_DIR + "conversations/";

// Sanitize filename to be safe for storage
const sanitizeFileName = (name: string): string => {
  return name
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()
    .substring(0, 50); // Limit length
};

// Ensure path has proper separators
const ensurePath = (path: string): string => {
  return path.replace(/\/+/g, "/"); // Replace multiple slashes with single slash
};

export const initStorage = async () => {
  try {
    // Check and create base directory
    const baseDirInfo = await FileSystem.getInfoAsync(ensurePath(BASE_DIR));
    if (!baseDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(ensurePath(BASE_DIR), { intermediates: true });
    }

    // Check and create conversations directory
    const conversationsDirInfo = await FileSystem.getInfoAsync(ensurePath(CONVERSATIONS_DIR));
    if (!conversationsDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(ensurePath(CONVERSATIONS_DIR), { intermediates: true });
    }
  } catch (err) {
    console.error("Error initializing storage:", err);
    throw new Error("Failed to initialize storage directories");
  }
};

export const saveConversation = async (chat: Chat) => {
  try {
    await initStorage();
    const safeFileName = sanitizeFileName(chat.contactName);
    const filePath = ensurePath(`${CONVERSATIONS_DIR}${safeFileName}.json`);
    
    // Add metadata
    const chatWithMetadata = {
      ...chat,
      lastUpdated: new Date().toISOString(),
      messageCount: chat.messages.length,
    };

    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(chatWithMetadata));
    return safeFileName;
  } catch (err) {
    console.error("Error saving conversation:", err);
    throw new Error("Failed to save conversation");
  }
};

export const loadConversations = async (): Promise<Chat[]> => {
  try {
    await initStorage();
    const dirInfo = await FileSystem.getInfoAsync(ensurePath(CONVERSATIONS_DIR));

    if (!dirInfo.exists) return [];

    const files = await FileSystem.readDirectoryAsync(dirInfo.uri);
    const chatFiles = files.filter((file) => file.endsWith(".json"));

    const conversations = await Promise.all(
      chatFiles.map(async (file) => {
        try {
          const filePath = ensurePath(`${CONVERSATIONS_DIR}${file}`);
          const content = await FileSystem.readAsStringAsync(filePath);
          return JSON.parse(content) as Chat;
        } catch (err) {
          console.error(`Error loading conversation ${file}:`, err);
          return null;
        }
      })
    );

    // Filter out any failed loads and sort by last updated
    return conversations
      .filter((chat): chat is Chat => chat !== null)
      .sort((a, b) => {
        const dateA = new Date(a.lastUpdated || 0);
        const dateB = new Date(b.lastUpdated || 0);
        return dateB.getTime() - dateA.getTime();
      });
  } catch (err) {
    console.error("Error loading conversations:", err);
    return [];
  }
};

export const deleteConversation = async (contactName: string) => {
  try {
    const safeFileName = sanitizeFileName(contactName);
    const filePath = ensurePath(`${CONVERSATIONS_DIR}${safeFileName}.json`);
    
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
    }
    return true;
  } catch (err) {
    console.error(`Error deleting conversation ${contactName}:`, err);
    return false;
  }
};

export const clearAllConversations = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(ensurePath(CONVERSATIONS_DIR));
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(ensurePath(CONVERSATIONS_DIR), { idempotent: true });
      await FileSystem.makeDirectoryAsync(ensurePath(CONVERSATIONS_DIR), { intermediates: true });
    }
    return true;
  } catch (err) {
    console.error("Error clearing conversations:", err);
    return false;
  }
};
