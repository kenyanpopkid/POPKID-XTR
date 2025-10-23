import config from '../../config.cjs';

const NEWSLETTER_JID = '120363420342566562@newsletter';

const antistickerCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const body = m.body || '';
  const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  // 🧠 Handler popkid
  if (cmd === 'antisticker') {
    if (!isCreator) return m.reply("🚫 *Owner-only command*");

    const subCmd = body.slice(prefix.length + cmd.length).trim().toLowerCase();
    let response;

    switch (subCmd) {
      case 'on':
        global.ANTI_STICKER = true;
        response = `🛡️ *Anti-Sticker Protection:* ENABLED\nStickers will now be auto-deleted.`;
        break;

      case 'off':
        global.ANTI_STICKER = false;
        response = `🔓 *Anti-Sticker Protection:* DISABLED\nStickers are now allowed.`;
        break;

      case 'status':
        response = `📊 *Anti-Sticker Status:* ${global.ANTI_STICKER ? '🟢 ACTIVE' : '🔴 INACTIVE'}`;
        break;

      default:
        response = `📍 *Anti-Sticker Usage:*\n\n• ${prefix}antisticker on — Enable\n• ${prefix}antisticker off — Disable\n• ${prefix}antisticker status — Check status`;
    }

    return Matrix.sendMessage(m.chat, {
      text: response,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: "Popkid GLE Bot",
          serverMessageId: '',
        },
        externalAdReply: {
          title: 'Anti-Sticker System',
          body: 'Popkid GLE Protection',
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: 'https://telegra.ph/file/7cde96ce87ae7d9bd22a4.jpg',
          sourceUrl: 'https://github.com/devpopkid'
        }
      }
    }, { quoted: m });
  }

  // 🧽 Auto-delete stickers
  if (global.ANTI_STICKER && m.message?.stickerMessage) {
    try {
      if (m.isGroup) {
        await Matrix.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.sender
          }
        });
      } else {
        try {
          await Matrix.sendMessage(m.chat, { delete: m.key });
        } catch {
          await Matrix.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.sender
            }
          });
        }

        // 🗯️ 
        await Matrix.sendMessage(m.chat, {
          text: `🚫 *No stickers allowed*`,
          mentions: [m.sender],
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: NEWSLETTER_JID,
              newsletterName: "Popkid GLE Bot",
              serverMessageId: '',
            }
          }
        });
      }
    } catch (err) {
      console.error('[❌ Anti-Sticker Error]:', err);
    }
  }
};

export default antistickerCommand;
