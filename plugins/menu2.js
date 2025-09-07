//---------------------------------------------
//           popkid-XD  
//---------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE OR REMOVE THIS CREDIT⚠️  
//---------------------------------------------

const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const os = require('os');
const axios = require('axios');
const { getPrefix } = require('../lib/prefix');
const { ButtonManager } = require('../button');

// Session storage for menu state
const menuSessions = new Map();

// Forwarded context info for "Search on web Popkid"
const forwardedContextInfo = (sender) => ({
    mentionedJid: [sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363420342566562@newsletter', // placeholder
        newsletterName: 'POPKID', // 🔥 shows as "Search on web Popkid"
        serverMessageId: 143
    }
});

// Function to fetch GitHub repository forks
const fetchGitHubForks = async () => {
    try {
        const repo = config.GITHUB_REPO || 'kenyanpopkid/POPKID-XTR';
        const response = await axios.get(`https://api.github.com/repos/${repo}`);
        return response.data.forks_count || 'N/A';
    } catch (e) {
        console.error('Error fetching GitHub forks:', e);
        return 'N/A';
    }
};

// Fake ChatGPT vCard
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© dev popkid",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:Meta
ORG:META AI;
TEL;type=CELL;type=VOICE;waid=13135550002:+13135550002
END:VCARD`
        }
    }
};

// Tiny caps converter
const toTinyCaps = (text) => {
    const tinyCapsMap = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
        j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'q', r: 'ʀ',
        s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
    };
    return text.toLowerCase().split('').map(c => tinyCapsMap[c] || c).join('');
};

// Generate menu text
async function generateMenuText(from, sender, prefix, categories, sessionId, categoryFilter = null, page = 1) {
    const timezone = config.TIMEZONE || 'Africa/Harare';
    const time = moment().tz(timezone).format('HH:mm:ss');
    const date = moment().tz(timezone).format('DD/MM/YYYY');
    const commandsPerPage = 10;
    const forks = await fetchGitHubForks();

    let menu = `
╭═✦〔 🤖 *${toTinyCaps(config.BOT_NAME || 'Popkid Bot')}* 〕✦═╮
│ 👤 ᴏᴡɴᴇʀ   : @${config.OWNER_NUMBER}  
│ 🌍 ᴍᴏᴅᴇ    : ${toTinyCaps(config.MODE || 'public')}
│ ⏰ ᴛɪᴍᴇ    : ${time}      
│ 📅 ᴅᴀᴛᴇ    : ${date}    
│ 🛠️ ᴘʀᴇғɪx  : ${prefix}          
│ 📈 ᴄᴍᴅs    : ${commands.length}   
│ 🌐 ᴛɪᴍᴇᴢᴏɴᴇ: ${timezone}       
│ 🚀 ᴠᴇʀsɪᴏɴ : ${config.version}  
│ 👥 ᴅᴀɪʟʏ ᴜsᴇʀs : ${forks}  
╰══∞
`;

    if (categoryFilter === 'viewall') {
        for (const cat of Object.keys(categories).sort()) {
            menu += `\n\n╭═✦〔 ${toTinyCaps(cat)} ${toTinyCaps('Menu')} 〕✦═╮\n`;
            const cmds = categories[cat] || [];
            cmds.forEach(cmd => {
                menu += `╞￫ ${prefix}${cmd}\n`;
            });
            menu += `╰════════════`;
        }
        return { menu, totalPages: 1 };
    } else if (categoryFilter) {
        const cmds = categories[categoryFilter] || [];
        const totalPages = Math.ceil(cmds.length / commandsPerPage);
        const start = (page - 1) * commandsPerPage;
        const end = start + commandsPerPage;
        const paginatedCmds = cmds.slice(start, end);

        menu += `\n\n╭═✦〔 ${toTinyCaps(categoryFilter)} ${toTinyCaps('Menu')} 〕✦═╮\n`;
        paginatedCmds.forEach(cmd => {
            menu += `╞ • ${prefix}${cmd}\n`;
        });
        menu += `╰════════════\n`;
        menu += `📄 ᴘᴀɢᴇ: ${page}/${totalPages}\n`;
        return { menu, totalPages };
    } else {
        for (const cat of Object.keys(categories).sort()) {
            menu += `\n\n╭═✦〔 ${toTinyCaps(cat)} ${toTinyCaps('Menu')} 〕✦═╮\n`;
            menu += `╞ • ${prefix}${categories[cat][0]}\n`;
            if (categories[cat].length > 1) {
                menu += `╞ • ${prefix}${categories[cat][1]}\n`;
                menu += `╞ • ... (${categories[cat].length - 2} more)\n`;
            }
            menu += `╰════════════`;
        }
        return { menu, totalPages: 1 };
    }
}

// Help command
async function sendHelpCommand(client, mek, from, sender, quoted) {
    try {
        const pushname = mek.pushName || 'xtr user';
        const ALIVE_IMG = config.BOT_IMAGE || 'https://files.catbox.moe/vf3uuk.jpg';
        const formattedInfo = `
