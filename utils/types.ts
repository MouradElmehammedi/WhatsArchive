export type Message = {
  timestamp: Date;
  sender: string;
  content: string;
  isMedia: boolean;
  mediaPath?: string;
};

export type Chat = {
  contactName: string;
  messages: Message[];
};

export type ZipContents = {
  chatFiles: { [key: string]: string }; // filename: content
  mediaFiles: string[]; // list of media file paths
};
