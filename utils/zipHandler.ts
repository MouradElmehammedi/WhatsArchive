/**
 * ZIP handling utilities for WhatsArchive
 * 
 * Note: Currently ZIP extraction is not supported in Expo Go due to native code requirements.
 * This file provides a foundation for future ZIP support when building standalone apps.
 */

import * as FileSystem from "expo-file-system";

export interface ZipExtractionResult {
  success: boolean;
  extractedPath?: string;
  files?: string[];
  error?: string;
}

/**
 * Placeholder for ZIP extraction functionality
 * This will be implemented when building standalone apps with native ZIP support
 */
export const extractZip = async (
  zipUri: string,
  extractionPath: string
): Promise<ZipExtractionResult> => {
  try {
    // For now, return an error indicating ZIP is not supported in Expo Go
    return {
      success: false,
      error: "ZIP extraction is not supported in Expo Go. Please use individual chat text files for now.",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to extract ZIP: ${error}`,
    };
  }
};

/**
 * Check if a file is a ZIP file based on its extension
 */
export const isZipFile = (fileName: string): boolean => {
  return fileName.toLowerCase().endsWith('.zip');
};

/**
 * Get supported file types for the current environment
 */
export const getSupportedFileTypes = (): string[] => {
  // In Expo Go, we only support text files
  return ["text/plain"];
};

/**
 * Get user-friendly instructions for the current environment
 */
export const getUploadInstructions = (): string => {
  return `📝 Currently supports individual WhatsApp chat export text files.
💡 To export: Open WhatsApp → Chat → More → Export Chat → Without Media

🔧 For ZIP support, you'll need to build a standalone app.`;
};

/**
 * Future: This function will handle ZIP extraction in standalone builds
 * For now, it's a placeholder that explains the limitation
 */
export const handleFileUpload = async (
  fileUri: string,
  fileName: string
): Promise<{
  success: boolean;
  conversations?: any[];
  error?: string;
}> => {
  try {
    if (isZipFile(fileName)) {
      return {
        success: false,
        error: "ZIP files are not supported in Expo Go. Please extract the ZIP and upload individual chat text files.",
      };
    }

    // Handle text file (current implementation)
    const content = await FileSystem.readAsStringAsync(fileUri);
    const contactName = fileName.replace("_chat.txt", "").replace(".txt", "") || "Unknown";

    const messages = content
      .split("\n")
      .filter((line) => line.trim())
      .map((line: any) => ({
        timestamp: new Date(),
        sender: line.includes("] You:") ? "You" : contactName,
        content: line.split(":").slice(2).join(":").trim(),
        isMedia: line.includes("<attached:"),
        mediaPath: undefined,
      }));

    const conversation = {
      contactName,
      messages,
    };

    return {
      success: true,
      conversations: [conversation],
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to process file: ${error}`,
    };
  }
};
