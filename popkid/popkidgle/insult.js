import config from '../../config.cjs';

const insultList = [
  "🧠 Your brain ran away from embarrassment.",
  "🕳️ You're proof the universe has bugs.",
  "📟 Your IQ score came back as a 404 error.",
  "🔌 You're not dumb. You're just on airplane mode permanently.",
  "💾 You're outdated software in a corrupt drive.",
  "🥴 If stupidity were a sport, you’d have a gold medal.",
  "🪞 Your reflection probably hides in shame.",
  "🎭 You wear your ego like it's a superhero cape... sadly, it's invisible.",
  "☢️ You're like a nuclear error: rare, dangerous, and entirely useless.",
  "🎮 You’re the lag in life’s multiplayer game.",
  "🕷️ Even spiders avoid your web of nonsense.",
  "📉 You're the reason the group chat went silent.",
  "🌪️ You're a tornado of bad decisions.",
  "🧩 You’re like a puzzle piece from the wrong box.",
  "🔓 Your logic is so flawed it triggers CAPTCHA every time you speak.",
  "🚽 Even the toilet flushed itself to avoid hearing from you.",
  "📼 Your thoughts play on VHS in a digital world.",
  "🔕 You're proof that silence is golden."
];

const insultCommand = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : '';
  if (cmd !== 'insult') return;

  const isReply = m.quoted && m.quoted.sender;
  const targetJid = isReply ? m.quoted.sender : m.sender;
  const targetTag = targetJid.split("@")[0];

  const insult = insultList[Math.floor(Math.random() * insultList.length)];

  const styledMessage = `
┏━🔥『 *I N S U L T   P R O J E C T* 』🔥━┓
┃ 👤 Target: @${targetTag}
┃ 🤬 Roasted: ${insult}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`.trim();

  await sock.sendMessage(m.from, {
    text: styledMessage,
    mentions: [targetJid],
    contextInfo: {
      forwardingScore: 777,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterName: "🔥 Popkid Xmd Burner",
        newsletterJid: "120363290715861418@newsletter",
      },
    },
  });
};

export default insultCommand;
