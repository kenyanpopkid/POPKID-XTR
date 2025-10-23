import config from '../../config.cjs';

const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isOwner = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
  const prefix = config.PREFIX;

  const command = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  const args = m.body.slice(prefix.length + command.length).trim();

  if (command !== 'autoread') return;

  if (!isOwner) {
    return m.reply('📛 *THIS IS AN OWNER-ONLY COMMAND*');
  }

  let message;

  switch (args) {
    case 'on':
      config.AUTO_READ = true;
      message = '✅ *Auto-Read has been enabled.*';
      break;
    case 'off':
      config.AUTO_READ = false;
      message = '🛑 *Auto-Read has been disabled.*';
      break;
    default:
      message = `
📘 *Auto-Read Command Usage*

• \`autoread on\` — Enable auto read
• \`autoread off\` — Disable auto read
`.trim();
      break;
  }

  try {
    await Matrix.sendMessage(m.from, { text: message }, { quoted: m });
  } catch (err) {
    console.error('[AutoRead Error]', err.message);
    await Matrix.sendMessage(m.from, {
      text: '❌ *An error occurred while processing your request.*'
    }, { quoted: m });
  }
};

export default autoreadCommand;
