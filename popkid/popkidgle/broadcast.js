import config from '../../config.cjs';

const bc = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
    const prefix = config.PREFIX;
    const body = m.body.trim();
    const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(/\s+/)[0].toLowerCase() : '';
    const text = body.slice(prefix.length + cmd.length).trim();

    if (cmd !== 'broadcast' && cmd !== 'bc') return;
    if (!isCreator) return m.reply('📛 *OWNER ONLY COMMAND* 📛');
    if (!text) return m.reply(`⚠️ Please provide a message to broadcast.\n💡 Usage: ${prefix}bc Your message here`);

    const startTime = Date.now();
    const groupChats = await gss.groupFetchAllParticipating();
    const groupIds = Object.keys(groupChats);

    if (!groupIds.length) return m.reply('❌ *No groups found for broadcast.*');

    const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;
    await gss.sendMessage(ownerJid, {
      text:
        `🔔 *BROADCAST STARTED*\n\n` +
        `📝 *Preview:* ${text.length > 50 ? text.slice(0, 50) + '...' : text}\n` +
        `📊 *Groups Targeted:* ${groupIds.length}\n` +
        `_Sending messages now..._`
    });

    m.reply(`🚀 Broadcasting to *${groupIds.length}* groups...`);

    let successCount = 0, failCount = 0;
    const failedGroups = [];

    for (const groupId of groupIds) {
      try {
        await gss.sendMessage(groupId, {
          text:
            `╭─❏ *📢 BROADCAST MESSAGE* ❏─╮\n\n` +
            `${text}\n\n` +
            `───╯ Sent by *Popkid's Bot* 💫`
        });
        successCount++;
      } catch (error) {
        failCount++;
        failedGroups.push(groupId.split('@')[0]);
        console.error(`❌ Failed to send to ${groupId}:`, error.message);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const summaryMsg =
      `✅ *BROADCAST COMPLETED*\n\n` +
      `⏱ *Time Taken:* ${duration} seconds\n` +
      `📊 *Stats:*\n` +
      `   • Total Groups: ${groupIds.length}\n` +
      `   • Successful: ${successCount}\n` +
      `   • Failed: ${failCount}\n\n` +
      (failCount ? `⚠️ *Failed Groups:* ${failedGroups.join(', ')}\n\n` : '') +
      `📝 *Original Message:*\n${text.length > 200 ? text.slice(0, 200) + '...' : text}`;

    await m.reply(summaryMsg);
    await gss.sendMessage(ownerJid, { text: summaryMsg, mentions: [m.sender] });

  } catch (error) {
    console.error('❌ Broadcast Error:', error.message);
    const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;
    await gss.sendMessage(ownerJid, {
      text:
        `❌ *BROADCAST FAILED*\n\n` +
        `🛠 Error: ${error.message}\n` +
        `⏰ Time: ${new Date().toLocaleString()}\n\n` +
        `Check console for details.`
    });
    m.reply('❌ Broadcast failed. Please check logs.');
  }
};

export default bc;
