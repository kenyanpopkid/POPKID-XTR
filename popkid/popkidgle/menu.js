import config from '../../config.cjs';

const startTime = Date.now();
const formatRuntime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const menu = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : '';

  const uptime = formatRuntime(Date.now() - startTime);
  const mode = m.isGroup ? "🌍 Public" : "🔒 Private";
  const ownerName = config.OWNER_NAME || "POPKID";

  let profilePic = "https://files.catbox.moe/e1k73u.jpg";
  try {
    const fetchedPic = await sock.profilePictureUrl(m.sender, 'image');
    if (fetchedPic) profilePic = fetchedPic;
  } catch {}

  // Function to format commands into stylish fancy boxes
  const boxify = (title, cmds) => {
    let out = `\n╭─❏ *${title}* ❏─╮\n`;
    const perLine = 3;
    for (let i = 0; i < cmds.length; i += perLine) {
      out += "│ " + cmds.slice(i, i + perLine).map(c => `🪄 ${c}`).join('   ') + "\n";
    }
    out += "╰──────────────────╯";
    return out;
  };

  // All sections
  const sections = {
    main: boxify("🌟 MAIN MENU", [
      ".menu", ".speed", ".alive", ".bugmenu", ".owner", ".allcmds",
      ".addpremium", ".repo", ".dev", ".ping", ".version"
    ]),
    owner: boxify("👑 OWNER ZONE", [
      ".join", ".autoread", ".pair", ".leave", ".jid", ".autoblock", ".statusreply",
      ".restart", ".host", ".upload", ".vv", ".alwaysonline", ".block", ".unblock",
      ".setstatusmsg", ".setprefix", ".setownername"
    ]),
    ai: boxify("🤖 AI ZONE", [
      ".ai", ".gpt", ".lydia", ".gemini", ".chatbot"
    ]),
    convert: boxify("🎨 CONVERTERS", [
      ".attp", ".sticker", ".take", ".mp3", ".idch", ".ss", ".shorten"
    ]),
    search: boxify("🔍 SEARCH TOOLS", [
      ".play", ".video", ".song", ".ytsearch", ".mediafire", ".facebook", ".instagram",
      ".tiktok", ".githubstalk", ".lyrics", ".app", ".pinterest", ".imdb", ".ipstalk"
    ]),
    group: boxify("👥 GROUP ZONE", [
      ".kickall", ".remove", ".tagall", ".hidetag", ".group open", ".group close", ".add",
      ".vcf", ".left", ".promoteall", ".demoteall", ".setdescription", ".linkgc", ".antilink",
      ".antisticker", ".antispam", ".create", ".setname", ".promote", ".demote",
      ".groupinfo", ".balance"
    ]),
    audio: boxify("🎧 AUDIO FX", [
      ".earrape", ".deep", ".blown", ".bass", ".nightcore", ".fat", ".fast", ".robot",
      ".tupai", ".smooth", ".slow", ".reverse"
    ]),
    react: boxify("😊 REACTIONS", [
      ".bonk", ".bully", ".yeet", ".slap", ".nom", ".poke", ".awoo", ".wave", ".smile",
      ".dance", ".smug", ".blush", ".cringe", ".sad", ".happy", ".shinobu", ".cuddle",
      ".glomp", ".handhold", ".highfive", ".kick", ".kill", ".kiss", ".cry", ".bite",
      ".lick", ".pat", ".hug"
    ])
  };

  // MAIN MENU
  if (cmd === 'menu') {
    // Animated loader before showing menu
    const loader = `
⏳ Loading Menu...
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 25%
██████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 50%
██████████▒▒▒▒▒▒▒▒▒▒▒▒ 75%
█████████████████████ 100%
✨ Menu Ready!`;

    await m.reply(loader);

    await m.React('⚡');
    await sock.sendMessage(m.from, {
      image: { url: profilePic },
      caption: 
`╭━━━〔 *ＰＯＰＫＩＤ ＢＯＴ* 〕━━━╮
┃ 👑 *Owner*     : ${ownerName}
┃ 📦 *Version*   : 2.0.0
┃ 🔧 *Mode*      : ${mode}
┃ ⏱ *Uptime*     : ${uptime}
┃ 💠 *Prefix*    : "${prefix}"
╰━━━━━━━━━━━━━━━━━━━━╯

📂 *Select a category below* ↓`,
      buttons: [
        { buttonId: `${prefix}mainmenu`, buttonText: { displayText: '🌟 MAIN MENU' }, type: 1 },
        { buttonId: `${prefix}ownermenu`, buttonText: { displayText: '👑 OWNER ZONE' }, type: 1 },
        { buttonId: `${prefix}aimenu`, buttonText: { displayText: '🤖 AI ZONE' }, type: 1 },
        { buttonId: `${prefix}convertmenu`, buttonText: { displayText: '🎨 CONVERTERS' }, type: 1 },
        { buttonId: `${prefix}searchmenu`, buttonText: { displayText: '🔍 SEARCH TOOLS' }, type: 1 },
        { buttonId: `${prefix}groupmenu`, buttonText: { displayText: '👥 GROUP ZONE' }, type: 1 },
        { buttonId: `${prefix}audiomenu`, buttonText: { displayText: '🎧 AUDIO FX' }, type: 1 },
        { buttonId: `${prefix}reactmenu`, buttonText: { displayText: '😊 REACTIONS' }, type: 1 }
      ],
      headerType: 4
    });
  }

  // CATEGORY SECTIONS
  if (cmd.endsWith('menu') && cmd !== 'menu') {
    const key = cmd.replace('menu', '');
    if (sections[key]) {
      await sock.sendMessage(m.from, { 
        text: `✨ *${key.toUpperCase()} MENU* ✨\n${sections[key]}` 
      }, { quoted: m });
    }
  }
};

export default menu;