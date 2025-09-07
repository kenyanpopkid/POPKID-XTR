const { cmd } = require("../command");
const axios = require("axios");
const yts = require("yt-search");

cmd({
  pattern: "popkidplay",
  alias: ["son", "mus"],
  desc: "Download and play songs from YouTube",
  category: "downloader",
  react: "🎶",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const query = args.join(" ");
    if (!query) {
      return reply("❗ *Usage:* `.play <song name>`\n📌 *Example:* `.play faded alan walker`");
    }

    // Search YouTube
    const searchResults = await yts(query);
    const video = searchResults.videos[0];
    if (!video) {
      return reply("❌ *No video found for your search.*");
    }

    const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
    let downloadUrl;
    let response;

    // Use your logic (mp3 via noobs-api, mp4 via jawad-tech)
    downloadUrl = `https://noobs-api.top/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;
    response = await axios.get(downloadUrl);

    const data = response.data;
    if (!data.downloadLink) {
      return reply("❌ *Error: the download link is empty or invalid.*");
    }

    // Caption
    const caption = `
━❍ *SONG*━
🎵 *Title:* ${video.title}
👤 *Artist:* ${video.author.name}
⏱️ *Duration:* ${video.timestamp}
📅 *Published:* ${video.ago}
👁️ *Views:* ${video.views.toLocaleString()}
📥 *Format:* MP3
━❍ Preparing... ⏳━
🤖 *𝓟𝓸𝓹𝓴𝓲𝓭*
`.trim();

    // Send thumbnail + caption
    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption
    }, { quoted: mek });

    // Send audio file
    await conn.sendMessage(from, {
      audio: { url: data.downloadLink },
      mimetype: "audio/mpeg",
      fileName: `${video.title.replace(/[\\/:*?"<>|]/g, "")}.mp3`
    }, { quoted: mek });

  } catch (err) {
    console.error("[PLAY ERROR]:", err.message);
    reply(`❌ *An error occurred:* ${err.message}`);
  }
});
