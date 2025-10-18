const config = require("../config");

const createContext = (userJid, options = {}) => ({
    contextInfo: {
        mentionedJid: [userJid],
        forwardingScore: 5,
        isForwarded: true,
        businessMessageForwardInfo: {
            businessOwnerJid: config.NEWSLETTER_JID, 
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid: config.NEWSLETTER_JID,
            newsletterName: config.BOT_NAME,
            serverMessageId: Math.floor(100000 + Math.random() * 900000)
        },
        externalAdReply: {
            title: options.title || config.BOT_NAME,
            body: options.body || "Powered by GiftedTech",
            thumbnailUrl: config.BOT_PIC,
            mediaType: 1,
            mediaUrl: options.mediaUrl || config.BOT_PIC,
            sourceUrl: options.sourceUrl || config.NEWSLETTER_URL, 
            showAdAttribution: true,
            renderLargerThumbnail: false 
        }
    }
});


const DEFAULT_THUMBNAIL = config.BOT_PIC;
const createContext2 = (userJid, options = {}) => ({
    contextInfo: {
        mentionedJid: [userJid],
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: config.NEWSLETTER_JID,
            newsletterName: config.BOT_NAME,
            serverMessageId: Math.floor(100000 + Math.random() * 900000)
        },
        externalAdReply: {
            title: options.title || config.BOT_NAME,
            body: options.body || "Powered by Gifted Tech",
            thumbnailUrl: config.BOT_PIC,
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: true 
        }
    }
});


module.exports = {
    createContext,
    createContext2
};
