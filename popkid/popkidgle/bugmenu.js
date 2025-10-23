import config from '../../config.cjs';

const startTime = Date.now();

const formatRuntime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const bugMenu = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd === 'bug-menu' || cmd === 'bugmenu') {
    const now = Date.now();
    const runtime = formatRuntime(now - startTime);

    let profilePictureUrl = 'https://i.postimg.cc/BvY75gbx/IMG-20250625-WA0221.jpg';

    try {
      const fetchedPP = await sock.profilePictureUrl(m.sender, 'image');
      if (fetchedPP) profilePictureUrl = fetchedPP;
    } catch (err) {
      console.error('❌ Failed to fetch profile pic:', err);
    }

    const caption = `
╭─⭓  *POPKIDGLE-BUG.MENU*
│🤖 Bot    : *POPKID GLE*
│📌 Prefix : *${prefix}*
│📂 Menu   : *BUG-MENU*
│⚙️ Version: *2.0.0*
│⏱️ Uptime : *${runtime}*
╰───────────────⭓

📛 *BUG COMMANDS*
├ popkid-kill
├ popkid-freeze
├ popkid-blast
├ ios-kill
└ x-force

────────────────────
 *POPKID TECH SYSTEM*
────────────────────
    `.trim();

    await sock.sendMessage(
      m.from,
      {
        image: { url: profilePictureUrl },
        caption,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420342566562@newsletter',
            newsletterName: 'POPKID GLE BOT',
            serverMessageId: '',
          },
        },
      },
      { quoted: m }
    );
  }
};

export default bugMenu;
