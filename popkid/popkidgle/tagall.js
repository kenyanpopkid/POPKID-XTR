import config from '../../config.cjs';

const tagall = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "tagall") {
    if (!m.isGroup) {
      await sock.sendMessage(m.from, { text: '🚫 *This command can only be used in groups!*' }, { quoted: m });
      return;
    }

    try {
      const groupMetadata = await sock.groupMetadata(m.from);
      const participants = groupMetadata.participants;
      const mentions = participants.map(({ id }) => id);

      const groupName = groupMetadata.subject || "this group";
      const participantCount = participants.length;

      let message = `
╭━━〔 👥 *TAGGING ALL MEMBERS* 〕━━⬣
┃ 🔰 *Group:* ${groupName}
┃ 📣 *Members:* ${participantCount}
┃ ✨ *Requested by:* @${m.sender.split('@')[0]}
┃
┃ 🔖 *Mentions:*
┃
`.trim();

      // Style individual mentions
      for (let i = 0; i < participants.length; i++) {
        const username = participants[i].id.split('@')[0];
        message += `┃ 🔹 @${username}\n`;
      }

      message += `╰━━━〔 © POPKID-MD BOT 〕━━━⬣`;

      await sock.sendMessage(
        m.from,
        {
          text: message,
          mentions: mentions
        },
        { quoted: m }
      );

    } catch (error) {
      console.error("Error tagging all members:", error);
      await sock.sendMessage(
        m.from,
        {
          text: '⚠️ *Failed to tag members.* Make sure the bot has admin rights in this group.',
        },
        { quoted: m }
      );
    }
  }
};

export default tagall;
