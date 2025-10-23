// 📁 File: popkidgle/personality.js
import config from '../../config.cjs';

const personality = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const senderName = m.pushName || 'User';

  if (cmd === 'love') {
    const msg = `❤️ *Hey ${senderName}*,\nHere's a little love for you 💕\nStay amazing!`;

    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/x0ohbm.jpg' },
      caption: msg,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: 'Popkid-Xmd',
          newsletterJid: '120363290715861418@newsletter',
        },
      },
    }, { quoted: m });
  }

  if (cmd === 'goodmorning') {
    const msg = `🌞 *Good Morning, ${senderName}!*\nWishing you a fresh start and good vibes today.`;

    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/x0ohbm.jpg' },
      caption: msg,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: 'Popkid-Xmd',
          newsletterJid: '120363290715861418@newsletter',
        },
      },
    }, { quoted: m });
  }

  if (cmd === 'goodnight') {
    const msg = `🌙 *Good Night, ${senderName}!*\nSweet dreams and peaceful rest.`;

    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/x0ohbm.jpg' },
      caption: msg,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: 'Popkid-Xmd',
          newsletterJid: '120363290715861418@newsletter',
        },
      },
    }, { quoted: m });
  }
};

export default personality;
