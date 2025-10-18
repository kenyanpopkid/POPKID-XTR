const { gmd, commands } = require("../pop");
const fs = require('fs').promises;
const fsA = require('node:fs');
const { S_WHATSAPP_NET } = require("gifted-baileys");
const Jimp = require("jimp");
const path = require("path");
const { exec, spawn } = require('node:child_process');
const moment = require('moment-timezone');


gmd({
  pattern: "shell",
  react: "👑",
  aliases: ['exec', 'terminal', 'sh', 'ex'],
  category: "owner",
  description: "Run shell commands",
}, async (from, Gifted, conText) => {
  const { q, mek, react, reply, isSuperUser } = conText;

  if (!isSuperUser) {
    await react("❌");
    return reply("❌ Owner Only Command!");
  }

  if (!q) {
    await react("❌");
    return reply("❌ Please provide a shell command!");
  }

  try {
    const options = {
      maxBuffer: 10 * 1024 * 1024, 
      encoding: 'utf-8'
    };

    exec(q, options, async (err, stdout, stderr) => {
      try {
        if (err) {
          await react("❌");
          return reply(`Error: ${err.message}`);
        }
        if (stderr) {
          await react("⚠️");
          return reply(`stderr: ${stderr}`);
        }

        const zipPath = extractFilePath(stdout) || (q.includes('zip') ? extractFilePath(q) : null);
        if (zipPath && fsA.existsSync(zipPath)) {
          await handleZipFile(from, Gifted, mek, react, zipPath);
          return;
        }

        if (stdout) {
          if (stdout.length > 10000) {
            await handleLargeOutput(from, Gifted, mek, react, stdout);
          } else {
            await react("✅");
            await reply(stdout);
          }
        } else {
          await react("✅");
          await reply("Command executed successfully (no output)");
        }
      } catch (error) {
        console.error("Output handling error:", error);
        await react("❌");
        await reply(`❌ Output handling error: ${error.message}`);
      }
    });
  } catch (error) {
    console.error("Exec Error:", error);
    await react("❌");
    await reply(`❌ Error: ${error.message}`);
  }
});

function extractFilePath(text) {
  const match = text.match(/(\/[^\s]+\.zip)/);
  return match ? match[0].trim() : null;
}

async function handleZipFile(from, Gifted, mek, react, zipPath) {
  try {
    await react("📦");
    const zipContent = fsA.readFileSync(zipPath);
    const filename = path.basename(zipPath);
    await Gifted.sendMessage(from, {
      document: zipContent,
      fileName: filename,
      mimetype: 'application/zip'
    }, { quoted: mek });
    fsA.unlinkSync(zipPath);
  } catch (e) {
    console.error("Zip send error:", e);
    throw e;
  }
}

