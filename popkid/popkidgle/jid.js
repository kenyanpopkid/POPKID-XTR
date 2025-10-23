import config from '../../config.cjs';

const jidCommand = async (m, Matrix) => {
    const prefix = config.PREFIX;
    const command = m.body?.startsWith(prefix)
        ? m.body.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase()
        : '';

    if (command === 'jid') {
        const isGroup = m.from.endsWith('@g.us');
        const jid = isGroup ? m.from : `${m.sender}`;
        const text = isGroup
            ? `🌐 *Group JID:* \n\`\`\`${jid}\`\`\``
            : `👤 *User JID:* \n\`\`\`${jid}\`\`\``;

        const copyButton = {
            buttonId: `${prefix}jid`,
            buttonText: { displayText: "📋 Copy JID" },
            type: 1
        };

        const infoButton = {
            buttonId: `${prefix}uptime ${jid}`,
            buttonText: { displayText: "ℹ️ BOT UPTIME" },
            type: 1
        };

        const contextInfo = {
            forwardedNewsletterMessageInfo: {
                newsletterName: 'Popkid-Xmd',
                newsletterJid: '120363290715861418@newsletter'
            }
        };

        return await Matrix.sendMessage(
            m.from,
            {
                text,
                buttons: [copyButton, infoButton],
                headerType: 1,
                footer: "⚡ Popkid-Xmd — JID Lookup",
                contextInfo
            },
            { quoted: m }
        );
    }
};

export default jidCommand;
