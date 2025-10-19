const { gmd, commands, monospace, formatBytes } = require("../pop"),
      fs = require('fs'), 
      axios = require('axios'),
      BOT_START_TIME = Date.now(),
      { totalmem: totalMemoryBytes, 
      freemem: freeMemoryBytes } = require('os'),
      moment = require('moment-timezone'), 
      more = String.fromCharCode(8206), 
      readmore = more.repeat(4001),
      { downloadContentFromMessage } = require('gifted-baileys'),
      ram = `${formatBytes(freeMemoryBytes)}/${formatBytes(totalMemoryBytes)}`;



gmd({
  pattern: "menu",
  aliases: ["help", "allmenu", "mainmenu"],
  react: "🪀",
  category: "general",
  description: "Fetch bot main menu",
}, async (from, Gifted, conText) => {
  const {
    mek,
    sender,
    react,
    pushName,
    botPic,
    botMode,
    botVersion,
    botName,
    botFooter,
    timeZone,
    botPrefix,
    newsletterJid
  } = conText;

  // 🕒 Uptime Formatter
  function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  // 📆 Date & Time
  const now = new Date();
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(now);

  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  const uptime = formatUptime(process.uptime());
  const totalCommands = commands.filter(cmd => cmd.pattern).length;

  // 📁 Group commands by category
  const categorized = commands.reduce((menu, cmd) => {
    if (cmd.pattern && !cmd.dontAddCommandList) {
      if (!menu[cmd.category]) menu[cmd.category] = [];
      menu[cmd.category].push(cmd.pattern);
    }
    return menu;
  }, {});

  // 💫 Elegant Header
  const header = `
╭══✦〔 💫 *${botName}* 💫 〕✦═╮
│ 👤 *User:* ${pushName}
│ ⚙️ *Mode:* ${botMode}
│ 🔰 *Prefix:* [ ${botPrefix} ]
│ 🪶 *Plugins:* ${totalCommands}
│ 🕰 *Uptime:* ${uptime}
│ 📅 *Date:* ${date}
│ ⏰ *Time:* ${time}
│ 🌍 *TimeZone:* ${timeZone}
│ 🧩 *Version:* ${botVersion}
╰───⭘
🦋❤️🤧 ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ${botName} ᴍᴇɴᴜ
${readmore}
`.trim();

  // 🎨 Category Style
  const formatCategory = (category, cmds) => {
    const title = `╭═✦〔 ${category.toUpperCase()} 〕✦═╮\n`;
    const body = cmds.map(cmd => `│  ✪ ${botPrefix + cmd}`).join("\n");
    const footer = `╰───⭘\n`;
    return `${title}${body}\n${footer}`;
  };

  // 📜 Build the menu text
  let menu = `${header}\n\n`;
  for (const [category, cmds] of Object.entries(categorized)) {
    menu += `${formatCategory(category, cmds)}\n`;
  }

  // 🖼 Send Menu with Image
  const message = {
    image: { url: botPic },
    caption: `${menu.trim()}\n\n> ✨ *${botFooter}* ✨`,
    contextInfo: {
      mentionedJid: [sender],
      forwardingScore: 5,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: newsletterJid,
        newsletterName: botName,
        serverMessageId: 143,
      },
    },
  };

  await Gifted.sendMessage(from, message, { quoted: mek });
  await react("✅");
});

gmd({
  pattern: "return",
  aliases: ['details', 'det', 'ret'],
  react: "⚡",
  category: "owner",
  description: "Displays the full raw quoted message using Baileys structure.",
}, async (from, Gifted, conText) => {
  const { mek, reply, react, quotedMsg, isSuperUser, botName, newsletterJid } = conText;
  
  if (!isSuperUser) {
    return reply(`Owner Only Command!`);
  }
  
  if (!quotedMsg) {
    return reply(`Please reply to/quote a message`);
  }

  try {
    const jsonString = JSON.stringify(quotedMsg, null, 2);
    const chunks = jsonString.match(/[\s\S]{1,100000}/g) || [];

    for (const chunk of chunks) {
      const formattedMessage = `\`\`\`\n${chunk}\n\`\`\``;

      await Gifted.sendMessage(
        from,
        {
          text: formattedMessage,
          contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: newsletterJid,
              newsletterName: botName,
              serverMessageId: 143
            },
          },
        },
        { quoted: mek }
      );
      await react("✅");
    }
  } catch (error) {
    console.error("Error processing quoted message:", error);
    await reply(`❌ An error occurred while processing the message.`);
  }
});


