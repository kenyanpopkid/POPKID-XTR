const { gmd } = require("../pop");

gmd({
  pattern: "tagall",
  aliases: ['mentionall', 'everyone', 'all'],
  react: "📣",
  category: "group",
  description: "Mention everyone in the group.",
}, async (from, Gifted, conText) => {
  const { reply, sender, isGroup, isAdmin, isBotAdmin, isSuperAdmin, args, mek } = conText;

  if (!isGroup) {
    return reply("This command only works in groups!");
  }

  if (!isAdmin && !isSuperAdmin) {
    const userNumber = sender.split('@')[0];
    return Gifted.sendMessage(from, {
      text: `@${userNumber} you are not an admin, so you can't tag everyone.`,
      mentions: [`${userNumber}@s.whatsapp.net`]
    }, { quoted: mek });
  }

  try {
    const gInfo = await Gifted.groupMetadata(from);
    const participants = gInfo.participants;

    // Create mention list
    const mentions = participants.map(p => p.id || p.jid || p.user);
    const taggedList = participants.map(p => `• @${(p.id || p.jid || p.user).split('@')[0]}`).join('\n');

    // Optional message with the tag
    const tagMessage = args && args.length > 0 ? args.join(' ') : "📢 *TAG ALL MEMBERS* 📢";

    const text = `
${tagMessage}

👥 *Total Members:* ${participants.length}

${taggedList}
    `.trim();

    await Gifted.sendMessage(from, {
      text,
      mentions
    }, { quoted: mek });

    await Gifted.sendMessage(from, {
      react: { text: "✅", key: mek.key }
    });
  } catch (err) {
    console.error("TagAll Error:", err);
    await Gifted.sendMessage(from, { text: "❌ Failed to tag all members." }, { quoted: mek });
  }
});
