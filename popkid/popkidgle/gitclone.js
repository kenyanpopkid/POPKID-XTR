import config from '../../config.cjs';
import axios from 'axios';
import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const gitclone = async (m, sock) => {
  const prefix = config.PREFIX;
  const body = m.body.trim();
  const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(/\s+/)[0].toLowerCase() : '';
  const text = body.slice(prefix.length + cmd.length).trim();

  if (cmd !== "gitclone") return;

  try {
    if (!text) {
      await m.React('❌');
      return sock.sendMessage(m.from, {
        text: `🚀 *GitHub Repo Downloader*\n\n❌ Missing repository URL!\n💡 *Usage:* \`${prefix}gitclone https://github.com/user/repo\`\n📌 Example:\n\`${prefix}gitclone https://github.com/mrpopkid/POPKID-GLE\``,
      }, { quoted: m });
    }

    await m.React('⏳');

    const url = text.replace(/\.git$/, '');
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/i);

    if (!match) {
      await m.React('❌');
      return sock.sendMessage(m.from, {
        text: `🚀 *GitHub Repo Downloader*\n\n❌ Invalid URL format!\n🔗 Expected: \`https://github.com/username/repository\`\n📌 Example:\n\`${prefix}gitclone https://github.com/mrpopkid/POPKID-GLE\``,
      }, { quoted: m });
    }

    const [, owner, repo] = match;
    const downloadUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/main`;
    const fileName = `${repo}.zip`;

    let progressMessage = await sock.sendMessage(m.from, {
      text: `🚀 *GitHub Repo Downloader*\n\n⏳ Initializing download...\n\n▰▱▱▱▱▱▱▱▱▱ 0%\n📌 Status: Connecting to GitHub...`,
    }, { quoted: m });

    const updateProgress = async (percentage, status) => {
      const bars = Math.round(percentage / 10);
      const progressBar = '▰'.repeat(bars) + '▱'.repeat(10 - bars);
      await sock.sendMessage(m.from, {
        text: `🚀 *GitHub Repo Downloader*\n\n📂 Repository: *${repo}*\n${progressBar} ${percentage}%\n${status}`,
        edit: progressMessage.key
      }, { quoted: m });
    };

    // Download
    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream',
      headers: { 'User-Agent': 'node.js' }
    });

    const writer = fs.createWriteStream(fileName);
    response.data.pipe(writer);

    await updateProgress(10, '🌐 Connecting to repository...');
    await new Promise((resolve, reject) => {
      let downloaded = 0;
      response.data.on('data', chunk => {
        downloaded += chunk.length;
        const percent = Math.min(90, Math.round((downloaded / (5 * 1024 * 1024)) * 90)); // Estimate
        updateProgress(percent, '⬇️ Downloading...');
      });
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    await updateProgress(95, '📦 Packaging files...');
    await updateProgress(100, '✅ Download complete! Sending file...');

    await sock.sendMessage(m.from, {
      document: fs.readFileSync(fileName),
      mimetype: 'application/zip',
      fileName: fileName
    }, { quoted: m });

    await sock.sendMessage(m.from, {
      text: `✅ *Download Complete!*\n\n📂 Repo: *${repo}*\n📦 File: ${fileName}\n🔗 Source: ${url}\n📤 Status: Sent successfully!`,
      edit: progressMessage.key
    }, { quoted: m });

    fs.unlinkSync(fileName);
    await m.React('✅');

  } catch (error) {
    console.error('❌ GitClone Error:', error.message);
    await m.React('❌');
    let errMsg = `🚀 *GitHub Repo Downloader*\n\n❌ Failed to download repository.`;
    if (error.response?.status === 404) {
      errMsg = `🚀 *GitHub Repo Downloader*\n\n❌ Repository not found!\n🔍 Possible reasons:\n- Private repository\n- Deleted repo\n- Invalid URL`;
    }
    await sock.sendMessage(m.from, { text: errMsg }, { quoted: m });
  }
};

export default gitclone;
