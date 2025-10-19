const { gmd } = require("../pop");

gmd({
    pattern: "sendimage",
    aliases: ["sendimg", "dlimg", "dlimage"],
    category: "downloader",
    react: "📷",
    description: "Download Audio from url"
  },
  async (from, Gifted, conText) => {
    const { q, mek, reply, react, sender, botFooter, gmdBuffer } = conText;

    if (!q) {
      await react("❌");
      return reply("Please provide image url");
    }

    try {
      const buffer = await gmdBuffer(q);
      if (buffer instanceof Error) {
        await react("❌");
        return reply("Failed to download the image file.");
      }
      await Gifted.sendMessage(from, {
        image: imageBuffer,
        mimetype: "image/jpg",
        caption: `> *${botFooter}*`,
      }, { quoted: mek });
      await react("✅");
    } catch (error) {
      console.error("Error during download process:", error);
      await react("❌");
      return reply("Oops! Something went wrong. Please try again.");
    }
  }
);


gmd({
    pattern: "sendaudio",
    aliases: ["sendmp3", "dlmp3", "dlaudio"],
    category: "downloader",
    react: "🎶",
    description: "Download Audio from url"
  },
  async (from, Gifted, conText) => {
    const { q, mek, reply, react, sender, botFooter, gmdBuffer, formatAudio } = conText;

    if (!q) {
      await react("❌");
      return reply("Please provide audio url");
    }

    try {
      const buffer = await gmdBuffer(q);
    //  const convertedBuffer = await formatAudio(buffer);
      if (buffer instanceof Error) {
        await react("❌");
        return reply("Failed to download the audio file.");
      }
      await Gifted.sendMessage(from, {
        audio: buffer,
        mimetype: "audio/mpeg",
        caption: `> *${botFooter}*`,
      }, { quoted: mek });
      await react("✅");
    } catch (error) {
      console.error("Error during download process:", error);
      await react("❌");
      return reply("Oops! Something went wrong. Please try again.");
    }
  }
);


gmd({
    pattern: "sendvideo",
    aliases: ["sendmp4", "dlmp4", "dvideo"],
    category: "downloader",
    react: "🎥",
    description: "Download Video from url"
  },
  async (from, Gifted, conText) => {
    const { q, mek, reply, react, sender, botFooter, gmdBuffer, formatVideo } = conText;

    if (!q) {
      await react("❌");
      return reply("Please provide video url");
    }

    try {
      const buffer = await gmdBuffer(q);
     // const convertedBuffer = await formatVideo(buffer);
      if (buffer instanceof Error) {
        await react("❌");
        return reply("Failed to download the video file.");
      }
      await Gifted.sendMessage(from, {
        document: buffer,
        fileName: "Video.mp4",
        mimetype: "video/mp4",
        caption: `> *${botFooter}*`,
      }, { quoted: mek });
      await react("✅");
    } catch (error) {
      console.error("Error during download process:", error);
      await react("❌");
      return reply("Oops! Something went wrong. Please try again.");
    }
  }
);


gmd({
  pattern: "play",
  aliases: ["ytmp3", "ytmp3doc", "audiodoc", "yta"],
  category: "downloader",
  react: "🎶",
  description: "Download songs from YouTube"
}, async (from, Gifted, conText) => {
  const { q, mek, reply, react, sender, botPic, botName, newsletterUrl, newsletterJid, gmdJson, gmdBuffer } = conText;
  if (!q) return reply("🎧 Provide a song name or YouTube link first!");

  try {
    const res = await gmdJson(`https://yts.giftedtech.co.ke/?q=${encodeURIComponent(q)}`);
    const vid = res?.videos?.[0];
    if (!vid) return reply("❌ No results found.");

    const url = `https://ytapi.giftedtech.co.ke/api/ytdla.php?url=${encodeURIComponent(vid.url)}&stream=true`;
    const audio = await gmdBuffer(url);
    const sizeMB = (audio.length / (1024 * 1024)).toFixed(2);

    const msg = {
      image: { url: vid.thumbnail || botPic },
      caption: `
╭───────────────❖
│ ✦ *${botName} —😍 🎧*
│──────────────────
│ 🎵 *Title:* ${vid.name}
│ ⏱ *Duration:* ${vid.duration}
│ 💾 *Size:* ${sizeMB} MB
╰──────────────────
_Reply with_
1️⃣ Audio 🎶  |  2️⃣ Document 📄
╭───────────────❖
│ *Session closes in 3 minutes*
╰──────────────────❖`,
      contextInfo: {
        forwardingScore: 5, isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid, newsletterName: botName, serverMessageId: 143
        }
      }
    };

    const sent = await Gifted.sendMessage(from, msg, { quoted: mek });
    const msgId = sent.key.id;

    const handle = async (event) => {
      const data = event.messages[0];
      if (!data?.message) return;
      const isReply = data.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;
      if (!isReply) return;
      const txt = data.message.conversation || data.message.extendedTextMessage?.text;
      await react("⬇️");

      try {
        if (txt.trim() === "1") {
          await Gifted.sendMessage(from, {
            audio, mimetype: "audio/mpeg",
            fileName: `${vid.name}.mp3`.replace(/[^\w\s.-]/gi, ''),
            caption: `🎶 ${vid.name}`,
            externalAdReply: {
              title: `${vid.name}.mp3`, body: "PopKid XTR Player",
              mediaType: 1, thumbnailUrl: vid.thumbnail || botPic,
              sourceUrl: newsletterUrl
            }
          }, { quoted: data });
        } else if (txt.trim() === "2") {
          await Gifted.sendMessage(from, {
            document: audio, mimetype: "audio/mpeg",
            fileName: `${vid.name}.mp3`.replace(/[^\w\s.-]/gi, ''),
            caption: `📄 ${vid.name}`
          }, { quoted: data });
        } else return reply("Reply 1️⃣ for Audio or 2️⃣ for Document", data);
        await react("✅");
      } catch {
        await react("❌"); reply("⚠️ Failed to send media.", data);
      }
    };

    setTimeout(() => Gifted.ev.off("messages.upsert", handle), 180000);
    Gifted.ev.on("messages.upsert", handle);
  } catch {
    await react("❌"); reply("Something went wrong. Try again.");
  }
});


