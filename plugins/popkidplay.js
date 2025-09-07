const { cmd } = require("../command");
const axios = require("axios");
const ytSearch = require("yt-search"); // npm i yt-search

// 🔑 Replace with your real API key
const lann = "YOUR_API_KEY_HERE";

async function youtube(url) {
  try {
    const { data } = await axios.get(
      "https://api.betabotz.eu.org/api/download/yt?url=" + url + "&apikey=" + lann
    );
    return data;
  } catch (e) {
    return e;
  }
}

cmd({
  pattern: "popkidplay",
  alias: ["p", "ds"],
  desc: "Play music from YouTube",
  category: "media",
  react: "🎶",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {
  try {
    if (!q) {
      return await conn.sendMessage(from, { text: "❌ Please provide a song name!" }, { quoted: mek });
    }

    // 🔍 Search YouTube
    const look = await ytSearch(q);
    const convert = look.videos[0];
    if (!convert) throw new Error("Video/Audio not found!");

    if (convert.seconds >= 3600) {
      return await conn.sendMessage(from, { text: "❌ Video is longer than 1 hour!" }, { quoted: mek });
    }

    let audioUrl;
    try {
      audioUrl = await youtube(convert.url);
    } catch (e) {
      await conn.sendMessage(from, { text: "⏳ Please wait, retrying..." }, { quoted: mek });
      audioUrl = await youtube(convert.url);
    }

    // 📄 Build caption
    let caption = `🎶 *Now Playing* 🎶\n\n`;
    caption += `∘ *Title:* ${convert.title}\n`;
    caption += `∘ *Duration:* ${convert.timestamp}\n`;
    caption += `∘ *Views:* ${convert.views}\n`;
    caption += `∘ *Uploaded:* ${convert.ago}\n`;
    caption += `∘ *Channel:* ${convert.author.name}\n`;
    caption += `∘ *Url:* ${convert.url}\n`;

    // 📺 Send preview
    await conn.sendMessage(from, {
      image: { url: convert.image },
      caption,
      contextInfo: {
        externalAdReply: {
          title: convert.title,
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: convert.image,
          sourceUrl: convert.url
        }
      }
    }, { quoted: mek });

    // 🎵 Send audio
    await conn.sendMessage(from, {
      audio: { url: audioUrl.result?.mp3 },
      mimetype: "audio/mpeg",
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: convert.title,
          body: "Popkid XMD Bot - Music",
          thumbnailUrl: convert.image,
          sourceUrl: convert.url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: mek });

    // ✅ React success
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: `❌ Error: ${e.message || e}` }, { quoted: mek });
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
  }
});
