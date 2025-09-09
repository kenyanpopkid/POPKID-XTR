//---------------------------------------------
//           popkid-XD  
//---------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE OR REMOVE THIS CREDIT⚠️  
//---------------------------------------------

const { cmd } = require('../command');
const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("ffmpeg-static");
const { execFile } = require("child_process");
const util = require("util");

const execFileAsync = util.promisify(execFile);

// Extract quoted audio or video
function getQuotedMedia(m) {
  const ctx = m.message?.extendedTextMessage?.contextInfo;
  const quoted = ctx?.quotedMessage;
  if (!quoted) return null;

  const type = Object.keys(quoted)[0];
  if (type !== "audioMessage" && type !== "videoMessage") return null;

  return { message: quoted, type };
}

cmd({
  pattern: "shazam",
  alias: ["findsong", "musicid"],
  desc: "Identify music from audio or video",
  category: "tools",
  react: "🎵",
  filename: __filename
}, async (conn, mek, m, { reply }) => {

  const quoted = getQuotedMedia(mek);
  if (!quoted) {
    return reply("🎵 *Reply to an audio or video to identify the song.*");
  }

  // Download the quoted media
  const buffer = await conn.downloadMediaMessage({ message: quoted.message }, "buffer");
  const timestamp = Date.now();
  const inputPath = path.join("/tmp", `shz_${timestamp}_input.mp3`);
  const trimmedPath = path.join("/tmp", `shz_${timestamp}_trimmed.mp3`);
  fs.writeFileSync(inputPath, buffer);

  // Trim to 20s using ffmpeg
  try {
    await execFileAsync(ffmpegPath, ["-y", "-i", inputPath, "-t", "20", "-acodec", "copy", trimmedPath]);
  } catch {
    fs.copyFileSync(inputPath, trimmedPath);
  }

  // Prepare ACRCloud request
  const unixTime = Math.floor(Date.now() / 1000);
  const accessKey = "352b9d6f21439f09c5aadba3386a03cf"; // replace with your own
  const accessSecret = "zT9Zeg1wSa7HNOTggW4rAGcN2nmIfien5SJx0WPN"; // replace with your own

  const stringToSign = ["POST", "/v1/identify", accessKey, "audio", "1", unixTime].join("\n");
  const signature = crypto.createHmac("sha1", accessSecret).update(stringToSign).digest("base64");

  const form = new FormData();
  form.append("access_key", accessKey);
  form.append("sample_bytes", fs.statSync(trimmedPath).size);
  form.append("sample", fs.createReadStream(trimmedPath), { filename: "sample.mp3", contentType: "audio/mpeg" });
  form.append("timestamp", unixTime);
  form.append("signature", signature);
  form.append("data_type", "audio");
  form.append("signature_version", "1");

  try {
    const { data } = await axios.post("https://identify-eu-west-1.acrcloud.com/v1/identify", form, {
      headers: form.getHeaders(),
    });

    if (data.status.code !== 0 || !data.metadata?.music?.length) {
      return reply("❌ *Could not identify the song.*\n📛 Reason: " + (data.status.msg || "No match"));
    }

    const track = data.metadata.music[0];
    const title = track.title;
    const artist = track.artists?.map(a => a.name).join(", ") || "Unknown";
    const album = track.album?.name || "Unknown";
    const release = track.release_date || "Unknown";
    const label = track.label || "Unknown";

    const spotifyLink = "https://open.spotify.com/search/" + encodeURIComponent(`${title} ${artist}`);
    const youtubeLink = track.external_metadata?.youtube?.vid
      ? `https://youtu.be/${track.external_metadata.youtube.vid}`
      : "https://www.youtube.com/results?search_query=" + encodeURIComponent(`${title} ${artist}`);

    const coverArt = track.album?.images?.[0]?.url || "https://i.postimg.cc/QNprd7CF/IMG-20250722-WA1105.jpg";

    const caption =
      "🎶 *Song Identified*\n\n" +
      `• *Title:* ${title}\n` +
      `• *Artist:* ${artist}\n` +
      `• *Album:* ${album}\n` +
      `• *Release:* ${release}\n` +
      `• *Label:* ${label}\n\n` +
      `🌐 Spotify: ${spotifyLink}\n📺 YouTube: ${youtubeLink}`;

    const coverBuffer = (await axios.get(coverArt, { responseType: "arraybuffer" })).data;

    await conn.sendMessage(
      mek.chat,
      { image: coverBuffer, caption },
      { quoted: mek }
    );

  } catch (err) {
    console.error("[Shazam Error]", err);
    reply("❌ Error while identifying the song.");
  } finally {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(trimmedPath)) fs.unlinkSync(trimmedPath);
  }
});
