import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';
import unzipper from 'unzipper';
import config from '../../config.cjs';

const updateCommand = async (m, sock) => {
  const prefix = config.PREFIX || '.';
  const cmdRaw = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const sender = m.sender;
  const isOwner = sender === config.OWNER_NUMBER + '@s.whatsapp.net';

  if (!['update', 'restart', 'reboot'].includes(cmdRaw)) return;

  if (!isOwner) {
    return await sock.sendMessage(m.from, {
      text: '⛔ *Access Denied*\nOnly the bot owner can run this command.',
    }, { quoted: m });
  }

  if (cmdRaw === 'restart' || cmdRaw === 'reboot') {
    await sock.sendMessage(m.from, {
      text: '♻️ *Restarting...*\nPlease wait...',
    }, { quoted: m });

    setTimeout(() => process.exit(0), 1000);
    return;
  }

  // Handle update
  if (cmdRaw === 'update') {
    await sock.sendMessage(m.from, { text: '🔄 *Downloading update, please wait...*' }, { quoted: m });

    const zipUrl = 'https://github.com/devpopkid/POPKID-GLE/archive/refs/heads/main.zip';
    const zipPath = path.join(process.cwd(), 'update.zip');
    const tempExtractPath = path.join(process.cwd(), 'update_temp');

    try {
      // Download zip
      await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(zipPath);
        https.get(zipUrl, (response) => {
          response.pipe(file);
          file.on('finish', () => file.close(resolve));
        }).on('error', (err) => {
          fs.unlinkSync(zipPath);
          reject(err);
        });
      });

      // Extract ZIP
      await fs.promises.mkdir(tempExtractPath, { recursive: true });
      await fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: tempExtractPath }))
        .promise();

      // Get extracted folder
      const [extractedFolder] = fs.readdirSync(tempExtractPath).filter(f => fs.statSync(path.join(tempExtractPath, f)).isDirectory());
      const extractedPath = path.join(tempExtractPath, extractedFolder);

      // Recursive copy (excluding critical files)
      const excluded = ['node_modules', '.git', 'session', 'update.zip', 'config.cjs'];
      const copyRecursive = (src, dest) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
          if (excluded.includes(entry.name)) continue;
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
            copyRecursive(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };

      copyRecursive(extractedPath, process.cwd());

      // Cleanup
      await fs.promises.rm(zipPath, { force: true });
      await fs.promises.rm(tempExtractPath, { recursive: true, force: true });

      await sock.sendMessage(m.from, {
        text: `
🌐 *Update Completed*
✅ Bot files updated successfully.

🧠 Use \`${prefix}restart\` to reload the bot now.
        `.trim(),
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "POPKID-GLE",
            body: "Update Ready",
            thumbnailUrl: "https://files.catbox.moe/e1k73u.jpg",
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: "https://github.com/devpopkid/POPKID-GLE"
          }
        }
      }, { quoted: m });

    } catch (err) {
      console.error('Update error:', err);
      await sock.sendMessage(m.from, {
        text: '❌ *Update failed.* Please check logs for details.',
      }, { quoted: m });
    }
  }
};

export default updateCommand;
