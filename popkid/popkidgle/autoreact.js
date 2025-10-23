import config from '../../config.cjs';

const autoreactCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isOwner = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
  const prefix = config.PREFIX;

  const command = m.body.startsWith(prefix) 
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() 
    : '';

  const args = m.body.slice(prefix.length + command.length).trim().toLowerCase();

  if (command !== 'autoreact') return;

  if (!isOwner) {
    return m.reply('📛 *THIS IS AN OWNER-ONLY COMMAND*');
  }

  if (!args) {
    // Show current status with buttons to toggle
    const statusText = `⚙️ *Auto-React Status*\n\nCurrently: *${config.AUTO_REACT ? '✅ Enabled' : '🛑 Disabled'}*\n\nUse buttons below to toggle.`;
    const buttons = [
      { buttonId: `${prefix}autoreact on`, buttonText: { displayText: "✅ Enable" }, type: 1 },
      { buttonId: `${prefix}autoreact off`, buttonText: { displayText: "🛑 Disable" }, type: 1 }
    ];
    return await Matrix.sendMessage(m.from, {
      text: statusText,
      buttons,
      headerType: 1,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "POPKID TECH",
          newsletterJid: "120363420342566562@newsletter"
        }
      }
    }, { quoted: m });
  }

  let message;

  if (args === 'on') {
    config.AUTO_REACT = true;
    message = '✅ *Auto-react has been enabled.*';
  } else if (args === 'off') {
    config.AUTO_REACT = false;
    message = '🛑 *Auto-react has been disabled.*';
  } else {
    message = `
⚙️ *Auto-React Command Usage*

• \`${prefix}autoreact on\` — Enable auto reaction
• \`${prefix}autoreact off\` — Disable auto reaction
`.trim();
  }

  try {
    await Matrix.sendMessage(m.from, {
      text: message,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "POPKID TECH",
          newsletterJid: "120363420342566562@newsletter"
        }
      }
    }, { quoted: m });
  } catch (err) {
    console.error('[AutoReact Error]', err.message);
    await Matrix.sendMessage(m.from, {
      text: '❌ *An error occurred while processing your request.*'
    }, { quoted: m });
  }
};

export default autoreactCommand;
