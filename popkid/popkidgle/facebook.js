import pkg from '@whiskeysockets/baileys';
const { fetchLatestBaileysVersion } = pkg;
import getFBInfo from '@xaviabot/fb-downloader';
import config from '../../config.cjs';

const fbSessionMap = new Map(); // userId -> { qualityList }

const facebookCommand = async (m, Matrix) => {
    const prefix = config.PREFIX;
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();
    const userId = m.sender;

    // ===== STEP 1: Trigger Command =====
    if (['facebook', 'fb', 'fbdl'].includes(cmd)) {
        if (!text) return m.reply('❌ *Please provide a valid Facebook video URL.*');

        try {
            await m.React("🔍");

            const fbData = await getFBInfo(text);
            if (!fbData) {
                await m.reply('❌ *No downloadable video found.*');
                await m.React("❌");
                return;
            }

            // Build quality list
            const qualityList = [];
            if (fbData.sd) qualityList.push({ resolution: 'SD', url: fbData.sd });
            if (fbData.hd) qualityList.push({ resolution: 'HD', url: fbData.hd });

            if (qualityList.length === 0) {
                await m.reply('⚠️ *No SD or HD quality available for this video.*');
                return;
            }

            // Save session for user
            fbSessionMap.set(userId, { qualityList });

            // Menu message
            let menu = `
╭━━〔 *📥 POPKID-MD FACEBOOK DOWNLOADER* 〕━━⬣
┃ 📝 *Title:* ${fbData.title}
┃ 🌐 *Source:* Facebook
┃ 📊 *Qualities:* ${qualityList.map(q => q.resolution).join(', ')}
┃
┃ 💠 *Tap a button below to download:*
╰━━━━━━━━━━━━━━━━━━━━⬣
`;

            await Matrix.sendMessage(m.from, {
                image: { url: fbData.thumbnail },
                caption: menu.trim(),
                footer: '🎥 Powered by POPKID-MD',
                buttons: qualityList.map(q => ({
                    buttonId: `fb_${q.resolution.toLowerCase()}`,
                    buttonText: { displayText: `⬇️ Download ${q.resolution}` },
                    type: 1
                })),
                headerType: 4
            }, { quoted: m });

            await m.React("✅");
        } catch (error) {
            console.error("Facebook command error:", error);
            await m.reply('❌ *Error processing your request.*');
            await m.React("❌");
        }
    }

    // ===== STEP 2: Handle Button Press =====
    else if (m.buttonId && fbSessionMap.has(userId)) {
        const { qualityList } = fbSessionMap.get(userId);
        const selected = qualityList.find(q => `fb_${q.resolution.toLowerCase()}` === m.buttonId);

        if (selected) {
            try {
                await m.React("⬇️");
                const buffer = await getStreamBuffer(selected.url);
                const sizeMB = buffer.length / (1024 * 1024);

                if (sizeMB > 300) {
                    await m.reply("🚫 *The video exceeds 300MB and cannot be sent.*");
                } else {
                    await Matrix.sendMessage(m.from, {
                        video: buffer,
                        mimetype: 'video/mp4',
                        caption: `✅ *Download Complete: ${selected.resolution}*\n\n🎥 *POPKID-MD BOT*`
                    }, { quoted: m });
                }

                fbSessionMap.delete(userId); // Clear session
                await m.React("✅");
            } catch (error) {
                console.error("Send error:", error);
                await m.reply('❌ *Failed to download or send video.*');
                await m.React("❌");
            }
        }
    }
};

// ===== Utility: Fetch video stream as Buffer =====
const getStreamBuffer = async (url) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
};

export default facebookCommand;
