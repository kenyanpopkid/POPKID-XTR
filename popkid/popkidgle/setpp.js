import { downloadMediaMessage } from '@whiskeysockets/baileys';
import Jimp from 'jimp';
import config from '../config.cjs';

const setProfilePicture = async (m, sock) => {
    const botNumber = await sock.decodeJid(sock.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix)
        ? m.body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        : '';

    // Only trigger on "setpp"
    if (cmd !== "setpp") return;

    // Restrict to bot only
    if (m.sender !== botNumber) {
        return sock.sendMessage(m.from, { 
            text: "❌ *Only the bot can run this command.*" 
        }, { quoted: m });
    }

    // Check if replied message is image
    if (!m.quoted?.message?.imageMessage) {
        return sock.sendMessage(m.from, { 
            text: "⚠️ *Reply to an image to set as profile picture.*" 
        }, { quoted: m });
    }

    // Show loading reaction
    await sock.sendMessage(m.from, { react: { text: '⏳', key: m.key } });

    try {
        // Download media
        const media = await downloadMediaMessage(m.quoted, 'buffer');
        if (!media) throw new Error("Image download failed");

        // Process image
        let image = await Jimp.read(media);

        // Make it square
        if (image.bitmap.width !== image.bitmap.height) {
            const size = Math.max(image.bitmap.width, image.bitmap.height);
            const squareImage = new Jimp(size, size, 0x000000FF);
            squareImage.composite(image, (size - image.bitmap.width) / 2, (size - image.bitmap.height) / 2);
            image = squareImage;
        }

        // Resize for WhatsApp
        image.resize(640, 640);
        const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        // Set profile picture
        await sock.updateProfilePicture(botNumber, buffer);

        // Success reaction & message
        await sock.sendMessage(m.from, { react: { text: '✅', key: m.key } });
        return sock.sendMessage(m.from, {
            text: "✅ *Profile Picture Updated Successfully!*",
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: m });

    } catch (err) {
        console.error("Error setting profile picture:", err);
        await sock.sendMessage(m.from, { react: { text: '❌', key: m.key } });
        return sock.sendMessage(m.from, { 
            text: "❌ *Error while updating profile picture.*" 
        }, { quoted: m });
    }
};

export default setProfilePicture;
