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
    return; // avoid multiple downloads from same sender
  }
  if (!args[0]) {
    return reply(`❗ Example:\n*${usedPrefix + command}* https://youtube.com/shorts/aUDYWYqtAR4`);
  }

  const isValid = ytdl.validateURL(args[0]);
  if (!isValid) {
    return reply("❌ *Your link is not supported.*");
  }

  const _filename = `./tmp/${Math.random().toString(36).substring(2, 7)}.mp4`;
  const writer = fs.createWriteStream(_filename);
  conn["youtubedl"][m.sender] = true;

  try {
    const { videoDetails } = await ytdl.getInfo(args[0]);
    const { title, publishDate, author } = videoDetails;
    const { name } = author;

    return new Promise((resolve) => {
      ytdl(args[0], { quality: "lowest" }).pipe(writer);

      writer.on("error", () => {
        reply("❌ Failed downloading video.");
        delete conn["youtubedl"][m.sender];
        resolve();
      });

      writer.on("close", async () => {
        try {
          // Try sending as video
          await conn.sendMessage(
            from,
            {
              video: { stream: fs.createReadStream(_filename) },
              caption: `┌  • *YouTube Shorts*\n│  ◦ *Title:* ${title}\n│  ◦ *Published:* ${publishDate}\n└  ◦ *Author:* ${name}`
            },
            { quoted: mek }
          );
        } catch {
          // Fallback to sending as document
          await conn.sendMessage(
            from,
            {
              document: { stream: fs.createReadStream(_filename) },
              fileName: `${title}.mp4`,
              mimetype: "video/mp4",
              caption: `┌  • *YouTube Shorts*\n│  ◦ *Title:* ${title}\n│  ◦ *Published:* ${publishDate}\n└  ◦ *Author:* ${name}`
            },
            { quoted: mek }
          );
        }

        fs.unlinkSync(_filename); // delete temp file
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
