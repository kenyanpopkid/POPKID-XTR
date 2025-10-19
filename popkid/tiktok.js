const { gmd } = require("../pop");
const axios = require("axios");

gmd({
  pattern: "tiktok",
  aliases: ['ttdl', 'tiktokdl'],
  react: "🎬",
  category: "downloader",
  description: "Download TikTok videos with caption and stats.",
}, async (from, Gifted, context) => {
  const { args, reply, react, mek, sender } = context;
  const q = args.join(" ");

  if (!q) return reply("🎯 *Usage:* .tiktok <TikTok_Link>\n\nExample:\n.tiktok https://www.tiktok.com/@user/video/123456789");
  if (!q.includes("tiktok.com")) return reply("❗ *Invalid URL Detected!*\nPlease provide a valid TikTok link.");

  await reply("⏳ *Connecting to TikTok Servers...*\n📡 Fetching your video, please hold...");

  try {
    const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data)
      return reply("💥 *Failed to download video!*\nTikTok link might be broken or server is offline.");

    const { title, like, comment, share, author, meta } = data.data;
    const videoUrl = meta.media.find(v => v.type === "video")?.org;
    const views = meta?.play_count || 'N/A';

    if (!videoUrl)
      return reply("🚫 *No video URL found!*\nSomething went wrong retrieving media.");

    const caption = `
╭━─━─━─━─━─━─━─━─━─╮
💫 *TikTok Video Found!*
╰━─━─━─━─━─━─━─━─━─╯

👤 *Creator:* ${author.nickname} (@${author.username})
📝 *Title:* ${title || 'Untitled'}
👀 *Views:* ${views}
❤️ *Likes:* ${like}
💬 *Comments:* ${comment}
🔁 *Shares:* ${share}

🔗 *Link:* ${q}
━━━━━━━━━━━━━━━━━━
🧠 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 *PopKid-MD*
`.trim();

    await Gifted.sendMessage(from, {
      video: { url: videoUrl },
      caption,
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

    await react("✅");
  } catch (e) {
    console.error("🔥 TikTok Download Error:", e);
    await react("❌");
    return reply(`❌ *Internal Error!*\n\`\`\`${e.message}\`\`\``);
  }
});
