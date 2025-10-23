import axios from 'axios';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const Lyrics = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const command = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const query = m.body.slice(prefix.length + command.length).trim();

  const validCommands = ['lyrics', 'lyric'];

  if (!validCommands.includes(command)) return;

  const newsletterInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363290715861418@newsletter",
      newsletterName: "Popkid-Xmd"
    }
  };

  if (!query) {
    return m.reply(
      `Hello *${m.pushName}*,\n\nTo find lyrics, use the format:\n\`\`\`${prefix}lyrics Song Title|Artist Name\`\`\`\n\nExample:\n\`\`\`${prefix}lyrics Imagine|John Lennon\`\`\``,
      { contextInfo: newsletterInfo }
    );
  }

  try {
    await m.React('⏳');
    await m.reply('Fetching lyrics... please be patient ✨', {
      contextInfo: newsletterInfo
    });

    if (!query.includes('|')) {
      return m.reply(
        'Please provide the song title and artist name separated by a `|` symbol.\n\nExample: `Spectre|Alan Walker`',
        { contextInfo: newsletterInfo }
      );
    }

    const [title, artist] = query.split('|').map(part => part.trim());

    if (!title || !artist) {
      return m.reply(
        'Oops! Both the song title and artist name are required.\n\nUse the format: `Song Title|Artist Name`',
        { contextInfo: newsletterInfo }
      );
    }

    const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
    const response = await axios.get(apiUrl);
    const result = response.data;

    if (result && result.lyrics) {
      const lyrics = result.lyrics.trim();

      const buttons = [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📝 Copy Lyrics",
            id: "copy_code",
            copy_code: lyrics
          })
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "🌐 Follow Our Channel",
            url: `https://whatsapp.com/channel/0029VadQrNI8KMqo79BiHr3l`
          })
        },
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🏠 Main Menu",
            id: ".menu"
          })
        }
      ];

      const interactiveMessage = proto.Message.InteractiveMessage.create({
        header: proto.Message.InteractiveMessage.Header.create({
          title: `🎶 Lyrics for "${title}" by ${artist} 🎶`,
          hasMediaAttachment: false
        }),
        body: proto.Message.InteractiveMessage.Body.create({
          text: lyrics || 'No lyrics found for this song. 😔'
        }),
        footer: proto.Message.InteractiveMessage.Footer.create({
          text: `🎵 Powered by 👑Popkid XMD🔥`
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons
        })
      });

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
              ...newsletterInfo
            },
            interactiveMessage
          }
        }
      }, {});

      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });

      await m.React('✅');
    } else {
      m.reply(`Sorry, I couldn't find the lyrics for "${title}" by ${artist}. 😔`, {
        contextInfo: newsletterInfo
      });
      await m.React('❌');
    }
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    m.reply('An error occurred while trying to fetch the lyrics. Please try again later. 🙏', {
      contextInfo: newsletterInfo
    });
    await m.React('⚠️');
  }
};

export default Lyrics;
