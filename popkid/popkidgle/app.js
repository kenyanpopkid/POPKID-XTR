import config from '../../config.cjs';
import axios from 'axios';

const apkDownloader = async (m, sock) => {
  const prefix = config.PREFIX;
  const command = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const query = m.body.slice(prefix.length + command.length).trim();

  if (command !== 'app') return;

  if (!query) {
    return sock.sendMessage(m.from, {
      text: '❌ *Please provide an app name to search.*'
    }, { quoted: m });
  }

  // React with hourglass emoji to indicate loading
  await sock.sendMessage(m.from, {
    react: { text: '⏳', key: m.key }
  });

  try {
    const sanitized = query.replace(/[^a-zA-Z0-9\s]/g, '');
    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${sanitized}/limit=1`;
    const { data } = await axios.get(apiUrl);

    const app = data?.datalist?.list?.[0];

    if (!app) {
      return sock.sendMessage(m.from, {
        text: '⚠️ *No results found for the given app name.*'
      }, { quoted: m });
    }

    const appSizeMB = (app.size / 1048576).toFixed(2);

    const apkInfo = `
╭─⧉  *APK Downloader*
│
│ 📦 *Name:* ${app.name}
│ 🏷 *Package:* ${app.package}
│ 📅 *Updated:* ${app.updated}
│ 🧮 *Size:* ${appSizeMB} MB
│
╰────⟡ *Powered by Popkid-AI*
`.trim();

    await sock.sendMessage(m.from, {
      text: apkInfo
    }, { quoted: m });

    await sock.sendMessage(m.from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: 'application/vnd.android.package-archive',
      caption: '✅ *Here is the APK file you requested.*'
    }, { quoted: m });

    await sock.sendMessage(m.from, {
      react: { text: '✅', key: m.key }
    });

  } catch (err) {
    console.error('[APK Downloader Error]', err.message);
    return sock.sendMessage(m.from, {
      text: '❌ *An error occurred while fetching the APK. Please try again later.*'
    }, { quoted: m });
  }
};

export default apkDownloader;
