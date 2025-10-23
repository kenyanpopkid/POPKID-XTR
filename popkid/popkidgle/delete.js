import config from '../../config.cjs';

// 💀 ᴅᴇʟᴇᴛᴇ ᴍᴇssᴀɢᴇ ᴄᴏᴍᴍᴀɴᴅ — ᴏᴡɴᴇʀ ᴏɴʟʏ
const deleteMessage = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['del', 'delete'];

    if (!validCommands.includes(cmd)) return;

    if (!isCreator) {
      return m.reply('🚫 *ACCESS DENIED: ONLY OWNER CAN EXECUTE THIS COMMAND!*');
    }

    if (!m.quoted) {
      return m.reply('⚠️ *REPLY TO A MESSAGE TO DELETE IT!*');
    }

    const key = {
      remoteJid: m.from,
      id: m.quoted.key.id,
      participant: m.quoted.key.participant || m.quoted.key.remoteJid,
    };

    await gss.sendMessage(m.from, { delete: key });

    await gss.sendMessage(m.from, {
      text: `
✅ *MESSAGE SUCCESSFULLY ERASED*

📍 *Actioned By:* @${m.sender.split('@')[0]}
💣 *Command:* ${prefix}${cmd}
      `.trim(),
      mentions: [m.sender],
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "POPKID-XTECH • DELETE MODE",
          body: "Message removed from chat history",
          thumbnailUrl: "https://i.imgur.com/fYVqYhO.png",
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: "https://popkid-xtech.web.app"
        }
      }
    }, { quoted: m });

  } catch (error) {
    console.error('❌ Error deleting message:', error);
    m.reply('⚠️ *ERROR OCCURRED WHILE DELETING THE MESSAGE.*');
  }
};

export default deleteMessage;
