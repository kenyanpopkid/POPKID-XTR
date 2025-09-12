// ytstalk.js
const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

cmd({
  pattern: "ytstalk",
  alias: ["stalkyt", "youtube"],
  desc: "Stalk a YouTube channel by username",
  category: "stalker",
  use: "<username>",
}, async (m, conn, { text, prefix, command }) => {
  try {
    if (!text) {
      return m.reply(
        `❌ Please provide a YouTube username.\n\n📌 Example: *${prefix + command} PewDiePie*`
      );
    }

    // 🔥 React to the command
    await conn.sendMessage(m.chat, { react: { text: "📺", key: m.key } });

    // API call
    let res = await axios.get(
      `https://api.siputzx.my.id/api/stalk/youtube?username=${encodeURIComponent(
        text
      )}`
    );

    if (!res.data.status) {
      return m.reply(`❌ Channel with username "${text}" not found.`);
    }

    let ch = res.data.data.channel;
    let vids = res.data.data.latest_videos;

    // Build caption
    let caption = `┌───〈 *📺 YouTube Stalk* 〉───┐\n\n`;
    caption += `👤 *Username*: ${ch.username}\n`;
    caption += `📌 *Subscribers*: ${ch.subscriberCount}\n`;
    caption += `🎬 *Videos*: ${ch.videoCount}\n`;
    caption += `🔗 *Channel*: ${ch.channelUrl}\n\n`;
    caption += `📝 *Description*:\n${ch.description || "-"}\n\n`;

    caption += `🎥 *Latest 5 Videos*:\n`;
    vids.slice(0, 5).forEach((v, i) => {
      caption += `\n${i + 1}. ${v.title}\n📅 ${v.publishedTime}\n👁️ ${v.viewCount}\n⏱️ ${v.duration}\n🔗 ${v.videoUrl}\n`;
    });
    caption += `\n└───────────────⭑`;

    // Send avatar + caption
    await conn.sendMessage(
      m.chat,
      {
        image: { url: ch.avatarUrl },
        caption,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("YT Stalk Error:", e);
    m.reply("⚠️ An error occurred while fetching YouTube data.");
  }
});
