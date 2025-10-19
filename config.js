// ╭──────────────────────────────────────────────╮
// │ 💫  𝐏𝐎𝐏𝐊𝐈𝐃 𝐗𝐓𝐑 ⚙️  ᴇʟɪᴛᴇ ᴄᴏɴꜰɪɢ ғɪʟᴇ  💎 │
// ╰──────────────────────────────────────────────╯

const fs = require("fs-extra");
const path = require("path");

if (fs.existsSync(".env"))
  require("dotenv").config({ path: __dirname + "/.env" });

// ─────────────── 🌐 𝐂𝐎𝐑𝐄 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 ───────────────
module.exports = {
  SESSION_ID: process.env.SESSION_ID || '',
  PREFIX: process.env.PREFIX || ".",
  OWNER_NAME: process.env.OWNER_NAME || "𝐏𝐎𝐏𝐊𝐈𝐃 𝐗𝐓𝐑",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "",
  SUDO_NUMBERS: process.env.SUDO_NUMBERS || "",
  BOT_NAME: process.env.BOT_NAME || "💫 𝐏𝐎𝐏𝐊𝐈𝐃 𝐗𝐓𝐑 💫",
  FOOTER: process.env.FOOTER || "🦋 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ",
  CAPTION: process.env.CAPTION || "✨ 𝐏𝐎𝐏𝐊𝐈𝐃 𝐁𝐎𝐓 ✨",
  VERSION: process.env.VERSION || "5.0.0",
  BOT_PIC: process.env.BOT_PIC || "https://i.ibb.co/fTCrW08/373b5c2300fc0f90e39b3797f2db358b.jpg",
  MODE: process.env.MODE || "private",
  TIME_ZONE: process.env.TIME_ZONE || "Africa/Nairobi",
  WARN_COUNT: process.env.WARN_COUNT || "3",

  // ─────────────── 💬 𝐏𝐑𝐄𝐒𝐄𝐍𝐂𝐄 ───────────────
  DM_PRESENCE: process.env.DM_PRESENCE || "online",
  GC_PRESENCE: process.env.GC_PRESENCE || "online",

  // ─────────────── 🤖 𝐀𝐈 / 𝐒𝐌𝐀𝐑𝐓 𝐌𝐎𝐃𝐄 ───────────────
  CHATBOT: process.env.CHATBOT || "false",
  CHATBOT_MODE: process.env.CHATBOT_MODE || "inbox",
  STARTING_MESSAGE: process.env.STARTING_MESSAGE || "true",

  // ─────────────── 🔒 𝐏𝐑𝐎𝐓𝐄𝐂𝐓𝐈𝐎𝐍 ───────────────
  ANTIDELETE: process.env.ANTIDELETE || "indm",
  ANTICALL: process.env.ANTICALL || "false",
  ANTICALL_MSG: process.env.ANTICALL_MSG || "*📞 Auto Call Reject: Disabled for Safety*",
  ANTILINK: process.env.ANTILINK || "false",
  AUTO_BLOCK: process.env.AUTO_BLOCK || "212,233",

  // ─────────────── 👋 𝐆𝐑𝐄𝐄𝐓𝐈𝐍𝐆𝐒 ───────────────
  WELCOME_MESSAGE: process.env.WELCOME_MESSAGE || "false",
  GOODBYE_MESSAGE: process.env.GOODBYE_MESSAGE || "false",

  // ─────────────── ⚡ 𝐀𝐔𝐓𝐎 𝐅𝐄𝐀𝐓𝐔𝐑𝐄𝐒 ───────────────
  AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || "true",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
  STATUS_LIKE_EMOJIS: process.env.STATUS_LIKE_EMOJIS || "💛,❤️,💜,🤍,💙",
  AUTO_REPLY_STATUS: process.env.AUTO_REPLY_STATUS || "false",
  STATUS_REPLY_TEXT: process.env.STATUS_REPLY_TEXT || "*👀 ʏᴏᴜʀ sᴛᴀᴛᴜs ᴠɪᴇᴡᴇᴅ ʙʏ 𝐏𝐎𝐏𝐊𝐈𝐃 𝐗𝐓𝐑 ✅*",
  AUTO_REACT: process.env.AUTO_REACT || "false",
  AUTO_REPLY: process.env.AUTO_REPLY || "false",
  AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "false",
  AUTO_BIO: process.env.AUTO_BIO || "false",

  // ─────────────── 🌍 𝐋𝐈𝐍𝐊𝐒 / 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 ───────────────
  YT: process.env.YT || "youtube.com/@pop_kid254",
  NEWSLETTER_JID: process.env.NEWSLETTER_JID || "120363419140572186@newsletter",
  NEWSLETTER_URL: process.env.NEWSLETTER_URL || "https://whatsapp.com/channel/0029VbBTlzoLtOjGXhhD4I2d",
  BOT_REPO: process.env.BOT_REPO || "kenyanpopkid/POPKID-XTR",

  // ─────────────── 🎨 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 𝐈𝐍𝐅𝐎 ───────────────
  PACK_NAME: process.env.PACK_NAME || "🦋 𝐏𝐎𝐏𝐊𝐈𝐃 𝐗𝐓𝐑 🦋",
  PACK_AUTHOR: process.env.PACK_AUTHOR || "✨ 𝐏𝐎𝐏𝐊𝐈𝐃 ✨"
};

// ╭──────────────────────────────────────────────╮
// │ 🔁 𝐀𝐔𝐓𝐎 𝐑𝐄𝐋𝐎𝐀𝐃  ┆ Keeps Config Fresh 💡 │
// ╰──────────────────────────────────────────────╯
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`♻️  Reloading Config: ${__filename}`);
  delete require.cache[file];
  require(file);
});
