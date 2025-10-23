import config from '../../config.cjs';
import fs from 'fs';

const tostatus = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "tostatus") {
    try {
      // Make sure user replied to a message with media
      if (!m.quoted || !m.quoted.message) {
        return await sock.sendMessage(m.from, { text: "❌ Please reply to an image or video with `.tostatus`" }, { quoted: m });
      }

      // Download the quoted media
      const buffer = await m.quoted.download();
      if (!buffer) {
        return await sock.sendMessage(m.from, { text: "❌ Failed to download media." }, { quoted: m });
      }

      // Detect media type (image or video)
      const messageType = Object.keys(m.quoted.message)[0]; // "imageMessage" or "videoMessage"

      // Send to status
      if (messageType === 'imageMessage') {
        await sock.sendMessage('status@broadcast', { image: buffer, caption: m.quoted.message.imageMessage.caption || '' });
      } else if (messageType === 'videoMessage') {
        await sock.sendMessage('status@broadcast', { video: buffer, caption: m.quoted.message.videoMessage.caption || '' });
      } else {
        return await sock.sendMessage(m.from, { text: "❌ Only images and videos are supported." }, { quoted: m });
      }

      // Confirmation message
      await sock.sendMessage(m.from, { text: "✅ Media posted to your status." }, { quoted: m });

    } catch (err) {
      console.error("tostatus error:", err);
      await sock.sendMessage(m.from, { text: "❌ An error occurred while posting to status." }, { quoted: m });
    }
  }
};

export default tostatus;
