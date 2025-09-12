const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

cmd({
  pattern: "ytstalk",
  desc: "Stalk a YouTube channel by username",
  category: "tools",
  use: "<username>"
}, async (m, conn, { text }) => {
  try {
    if (!text) {
      return m.reply("❌ Please provide a YouTube username.\nExample: *!ytstalk PewDiePie*");
    }

    let res = await axios.get(`https://api.siputzx.my.id/api/stalk/youtube?username=${encodeURIComponent(text)}`);

    if (!res.data.status) {
      return m.reply(`❌ Channel with username "${text}" not found.`);
    }

    let ch = res.data.data.channel;
    let vids = res.data.data.latest_videos;

    let result = `📺 *YouTube Stalk*\n\n`;
    result += `👤 Username: ${ch.username}\n`;
    result += `📌 Subscribers: ${ch.subscriberCount}\n`;
    result += `🎬 Videos: ${ch.videoCount}\n`;
    result += `🔗 Channel: ${ch.channelUrl}\n\n`;
    result += `📝 Description:\n${ch.description || "-"}\n\n`;

    result += `🎥 *Latest 5 Videos*:\n`;
    vids.slice(0, 5).forEach((v, i) => {
      result += `\n${i + 1}. ${v.title}\n📅 ${v.publishedTime}\n👁️ ${v.viewCount}\n⏱️ ${v.duration}\n🔗 ${v.videoUrl}\n`;
    });

    await conn.sendMessage(
      m.chat,
      {
        image: { url: ch.avatarUrl },
        caption: result
      },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    m.reply("⚠️ An error occurred while fetching YouTube data.");
  }
});
