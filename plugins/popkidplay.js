const { cmd } = require("../command");
const axios = require("axios");
const yts = require("yt-search");

cmd({
  pattern: "popkidplay",
  alias: ["ian", "mus"],
  desc: "Download and play songs from YouTube",
  category: "downloader",
  react: "🎶",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const text = args.join(" ");
    if (!text) return reply("❌ Please provide a song name!\n\nExample: `.play despacito`");

    // React searching
    await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

    // 🔎 Search YouTube
    const search = await yts(text);
    const convert = search.videos[0];
    if (!convert) return reply("❌ No results found!");

    if (convert.seconds >= 3600) {
      return reply("⚠️ Video is longer than 1 hour, cannot process.");
    }

    // 🔗 Get download link
    let audioUrl;
    try {
      const { data } = await axios.get(
        "https://api.betabotz.eu.org/api/download/yt?url=" +
          convert.url +
          "&apikey=" +
          lann
      );
      audioUrl = data?.result?.mp3 || data?.mp3;
    } catch (e) {
      return reply("❌ Failed to fetch audio link.");
    }

    if (!audioUrl) return reply("❌ Could not fetch audio link.");

    // 🎵 Download audio buffer
    const file = await axios.get(audioUrl, { responseType: "arraybuffer" });

    // 🎶 Caption
    const caption =
      `🎵 *Now Playing* 🎵\n\n` +
      `• *Title:* ${convert.title}\n` +
      `• *Duration:* ${convert.timestamp}\n` +
      `• *Views:* ${convert.views}\n` +
      `• *Uploaded:* ${convert.ago}\n` +
      `• *Channel:* ${convert.author.name}\n` +
      `• *Url:* ${convert.url}`;

    // 📸 Send preview
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

    // 🎧 Send audio file
    await conn.sendMessage(from, {
      audio: file.data,
      mimetype: "audio/mpeg",
      fileName: convert.title + ".mp3",
      contextInfo: {
        externalAdReply: {
          title: convert.title,
          body: "Powered by Popkid XMD Bot",
          thumbnailUrl: convert.thumbnail,
          sourceUrl: convert.url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: mek });

    // React ✅
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (err) {
    console.error(err);
    reply("❌ Error: " + err.message);
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
  }
});
