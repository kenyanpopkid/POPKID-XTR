import axios from 'axios';
import config from '../../config.cjs';

const sessionGen = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const senderName = m.pushName || 'User';

  if (cmd !== 'pair') return;

  if (!text || !/^\+?\d{9,15}$/.test(text)) {
    const buttons = [
      { buttonId: `${prefix}pair +254712345678`, buttonText: { displayText: 'Generate Pair Code' }, type: 1 }
    ];
    await sock.sendMessage(m.from, {
      text: `❌ *Invalid Format!*\n\n✅ Example: *.pair +254712345678*`,
      buttons,
      headerType: 1,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Xmd",
          newsletterJid: "120363420342566562@newsletter",
        },
      },
    }, { quoted: m });
    return;
  }

  try {
    const response = await axios.get(`https://kindasessions.onrender.com/code?number=${encodeURIComponent(text)}`);
    const { code } = response.data;

    if (!code) throw new Error("No code returned");

    // Buttons: Copy Code and maybe another if you want
    const buttons = [
      {
        buttonId: `${prefix}copycode ${code}`,
        buttonText: { displayText: '📋 Copy Code' },
        type: 1
      }
    ];

    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/959dyk.jpg' },
      caption: `✅ *Pairing Code Generated!*\n\n👤 Number: ${text}\n🔐 Code: *${code}*\n\nUse this on your bot panel or CLI to connect the number.`,
      buttons,
      headerType: 4,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Xmd",
          newsletterJid: "120363420342566562@newsletter",
        },
      }
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    await sock.sendMessage(m.from, {
      text: `❌ *Failed to generate pairing code.*\n\nReason: ${err.response?.data?.error || err.message}`,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Xmd",
          newsletterJid: "120363420342566562@newsletter",
        },
      },
    }, { quoted: m });
  }
};

export default sessionGen;
