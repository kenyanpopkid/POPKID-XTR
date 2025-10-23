// commands/whois.js
import config from '../../config.cjs';

const whois = async (m, sock) => {
  const prefix = config.PREFIX || '.';
  const body = m.body || '';
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd !== 'whois') return;

  await m.React('✅');

  const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const number = target.split('@')[0];

  await sock.sendMessage(m.chat, {
    text: `📍 WHOIS fetched:\n👤 Number: ${number}`,
  }, { quoted: m });
};

export default whois;
