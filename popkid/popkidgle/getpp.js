import config from '../../config.cjs';

const getProfilePic = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "getpp") {
    let target;

    // ✅ 1. If message is a reply, get the quoted participant
    if (m.message?.extendedTextMessage?.contextInfo?.participant) {
      target = m.message.extendedTextMessage.contextInfo.participant;
    }

    // ✅ 2. If not, check for number in the command
    else if (text) {
      const cleanNumber = text.replace(/[^0-9]/g, '');
      if (cleanNumber.length > 4) {
        target = cleanNumber + "@s.whatsapp.net";
      }
    }

    // ✅ 3. Fallback to self
    if (!target) {
      target = m.sender;
    }

    // ✅ 4. Fetch profile picture
    let profilePic;
    try {
      profilePic = await sock.profilePictureUrl(target, "image");
    } catch {
      profilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    }

    // ✅ 5. Send the picture instantly
    await sock.sendMessage(m.from, {
      image: { url: profilePic },
      caption: `👤 *Profile of:* ${target.split('@')[0]}\n🔧 *By Popkid GLE Bot*`
    }, { quoted: m });
  }
};

export default getProfilePic;
