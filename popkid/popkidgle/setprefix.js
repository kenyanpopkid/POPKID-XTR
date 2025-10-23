import config from '../../config.cjs';

const setprefixCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);

  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'setprefix') {
    if (!isCreator) {
      return await Matrix.sendMessage(
        m.from,
        {
          text: `🚫 *ACCESS DENIED*\n\nYou are not authorized to use this command.\nOnly *bot owner* can change the prefix.`,
        },
        { quoted: m }
      );
    }

    if (!text) {
      return await Matrix.sendMessage(
        m.from,
        {
          text:
            `⚙️ *Prefix Configuration Panel*\n\n` +
            `• Current Prefix: *${prefix}*\n\n` +
            `📌 To change the prefix, type:\n` +
            `> *${prefix}setprefix !*  (example)\n\n` +
            `✅ You can use symbols like: *.* / ! # > ~*`,
        },
        { quoted: m }
      );
    }

    config.PREFIX = text;
    return await Matrix.sendMessage(
      m.from,
      {
        text:
          `✅ *Prefix Updated Successfully!*\n\n` +
          `• New Prefix: *${text}*\n\n` +
          `Use *${text}help* to test the new prefix.`,
      },
      { quoted: m }
    );
  }
};

export default setprefixCommand;
