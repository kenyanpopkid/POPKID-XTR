const { cmd } = require('./command');

class ButtonManager {
    constructor(cmd) {
        this.cmd = cmd;
        this.handlers = new Map();
    }

    // Create a buttons message
    createButtonsMessage(options) {
        const {
            imageUrl,
            caption,
            footer,
            buttons,
            contextInfo = {},
            quoted
        } = options;

        return {
            image: imageUrl ? (Buffer.isBuffer(imageUrl) ? imageUrl : { url: imageUrl }) : undefined,
            caption,
            footer,
            buttons,
            headerType: imageUrl ? 4 : 1, // Image header if imageUrl is provided
            contextInfo: {
                ...contextInfo,
                mentionedJid: contextInfo.mentionedJid || [],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: contextInfo.newsletterJid || '120363402507750390@newsletter',
                    newsletterName: contextInfo.newsletterName || '🔥ᴍᴀʟᴠɪɴ-ʀᴇᴘᴏ🔥',
                    serverMessageId: 143
                }
            }
        };
    }

    // Add button handler
    addHandler(messageId, sessionId, callback) {
        const handler = async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg.message?.buttonsResponseMessage) return;

            const buttonId = receivedMsg.message.buttonsResponseMessage.selectedButtonId;
            const senderId = receivedMsg.key.remoteJid;
            const isReplyToBot = receivedMsg.message.buttonsResponseMessage.contextInfo?.stanzaId === messageId;

            console.log('Button Clicked:', { buttonId, senderId, isReplyToBot }); // Debug log

            if (isReplyToBot && senderId && buttonId.includes(sessionId)) {
                await callback(receivedMsg, buttonId);
            }
        };

        this.cmd.ev.on('messages.upsert', handler);
        this.handlers.set(`${messageId}-${sessionId}`, handler);

        // Remove handler after 2 minutes
        setTimeout(() => {
            this.cmd.ev.off('messages.upsert', handler);
            this.handlers.delete(`${messageId}-${sessionId}`);
        }, 120000);
    }

    // Handle button actions
    async handleAction(receivedMsg, buttonId, actions) {
        await this.cmd.sendMessage(receivedMsg.key.remoteJid, { react: { text: '⏳', key: receivedMsg.key } });

        try {
            const actionPrefix = Object.keys(actions).find(key => buttonId.startsWith(`${key}-`));
            if (!actionPrefix) {
                throw new Error('Invalid action selected');
            }
            await actions[actionPrefix](receivedMsg);
            await this.cmd.sendMessage(receivedMsg.key.remoteJid, { react: { text: '✅', key: receivedMsg.key } });
        } catch (error) {
            console.error('Button Handler Error:', error);
            await this.cmd.sendMessage(receivedMsg.key.remoteJid, { react: { text: '❌', key: receivedMsg.key } });
            await this.cmd.sendMessage(receivedMsg.key.remoteJid, { text: `❎ Error: ${error.message || 'Action failed'}` }, { quoted: receivedMsg });
        }
    }
}

module.exports = { ButtonManager };
