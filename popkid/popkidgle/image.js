import axios from 'axios';
import config from '../../config.cjs';

global.nex_key = 'https://api.nexoracle.com';
global.nex_api = 'free_key@maher_apis';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const imageCommand = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  let query = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['image', 'img', 'gimage'];
  if (!validCommands.includes(cmd)) return;

  if (!query && !(m.quoted && m.quoted.text)) {
    return sock.sendMessage(m.from, {
      text:
        `╭━━〔 *🖼️ IMAGE SEARCH* 〕━━╮\n` +
        `┃ ❌ No query provided.\n` +
        `┃ 💡 Example: *${prefix + cmd} neon skull*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363290715861418@newsletter",
          newsletterName: "Popkid-Xmd"
        }
      }
    });
  }

  if (!query && m.quoted && m.quoted.text) {
    query = m.quoted.text;
  }

  await sock.sendMessage(m.from, {
    text: `🔍 *Searching for:* _${query}_\n\n🕒 Please wait while I fetch images...`,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363290715861418@newsletter",
        newsletterName: "Popkid-Xmd"
      }
    }
  });

  try {
    const endpoint = `${global.nex_key}/search/google-image?apikey=${global.nex_api}&q=${encodeURIComponent(query)}`;
    const response = await axios.get(endpoint);

    if (response.status !== 200 || !response.data.result || response.data.result.length === 0) {
      throw new Error('No images found');
    }

    const images = response.data.result.slice(0, 5);
    let successCount = 0;

    for (let i = 0; i < images.length; i++) {
      try {
        await sleep(500);
        await sock.sendMessage(
          m.from,
          {
            image: { url: images[i] },
            caption: `🖼️ *Image ${i + 1}/${images.length}*\n🔎 _${query}_`,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "120363290715861418@newsletter",
                newsletterName: "Popkid-Xmd"
              }
            }
          },
          { quoted: m }
        );
        successCount++;
      } catch (imgErr) {
        console.warn(`Failed to send image ${i + 1}:`, imgErr.message);
        // Skip to next image
      }
    }

    if (successCount > 0) {
      await sock.sendMessage(m.key.remoteJid, {
        react: {
          text: '✅',
          key: m.key
        }
      });
    } else {
      throw new Error('All image fetch attempts failed');
    }

  } catch (error) {
    console.error("Image Fetch Error:", error);

    await sock.sendMessage(m.from, {
      text:
        `╭───〔 *❌ SEARCH FAILED* 〕───╮\n` +
        `┃ ❗ Unable to fetch images.\n` +
        `┃ 💬 Error: ${error.message || error}\n` +
        `┃ 🔁 Please try again later.\n` +
        `╰──────────────────────────╯`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363290715861418@newsletter",
          newsletterName: "Popkid-Xmd"
        }
      }
    });
  }
};

export default imageCommand;
