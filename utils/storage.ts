import * as FileSystem from "expo-file-system";
import { Chat } from "./types";

const BASE_DIR = FileSystem.documentDirectory + "whatsarchive/";

export const initStorage = async () => {
  const dirInfo = await FileSystem.getInfoAsync(BASE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(BASE_DIR);
    await FileSystem.makeDirectoryAsync(BASE_DIR + "extracted/");
  }
};

export const saveConversation = async (chat: Chat) => {
  await initStorage();
  const filePath = `${BASE_DIR}${chat.contactName}.json`;
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(chat));
};

export const loadConversations = async (): Promise<Chat[]> => {
  await initStorage();
  const dirInfo = await FileSystem.getInfoAsync(BASE_DIR);

  if (!dirInfo.exists) return [];

  const files = await FileSystem.readDirectoryAsync(dirInfo.uri);
  const chatFiles = files.filter((file) => file.endsWith(".json"));

  return Promise.all(
    chatFiles.map(async (file) => {
      const content = await FileSystem.readAsStringAsync(dirInfo.uri + file);
      return JSON.parse(content) as Chat;
    })
  );
};

export const clearAllConversations = async () => {
  await FileSystem.deleteAsync(BASE_DIR, { idempotent: true });
};
