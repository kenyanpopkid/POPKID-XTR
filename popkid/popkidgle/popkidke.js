import config from '../../config.cjs';
import ytSearch from 'yt-search';
import fetch from 'node-fetch';

const play = async (msg, sock) => {
  const PREFIX = config.PREFIX;
  const cmd = msg.body.startsWith(PREFIX)
    ? msg.body.slice(PREFIX.length).split(" ")[0].toLowerCase()
    : '';
  const query = msg.body.slice(PREFIX.length + cmd.length).trim();

  if (cmd !== "play3") return;

  if (!query) {
    return msg.reply("❌ Please provide a search query!");
  }

  await msg.React('🎧');

  try {
    const searchResults = await ytSearch(query);
    if (!searchResults.videos.length) {
      return msg.reply("❌ No results found!");
    }

    const video = searchResults.videos[0];
    const caption =
      `\n✞︎😇😇𝗣𝗢𝗣𝗞𝗜𝗗 𝗚𝗟𝗘😇😇✞︎\n\n` +
      `┃▸ Title: ${video.title}\n` +
      `┃▸ Duration: ${video.timestamp}\n` +
      `┃▸ Views: ${video.views.toLocaleString()}\n` +
      `┃▸ Channel: ${video.author.name}\n\n` +
      `╰━━━━━━━━━━━━━━━━━━\n\n` +
      `Choose a download format below ⬇️`;

    const contextInfo = {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterName: "ᴘᴏᴘᴋɪᴅ ɢʟᴇ",
        newsletterJid: "120363420342566562@newsletter"
      }
    };

    const buttons = [
      { buttonId: `play3_vid_${video.url}`, buttonText: { displayText: '🎥 Video' }, type: 1 },
      { buttonId: `play3_aud_${video.url}`, buttonText: { displayText: '🎵 Audio' }, type: 1 },
      { buttonId: `play3_viddoc_${video.url}`, buttonText: { displayText: '📄 Video (Doc)' }, type: 1 },
      { buttonId: `play3_auddoc_${video.url}`, buttonText: { displayText: '📄 Audio (Doc)' }, type: 1 }
    ];

    await sock.sendMessage(
      msg.from,
      {
        image: { url: video.thumbnail },
        caption,
        footer: "Select a format to download",
        buttons,
        headerType: 4,
        contextInfo
      },
      { quoted: msg }
    );

  } catch (err) {
    console.error("Search error:", err);
    return msg.reply("❌ An error occurred while searching.");
  }
};

// Handle button responses
export const handleButtonResponse = async (msg, sock) => {
  if (!msg.message?.buttonsResponseMessage) return;
  const btnId = msg.message.buttonsResponseMessage.selectedButtonId;

  if (!btnId.startsWith('play3_')) return;

  await sock.sendMessage(msg.key.remoteJid, {
    react: { text: '🤳', key: msg.key }
  });

  // split by first 2 underscores: type + rest of url
  const [_, type, ...urlParts] = btnId.split('_');
  const url = urlParts.join('_');

  let downloadUrl, sendType, mimeType, successMsg;

  switch (type) {
    case 'vid':
      downloadUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`;
      sendType = "video";
      mimeType = "video/mp4";
      successMsg = "🎟️ Downloaded in Video Format";
      break;
    case 'aud':
      downloadUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(url)}`;
      sendType = "audio";
      mimeType = "audio/mpeg";
      successMsg = "✔️ Downloaded in Audio Format";
      break;
    case 'viddoc':
      downloadUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`;
      sendType = "document";
      mimeType = "video/mp4";
      successMsg = "🏁 Downloaded as Video Document";
      break;
    case 'auddoc':
      downloadUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(url)}`;
      sendType = "document";
      mimeType = "audio/mpeg";
      successMsg = "🤖 Downloaded as Audio Document";
      break;
    default:
      return;
  }

  // Send progress message with edit
  const progressMsg = await sock.sendMessage(msg.key.remoteJid, {
    text: "🔄 Processing your request...\n\n[                    ] 0%",
    quoted: msg
  });

  for (let p = 5; p <= 100; p += 5) {
    const bar = '█'.repeat(p / 5) + " ".repeat(20 - p / 5);
    try {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `🔄 Processing your request...\n\n[${bar}] ${p}%`,
        edit: progressMsg.key
      });
    } catch {
      // some clients might not support edit, so ignore errors
    }
    await new Promise(res => setTimeout(res, 150));
  }

  try {
    const res = await fetch(downloadUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    if (!json.success || !json.result?.download_url) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Download failed, please try again.",
        edit: progressMsg.key
      });
    }

    const sendContent = {
      mimetype: mimeType,
      caption: successMsg,
      fileName: `PopkidGLE_${sendType}.${mimeType.includes("video") ? "mp4" : "mp3"}`
    };
    sendContent[sendType] = { url: json.result.download_url };

    // Delete progress and send file
    await sock.sendMessage(msg.key.remoteJid, { delete: progressMsg.key });
    await sock.sendMessage(msg.key.remoteJid, sendContent, { quoted: msg });

  } catch (err) {
    console.error("Download error:", err);
    try {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ An error occurred during download.",
        edit: progressMsg.key
      });
    } catch {}
  }
};

export default play;
