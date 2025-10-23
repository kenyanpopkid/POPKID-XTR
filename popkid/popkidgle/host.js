import os from 'os';
import process from 'process';
import config from '../../config.cjs';

const hostCommand = async (m, Matrix) => {
  const prefix = config.PREFIX || '.';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  if (cmd !== 'host') return;

  try {
    const hostname = os.hostname();
    const platform = os.platform();
    const arch = os.arch();
    const release = os.release();
    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model || 'Unknown CPU';
    const cpuCores = cpus.length;
    const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const freeMem = (os.freemem() / (1024 ** 3)).toFixed(2);
    const nodeVersion = process.version;
    const uptimeSeconds = process.uptime();
    const uptime = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${Math.floor(uptimeSeconds % 60)}s`;
    const now = new Date().toLocaleString();

    // 🌍 Deployment detection logic
    let deployedOn = 'Unknown';

    if (process.env.RENDER === 'true' || process.env.RENDER_INSTANCE_ID) {
      deployedOn = 'Render';
    } else if (process.env.HEROKU === 'true' || process.env.DYNO) {
      deployedOn = 'Heroku';
    } else if (process.env.REPL_ID || process.env.REPLIT_DB_URL) {
      deployedOn = 'Replit';
    } else if (process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_ENVIRONMENT) {
      deployedOn = 'Railway';
    } else if (process.env.GLITCH_PROJECT_ID) {
      deployedOn = 'Glitch';
    } else if (process.env.VERCEL === '1' || process.env.NEXT_PUBLIC_VERCEL_URL) {
      deployedOn = 'Vercel';
    } else if (hostname.includes('fly')) {
      deployedOn = 'Fly.io';
    }

    const messageText = `
🏷️ *Bot Deployment Info*

📍 Deployed On   : ${deployedOn}
🌐 Hostname      : ${hostname}
🖥️ Platform       : ${platform} (${arch})
📦 OS Release    : ${release}
⚙️ CPU           : ${cpuModel} (${cpuCores} cores)
💾 Memory        : ${freeMem} GB free / ${totalMem} GB total
🔧 Node.js       : ${nodeVersion}
⏳ Uptime        : ${uptime}
🕒 Server Time   : ${now}
    `.trim();

    await Matrix.sendMessage(m.from, {
      text: messageText,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Xmd",
          newsletterJid: "120363420342566562@newsletter",
        },
        externalAdReply: {
          title: "Popkid-Xmd Bot",
          body: "Host Environment Details",
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: "https://github.com/popkid-xmd"
        }
      }
    }, { quoted: m });

  } catch (error) {
    console.error('Host command error:', error);
    await Matrix.sendMessage(m.from, {
      text: '❌ Failed to retrieve host info.',
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Xmd",
          newsletterJid: "120363420342566562@newsletter",
        }
      }
    }, { quoted: m });
  }
};

export default hostCommand;
