export interface ParsedMessage {
  timestamp: Date;
  sender: string;
  content: string;
}

export interface ChatParticipants {
  participants: string[];
  chatTitle: string;
}

export const parseWhatsAppMessage = (line: string): ParsedMessage | null => {
  // Skip empty lines
  if (!line || !line.trim()) {
    return null;
  }

  // Enhanced regex to match WhatsApp message format
  // [MM/DD/YY, HH:MM:SS] Contact Name: Message content
  // Multiple patterns to handle different formats
  const patterns = [
    // Standard format: [3/30/24, 15:23:34] Khalid Elm: message
    /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}:\d{2})\]\s([^:]+?):\s(.*)$/,
    // Format without seconds
    /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2})\]\s([^:]+?):\s(.*)$/,
  ];

  let match = null;
  for (const pattern of patterns) {
    match = line.match(pattern);
    if (match) break;
  }

  if (!match) {
    return null;
  }

  const [, date, time, sender, content] = match;

  // Parse the date
  const [month, day, year] = date.split("/");
  const fullYear = year.length === 2 ? `20${year}` : year;

  // Handle time format (might not have seconds)
  const timeFormatted = time.includes(":") && time.split(":").length === 2 ? `${time}:00` : time;
  const timestamp = new Date(`${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timeFormatted}`);

  return {
    timestamp,
    sender: sender.trim(),
    content: content.trim(),
  };
};

export const getMediaType = (fileName: string): "image" | "video" | "audio" | "document" => {
  const extension = fileName.toLowerCase().split(".").pop() || "";

  if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(extension)) {
    return "image";
  } else if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(extension)) {
    return "video";
  } else if (["mp3", "wav", "ogg", "opus", "m4a", "aac"].includes(extension)) {
    return "audio";
  } else {
    return "document";
  }
};

export const extractChatParticipants = (chatContent: string): ChatParticipants => {
  const lines = chatContent.split("\n").filter((line) => line.trim());
  const participants = new Set<string>();

  for (const line of lines) {
    const parsed = parseWhatsAppMessage(line);
    if (parsed && parsed.sender) {
      // Skip system messages
      if (!parsed.content.includes("Messages and calls are end-to-end encrypted")) {
        participants.add(parsed.sender);
      }
    }
  }

  const participantsList = Array.from(participants);
  const chatTitle = participantsList.length > 1 ? participantsList.join(" & ") : participantsList[0] || "Unknown";

  return {
    participants: participantsList,
    chatTitle,
  };
};

export const parseChatFile = (
  content: string
): {
  messages: ParsedMessage[];
  participants: ChatParticipants;
} => {
  const lines = content.split("\n").filter((line) => line);
  const messages: ParsedMessage[] = [];

  console.log(content);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parsed = parseWhatsAppMessage(line);
    if (parsed) {
      // Skip system messages about encryption
      messages.push(parsed);
    }
  }
  const participants = extractChatParticipants(content);

  return {
    messages,
    participants,
  };
};
