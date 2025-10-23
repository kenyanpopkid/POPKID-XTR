const fs = require("fs");
require("dotenv").config();

const config = {
  // 🧠 Session & Identity
  SESSION_ID: process.env.SESSION_ID || "Popkidmd$MLJjtNih",
  PREFIX: process.env.PREFIX || '.',
  BOT_NAME: process.env.BOT_NAME || "POPKID GLE",
  BOT: process.env.BOT || "hello 👋",
  CAPTION: process.env.CAPTION || "ᴘᴏᴡᴇʀᴇᴅ by popkid",
  NEW_CMD: process.env.NEW_CMD || "ᴀᴅᴅᴠᴀʀ\n│ sᴜᴅᴏ\n| popkid",

  // 🤖 GPT/AI API KEYS
  GPT_API_KEY: process.env.GPT_API_KEY || "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",
  GROQ_API_KEY: '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',
  WEATHER_API_KEY: "ec32bfa1c6b8ff81a636877b6ba302c8",
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",
  PRINCETECH_APIKEY: "prince_api_tjhv",

  // 🔧 Auto features
  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN === 'true',   // ✅ Auto-read status
  AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT === 'true', // ✅ Auto-react to status
  AUTO_REPLY_STATUS: process.env.AUTO_REPLY_STATUS === 'true', // ✅ Auto-reply to status
  AUTO_BIO: process.env.AUTO_BIO === 'true',
  AUTO_STICKER: process.env.AUTO_STICKER === 'true',
  AUTO_READ: process.env.AUTO_READ === 'true',
  AUTO_TYPING: process.env.AUTO_TYPING === 'true',
  AUTO_RECORDING: process.env.AUTO_RECORDING === 'true',
  AUTO_REACT: process.env.AUTO_REACT === 'true',
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE === 'true',
  AUTO_BLOCK: process.env.AUTO_BLOCK !== 'false',

  // 💬 Status Automation Messages
  STATUS_LIKE_EMOJI: process.env.STATUS_LIKE_EMOJI || '💛,❤️,💜,🤍,💙', // ✅ Emoji list
  AUTOLIKE_EMOJI: process.env.AUTOLIKE_EMOJI || '💛,❤️,💜,🤍,💙', // ✅ Emoji list for status reactions
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || '✅ Status Viewed by popkid-Md', // ✅ Auto-reply text
  AUTO_STATUS_REPLY_MSG: process.env.AUTO_STATUS_REPLY_MSG || "👋 Hello! I saw your status.", // ✅ Extra custom reply text

  // 📦 Extra Features
  ANTI_LEFT: process.env.ANTI_LEFT === 'true',
  MASS_TARGET_JID: '254111385747@s.whatsapp.net',
  ANTILINK: process.env.ANTILINK === 'true',
  ANTI_DELETE: process.env.ANTI_DELETE === 'true',
  CHAT_BOT: process.env.CHAT_BOT === 'true',
  CHAT_BOT_MODE: process.env.CHAT_BOT_MODE || "public",
  LYDEA: process.env.LYDEA === 'true',
  REJECT_CALL: process.env.REJECT_CALL === 'true',
  NOT_ALLOW: process.env.NOT_ALLOW !== 'false',
  BLOCK_UNKNOWN: process.env.BLOCK_UNKNOWN === 'true',

  // 🛠 Other
  MODE: process.env.MODE || "public",
  DELETED_MESSAGES_CHAT_ID: process.env.DELETED_MESSAGES_CHAT_ID || "254732297194@s.whatsapp.net",

  // 👑 Owner & Permissions
  OWNER_NAME: process.env.OWNER_NAME || "❤️popkid🙊",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "254732297194",
  SUDO_NUMBER: process.env.SUDO_NUMBER || "254732297194",

  // 💚 Welcome & Auto Reply
  WELCOME: process.env.WELCOME === 'true',
  AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY === 'true', // ✅ Duplicate key retained for compatibility
};

module.exports = config;
