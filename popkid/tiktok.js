const { gmd } = require("../pop");
const axios = require("axios");

//═══════════════『 🎵 TIKTOK DOWNLOADER 』═══════════════//
gmd({
  pattern: "tiktok",
  react: "🎶",
  aliases: ['tt', 'tiktokdl'],
  category: "owner",
  description: "Download TikTok videos using a valid TikTok link.",
}, async (from, Gifted, conText) => {
  const { reply, args, mek, sender } = conText;
  const q = args && args.length > 0 ? args.join(" ") : "";

  // 🧩 Validate link
  if (!q || !q.includes("tiktok.com")) {
    return reply("❗ *Invalid URL detected!*\nPlease provide a valid TikTok video link.");
  }

  await reply("⏳ *Connecting to TikTok servers...*\n📡 Fetching your video, please wait...");

  try {
    // 🌐 API CALL
    const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    // ❌ Validate response
    if (!data.status || !data.data) {
      return reply("💥 *Failed to download video!*\nTikTok link might be broken or the API is offline.");
    }

    const { title, like, comment, share, author, meta } = data.data;
    const videoUrl = meta.media.find(v => v.type === "video")?.org;
    const views = meta?.play_count || "N/A";

    if (!videoUrl) {
      return reply("🚫 *No video found!* Please check the link again.");
    }

    // 🧾 Caption
    const caption = `
┏━━━━━━━━━━━━━━━━━━━━━━┓
   🎵 *TIKTOK VIDEO FOUND!* 🎵
┗━━━━━━━━━━━━━━━━━━━━━━┛

👤 *Creator:* ${author.nickname} (@${author.username})
📝 *Title:* ${title || "Untitled"}
👀 *Views:* ${views}
❤️ *Likes:* ${like}
💬 *Comments:* ${comment}
🔁 *Shares:* ${share}

🔗 *Link:* ${q}

━━━━━━━━━━━━━━━━━━━━━━
⚡ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 *Popkid-Xmd*
`;

    // 🎥 Send video
    await Gifted.sendMessage(from, {
      video: { url: videoUrl },
      caption: caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: [sender],
        forwardedNewsletterMessageInfo: {
          newsletterName: "🔥 Popkid Media Feed",
          newsletterJid: "120363420342566562@newsletter"
        }
      }
    }, { quoted: mek });

  } catch (err) {
    console.error("🔥 TikTok Download Error:", err);
    await reply(`❌ *Internal Error!*\n\`\`\`${err.message}\`\`\``);
  }
});
