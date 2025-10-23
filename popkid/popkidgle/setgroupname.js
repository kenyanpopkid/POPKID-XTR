import config from '../../config.cjs';

const setGroupName = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix)
      ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
      : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['setgroupname', 'setname'];
    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup)
      return m.reply(
        `╭━━〔 *🚫 GROUP ONLY COMMAND* 〕━━━╮\n┃ This command works in *GROUPS ONLY!*\n╰━━━━━━━━━━━━━━━━━━━━╯`
      );

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin)
      return m.reply(
        `╭━━〔 *🤖 BOT PERMISSION ERROR* 〕━━╮\n┃ ❌ I need to be an *admin* to rename the group.\n╰━━━━━━━━━━━━━━━━━━━━╯`
      );

    if (!senderAdmin)
      return m.reply(
        `╭━━〔 *🔐 ACCESS DENIED* 〕━━╮\n┃ ❌ You must be a *group admin* to do this.\n╰━━━━━━━━━━━━━━━━━━━━╯`
      );

    if (!text)
      return m.reply(
        `╭━━〔 *📛 INVALID NAME* 〕━━╮\n┃ ❌ Please provide a valid *group name*.\n┃ 💡 Example: ${prefix}${cmd} Hackers United\n╰━━━━━━━━━━━━━━━━━━━━╯`
      );

    await gss.groupUpdateSubject(m.from, text);

    return m.reply(
      `╭─❖ 「 *✅ GROUP NAME UPDATED* 」\n│\n├ 📛 New Name: *${text}*\n├ 🛡️ Changed by: @${m.sender.split('@')[0]}\n╰───────────────╯`,
      { mentions: [m.sender] }
    );
  } catch (error) {
    console.error('Error:', error);
    return m.reply(
      `╭───〔 *❌ ERROR OCCURRED* 〕───╮\n┃ Something went wrong while renaming.\n┃ Error: ${error.message || error}\n╰────────────────────╯`
    );
  }
};

export default setGroupName;