async function handleLargeOutput(from, Gifted, mek, react, stdout) {
  await react("📤");
  let extension = '.txt';
  let mimetype = 'text/plain';
  let fileContent = stdout;
  
  const isPotentialJson = /^[\s]*[\{\[]/.test(stdout) && /[\}\]]$/.test(stdout.trim());
  if (isPotentialJson) {
    try {
      const jsonObj = JSON.parse(stdout);
      fileContent = JSON.stringify(jsonObj, null, 2);
      extension = '.json';
      mimetype = 'application/json';
    } catch (e) {}
  }
 
  if (mimetype === 'text/plain') {
    if (/<\s*html[\s>]|<!DOCTYPE html>/i.test(stdout)) {
      extension = '.html';
      mimetype = 'text/html';
    } else if (/<\s*\/?\s*(div|span|p|a|img|body|head|title)[\s>]/i.test(stdout)) {
      extension = '.html';
      mimetype = 'text/html';
    } else if (/function\s*\w*\s*\(|const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=|class\s+\w+/i.test(stdout)) {
      extension = '.js';
      mimetype = 'application/javascript';
    } else if (/^\s*#\s.*|^\s*-\s.*|^\s*\*\s.*|^\s*\d+\.\s.*/.test(stdout)) {
      extension = '.md';
      mimetype = 'text/markdown';
    } else if (/^\s*(def|class)\s+\w+|^\s*import\s+\w+|^\s*from\s+\w+|^\s*print\(/.test(stdout)) {
      extension = '.py';
      mimetype = 'text/x-python';
    } else if (/^\s*package\s+\w+|^\s*import\s+\w+\.\w+|^\s*public\s+class\s+\w+/.test(stdout)) {
      extension = '.java';
      mimetype = 'text/x-java-source';
    } else if (/<\?php|\$[a-zA-Z_]+\s*=|function\s+\w+\s*\(/.test(stdout)) {
      extension = '.php';
      mimetype = 'application/x-httpd-php';
    } else if (/^\s*#include\s+<|^\s*int\s+main\s*\(|^\s*printf\s*\(/.test(stdout)) {
      extension = '.c';
      mimetype = 'text/x-csrc';
    } else if (/^\s*#include\s+<|^\s*using\s+namespace|^\s*cout\s*<</.test(stdout)) {
      extension = '.cpp';
      mimetype = 'text/x-c++src';
    } else if (/^\s*<[?]xml\s+version|<\w+\s+xmlns(:?\w+)?=/.test(stdout)) {
      extension = '.xml';
      mimetype = 'application/xml';
    } else if (/^\s*#!\s*\/bin\/bash|^\s*echo\s+\"\$/.test(stdout)) {
      extension = '.sh';
      mimetype = 'application/x-sh';
    } else if (/^\s*---\s*$|^\s*title\s*:/m.test(stdout)) {
      extension = '.yml';
      mimetype = 'application/x-yaml';
    }
  }
  
  const filename = `output_${Date.now()}${extension}`;
  await Gifted.sendMessage(from, {
    document: Buffer.from(fileContent),
    fileName: filename,
    mimetype: mimetype
  }, { quoted: mek });
}


gmd({
  pattern: "eval",
  react: "👑",
  category: "owner",
  description: "Eval any JavaScript code (sync/async)",
}, async (from, Gifted, conText) => {
  const { 
    m, mek, edit, react, del, args, quoted, isCmd, command, 
    isAdmin, isBotAdmin, isSuperAdmin, sender, pushName, setSudo, delSudo, 
    q, reply, config, superUser, tagged, mentionedJid, 
    isGroup, groupInfo, groupName, getSudoNumbers, authorMessage, 
    user, groupMember, repliedMessage, quotedMsg, quotedUser, 
    isSuperUser, botMode, botPic, botFooter, botCaption, 
    botVersion, groupAdmins, participants, ownerNumber, ownerName, botName, giftedRepo, 
    getMediaBuffer, getFileContentType, bufferToStream, 
    uploadToPixhost, uploadToImgBB, uploadToGithubCdn, 
    uploadToGiftedCdn, uploadToPasteboard, uploadToCatbox, 
    newsletterUrl, newsletterJid, GiftedTechApi, GiftedApiKey, 
    botPrefix, gmdBuffer, gmdJson, formatAudio, formatVideo, timeZone 
  } = conText;

  if (!isSuperUser) {
    await react("❌");
    return reply("❌ Owner Only Command!");
  }

  if (!q) {
    await react("❌");
    return reply("❌ Please provide code to evaluate!");
  }

  try {
    const isAsync = q.includes('await') || q.includes('async');

    let evaled;
    if (isAsync) {
      evaled = await eval(`(async () => { 
        try { 
          return ${q.includes('return') ? q : `(${q})`} 
        } catch (e) { 
          return "❌ Async Eval Error: " + e.message; 
        } 
      })()`);
    } else {
      evaled = eval(q);
    }
    if (typeof evaled !== 'string') {
      evaled = require('util').inspect(evaled, { depth: 1 });
    }
    await Gifted.sendMessage(from, {
      text: evaled,
      mentions: [quotedUser]
    }, { quoted: mek });
    await react("✅");
  } catch (error) {
    console.error("Eval Error:", error);
    await react("❌");
    await reply(`❌ Error: ${error.message}`);
  }
});


gmd({
  pattern: "setsudo",
  aliases: ['setsudo'],
  react: "👑",
  category: "owner",
  description: "Sets User as Sudo",
}, async (from, Gifted, conText) => {
  const { q, mek, reply, react, isGroup, isSuperUser, quotedUser, setSudo } = conText;

  if (!isSuperUser) {
    await react("❌");
    return reply("❌ Owner Only Command!");
  }

  if (!quotedUser) {
    await react("❌");
    return reply("❌ Please reply to/quote a user!");
  }

  try {
    let result;
    
    if (quotedUser) {
      if (quotedUser.startsWith('@') && quotedUser.includes('@lid')) {
        result = quotedUser.replace('@', '') + '@lid';
      } else {
        result = quotedUser;
      }
    }

    let finalResult = result;
    if (result && result.includes('@lid')) {
      finalResult = await Gifted.getJidFromLid(result);
    }
    const userNumber = finalResult.split("@")[0];
    const added = setSudo(userNumber);
    const msg = added
      ? `✅ Added @${userNumber} to sudo list.`
      : `⚠️ @${userNumber} is already in sudo list.`;

    await Gifted.sendMessage(from, {
      text: msg,
      mentions: [quotedUser]
    }, { quoted: mek });
    await react("✅");

  } catch (error) {
    console.error("setsudo error:", error);
    await react("❌");
    await reply(`❌ Error: ${error.message}`);
  }
});


gmd({
  pattern: "delsudo",
  aliases: ['removesudo'],
  react: "👑",
  category: "owner",
  description: "Deletes User as Sudo",
}, async (from, Gifted, conText) => {
  const { q, mek, reply, react, isGroup, isSuperUser, quotedUser, delSudo } = conText;

  if (!isSuperUser) {
    await react("❌");
    return reply("❌ Owner Only Command!");
  }

  try {
    let result;
    
    if (quotedUser) {
      if (quotedUser.startsWith('@') && quotedUser.includes('@lid')) {
        result = quotedUser.replace('@', '') + '@lid';
      } else {
        result = quotedUser;
      }
    }

    let finalResult = result;
    if (result && result.includes('@lid')) {
      finalResult = await Gifted.getJidFromLid(result);
    }
    const userNumber = finalResult.split("@")[0];
    const removed = delSudo(userNumber);
    const msg = removed
      ? `❌ Removed @${userNumber} from sudo list.`
      : `⚠️ @${userNumber} is not in the sudo list.`;

    await Gifted.sendMessage(from, {
      text: msg,
      mentions: [quotedUser]
    }, { quoted: mek });
    await react("✅");

  } catch (error) {
    console.error("delsudo error:", error);
    await react("❌");
    await reply(`❌ Error: ${error.message}`);
  }
});


gmd({
  pattern: "getsudo",
  aliases: ['getsudos', 'listsudo', 'listsudos'],
  react: "👑",
  category: "owner",
  description: "Get All Sudo Users",
}, async (from, Gifted, conText) => {
  const { q, mek, config, reply, react, isGroup, isSuperUser, quotedUser, getSudoNumbers } = conText;

  try {
    if (!isSuperUser) {
      await react("❌");
      return reply("❌ Owner Only Command!");
    }
    // Get sudo numbers from both sources
    const sudoFromFile = getSudoNumbers() || [];
    const sudoFromConfig = (config.SUDO_NUMBERS ? config.SUDO_NUMBERS.split(',') : [])
      .map(num => num.trim().replace(/\D/g, ''))
      .filter(num => num.length > 5);

    // Combine and deduplicate
    const allSudos = [...new Set([...sudoFromFile, ...sudoFromConfig])];

    if (!allSudos.length) {
      return reply("⚠️ No sudo users added yet (neither in config nor in sudo file).");
    }

    let msg = "*👑 ALL SUDO USERS*\n\n";
    msg += `*Config SUDO_NUMBERS (${sudoFromConfig.length}):*\n`;
    sudoFromConfig.forEach((num, i) => {
      msg += `${i + 1}. wa.me/${num}\n`;
    });

    msg += `\n*File SUDO_NUMBERS (${sudoFromFile.length}):*\n`;
    sudoFromFile.forEach((num, i) => {
      msg += `${i + 1}. wa.me/${num}\n`;
    });

    msg += `\n*Total Sudo Users: ${allSudos.length}*`;
    
    await reply(msg);
    await react("✅");

  } catch (error) {
    console.error("getsudo error:", error);
    await react("❌");
    await reply(`❌ Error: ${error.message}`);
  }
});


gmd({
  pattern: "cmd",
  react: "👑",
  aliases: ['getcmd'],
  category: "owner",
  description: "Get and send a command",
}, async (from, Gifted, conText) => {
  const { mek, reply, react, isSuperUser, q, botPrefix } = conText;

  if (!isSuperUser) {
    await react("❌");
    return reply("❌ Owner Only Command!");
  }

  if (!q) {
    await react("❌");
    return reply(`❌ Please provide a command name!\nExample: ${botPrefix}cmd owner`);
  }

  try {
    const commandName = q.toLowerCase();
    const commandData = commands.find(cmd => 
      cmd.pattern.toLowerCase() === commandName || 
      (cmd.aliases && cmd.aliases.some(alias => alias.toLowerCase() === commandName))
    );
    if (!commandData) {
      await react("❌");
      return reply("❌ Command not found!");
    }

    const commandPath = commandData.filename;
    const fullCode = await fs.readFile(commandPath, 'utf-8');
    const extractCommand = (code, pattern) => {
      const possibleStarts = [
        `gmd({\n  pattern: "${pattern}"`,
        `gmd({\n  pattern: '${pattern}'`,
        `gmd({\n  pattern: \`${pattern}\``,
        `gmd({ pattern: "${pattern}"`,
        `gmd({ pattern: '${pattern}'`,
        `gmd({ pattern: \`${pattern}\``,
        `gmd({\n    pattern: "${pattern}"`,
        `gmd({\n    pattern: '${pattern}'`,
        `gmd({\n    pattern: \`${pattern}\``
      ];

      let startIndex = -1;
      for (const start of possibleStarts) {
        startIndex = code.indexOf(start);
        if (startIndex !== -1) break;
      }
      if (startIndex === -1) return null;
      let braceCount = 0;
      let inString = false;
      let stringChar = '';
      let escapeNext = false;
      let commandEnd = startIndex;

      for (let i = startIndex; i < code.length; i++) {
        const char = code[i];

        if (escapeNext) {
          escapeNext = false;
          continue;
        }

        if (!inString && (char === '"' || char === "'" || char === '`')) {
          inString = true;
          stringChar = char;
          continue;
        }

        if (inString && char === stringChar) {
          inString = false;
          continue;
        }

        if (char === '\\') {
          escapeNext = true;
          continue;
        }

        if (!inString) {
          if (char === '{' || char === '(') braceCount++;
          if (char === '}' || char === ')') braceCount--;

          if (braceCount === 0 && char === ')') {
            commandEnd = i + 1;
            break;
          }
        }
      }

      return code.substring(startIndex, commandEnd).trim();
    };

    let commandCode = extractCommand(fullCode, commandData.pattern) || 
                     "Could not extract command code";
    const response = `📁 *Command File:* ${path.basename(commandPath)}\n` +
                     `⚙️ *Command Name:* ${commandData.pattern}\n` +
                     `📝 *Description:* ${commandData.description || "Not provided"}\n\n` +
                     `📜 *Command Code:*\n\`\`\`\n${commandCode}\n\`\`\``;
    const fileName = commandName;
        const tempPath = path.join(__dirname, fileName);
        fsA.writeFileSync(tempPath, commandCode);
        await reply(response);
        await Gifted.sendMessage(from, { 
            document: fsA.readFileSync(tempPath),
            mimetype: 'text/javascript',
            fileName: `${fileName}.js`
        }, { quoted: mek });
        fsA.unlinkSync(tempPath);
    await react("✅");
  } catch (error) {
    console.error("getcmd error:", error);
    await react("❌");
    await reply(`❌ Error: ${error.message}`);
  }
});


gmd({
  pattern: "jid",
  react: "👑",
  category: "owner",
  description: "Get User/Group JID",
}, async (from, Gifted, conText) => {
  const { q, mek, reply, react, isGroup, isSuperUser, quotedUser } = conText;

  if (!isSuperUser) {
    await react("❌");
    return reply("❌ Owner Only Command!");
  }

  try {
    let result;
    
    if (quotedUser) {
      console.log(quotedUser);
      if (quotedUser.startsWith('@') && quotedUser.includes('@lid')) {
        result = quotedUser.replace('@', '') + '@lid';
      } else {
        result = quotedUser;
      }
    }
    else if (isGroup) {
      result = from;
    }
    else {
      result = from || mek.key.remoteJid; 
    }
    console.log(result);

    let finalResult = result;
    if (result && result.includes('@lid')) {
      finalResult = await Gifted.getJidFromLid(result);
    }

    await reply(`${finalResult}`);
    await react("✅");

  } catch (error) {
    console.error("getjid error:", error);
    await react("❌");
    await reply(`❌ Error: ${error.message}`);
  }
});


gmd({
  pattern: "getlid",
  react: "👑",
  aliases: ['lid', 'userlid'],
  category: "Group",
  description: "Get User JID from LID",
}, async (from, Gifted, conText) => {
  const { q, reply, react, isSuperUser, isGroup, quotedUser } = conText;

  if (!isGroup) {
    await react("❌");
    return reply("❌ Group Only Command!");
  }

  if (!q && !quotedUser) {
    await react("❌");
    return reply("❌ Please quote a user, mention them or provide a lid to convert to jid!");
  }

  if (!isSuperUser) {
    await react("❌");
    return reply("❌ Owner Only Command!");
  }

  try {
    let target = quotedUser || q;
    let conversionNote = "";

    if (target.startsWith('@') && !target.includes('@lid')) {
      target = target.replace('@', '') + '@lid';
      conversionNote = `\n\nℹ️ Converted from mention format`;
    }

    else if (!target.endsWith('@lid')) {
      try {
        const lid = await Gifted.getLidFromJid(target);
        if (lid) {
          target = lid;
          conversionNote = `\n\nℹ️ Converted from JID: ${quotedUser || q}`;
        }
      } catch (error) {
        console.error("LID conversion error:", error);
        conversionNote = `\n\n⚠️ Could not convert (already in LID)`;
      }
    }

    await reply(`${target}${conversionNote}`);
    await react("✅");

  } catch (error) {
    console.error("getlid error:", error);
    await react("❌");
    await reply(`❌ Error: ${error.message}`);
  }
});


gmd({
  pattern: "owner",
  react: "👑",
  category: "owner",
  description: "Get Bot Owner.",
}, async (from, Gifted, conText) => {
  const { mek, reply, react, isSuperUser, ownerNumber, ownerName, botName } = conText;
  
  if (!isSuperUser) {
    await react("❌");
    return reply(`Owner Only Command!`);
  }
 
  try {
    const vcard = 'BEGIN:VCARD\n'
          + 'VERSION:3.0\n' 
          + `FN:${ownerName}\n` 
          + `ORG:${botName};\n` 
          + `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\n`
          + 'END:VCARD';
    
    await Gifted.sendMessage(
      from,
      { 
        contacts: { 
          displayName: ownerName, 
          contacts: [{ vcard }] 
        }
      }, 
      { quoted: mek } 
    );
    
    await react("✅");
  } catch (error) {
    await react("❌");
    await reply(`❌ Failed: ${error.message}`);
  }
});


gmd({
  pattern: "gcpp",
  aliases: ['setgcpp', 'gcfullpp', 'fullgcpp'],
  react: "🔮",
  category: "owner",
  description: "Set group full profile picture without cropping.",
}, async (from, Gifted, conText) => {
  const { mek, reply, react, sender, quoted, isGroup, isSuperUser } = conText;
  
  if (!isAdmin) {
    await react("❌");
    return reply(`Admin Only Command!`);
  }
  
  if (!isGroup) {
    await react("❌");
    return reply(`Command can only be used in groups!`);
  }
  
  let tempFilePath;
  try {
    const quotedImg = quoted?.imageMessage || quoted?.message?.imageMessage;
    if (!quotedImg) {
      await react("❌");
      return reply("Please quote an image");
    }
    tempFilePath = await Gifted.downloadAndSaveMediaMessage(quotedImg, 'temp_media');
    
    const image = await Jimp.read(tempFilePath);
    const croppedImage = image.crop(0, 0, image.getWidth(), image.getHeight());
    const resizedImage = await croppedImage.scaleToFit(720, 720);
    const imageBuffer = await resizedImage.getBufferAsync(Jimp.MIME_JPEG);

    const pictureNode = {
      tag: "picture",
      attrs: { type: "image" },
      content: imageBuffer
    };

    const iqNode = {
      tag: "iq",
      attrs: {
        to: S_WHATSAPP_NET,
        type: "set",
        xmlns: "w:profile:picture",
        target: from
      },
      content: [pictureNode]
    };

    await Gifted.query(iqNode);
    await react("✅");
    await fs.unlink(tempFilePath);
    await reply('✅ Group Profile picture updated successfully (full image)!');
    
  } catch (error) {
    console.error("Error updating group profile picture:", error);
    
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(console.error);
    }
    
    if (error.message.includes('not-authorized') || error.message.includes('forbidden')) {
      await reply("❌ I need to be an admin to update group profile picture!");
    } else {
      await reply(`❌ Failed to update group profile picture: ${error.message}`);
    }
    await react("❌");
  }
});




gmd({
  pattern: "fullpp",
  aliases: ['setfullpp'],
  react: "🔮",
  category: "owner",
  description: "Set full profile picture without cropping.",
}, async (from, Gifted, conText) => {
  const { mek, reply, react, sender, quoted, isSuperUser } = conText;
  
  if (!isSuperUser) {
    await react("❌");
    return reply(`Owner Only Command!`);
  }
  let tempFilePath;
  try {
    const quotedImg = quoted?.imageMessage || quoted?.message?.imageMessage;
    if (!quotedImg) {
      await react("❌");
      return reply("Please quote an image");
    }
    tempFilePath = await Gifted.downloadAndSaveMediaMessage(quotedImg, 'temp_media');
    
    const image = await Jimp.read(tempFilePath);
    const croppedImage = image.crop(0, 0, image.getWidth(), image.getHeight());
    const resizedImage = await croppedImage.scaleToFit(720, 720);
    const imageBuffer = await resizedImage.getBufferAsync(Jimp.MIME_JPEG);

    const pictureNode = {
      tag: "picture",
      attrs: { type: "image" },
      content: imageBuffer
    };

    const iqNode = {
      tag: "iq",
      attrs: {
        to: S_WHATSAPP_NET,
        type: "set",
        xmlns: "w:profile:picture"
      },
      content: [pictureNode]
    };

    await Gifted.query(iqNode);
    await react("✅");
    await fs.unlink(tempFilePath);
    await reply('✅ Profile picture updated successfully (full image)!');
    
  } catch (error) {
    console.error("Error updating profile picture:", error);
    
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(console.error);
    }
    
    await reply(`❌ Failed to update profile picture: ${error.message}`);
    await react("❌");
  }
});


gmd({
  pattern: "whois",
  aliases: ['profile'],
  react: "👀",
  category: "owner",
  description: "Get someone's full profile details.",
}, async (from, Gifted, conText) => {
  const { mek, reply, react, sender, quoted, timeZone, isGroup, quotedMsg, newsletterJid, quotedUser, botName, botFooter, isSuperUser } = conText;
  
  if (!isSuperUser) {
    await react("❌");
    return reply(`Owner Only Command!`);
  }

  if (!quotedUser) {
    await react("❌");
    return reply(`Please reply to/quote a user or their message!`);
  }
  
  let profilePictureUrl;
  let statusText = "Not Found";
  let setAt = "Not Available";
  let targetUser = quotedUser;
  
  try {
    if (quoted) {
      if (isGroup && !targetUser.endsWith('@s.whatsapp.net')) {
        try {
          const jid = await Gifted.getJidFromLid(targetUser);
          if (jid) targetUser = jid;
        } catch (error) {
          console.error("Error converting LID to JID:", error);
        }
      }

      try {
        profilePictureUrl = await Gifted.profilePictureUrl(targetUser, "image");
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        profilePictureUrl = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg";
      }

      try {
        const statusData = await Gifted.fetchStatus(targetUser);
        console.log("Status Data:", statusData);
        
        if (statusData && statusData.length > 0 && statusData[0].status) {
          statusText = statusData[0].status.status || "Not Found";
          setAt = statusData[0].status.setAt || "Not Available";
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }

      let formattedDate = "Not Available";
      if (setAt && setAt !== "Not Available") {
        try {
          formattedDate = moment(setAt)
            .tz(timeZone)
            .format('dddd, MMMM Do YYYY, h:mm A z');
        } catch (e) {
          console.error("Error formatting date:", e);
        }
      }

      const number = targetUser.replace(/@s\.whatsapp\.net$/, "");

      await Gifted.sendMessage(
        from,
        {
          image: { url: profilePictureUrl },
          caption: `*👤 User Profile Information*\n\n` +
                   `*• Name:* @${number}\n` +
                   `*• Number:* ${number}\n` +
                   `*• About:* ${statusText}\n` +
                   `*• Last Updated:* ${formattedDate}\n\n` +
                   `_${botFooter}_`,
          contextInfo: {
            mentionedJid: [targetUser],
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
    console.error("Error in whois command:", error);
    await reply(`❌ An error occurred while fetching profile information.\nError: ${error.message}`);
    await react("❌");
  }
});


gmd({
  pattern: "pp",
  aliases: ['setpp'],
  react: "🔮",
  category: "owner",
  description: "Set new profile picture.",
}, async (from, Gifted, conText) => {
  const { mek, reply, react, sender, quoted, isSuperUser } = conText;
  
  if (!isSuperUser) {
    await react("❌");
    return reply(`Owner Only Command!`);
  }
  
  try {
    const quotedImg = quoted?.imageMessage || quoted?.message?.imageMessage;
    if (!quotedImg) {
      await react("❌");
      return reply("Please quote an image");
    }
    
    const tempFilePath = await Gifted.downloadAndSaveMediaMessage(quotedImg, 'temp_media');
    const imageBuffer = await fs.readFile(tempFilePath);
    try {
      await Gifted.updateProfilePicture(Gifted.user.id, { url: tempFilePath });
      await reply('Profile picture updated successfully!');
      await react("✅");
    } catch (modernError) {
      console.log('Modern method failed, trying legacy method...');

      const iq = {
        tag: "iq",
        attrs: {
          to: S_WHATSAPP_NET,
          type: "set",
          xmlns: "w:profile:picture"
        },
        content: [{
          tag: "picture",
          attrs: {
            type: "image",
          },
          content: imageBuffer
        }]
      };
      
      await Gifted.query(iq);
      await reply('Profile picture update requested (legacy method)');
      await react("✅");
    }
    await fs.unlink(tempFilePath).catch(console.error);
    
  } catch (error) {
    console.error("Error updating profile picture:", error);
    await reply(`❌ An error occurred: ${error.message}`);
    await react("❌");
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(console.error);
    }
  }
});


gmd({
  pattern: "getpp",
  aliases: ['stealpp', 'snatchpp'],
  react: "👀",
  category: "owner",
  description: "Download someone's profile picture.",
}, async (from, Gifted, conText) => {
  const { mek, reply, react, sender, quoted, quotedMsg, newsletterJid, quotedUser, botName, botFooter, isSuperUser } = conText;
  
  if (!isSuperUser) {
    await react("❌");
    return reply(`Owner Only Command!`);
  }

  if (!quotedMsg) {
    await react("❌");
    return reply(`Please reply to/quote a user to get their profile picture!`);
  }
  
  let profilePictureUrl;
  
  try {
    if (quoted) {
      try {
        profilePictureUrl = await Gifted.profilePictureUrl(quotedUser, "image");
        
      } catch (error) {
        await react("❌");
        return reply(`User does not have profile picture or they have set it to private!`);
      }

      await Gifted.sendMessage(
        from,
        {
          image: { url: profilePictureUrl },
          caption: `Here is the Profile Picture\n\n> *${botFooter}*`,
          contextInfo: {
            mentionedJid: [quotedUser],
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
    console.error("Error processing profile picture:", error);
    await reply(`❌ An error occurred while fetching the profile picture.`);
    await react("❌");
  }
});


gmd({
  pattern: "getgcpp",
  aliases: ['stealgcpp', 'snatchgcpp'],
  react: "👀",
  category: "group",
  description: "Download group profile picture",
}, async (from, Gifted, conText) => {
  const { mek, reply, react, isGroup, newsletterJid, botName, botFooter } = conText;
  
  if (!isGroup) {
    await react("❌");
    return reply("❌ This command only works in groups!");
  }

  try {
    let profilePictureUrl;
    try {
      profilePictureUrl = await Gifted.profilePictureUrl(from, "image");
    } catch (error) {
      await react("❌");
      return reply("❌ This group has no profile picture set!");
    }

    await Gifted.sendMessage(
      from,
      {
        image: { url: profilePictureUrl },
        caption: `🖼️ *Group Profile Picture*\n\n${botFooter ? `_${botFooter}_` : ''}`,
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

  } catch (error) {
    console.error("getgcpp error:", error);
    await react("❌");
    await reply(`❌ Failed to get group picture: ${error.message}`);
  }
});


gmd({ 
  pattern: "vv2", 
  aliases: ['‎2', 'reveal2'],
  react: "🙄",
  category: "owner",
  description: "Reveal View Once Media"
}, async (from, Gifted, conText) => {
    const { mek, reply, quoted, react, botName, isSuperUser } = conText;

    if (!quoted) return reply(`Please reply to/quote a ViewOnce message`);
    if (!isSuperUser) return reply(`Owner Only Command!`);
    
    let viewOnceContent, mediaType;
    
    if (quoted.imageMessage?.viewOnce || quoted.videoMessage?.viewOnce || quoted.audioMessage?.viewOnce) {
        mediaType = Object.keys(quoted).find(key => 
            key.endsWith('Message') && 
            ['image', 'video', 'audio'].some(t => key.includes(t))
        );
        viewOnceContent = { [mediaType]: quoted[mediaType] };
    } 
    else if (quoted.viewOnceMessage) {
        viewOnceContent = quoted.viewOnceMessage.message;
        mediaType = Object.keys(viewOnceContent).find(key => 
            key.endsWith('Message') && 
            ['image', 'video', 'audio'].some(t => key.includes(t))
        );
    } else {
        return reply('Please reply to a view once media message.');
    }

    if (!mediaType) return reply('Unsupported ViewOnce message type.');

    let msg;
    let tempFilePath = null;

    try {
        const mediaMessage = {
            ...viewOnceContent[mediaType],
            viewOnce: false
        };

        tempFilePath = await Gifted.downloadAndSaveMediaMessage(mediaMessage, 'temp_media');
        
        const caption = `${mediaMessage.caption}\n\n> *REVEALED BY ${botName}*`;
        const mime = mediaMessage.mimetype || '';

        if (mediaType.includes('image')) {
            msg = { 
                image: { url: tempFilePath }, 
                caption,
                mimetype: mime
            };
        } 
        else if (mediaType.includes('video')) {
            msg = { 
                video: { url: tempFilePath }, 
                caption,
                mimetype: mime
            };
        } 
        else if (mediaType.includes('audio')) {
            msg = { 
                audio: { url: tempFilePath }, 
                ptt: true, 
                mimetype: mime || 'audio/mp4' 
            };
        }

        await Gifted.sendMessage(from, msg);
      await react("✅");
    } catch (e) {
        console.error("Error in vv command:", e);
        reply(`Error: ${e.message}`);
    } finally {
        if (tempFilePath) {
            try {
                await fs.unlink(tempFilePath);
            } catch (cleanupError) {
                console.error("Failed to clean up temp file:", cleanupError);
            }
        }
    }
});

gmd({ 
  pattern: "vv", 
  aliases: ['‎', 'reveal'],
  react: "🙄",
  category: "owner",
  description: "Reveal View Once Media"
}, async (from, Gifted, conText) => {
    const { mek, reply, quoted, react, botName, isSuperUser } = conText;

    if (!quoted) return reply(`Please reply to/quote a ViewOnce message`);
    if (!isSuperUser) return reply(`Owner Only Command!`);

    let viewOnceContent, mediaType;
  
    if (quoted.imageMessage?.viewOnce || quoted.videoMessage?.viewOnce || quoted.audioMessage?.viewOnce) {
        mediaType = Object.keys(quoted).find(key => 
            key.endsWith('Message') && 
            ['image', 'video', 'audio'].some(t => key.includes(t))
        );
        viewOnceContent = { [mediaType]: quoted[mediaType] };
    } 
    else if (quoted.viewOnceMessage) {
        viewOnceContent = quoted.viewOnceMessage.message;
        mediaType = Object.keys(viewOnceContent).find(key => 
            key.endsWith('Message') && 
            ['image', 'video', 'audio'].some(t => key.includes(t))
        );
    } else {
        return reply('Please reply to a view once media message.');
    }

    if (!mediaType) return reply('Unsupported ViewOnce message type.');

    let msg;
    let tempFilePath = null;

    try {
        const mediaMessage = {
            ...viewOnceContent[mediaType],
            viewOnce: false
        };

        tempFilePath = await Gifted.downloadAndSaveMediaMessage(mediaMessage, 'temp_media');
        
        const caption = `${mediaMessage.caption}\n\n> *REVEALED BY ${botName}*`;
        const mime = mediaMessage.mimetype || '';

        if (mediaType.includes('image')) {
            msg = { 
                image: { url: tempFilePath }, 
                caption,
                mimetype: mime
            };
        } 
        else if (mediaType.includes('video')) {
            msg = { 
                video: { url: tempFilePath }, 
                caption,
                mimetype: mime
            };
        } 
        else if (mediaType.includes('audio')) {
            msg = { 
                audio: { url: tempFilePath }, 
                ptt: true, 
                mimetype: mime || 'audio/mp4' 
            };
        }

        await Gifted.sendMessage(Gifted.user.id, msg);
      await react("✅");
    } catch (e) {
        console.error("Error in vv command:", e);
        reply(`Error: ${e.message}`);
    } finally {
        if (tempFilePath) {
            try {
                await fs.unlink(tempFilePath);
            } catch (cleanupError) {
                console.error("Failed to clean up temp file:", cleanupError);
            }
        }
    }
});
