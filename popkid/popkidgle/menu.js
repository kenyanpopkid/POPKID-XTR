import config from "../../config.cjs";

const startTime = Date.now();
const formatRuntime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const menu = async (m, sock) => {
  try {
    // ✅ Only respond to the "menu" command
    const prefix = config.PREFIX || ".";
    const body =
      (typeof m.text === "string" && m.text.startsWith(prefix)) ? m.text : "";

    const command = body.slice(prefix.length).trim().split(" ")[0].toLowerCase();

    // 🧠 If it's not the menu command, ignore
    if (command !== "menu") return;

    const ownerName = config.OWNER_NAME || "POPKID";
    const botName = config.BOT_NAME || "POPKID BOT";
    const mode = config.MODE || "Public";
    const version = config.VERSION || "2.0.0";
    const speed = "0.0009ms";
    const uptime = formatRuntime(Date.now() - startTime);

    // 🖼️ Profile picture fallback
    let profilePic = "https://files.catbox.moe/e1k73u.jpg";
    try {
      const fetchedPic = await sock.profilePictureUrl(m.sender, "image");
      if (fetchedPic) profilePic = fetchedPic;
    } catch {}

    // 🧾 Menu text
    const menuText = `
╭───────────────━⊷
┃ *${botName} ᴍᴇɴᴜ*
╰───────────────━⊷
╭───────────────━⊷
┃ 👑 *Owner:* ${ownerName}
┃ ⚙️ *Mode:* ${mode}
┃ 💠 *Prefix:* [ ${prefix} ]
┃ ⚡ *Speed:* ${speed}
┃ ⏱ *Uptime:* ${uptime}
┃ 📦 *Version:* ${version}
╰───────────────━⊷

╭─❍「 OWNER 」❍
│★ join
│★ autoread
│★ pair
│★ leave
│★ jid
│★ autoblock
│★ statusreply
│★ restart
│★ host
│★ upload
│★ vv
│★ alwaysonline
│★ block
│★ unblock
│★ setstatusmsg
│★ setprefix
│★ setownername
│★ addpremium
│★ delpremium
╰─┬────❍

╭─┴❍「 MAIN 」❍
│★ menu
│★ speed
│★ alive
│★ bugmenu
│★ owner
│★ allcmds
│★ repo
│★ dev
│★ ping
│★ version
│★ runtime
╰─┬────❍

╭─┴❍「 GROUP 」❍
│★ kickall
│★ remove
│★ tagall
│★ hidetag
│★ group open
│★ group close
│★ add
│★ vcf
│★ left
│★ promoteall
│★ demoteall
│★ setdescription
│★ linkgc
│★ antilink
│★ antisticker
│★ antispam
│★ create
│★ setname
│★ promote
│★ demote
│★ groupinfo
│★ balance
╰─┬────❍

╭─┴❍「 AI ZONE 」❍
│★ ai
│★ gpt
│★ lydia
│★ gemini
│★ chatbot
╰─┬────❍

╭─┴❍「 CONVERTERS 」❍
│★ attp
│★ sticker
│★ take
│★ mp3
│★ idch
│★ ss
│★ shorten
│★ toimage
│★ toaudio
│★ tomp3
│★ togif
│★ tovideo
│★ tts
│★ ocr
│★ remini
│★ translate
│★ removebg
╰─┬────❍

╭─┴❍「 SEARCH 」❍
│★ play
│★ video
│★ song
│★ ytsearch
│★ mediafire
│★ facebook
│★ instagram
│★ tiktok
│★ githubstalk
│★ lyrics
│★ app
│★ pinterest
│★ imdb
│★ ipstalk
╰─┬────❍

╭─┴❍「 AUDIO FX 」❍
│★ earrape
│★ deep
│★ blown
│★ bass
│★ nightcore
│★ fat
│★ fast
│★ robot
│★ tupai
│★ smooth
│★ slow
│★ reverse
╰─┬────❍

╭─┴❍「 REACTIONS 」❍
│★ bonk
│★ bully
│★ yeet
│★ slap
│★ nom
│★ poke
│★ awoo
│★ wave
│★ smile
│★ dance
│★ smug
│★ blush
│★ cringe
│★ sad
│★ happy
│★ shinobu
│★ cuddle
│★ glomp
│★ handhold
│★ highfive
│★ kick
│★ kill
│★ kiss
│★ cry
│★ bite
│★ lick
│★ pat
│★ hug
╰──────────────❍

╭─❍「 SYSTEM 」❍
│★ status
│★ uptime
│★ systeminfo
│★ about
╰──────────────❍
`;

    await sock.sendMessage(
      m.from,
      {
        image: { url: profilePic },
        caption: menuText,
        headerType: 4
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    await sock.sendMessage(m.from, { text: "❌ Error displaying menu!" }, { quoted: m });
  }
};

export default menu;
