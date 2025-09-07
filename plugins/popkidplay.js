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
    const text = args.join(" ");
    if (!text) return reply("❌ Please provide a song name.\n\nExample: `.play perfect ed sheeran`");

    await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

    const search = await yts(text);
    const convert = search.videos[0];
    if (!convert) return reply("❌ No results found!");

    if (convert.seconds >= 3600) {
      return reply("⏳ Video is longer than 1 hour, cannot process.");
    }

    // 🔗 Try APIs
    let audioUrl;
    try {
      const { data } = await axios.get(
        `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(convert.url)}`
      );
      audioUrl = data?.result?.download_url;
    } catch (e) {
      return reply("❌ Failed to fetch audio link.");
    }

    if (!audioUrl) return reply("❌ Could not fetch audio link.");

    // 📥 Download audio as buffer instead of URL
    const audioBuffer = await axios.get(audioUrl, { responseType: "arraybuffer" });

    const caption =
      `🎵 *Now Playing* 🎵\n\n` +
      `• *Title:* ${convert.title}\n` +
      `• *Duration:* ${convert.timestamp}\n` +
      `• *Views:* ${convert.views}\n` +
      `• *Uploaded:* ${convert.ago}\n` +
      `• *Channel:* ${convert.author.name}\n` +
      `• *Url:* ${convert.url}`;

    // Send thumbnail + caption
    await conn.sendMessage(from, {
      image: { url: convert.thumbnail },
      caption,
      contextInfo: {
        externalAdReply: {
          title: convert.title,
          body: "Popkid XMD Bot • YouTube Music",
          thumbnailUrl: convert.thumbnail,
          sourceUrl: convert.url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: mek });

    // Send real audio buffer
    await conn.sendMessage(from, {
      audio: audioBuffer.data,
      mimetype: "audio/mpeg",
      ptt: false, // true = voice note
      fileName: `${convert.title}.mp3`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (err) {
    console.error(err);
    reply("❌ Error: " + err.message);
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
  }
});
