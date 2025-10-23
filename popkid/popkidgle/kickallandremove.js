import config from '../../config.cjs';

const kickAll = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'kickall') return;
    if (!m.isGroup) return m.reply("🚫 *GROUP ONLY COMMAND*\n\nThis command works only in groups.");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("❌ *BOT MUST BE ADMIN*");
    if (!senderAdmin) return m.reply("⚠️ *YOU MUST BE AN ADMIN TO EXECUTE THIS*");

    const usersToKick = participants
      .filter(p => !p.admin) // Exclude all admins
      .map(p => p.id);

    if (usersToKick.length === 0) {
      return m.reply("✅ *NO NON-ADMIN MEMBERS TO KICK*");
    }

    await gss.groupParticipantsUpdate(m.from, usersToKick, 'remove')
      .then(async () => {
        const mentionsList = usersToKick.map(user => `@${user.split("@")[0]}`);

        const styledMessage = `
╔═════ ⌬ 𝗞𝗜𝗖𝗞 𝗢𝗣𝗘𝗥𝗔𝗧𝗜𝗢𝗡
║ 📍 *Group:* ${groupMetadata.subject}
║ 👤 *Kicked:* ${mentionsList.length} members
╚═══════════════════════
🚷 ${mentionsList.join(', ')} 
🛡️ *Removed successfully!*`;

        await gss.sendMessage(m.from, {
          text: styledMessage,
          mentions: usersToKick,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: "POPKID-XTECH",
              body: "🔐 Kicked by system core",
              thumbnailUrl: "https://i.imgur.com/Qo0Qo0p.jpeg",
              mediaType: 1,
              renderLargerThumbnail: true,
              sourceUrl: "https://chat.whatsapp.com/"
            }
          }
        });
      })
      .catch(() => m.reply("❗ *FAILED TO REMOVE SOME USERS*"));
      
  } catch (error) {
    console.error('Error:', error);
    m.reply('⚠️ An unexpected error occurred during execution.');
  }
};

export default kickAll;
