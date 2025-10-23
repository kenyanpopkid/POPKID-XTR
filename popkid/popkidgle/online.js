import config from '../../config.cjs';

const listOnline = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'listonline') {
    if (!m.isGroup) {
      return await sock.sendMessage(m.from, {
        text: `🚫 This command only works in *group chats*.`,
      }, { quoted: m });
    }

    await m.React('🛰️'); // Start reaction

    const metadata = await sock.groupMetadata(m.from);
    const members = metadata.participants.map(p => p.id);

    const onlineUsers = [];

    // Process up to 30 members max to avoid rate limits (customize if needed)
    const limitedMembers = members.slice(0, 30);

    // Subscribe and check presence in parallel
    await Promise.all(limitedMembers.map(async userId => {
      try {
        await sock.presenceSubscribe(userId);
        await new Promise(res => setTimeout(res, 100)); // short delay to allow update
        const presence = sock.presence?.[userId];
        const state = presence?.lastKnownPresence;

        if (['available', 'composing', 'recording'].includes(state)) {
          onlineUsers.push(userId.split('@')[0]);
        }
      } catch (e) {
        // Silent fail
      }
    }));

    const onlineText = onlineUsers.length
      ? onlineUsers.map(id => `🔹 @${id}`).join('\n')
      : '🚫 No group members are online right now.';

    const finalMessage = `
┏━༺『 *REAL ONLINE GROUP MEMBERS* 』༻━┓
${onlineText}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
📡 *Online Count:* ${onlineUsers.length}
👥 *Group:* ${metadata.subject}
🕒 *Time:* ${new Date().toLocaleTimeString()}
    `.trim();

    await sock.sendMessage(m.from, {
      text: finalMessage,
      mentions: onlineUsers.map(id => id + '@s.whatsapp.net')
    }, { quoted: m });

    await m.React('✅'); // End reaction
  }
};

export default listOnline;
