import config from '../../config.cjs';

// Sleep delay function to prevent spam
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// 👇 Auto reply to WhatsApp statuses
export const statusReply = async (update, sock) => {
  if (config.AUTO_STATUS_REPLY !== "true") return;

  try {
    for (const [jid, statusObj] of Object.entries(update.statuses || {})) {
      const statuses = statusObj.status;
      if (!statuses?.length) continue;

      const latest = statuses[statuses.length - 1];
      if (!latest?.id || !latest?.participant) continue;

      await sleep(1500); // anti-spam delay

      const message = {
        text: config.AUTO_STATUS_REPLY_MSG || "👋 Hello! I saw your status.",
        contextInfo: {
          stanzaId: latest.id,
          participant: jid,
          quotedMessage: latest,
        },
      };

      await sock.sendMessage(jid, message);
    }
  } catch (err) {
    console.error("❌ AutoStatusReply Error:", err);
  }
};

// 👇 Toggle command handler (use like .status-reply on/off)
export const statusReplyCommand = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const args = m.body.slice(prefix.length + cmd.length).trim().split(' ');

  if (cmd !== "status-reply") return;

  if (!config.OWNER_NUMBER.includes(m.sender.split('@')[0])) {
    return m.reply("*📛 Only the owner can use this command!*");
  }

  const mode = args[0]?.toLowerCase();
  if (mode === "on") {
    config.AUTO_STATUS_REPLY = "true";
    return m.reply("✅ Auto status reply is now *enabled*.");
  } else if (mode === "off") {
    config.AUTO_STATUS_REPLY = "false";
    return m.reply("❌ Auto status reply is now *disabled*.");
  } else {
    return m.reply("⚙️ Usage: *.status-reply on* or *.status-reply off*");
  }
};
