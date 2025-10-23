import moment from 'moment-timezone';
import config from '../../config.cjs';

const fallbackPP = "https://i.ibb.co/fqvKZrP/ppdefault.jpg";
const TIMEZONE = 'Africa/Nairobi'; // Correct for Kenya

export default async function GroupParticipants(sock, { id, participants, action }) {
  try {
    const metadata = await sock.groupMetadata(id);
    const groupName = metadata.subject;
    const membersCount = metadata.participants.length;

    for (const jid of participants) {
      let profilePic;
      try {
        profilePic = await sock.profilePictureUrl(jid, 'image');
      } catch {
        profilePic = fallbackPP;
      }

      const userName = jid.split('@')[0];
      const time = moment.tz(TIMEZONE).format('HH:mm:ss');
      const date = moment.tz(TIMEZONE).format('DD/MM/YYYY');

      const baseContext = {
        mentions: [jid],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: 'Popkid-Xmd',
            newsletterJid: '120363290715861418@newsletter'
          },
          externalAdReply: {
            title: action === 'add' ? '🎊 Welcome to the Realm' : '😢 Goodbye, fallen soldier',
            body: action === 'add' 
              ? `You're now part of ${groupName}` 
              : `Farewell from ${groupName}`,
            thumbnailUrl: profilePic,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: 'https://github.com/Popkiddevs/POPKID-XTECH'
          }
        }
      };

      // 💠 Stylish Welcome
      if (action === 'add' && config.WELCOME) {
        const welcomeMsg = `
╭━━━━━━🎉 *WELCOME NEW MEMBER* 🎉━━━━━━╮

👋 Hi @${userName}!
🎯 Group: *${groupName}*
🔢 Member: *${membersCount}*
📅 Date: *${date}*
🕒 Time: *${time}*

🎈 Enjoy and participate actively!

╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
🔗 *Powered by ${config.BOT_NAME}*
        `.trim();

        await sock.sendMessage(id, {
          image: { url: profilePic },
          caption: welcomeMsg,
          ...baseContext
        });
      }

      // 💔 Stylish Goodbye
      if (action === 'remove' && config.WELCOME) {
        const goodbyeMsg = `
╭━━━━━━💔 *FAREWELL MEMBER* 💔━━━━━━╮

👋 @${userName} has left *${groupName}*
👥 Remaining: *${membersCount}*
📅 Date: *${date}*
🕒 Time: *${time}*

💭 You will be missed...

╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
🔗 *Powered by ${config.BOT_NAME}*
        `.trim();

        await sock.sendMessage(id, {
          image: { url: profilePic },
          caption: goodbyeMsg,
          ...baseContext
        });
      }
    }
  } catch (e) {
    console.error("❌ Error in GroupParticipants:", e);
  }
}
