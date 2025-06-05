import { parseChatFile } from "./parsers";

// Test data from your example
const sampleChatData = `[3/30/24, 15:23:34] Khalid Elm: ‎Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them.
[3/30/24, 15:23:34] Khalid Elm: Salam Mourad hanya wella ?
[3/30/24, 15:23:47] Khalid Elm: Tl3eb chwiya ?
[3/30/24, 15:39:55] Mourad: Salam khalid
[3/30/24, 15:39:58] Mourad: Hanya lhamdolah
[3/30/24, 15:40:07] Mourad: Awdi rani 3nd l coiffure
[3/30/24, 15:40:17] Mourad: Yalah dkhlt 3ndo
[3/30/24, 15:40:40] Mourad: 😅
[3/30/24, 16:17:47] Khalid Elm: Hhh
[3/30/24, 16:17:56] Khalid Elm: Besaha asidi
[3/30/24, 17:13:01] Mourad: Ya3tik saha
[3/30/24, 17:13:11] Mourad: Rak 3ad online wla
[3/30/24, 17:20:03] Khalid Elm: Waah
[3/30/24, 17:20:12] Khalid Elm: Rani nl3eb rocket League
[3/30/24, 17:20:25] Khalid Elm: Chno bghit tl3eb !!
[3/30/24, 17:20:50] Mourad: Nl3bo fortnite
[3/30/24, 17:20:53] Mourad: Wacha balk
[3/30/24, 17:20:57] Khalid Elm: Yalah
[3/30/24, 17:20:58] Mourad: Rani online tema ana
[3/30/24, 17:21:03] Mourad: Yalh rani nstnak
[3/30/24, 17:21:05] Khalid Elm: Wakha
[3/30/24, 17:33:05] Mourad: Rani nsam3ek ana
[3/30/24, 23:27:44] Khalid Elm: Django tl3eb ?
[3/30/24, 23:32:45] Mourad: Oui lmodir
[3/30/24, 23:33:19] Mourad: Awdi khrjt nt9hwa m3a drari
[3/30/24, 23:33:34] Mourad: Wahed 30 min nkon fdar ila rako 3ad`;

// Sample media files that might be in the folder
const sampleMediaFiles = [
  "00000033-AUDIO-2024-03-31-00-39-42.opus",
  "00000034-AUDIO-2024-03-31-00-39-48.opus",
  "00000037-AUDIO-2024-03-31-00-40-11.opus",
  "00000039-AUDIO-2024-03-31-00-40-39.opus",
  "00000102-AUDIO-2024-06-24-22-12-16.opus",
  "00000103-AUDIO-2024-06-24-22-36-29.opus",
  "00000104-VIDEO-2024-06-24-22-38-58.mp4",
  "00000105-VIDEO-2024-06-24-22-39-01.mp4",
];

export const testParser = () => {
  console.log("Testing WhatsApp Chat Parser...");

  // Test individual lines first
  const lines = sampleChatData.split("\n").filter((line) => line.trim());
  console.log(`Total lines in sample: ${lines.length}`);

  lines.forEach((line, index) => {
    console.log(`Line ${index + 1}: ${line}`);
  });

  const result = parseChatFile(sampleChatData, sampleMediaFiles);

  console.log("Participants:", result.participants);
  console.log("Total messages:", result.messages.length);

  // Show all messages
  result.messages.forEach((msg, index) => {
    console.log(`Message ${index + 1}:`);
    console.log(`  Sender: ${msg.sender}`);
    console.log(`  Content: ${msg.content}`);
    console.log(`  Time: ${msg.timestamp.toLocaleString()}`);
    console.log(`  Is Media: ${msg.isMedia}`);
    if (msg.isMedia) {
      console.log(`  Media Type: ${msg.mediaType}`);
    }
    console.log("---");
  });

  return result;
};

// Export for testing in the app
export { sampleChatData, sampleMediaFiles };
