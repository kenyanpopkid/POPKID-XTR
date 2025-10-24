import config from "../../config.cjs";

const ping = async (msg, sock) => {
  const prefix = config.PREFIX || ".";
  const body = typeof msg.body === "string" ? msg.body : "";
  const command = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  // ✅ Only run if the command is "ping"
  if (command !== "ping") return;

  const start = Date.now();
  await msg.React("⏳");

  const end = Date.now();
  const pingSpeed = (end - start).toFixed(2);

  const text = `💠 *ᴘᴏɴɢ sᴘᴇᴇᴅ:* ${pingSpeed} ms`;

  await msg.React("✅");

  // 📰 Newsletter Info (for forwarded-style display)
  const newsletterInfo = {
    newsletterJid: "120363419140572186@newsletter",
    newsletterName: "POPKID XTR",
    serverMessageId: 1,
  };

  // 📢 External Ad Info (for link preview style)
  const externalAdReply = {
    title: "POPKID XTR BOT",
    body: "⚡ Live Ping Speed Results",
    thumbnailUrl: "https://files.catbox.moe/kiy0hl.jpg",
    sourceUrl: "https://whatsapp.com/channel/0029VbBTlzoLtOjGXhhD4I2d",
    mediaType: 1,
    renderLargerThumbnail: false,
  };

  // 🧠 Combine into proper WhatsApp context
  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: newsletterInfo,
    externalAdReply,
  };

  // ✅ Send message with newsletter style
  await sock.sendMessage(
    msg.from,
    {
      text,
      contextInfo,
    },
    { quoted: msg }
  );
};

export default ping;
