import config from '../../config.cjs';
import fetch from 'node-fetch';

const popkidplay = async (m, sock) => {
  const prefix = config.PREFIX;
  const body = m.body || '';
  const command = body.startsWith(prefix)
    ? body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const url = body.slice(prefix.length + command.length).trim();

  // Only run if it's .popkidplay
  if (command !== 'popkidplay') return;

  if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
    return sock.sendMessage(m.chat, {
      text: `❌ *Usage:*\n${prefix}popkidplay <YouTube Link>\n\n✅ Example:\n${prefix}popkidplay https://youtu.be/60ItHLz5WEA`
    }, { quoted: m });
  }

  try {
    const start = Date.now();
    await m.react('🎵');

    // Call PrinceTech API
    const apiUrl = `https://api.princetechn.com/api/download/mp3?apikey=prince_api_tjhv&url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.status || !data.url) {
      return sock.sendMessage(m.chat, {
        text: `❌ Song not found or download failed. Try another link.`
      }, { quoted: m });
    }

    const { title, thumbnail, duration, url: audioUrl } = data;

    const thumbRes = await fetch(thumbnail);
    const thumbBuffer = await thumbRes.buffer();

    const end = Date.now();
    const pingTime = end - start;

    // Send song details with thumbnail
    await sock.sendMessage(m.chat, {
      image: thumbBuffer,
      caption: `╭━〔 *Popkid Music Engine* 〕━⬣
┃🎶 *Title:* ${title}
┃⏱ *Duration:* ${duration}
┃📡 *Processed:* ${pingTime} ms
┃🔗 *Source:* YouTube
┃💽 *Powered by:* Popkid API
╰━━━━━━━━━━━━━━━━━⬣`,
    }, { quoted: m });

    // Send the audio
    const audioRes = await fetch(audioUrl);
    const audioBuffer = await audioRes.buffer();

    await sock.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m });

  } catch (err) {
    console.error('❌ Error in .popkidplay:', err);
    await sock.sendMessage(m.chat, {
      text: `❌ Something went wrong while processing.\nTry again later.`
    }, { quoted: m });
  }
};

export default popkidplay;
