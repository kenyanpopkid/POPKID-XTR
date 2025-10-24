import moment from "moment-timezone";
import config from "../../config.cjs";

/**
 * POPKID XTR Alive / Uptime Command
 */
const joel = async (msg, sock) => {
  const prefix = config.PREFIX || ".";
  const body = typeof msg.body === "string" ? msg.body : "";
  const command = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (["uptime", "alive", "runtime"].includes(command)) {
    try {
      // Initial reaction
      await msg.React("⏳");

      // 🕒 Calculate uptime
      const totalSeconds = Math.floor(process.uptime());
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // 🌍 Get local time for Tanzania
      const localTime = moment().tz("Africa/Dar_es_Salaam");
      const hour = localTime.hour();

      // 🌅 Greeting
      let greeting =
        hour < 5
          ? "🌄 Good Morning"
          : hour < 12
          ? "🌅 Good Morning"
          : hour < 17
          ? "🌞 Good Afternoon"
          : hour < 20
          ? "🌇 Good Evening"
          : "🌌 Good Night";

      // Second reaction
      await msg.React("⚡");

      // 🎵 Audio (voice note)
      const audio = {
        url: "https://files.catbox.moe/w1iy98.m4a",
      };

      // 📰 Newsletter Forwarded Info
      const newsletterInfo = {
        newsletterJid: "120363419140572186@newsletter",
        newsletterName: "POPKID XTR",
        serverMessageId: 1,
      };

      // 📢 Ad-style metadata
      const externalAdReply = {
        title: "POPKID XTR BOT ⚡",
        body: `⏱ UPTIME ${days}D ${hours}H ${minutes}M ${seconds}S`,
        thumbnailUrl: "https://files.catbox.moe/kiy0hl.jpg",
        sourceUrl: "https://whatsapp.com/channel/0029VbBTlzoLtOjGXhhD4I2d",
        mediaType: 1,
        renderLargerThumbnail: true,
      };

      // 🧠 Context Info
      const contextInfo = {
        mentionedJid: [msg.sender],
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: newsletterInfo,
        externalAdReply,
      };

      // ✅ Send voice note with forwarded newsletter style
      await sock.sendMessage(
        msg.from,
        {
          audio,
          mimetype: "audio/mpeg",
          ptt: true,
          contextInfo,
        },
        { quoted: msg }
      );
    } catch (error) {
      console.error("Error in uptime/alive command:", error);
      await sock.sendMessage(msg.from, { text: "❌ Error running command!" }, { quoted: msg });
    }
  }
};

export default joel;
