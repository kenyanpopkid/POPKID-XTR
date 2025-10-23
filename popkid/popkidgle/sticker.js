import { writeFileSync, unlinkSync, existsSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import config from '../../config.cjs';

const tmp = tmpdir();

const sticker = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  if (cmd !== 'sticker') return;

  const isQuoted = !!m.quoted;
  const msg = isQuoted ? m.quoted : m;

  // 📌 Get MIME type from either quoted or main message
  const mime = (msg.message?.imageMessage?.mimetype ||
                msg.message?.videoMessage?.mimetype ||
                msg.mimetype ||
                '');

  // ❌ No valid media detected
  if (!/image|video/.test(mime)) {
    return await Matrix.sendMessage(m.from, {
      text: `📸 Send or reply to an *image or short video* with:\n*${prefix}sticker*`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363290715861418@newsletter',
          newsletterName: 'Popkid-Xmd',
          serverMessageId: 99
        }
      }
    }, { quoted: m });
  }

  try {
    // ✅ Download media
    const mediaBuffer = await downloadMediaMessage(msg, 'buffer', {}, {});
    const inputExt = mime.includes('video') ? 'mp4' : 'jpg';
    const inputPath = path.join(tmp, `input_${Date.now()}.${inputExt}`);
    const outputPath = path.join(tmp, `output_${Date.now()}.webp`);

    writeFileSync(inputPath, mediaBuffer);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .inputOptions(['-y'])
        .outputOptions([
          '-vcodec', 'libwebp',
          '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=0x00000000',
          '-loop', '0',
          '-ss', '0',
          '-t', '10',
          '-preset', 'default',
          '-an',
          '-vsync', '0'
        ])
        .toFormat('webp')
        .save(outputPath)
        .on('end', resolve)
        .on('error', reject);
    });

    // ✅ Send sticker
    const stickerBuffer = readFileSync(outputPath);
    await Matrix.sendMessage(m.from, {
      sticker: stickerBuffer,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363290715861418@newsletter',
          newsletterName: 'Popkid-Xmd',
          serverMessageId: 99
        }
      }
    }, { quoted: m });

    unlinkSync(inputPath);
    unlinkSync(outputPath);
  } catch (err) {
    console.error('❌ Sticker creation error:', err);
    await Matrix.sendMessage(m.from, {
      text: `❌ *Sticker Failed:* Could not convert media.\n_Try again with a valid image or short video._`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363290715861418@newsletter',
          newsletterName: 'Popkid-Xmd',
          serverMessageId: 99
        }
      }
    }, { quoted: m });
  }
};

export default sticker;
