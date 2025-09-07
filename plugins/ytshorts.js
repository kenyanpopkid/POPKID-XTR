const { cmd } = require("../command");
const fs = require("fs");
const ytdl = require("ytdl-core");

cmd({
  pattern: "ytshorts",
  alias: ["shorts", "short"],
  desc: "Download YouTube Shorts",
  category: "downloader",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, usedPrefix, command }) => {
  conn["youtubedl"] = conn["youtubedl"] || {};

  if (m.sender in conn["youtubedl"]) {
    return reply("⏳ Please wait, your previous download is still processing...");
  }

  if (!args[0]) {
    return reply(`❗ Example:\n*${usedPrefix + command}* https://youtube.com/shorts/aUDYWYqtAR4`);
  }

  const isValid = ytdl.validateURL(args[0]); // ❌ don't use await
  if (!isValid) {
    return reply("❌ *Invalid YouTube Shorts link.*");
  }

  const _filename = `./tmp/${Math.random().toString(36).substring(2, 7)}.mp4`;
  const writer = fs.createWriteStream(_filename);
  conn["youtubedl"][m.sender] = true;

  try {
    const { videoDetails } = await ytdl.getInfo(args[0]);
    const { title, publishDate, author } = videoDetails;

    return new Promise((resolve) => {
      ytdl(args[0], { quality: "lowest" }).pipe(writer);

      writer.on("error", () => {
        reply("❌ Failed to download video.");
        delete conn["youtubedl"][m.sender];
        resolve();
      });

      writer.on("close", async () => {
        try {
          await conn.sendMessage(
            from,
            {
              video: { stream: fs.createReadStream(_filename) },
              caption: `┌  • *YouTube Shorts*\n│  ◦ *Title:* ${title}\n│  ◦ *Published:* ${publishDate}\n└  ◦ *Author:* ${author.name}`
            },
            { quoted: mek }
          );
        } catch {
          await conn.sendMessage(
            from,
            {
              document: { stream: fs.createReadStream(_filename) },
              fileName: `${title}.mp4`,
              mimetype: "video/mp4",
              caption: `┌  • *YouTube Shorts*\n│  ◦ *Title:* ${title}\n│  ◦ *Published:* ${publishDate}\n└  ◦ *Author:* ${author.name}`
            },
            { quoted: mek }
          );
        }

        fs.unlinkSync(_filename);
        delete conn["youtubedl"][m.sender];
        resolve();
      });
    });
  } catch (err) {
    delete conn["youtubedl"][m.sender];
    console.error("[YT SHORTS ERROR]:", err.message);
    reply("❌ *Failed to fetch video!*");
  }
});
