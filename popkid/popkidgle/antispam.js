import config from '../../config.cjs';

const antispam = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const senderName = m.pushName || 'User';

  if (cmd === 'antispam') {
    const msg = `
🚫 *ANTI-SPAM POLICY — Popkid-Xmd*

Hello *${senderName}*, please take note of our anti-spam system:

⚠️ Spamming is strictly *prohibited* in all chats.
✅ First strike: *Warning* issued.
⛔ Second strike: *Temporary mute or restriction*.
🔒 Repeat offenses: *Permanent block or ban*.

Our system uses auto-detection to catch repeated texts, mass tagging, flooding, or command abuse.

Let’s keep Popkid-Xmd clean, respectful, and fun for everyone 💯

*— Popkid-Xmd Moderation Team 🛡️*
    `.trim();

    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/959dyk.jpg' },
      caption: msg,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: 'Popkid-Xmd',
          newsletterJid: '120363420342566562@newsletter',
        },
      },
    }, { quoted: m });
  }
};

export default antispam;
