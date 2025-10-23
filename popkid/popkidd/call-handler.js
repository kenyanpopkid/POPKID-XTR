import config from '../../config.cjs';

const Callupdate = async (json, sock) => {
   for (const id of json) {
      if (id.status === 'offer' && config.REJECT_CALL) {
         await sock.sendMessage(id.from, {
            text: `
┏━━⬛『 🚫 CALL DETECTED 』⬛━━┓

📵 *INCOMING CALL BLOCKED*
┠───> Calling the bot is *prohibited*
🛡️ *Auto-Block Triggered*

❗ You will be *automatically blocked* if you repeat this!

💬 *Use text commands to interact with the bot!*

┗━━⬛ Powered by *POPKID-XTECH* ⬛━━┛
            `.trim(),
            mentions: [id.from],
            contextInfo: {
               forwardingScore: 999,
               isForwarded: true,
               forwardedNewsletterMessageInfo: {
                  newsletterName: "POPKID-XTECH 🚫",
                  newsletterJid: "120363290715861418@newsletter"
               }
            }
         });

         await sock.rejectCall(id.id, id.from);
      }
   }
};

export default Callupdate;
