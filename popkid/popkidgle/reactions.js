import axios from 'axios';
import config from '../../config.cjs';

const stickerCommandHandler = async (m, gss) => {
  const prefix = config.PREFIX;
  const body = m.body.trim();
  const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(/\s+/)[0].toLowerCase() : '';
  
  const stickerCommands = new Set([
    'cry', 'kiss', 'kill', 'kick', 'hug', 'pat', 'lick', 'bite', 'yeet', 'bully',
    'bonk', 'wink', 'poke', 'nom', 'slap', 'smile', 'wave', 'awoo', 'blush', 
    'smug', 'dance', 'happy', 'sad', 'cringe', 'cuddle', 'shinobu', 'handhold', 
    'glomp', 'highfive'
  ]);

  if (!stickerCommands.has(cmd)) return;

  try {
    const { data } = await axios.get(`https://api.waifu.pics/sfw/${cmd}`, { timeout: 7000 });
    if (data?.url) {
      await gss.sendImageAsSticker(m.from, data.url, m, {
        packname: 'popkidgle',
        author: ''
      });
    } else {
      m.reply('⚠️ Unable to fetch sticker.');
    }
  } catch (error) {
    console.error('❌ Sticker Fetch Error:', error.message);
    m.reply('⚠️ Failed to fetch sticker, please try again.');
  }
};

export default stickerCommandHandler;
