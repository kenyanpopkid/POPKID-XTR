import config from '../../config.cjs';

const autotypingCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isOwner = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
    const prefix = config.PREFIX;

    if (!m.body.startsWith(prefix)) return;

    const [cmd, ...rest] = m.body.slice(prefix.length).trim().split(/\s+/);
    const command = cmd.toLowerCase();
    const args = rest.join(' ').toLowerCase();

    if (command !== 'autotyping') return;
    if (!isOwner) return m.reply('📛 *THIS IS AN OWNER-ONLY COMMAND*');

    let replyText;

    switch (args) {
      case 'on':
        config.AUTO_TYPING = true;
        replyText = '✅ *Auto-Typing has been enabled.*';
        break;

      case 'off':
        config.AUTO_TYPING = false;
        replyText = '❌ *Auto-Typing has been disabled.*';
        break;

      default:
        replyText = `
╭───⧉  *Auto-Typing Settings*
│
│ 🖊️ *Status:* ${config.AUTO_TYPING ? '🟢 ON' : '🔴 OFF'}
│
│ 🔧 *Usage:*
│ • \`${prefix}autotyping on\` — Enable auto typing
│ • \`${prefix}autotyping off\` — Disable auto typing
│
╰────⟡ *Popkid-AI Control Panel*
        `.trim();
        break;
    }

    await Matrix.sendMessage(m.from, { text: replyText }, { quoted: m });

  } catch (err) {
    console.error('[AutoTyping Error]', err);
    await Matrix.sendMessage(m.from, {
      text: '🚫 *An error occurred while processing your request.*'
    }, { quoted: m });
  }
};

export default autotypingCommand;
