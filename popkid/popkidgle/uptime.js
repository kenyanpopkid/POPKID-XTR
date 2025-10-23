import moment from "moment-timezone";
import { generateWAMessageFromContent, proto } from "@whiskeysockets/baileys";
import config from "../../config.cjs";

/**
 * JoEL command handler
 * Supports commands: uptime, alive, runtime
 *
 * msg  - incoming message object (used for .body, .sender, .from, .React, etc)
 * sock - socket / client used to send messages (has sendMessage)
 */
const joel = async (msg, sock) => {
  const prefix = config.PREFIX;
  const command = msg.body && msg.body.startsWith(prefix)
    ? msg.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : "";

  if (command === "uptime" || command === "alive" || command === "runtime") {
    // show initial reaction
    await msg.React("⏳");

    // uptime calculations
    const totalSeconds = Math.floor(process.uptime());
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // localized time (Tanzania). Note: IANA timezone used below to avoid possible non-standard zone names.
    // Original used "Tanzania/Dodoma" — that's nonstandard for moment-timezone so we use "Africa/Dar_es_Salaam".
    const localTime = moment().tz("Africa/Dar_es_Salaam").format("HH:mm:ss");

    // greeting based on time of day
    let greeting = "";
    if (localTime < "05:00:00") {
      greeting = "Good Morning 🌄";
    } else if (localTime < "11:00:00") {
      greeting = "Good Morning 🌄";
    } else if (localTime < "15:00:00") {
      greeting = "Good Afternoon 🌅";
    } else if (localTime < "18:00:00") {
      greeting = "Good Evening 🌃";
    } else if (localTime < "19:00:00") {
      greeting = "Good Evening 🌃";
    } else {
      greeting = "Good Night 🌌";
    }

    // show a second reaction
    await msg.React("☄️");

    // audio to send (voice note)
    const audio = {
      url: "https://files.catbox.moe/w1iy98.m4a",
    };

    // external ad / reply metadata
    const externalAdReply = {
      title: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ",
      body: `UPTIME ${days}D ${hours}H ${minutes}M ${seconds}S`,
      thumbnailUrl:
        "https://files.catbox.moe/kiy0hl.jpg",
      sourceUrl: "https://whatsapp.com/channel/0029VbBTlzoLtOjGXhhD4I2d",
      mediaType: 1,
      renderLargerThumbnail: true,
    };

    const contextInfo = {
      mentionedJid: [msg.sender],
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363419140572186@newsletter'",
        newsletterName: "ᴘᴏᴘᴋɪᴅ xᴍᴅ ʙᴏᴛ",
        serverMessageId: 0x8f,
      },
      externalAdReply,
    };

    // message payload: audio (ptt)
    const messagePayload = {
      audio,
      mimetype: "audio/mp4",
      ptt: true,
      contextInfo,
    };

    await sock.sendMessage(msg.from, messagePayload, { quoted: msg });
  }
};

export default uptime;
