import config from '../../config.cjs';
import fetch from 'node-fetch';

const ytVideo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const body = m.body.slice(prefix.length + cmd.length).trim();
  const args = body.split(" ");

  if (cmd === "ytmp4" || cmd === "ytvideo") {
    if (!body)
      return sock.sendMessage(m.from, {
        text: `🎥 *YouTube Video Downloader*

📌 *Usage:* 
\`\`\`${prefix + cmd} <url> <quality>\`\`\`

💡 *Example:* 
\`\`\`${prefix + cmd} https://youtube.com/watch?v=CVLeZpg6Kzk 360\`\`\`

📺 *Available:* 144, 240, 360, 480, 720, 1080`,
      }, { quoted: m });

    const url = args[0];
    const availableRes = ['144', '240', '360', '480', '720', '1080'];
    const quality = args[1] && availableRes.includes(args[1]) ? args[1] : '480';

    if (!url.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)) {
      return sock.sendMessage(m.from, {
        text: `❌ *Invalid YouTube URL!*\n\n✅ Make sure the link is valid\n🎞 *Allowed qualities:* ${availableRes.join(', ')}`,
      }, { quoted: m });
    }

    await sock.sendMessage(m.from, { text: '⏳ *Processing your video...*' }, { quoted: m });

    try {
      const apiUrl = `https://api.hiuraa.my.id/downloader/savetube?url=${encodeURIComponent(url)}&format=${quality}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data.status || !data.result) {
        return sock.sendMessage(m.from, { text: '❌ *Failed to fetch the video.*' }, { quoted: m });
      }

      const { title, duration, thumbnail, download } = data.result;

      await sock.sendMessage(m.from, {
        image: { url: thumbnail },
        caption: `🎬 *Title:* ${title}
📥 *Quality:* ${quality}p
⏱️ *Duration:* ${duration}

⚡ *Powered by Popkid GLE Bot*`,
      }, { quoted: m });

      await sock.sendMessage(m.from, {
        video: { url: download },
        mimetype: 'video/mp4',
        caption: `✅ *Download Complete!*\n🎞 *${quality}p* Video`,
      }, { quoted: m });

    } catch (err) {
      console.error('YT error:', err);
      sock.sendMessage(m.from, {
        text: '⚠️ *An error occurred while downloading the video.*\nTry again or use a different link.',
      }, { quoted: m });
    }
  }
};

export default ytVideo;