gmd({
  pattern: "ping",
  react: "⚡",
  category: "general",
  description: "Check bot response speed",
}, async (from, Gifted, conText) => {
  const { mek, react, botName } = conText;
  const start = process.hrtime();

  await new Promise(r => setTimeout(r, Math.floor(80 + Math.random() * 420)));

  const end = process.hrtime(start);
  const speed = Math.floor((end[0] * 1000) + (end[1] / 1e6));
  const feel = speed < 150 ? "🚀" : speed < 350 ? "⚡" : "🐢";

  const pingMsg = `
${feel} *𝙋𝙊𝙋𝙆𝙄𝘿 𝙓𝙏𝙍* ᴀᴄᴛɪᴠᴇ ⚡
📡 *${speed}ms*
🦋 ᴠɪʙɪɴɢ ᴏɴʟɪɴᴇ ❤️
`.trim();

  await Gifted.sendMessage(from, { text: pingMsg }, { quoted: mek });
  await react("✅");
});






gmd({ 
  pattern: "uptime", 
  react: "⏳",
  category: "general",
  description: "check bot uptime status.",
}, async (from, Gifted, conText) => {
      const { mek, react, newsletterJid, botName } = conText;
      
    const uptimeMs = Date.now() - BOT_START_TIME;
    
    const seconds = Math.floor((uptimeMs / 1000) % 60);
    const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
    const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));

    await Gifted.sendMessage(from, {
      text: `⏱️ Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: newsletterJid,
          newsletterName: botName,
          serverMessageId: 143
        }
      }
    }, { quoted: mek });
      await react("✅");
  }
);

gmd({ 
  pattern: "repo", 
  aliases: ['sc', 'script'],
  react: "💜",
  category: "general",
  description: "Fetch bot script.",
}, async (from, Gifted, conText) => {
      const { mek, sender, react, pushName, botPic, botName, ownerName, newsletterJid, giftedRepo } = conText;

    const response = await axios.get(`https://api.github.com/repos/${giftedRepo}`);
    const repoData = response.data;
    const { full_name, name, forks_count, stargazers_count, created_at, updated_at, owner } = repoData;
    const messageText = `Hello *_${pushName}_,*\nThis is *${botName},* A Whatsapp Bot Built by *${ownerName},* Enhanced with Amazing Features to Make Your Whatsapp Communication and Interaction Experience Amazing\n\n*ʀᴇᴘᴏ ʟɪɴᴋ:* https://github.com/${giftedRepo}\n\n*❲❒❳ ɴᴀᴍᴇ:* ${name}\n*❲❒❳ sᴛᴀʀs:* ${stargazers_count}\n*❲❒❳ ғᴏʀᴋs:* ${forks_count}\n*❲❒❳ ᴄʀᴇᴀᴛᴇᴅ ᴏɴ:* ${new Date(created_at).toLocaleDateString()}\n*❲❒❳ ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇᴅ:* ${new Date(updated_at).toLocaleDateString()}`;

    const giftedMess = {
        image: { url: botPic },
        caption: messageText,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: newsletterJid,
            newsletterName: botName,
            serverMessageId: 143
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
      await react("✅");
  }
);


gmd({
  pattern: "save",
  aliases: ['sv', 's', 'sav', '.'],
  react: "⚡",
  category: "tools",
  description: "Save messages (supports images, videos, audio, stickers, and text).",
}, async (from, Gifted, conText) => {
  const { mek, reply, react, sender, isSuperUser, getMediaBuffer } = conText;
  
  if (!isSuperUser) {
    return reply(`❌ Owner Only Command!`);
  }

  const quotedMsg = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  
  if (!quotedMsg) {
    return reply(`⚠️ Please reply to/quote a message.`);
  }

  try {
    let mediaData;
    
    if (quotedMsg.imageMessage) {
      const buffer = await getMediaBuffer(quotedMsg.imageMessage, "image");
      mediaData = {
        image: buffer,
        caption: quotedMsg.imageMessage.caption || ""
      };
    } 
    else if (quotedMsg.videoMessage) {
      const buffer = await getMediaBuffer(quotedMsg.videoMessage, "video");
      mediaData = {
        video: buffer,
        caption: quotedMsg.videoMessage.caption || ""
      };
    } 
    else if (quotedMsg.audioMessage) {
      const buffer = await getMediaBuffer(quotedMsg.audioMessage, "audio");
      mediaData = {
        audio: buffer,
        mimetype: "audio/mp4"
      };
    } 
    else if (quotedMsg.stickerMessage) {
      const buffer = await getMediaBuffer(quotedMsg.stickerMessage, "sticker");
      mediaData = {
        sticker: buffer
      };
    } 
    else if (quotedMsg.conversation || quotedMsg.extendedTextMessage?.text) {
      const text = quotedMsg.conversation || quotedMsg.extendedTextMessage.text;
      mediaData = {
        text: text
      };
    } 
    else {
      return reply(`❌ Unsupported message type.`);
    }

    await Gifted.sendMessage(sender, mediaData, { quoted: mek });
    // await reply(`✅ Saved Successfully!`);
    await react("✅");

  } catch (error) {
    console.error("Save Error:", error);
    await reply(`❌ Failed to save the message. Error: ${error.message}`);
  }
});


