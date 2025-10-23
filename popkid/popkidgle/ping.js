import config from "../../config.cjs";

const ping = async (msg, sock) => {
  const prefix = config.PREFIX;
  const command = msg.body.startsWith(prefix)
    ? msg.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : "";

  if (command === "ping") {
    const start = Date.now();
    await msg.React("⏳");

    const end = Date.now();
    const pingSpeed = (end - start).toFixed(2);

    const text = `*ᴘᴏɴɢ sᴘᴇᴇᴅ: ${pingSpeed} ms*`;

    await msg.React("✅");

    const newsletterInfo = {
      newsletterJid: "120363419140572186@newsletter'",
      newsletterName: "ᴘᴏᴘᴋɪᴅ xᴛʀ ʙᴏᴛ",
      serverMessageId: -1,
    };

    const externalAdReply = {
      title: "ᴘᴏᴘᴋɪᴅ xᴛʀ ʙᴏᴛ",
      body: "ᴘɪɴɢ sᴘᴇᴇᴅ ᴄᴀʟᴄᴜʟᴀᴛɪᴏɴs",
      thumbnailUrl: "https://files.catbox.moe/kiy0hl.jpg",
      sourceUrl: "https://whatsapp.com/channel/0029VbBTlzoLtOjGXhhD4I2d",
      mediaType: 1,
      renderLargerThumbnail: false,
    };

    const contextInfo = {
      isForwarded: true,
      forwardedNewsletterMessageInfo: newsletterInfo,
      forwardingScore: 999,
      externalAdReply,
    };

    const message = {
      text,
      contextInfo,
    };

    await sock.sendMessage(msg.from, message, { quoted: msg });
  }
};

export default ping;
