import moment from "moment-timezone";
import config from "../../config.cjs";

const popkid = async (msg, sock) => {
  const prefix = config.PREFIX || ".";
  const command = msg.body && msg.body.startsWith(prefix)
    ? msg.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  // Respond only to these commands
  if (!["uptime", "alive", "runtime"].includes(command)) return;

  try {
    await msg.React("⚡");

    // ⏱ Calculate uptime
    const totalSeconds = Math.floor(process.uptime());
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const uptime = `${days}D ${hours}H ${minutes}M ${seconds}S`;

    // 🕒 Get greeting based on Tanzania time
    const hour = moment().tz("Africa/Dar_es_Salaam").hour();
    let greeting = "";
    if (hour < 5) greeting = "🌄 Good Morning";
    else if (hour < 12) greeting = "🌅 Good Morning";
    else if (hour < 17) greeting = "🌞 Good Afternoon";
    else if (hour < 20) greeting = "🌇 Good Evening";
    else greeting = "🌌 Good Night";

    await msg.React("✅");

    // 🎧 Voice note file (alive audio)
    const audioUrl = "https://files.catbox.moe/w1iy98.m4a";

    // 📰 Newsletter style metadata
    const contextInfo = {
      mentionedJid: [msg.sender],
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363419140572186@newsletter",
        newsletterName: "ᴘᴏᴘᴋɪᴅ 𝕏ᴛʀ",
        serverMessageId: 1,
      },
      externalAdReply: {
        title: "⚡ ᴘᴏᴘᴋɪᴅ 𝕏ᴛʀ ʙᴏᴛ",
        body: `${greeting}\n⏱ Uptime: ${uptime}`,
        thumbnailUrl: "https://files.catbox.moe/kiy0hl.jpg",
        sourceUrl: "https://whatsapp.com/channel/0029VbBTlzoLtOjGXhhD4I2d",
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    };

    // 🎤 Send as PTT (voice message)
    await sock.sendMessage(
      msg.from,
      {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        ptt: true,
        contextInfo,
      },
      { quoted: msg }
    );
  } catch (err) {
    console.error("❌ POPKID Command Error:", err);
    await sock.sendMessage(msg.from, { text: "❌ Error running popkid command!" }, { quoted: msg });
  }
};

export default popkid;