gmd({
  pattern: "video",
  aliases: ["ytmp4", "ytmp4doc", "mp4", "dlmp4"],
  category: "downloader",
  react: "🎥",
  description: "Download YouTube videos"
}, async (from, Gifted, conText) => {
  const { q, mek, reply, react, sender, botPic, botName, newsletterUrl, newsletterJid, gmdJson, gmdBuffer } = conText;
  if (!q) return reply("🎬 Provide a video name or YouTube link first!");

  try {
    const res = await gmdJson(`https://yts.giftedtech.co.ke/?q=${encodeURIComponent(q)}`);
    const vid = res?.videos?.[0];
    if (!vid) return reply("❌ No results found.");

    const url = `https://ytapi.giftedtech.co.ke/api/ytdlv.php?url=${encodeURIComponent(vid.url)}&stream=true`;
    const video = await gmdBuffer(url);
    const sizeMB = (video.length / (1024 * 1024)).toFixed(2);

    const msg = {
      image: { url: vid.thumbnail || botPic },
      caption: `
╭───────────────❖
│ ✦ *${botName} — 😍 🎬*
│──────────────────
│ 🎞 *Title:* ${vid.name}
│ ⏱ *Duration:* ${vid.duration}
│ 💾 *Size:* ${sizeMB} MB
╰──────────────────
_Reply with_
1️⃣ Video 🎥  |  2️⃣ Document 📄
╭───────────────❖
│ *Session closes in 3 minutes*
╰──────────────────❖`,
      contextInfo: {
        forwardingScore: 5, isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid, newsletterName: botName, serverMessageId: 143
        }
      }
    };

    const sent = await Gifted.sendMessage(from, msg, { quoted: mek });
    const msgId = sent.key.id;

    const handle = async (event) => {
      const data = event.messages[0];
      if (!data?.message) return;
      const isReply = data.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;
      if (!isReply) return;
      const txt = data.message.conversation || data.message.extendedTextMessage?.text;
      await react("⬇️");

      try {
        if (txt.trim() === "1") {
          await Gifted.sendMessage(from, {
            video, mimetype: "video/mp4",
            fileName: `${vid.name}.mp4`.replace(/[^\w\s.-]/gi, ''),
            caption: `🎥 ${vid.name}`
          }, { quoted: data });
        } else if (txt.trim() === "2") {
          await Gifted.sendMessage(from, {
            document: video, mimetype: "video/mp4",
            fileName: `${vid.name}.mp4`.replace(/[^\w\s.-]/gi, ''),
            caption: `📄 ${vid.name}`
          }, { quoted: data });
        } else return reply("Reply 1️⃣ for Video or 2️⃣ for Document", data);
        await react("✅");
      } catch {
        await react("❌"); reply("⚠️ Failed to send media.", data);
      }
    };

    setTimeout(() => Gifted.ev.off("messages.upsert", handle), 180000);
    Gifted.ev.on("messages.upsert", handle);
  } catch {
    await react("❌"); reply("Something went wrong. Try again.");
  }
});
