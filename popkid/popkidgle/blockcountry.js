import fs from 'fs';
import path from 'path';
import config from '../../config.cjs';

const dbPath = path.join('./lib', 'blockedCountries.json');
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify([]));

const blockcountry = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const senderName = m.pushName || 'User';

  const countryList = JSON.parse(fs.readFileSync(dbPath));

  if (cmd === 'blockcountry') {
    if (!text) {
      return await sock.sendMessage(m.from, {
        text: `✳️ Usage: *${prefix}blockcountry <code>*\n\nExample: ${prefix}blockcountry 91`,
      }, { quoted: m });
    }

    if (!/^\d+$/.test(text)) {
      return await sock.sendMessage(m.from, { text: `❌ Invalid country code.` }, { quoted: m });
    }

    if (countryList.includes(text)) {
      return await sock.sendMessage(m.from, { text: `⚠️ +${text} is already blocked.` }, { quoted: m });
    }

    countryList.push(text);
    fs.writeFileSync(dbPath, JSON.stringify(countryList, null, 2));

    const msg = `
🌍 *BLOCK COUNTRY SYSTEM — Popkid-Xmd*

✅ Country code *+${text}* has been successfully *blocked*.

Users with phone numbers starting with +${text} will now be ignored or kicked automatically.

*— Popkid-Xmd Security 🛡️*
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

  // Auto-block message handler
  const senderJid = m.sender || m.key?.participant || '';
  const senderCountry = senderJid.replace(/\D/g, '').slice(0, 2);
  if (countryList.includes(senderCountry)) {
    return await sock.sendMessage(m.from, { text: `⛔ You are blocked from using this bot.` }, { quoted: m });
  }
};

export default blockcountry;