╭═✦〔 🤖 *${toTinyCaps('Bot Settings')}* 〕✦═╮
│
├ 👤 ʜᴇʟʟᴏ: ${pushname}
│
... rest of help text ...
`.trim();

        const isValidImage = ALIVE_IMG && ALIVE_IMG.startsWith('http');
        if (isValidImage) {
            await client.sendMessage(from, {
                image: { url: ALIVE_IMG },
                caption: formattedInfo,
                contextInfo: forwardedContextInfo(sender),
                quoted
            });
        } else {
            await client.sendMessage(from, {
                text: formattedInfo,
                contextInfo: forwardedContextInfo(sender)
            }, { quoted });
        }
    } catch (error) {
        console.error('Help Command Error:', error);
        await client.sendMessage(from, {
            text: `❌ ${toTinyCaps('error')}: ${toTinyCaps('failed to show help')}. ${error.message} 😞`,
            contextInfo: forwardedContextInfo(sender),
            quoted
        });
    }
}

// Menu command
cmd({
    pattern: 'menu2',
    alias: ['m'],
    desc: toTinyCaps('show random or all bot commands'),
    category: 'menu',
    react: '⚡️',
    use: '.menu [category]',
    filename: __filename
}, async (client, mek, m, { from, sender, args, reply, quoted, isOwner }) => {
    try {
        const prefix = getPrefix();
        const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Group commands
        const categories = {};
        for (const c of commands) {
            if (c.category && !c.dontAdd && c.pattern) {
                categories[c.category] = categories[c.category] || [];
                categories[c.category].push(c.pattern.split('|')[0]);
            }
        }

        // Store session
        menuSessions.set(sessionId, { categories, categoryFilter: null, page: 1 });
        setTimeout(() => menuSessions.delete(sessionId), 2 * 60 * 1000);

        // Handle category
        let categoryFilter = args.length ? args.join(' ').toLowerCase() : null;
        if (!categoryFilter || !categories[categoryFilter]) {
            const keys = Object.keys(categories).sort();
            categoryFilter = keys[Math.floor(Math.random() * keys.length)];
        }
        menuSessions.set(sessionId, { categories, categoryFilter, page: 1 });

        const { menu } = await generateMenuText(from, sender, prefix, categories, sessionId, categoryFilter);

        // Buttons
        let buttonManager = new ButtonManager(client);
        const buttons = [
            { buttonId: `menu-help-${sessionId}`, buttonText: { displayText: '❓ ʜᴇʟᴘ' }, type: 1 },
            { buttonId: `menu-about-${sessionId}`, buttonText: { displayText: 'ℹ️ ᴀʙᴏᴜᴛ' }, type: 1 },
            { buttonId: `menu-viewall-${sessionId}`, buttonText: { displayText: '📋 ᴠɪᴇᴡ ᴀʟʟ' }, type: 1 },
            { buttonId: `menu-random-${sessionId}`, buttonText: { displayText: '🎲 ʀᴀɴᴅᴏᴍ' }, type: 1 }
        ];
        if (isOwner) {
            buttons.push({
                buttonId: `menu-toggle-mode-${sessionId}`,
                buttonText: { displayText: `🔧 ${toTinyCaps(config.MODE === 'private' ? 'go public' : 'go private')}` },
                type: 1
            });
        }

        const buttonsMessage = buttonManager.createButtonsMessage({
            imageUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/vf3uuk.jpg',
            caption: menu,
            footer: config.FOOTER || toTinyCaps('Powered by popkid'),
            buttons,
            contextInfo: forwardedContextInfo(sender),
            quoted: fakevCard
        });

        await client.sendMessage(from, buttonsMessage);

    } catch (error) {
        console.error('Menu Error:', error);
        await reply(`❌ ${toTinyCaps('failed to show menu')}: ${error.message || 'unknown error'} 😞`);
    }
});
