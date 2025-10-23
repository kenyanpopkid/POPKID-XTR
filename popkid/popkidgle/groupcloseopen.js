import cron from 'node-cron';
import moment from 'moment-timezone';
import config from '../../config.cjs';

let scheduledTasks = {};

const groupSetting = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['group'];
    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup)
      return m.reply('🚫 *This command is only available in group chats!*');

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await gss.decodeJid(gss.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin)
      return m.reply('🛑 *I need to be an admin to manage group settings.*');

    if (!senderAdmin)
      return m.reply('⚠️ *Only group admins can use this command.*');

    const args = text.split(/\s+/);
    if (args.length < 1)
      return m.reply(
        `❓ *Usage:* \`${prefix + cmd} [open/close] [optional_time]\`\n\n🕒 Example:\n• \`${prefix + cmd} open\`\n• \`${prefix + cmd} close 10:00 PM\``
      );

    const groupAction = args[0].toLowerCase();
    const time = args.slice(1).join(' ');

    // Immediate action
    if (!time) {
      if (groupAction === 'close') {
        await gss.groupSettingUpdate(m.from, 'announcement');
        return m.reply('🔒 *Group has been closed. Only admins can send messages now.*');
      } else if (groupAction === 'open') {
        await gss.groupSettingUpdate(m.from, 'not_announcement');
        return m.reply('🔓 *Group has been opened. All members can now chat.*');
      } else {
        return m.reply(
          `❗ *Invalid option.*\nUse "open" or "close".\n\n📌 Example:\n• \`${prefix + cmd} open\`\n• \`${prefix + cmd} close\``
        );
      }
    }

    // Time format validation
    if (!/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(time)) {
      return m.reply(
        `⏰ *Invalid time format!*\nPlease use 12-hour format (HH:mm AM/PM)\n\n📌 Example:\n\`${prefix + cmd} open 04:00 PM\``
      );
    }

    const [hour, minute] = moment(time, ['h:mm A']).format('HH:mm').split(':').map(Number);
    const cronTime = `${minute} ${hour} * * *`;

    console.log(`🛠 Scheduling '${groupAction}' at ${cronTime} IST`);

    // Stop existing task if any
    if (scheduledTasks[m.from]) {
      scheduledTasks[m.from].stop();
      delete scheduledTasks[m.from];
    }

    scheduledTasks[m.from] = cron.schedule(cronTime, async () => {
      try {
        console.log(`🕒 Executing scheduled group ${groupAction} at ${moment().format('HH:mm')} IST`);

        if (groupAction === 'close') {
          await gss.groupSettingUpdate(m.from, 'announcement');
          await gss.sendMessage(m.from, { text: '🔒 *Group has been auto-closed as scheduled.*' });
        } else if (groupAction === 'open') {
          await gss.groupSettingUpdate(m.from, 'not_announcement');
          await gss.sendMessage(m.from, { text: '🔓 *Group has been auto-opened as scheduled.*' });
        }
      } catch (err) {
        console.error('⛔ Error during scheduled task:', err);
        await gss.sendMessage(m.from, { text: '⚠️ *An error occurred while updating the group setting.*' });
      }
    }, {
      timezone: "Asia/Kolkata"
    });

    await gss.sendMessage(m.from, {
      text: `✅ *Group will be automatically set to* "${groupAction}" *at* 🕒 *${time} IST*`,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Xmd",
          newsletterJid: "120363290715861418@newsletter",
        },
        externalAdReply: {
          title: "👑 Popkid-Xmd Bot",
          body: `Group scheduling: ${groupAction.toUpperCase()} @ ${time}`,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          thumbnailUrl: 'https://files.catbox.moe/kiy0hl.jpg',
          sourceUrl: "https://github.com/popkid-xmd"
        }
      }
    }, { quoted: m });

  } catch (error) {
    console.error('❌ Error:', error);
    await m.reply('❌ *An error occurred while processing your request.*');
  }
};

export default groupSetting;
