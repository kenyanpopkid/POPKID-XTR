const { gmd } = require("../pop");
const axios = require('axios');


//═══════════════『 ❌ KICK USER 』═══════════════//
gmd({
  pattern: "kick",
  react: "🚫",
  category: "group",
  description: "Remove a user from the group.",
}, async (from, Gifted, ctx) => {
  const { reply, sender, quotedUser, isAdmin, isGroup, isBotAdmin, mek } = ctx;

  if (!isGroup) return reply("❌ Group only command!");
  if (!isAdmin) return reply(`@${sender.split('@')[0]} you are not an admin.`, { mentions: [sender] });
  if (!isBotAdmin) return reply("❌ Bot must be admin first!");
  if (!quotedUser) return reply("Reply to the user you want to remove!");

  try {
    await Gifted.groupParticipantsUpdate(from, [quotedUser], "remove");
    reply(`🚫 Removed @${quotedUser.split('@')[0]}`, { mentions: [quotedUser] });
  } catch (err) {
    reply(`❌ Failed to remove: ${err.message}`);
  }
});


//═══════════════『 🔗 GROUP LINK 』═══════════════//
gmd({
  pattern: "link",
  react: "🔗",
  category: "group",
  description: "Get the group invite link.",
}, async (from, Gifted, ctx) => {
  const { reply, isGroup, isAdmin, isBotAdmin } = ctx;

  if (!isGroup) return reply("❌ Group only command!");
  if (!isAdmin) return reply("❌ Admins only!");
  if (!isBotAdmin) return reply("❌ Bot must be admin first!");

  try {
    const link = await Gifted.groupInviteCode(from);
    reply(`🔗 *Group Link:*\nhttps://chat.whatsapp.com/${link}`);
  } catch (err) {
    reply(`❌ Failed to get group link: ${err.message}`);
  }
});


//═══════════════『 ♻️ REVOKE LINK 』═══════════════//
gmd({
  pattern: "resetlink",
  react: "♻️",
  category: "group",
  description: "Revoke and generate a new group invite link.",
}, async (from, Gifted, ctx) => {
  const { reply, isGroup, isAdmin, isBotAdmin } = ctx;

  if (!isGroup) return reply("❌ Group only command!");
  if (!isAdmin) return reply("❌ Admins only!");
  if (!isBotAdmin) return reply("❌ Bot must be admin first!");

  try {
    await Gifted.groupRevokeInvite(from);
    const newLink = await Gifted.groupInviteCode(from);
    reply(`✅ Group link successfully reset!\n🔗 New Link:\nhttps://chat.whatsapp.com/${newLink}`);
  } catch (err) {
    reply(`❌ Failed to revoke link: ${err.message}`);
  }
});


//═══════════════『 🏃 BOT LEAVE 』═══════════════//
gmd({
  pattern: "leave",
  react: "👋",
  category: "owner",
  description: "Bot leaves the current group.",
}, async (from, Gifted, ctx) => {
  const { reply, sender, isGroup, isAdmin } = ctx;

  if (!isGroup) return reply("❌ Group only command!");
  if (!isAdmin) return reply(`@${sender.split('@')[0]} only admins can make me leave.`, { mentions: [sender] });

  await reply("👋 Leaving the group... Bye!");
  await Gifted.groupLeave(from);
});
