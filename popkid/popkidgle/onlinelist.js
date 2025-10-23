import config from '../../config.cjs';

const listOnline = async (message, sock) => {
  try {
    const prefix = config.PREFIX;
    const command = message.body.startsWith(prefix)
      ? message.body.slice(prefix.length).split(" ")[0].toLowerCase()
      : '';

    if (command === "listonline") {
      if (!message.key.remoteJid.endsWith('@g.us')) {
        return sock.sendMessage(message.key.remoteJid, { text: '❌ This command works only in groups!' });
      }

      const groupMetadata = await sock.groupMetadata(message.key.remoteJid);
      const participants = groupMetadata.participants.map(p => p.id);

      let onlineMembers = [];

      // Subscribe to each participant's presence and collect results
      await Promise.all(participants.map(async id => {
        try {
          await sock.presenceSubscribe(id);
          const presence = sock.presences[id]?.lastKnownPresence;
          if (presence === 'available') {
            onlineMembers.push(id);
          }
        } catch (err) {
          console.error(`Error checking presence for ${id}:`, err);
        }
      }));

      let reply;
      if (onlineMembers.length > 0) {
        reply =
`┌───「 *POPKID Online Members* 」
├❍ Total Online: ${onlineMembers.length}
${onlineMembers.map((id, i) => `├ ${i + 1}. @${id.split('@')[0]}`).join('\n')}
└──────────────────`;
      } else {
        reply = '❌ *No members are online right now.*';
      }

      await sock.sendMessage(message.key.remoteJid, {
        text: reply,
        mentions: onlineMembers
      });
    }
  } catch (err) {
    console.error(err);
    await sock.sendMessage(message.key.remoteJid, { text: '❌ *Error:* Unable to fetch online users at this time.' });
  }
};

export default listOnline;
