const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("db", "mp3", "wav", "txt", "zip");

module.exports = config;
