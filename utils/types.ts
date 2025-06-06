export type Message = {
  timestamp: Date;
  sender: string;
  content: string;
  isMedia?: boolean;
};

export type Chat = {
  contactName: string;
  messages: Message[];
  participants?: string[];
  lastUpdated?: string;
  messageCount?: number;
};

export type ZipContents = {
  chatFiles: { [key: string]: string }; // filename: content
  mediaFiles: string[]; // list of media file paths
};
