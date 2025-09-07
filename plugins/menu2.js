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

// Function to fetch GitHub repository forks
const fetchGitHubForks = async () => {
    try {
        const repo = config.GITHUB_REPO || 'kenyanpopkid/POPKID-XTR'; // Default repo, e.g., 'octocat/hello-world'
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

// Updated runtime function (kept for reference, but not used in the menu)
const runtime = (seconds) => {
    seconds = Math.floor(seconds);
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    let output = '';
    if (days > 0) output += `${days}d `;
    if (hours > 0 || days > 0) output += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) output += `${minutes}m `;
    output += `${secs}s`;

    return output.trim();
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

// Helper function to generate menu text
async function generateMenuText(from, sender, prefix, categories, sessionId, categoryFilter = null, page = 1) {
    // Time info
        const timezone = config.TIMEZONE || 'Africa/Harare';
        const time = moment().tz(timezone).format('HH:mm:ss');
        const date = moment().tz(timezone).format('DD/MM/YYYY');

    const commandsPerPage = 10; // Used only for category-specific pagination
    const forks = await fetchGitHubForks(); // Fetch GitHub forks


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
        // View All mode: List all categories with all their commands
        for (const cat of Object.keys(categories).sort()) {
            menu += `\n\n╭═✦〔 ${toTinyCaps(cat)} ${toTinyCaps('Menu')} 〕✦═╮\n`;
            const cmds = categories[cat] || [];
            cmds.forEach(cmd => {
                menu += `╞￫ ${prefix}${cmd}\n`;
            });
            menu += `╰════════════`;
        }
        return { menu, totalPages: 1 }; // No pagination in viewall mode
    } else if (categoryFilter) {
        // Specific category mode: List all commands in the selected category with pagination
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
        // All categories overview: Show all categories with their first commands
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

    menu += `\n\n> ${config.DESCRIPTION || toTinyCaps('Explore the bot commands!')}`;
    return { menu, totalPages: 1 };
}

// Helper function for help command
async function sendHelpCommand(client, mek, from, sender, quoted) {
    try {
        if (!mek || !mek.key || !mek.key.id) {
            console.error('Invalid mek object in sendHelpCommand:', JSON.stringify(mek, null, 2));
            throw new Error('Invalid message object');
        }

        const pushname = mek.pushName || 'xtr user';
        const ALIVE_IMG = config.BOT_IMAGE || 'https://files.catbox.moe/vf3uuk.jpg';
        const formattedInfo = `
╭═✦〔 🤖 *${toTinyCaps('Bot Settings')}* 〕✦═╮
│
├ 👤 ʜᴇʟʟᴏ: ${pushname}
│
├ 🔧 *1. \`ᴍᴏᴅᴇ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.MODE || 'public')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}mode private/public
│
├ 🎯 *2. \`ᴀᴜᴛᴏ ᴛʏᴘɪɴɢ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.AUTO_TYPING || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}autotyping on/off
│
├ 🌐 *3. \`ᴀʟᴡᴀʏs ᴏɴʟɪɴᴇ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.ALWAYS_ONLINE || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}alwaysonline on/off
│
├ 🎙️ *4. \`ᴀᴜᴛᴏ ʀᴇᴄᴏʀᴅɪɴɢ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.AUTO_RECORDING || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}autorecording on/off
│
├ 📖 *5. \`ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ sᴛᴀᴛᴜs\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.AUTO_STATUS_REACT || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}autostatusreact on/off
│
├ 👀 *6. \`ᴀᴜᴛᴏ ᴠɪᴇᴡ sᴛᴀᴛᴜs\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.AUTO_STATUS_SEEN || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}autoviewstatus on/off
│
├ 🚫 *7. \`ᴀɴᴛɪ ʙᴀᴅ ᴡᴏʀᴅ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.ANTI_BAD_WORD || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}antibad on/off
│
├ 🗑️ *8. \`ᴀɴᴛɪ ᴅᴇʟᴇᴛᴇ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.ANTI_DELETE || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}antidelete on/off
│
├ 🖼️ *9. \`ᴀᴜᴛᴏ sᴛɪᴄᴋᴇʀ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.AUTO_STICKER || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}autosticker on/off
│
├ 💬 *10. \`ᴀᴜᴛᴏ ʀᴇᴘʟʏ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.AUTO_REPLY || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}autoreply on/off
│
├ 💞 *11. \`ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.AUTO_REACT || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}autoreact on/off
│
├ 📢 *12. \`sᴛᴀᴛᴜs ʀᴇᴘʟʏ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.AUTO_STATUS_REPLY || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}autostatusreply on/off
│
├ 🔗 *13. \`ᴀɴᴛɪ ʟɪɴᴋ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.ANTI_LINK || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}antilink on/off
│
├ 🤖 *14. \`ᴀɴᴛɪ ʙᴏᴛ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.ANTI_BOT || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}antibot off/warn/delete/kick
│
├ 📞 *15. \`ᴀɴᴛɪ ᴄᴀʟʟ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.ANTI_CALL || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}anticall off/on
│
├ 💖 *16. \`ʜᴇᴀʀᴛ ʀᴇᴀᴄᴛ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.HEART_REACT || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}heartreact on/off
│
├ 🔧 *17. \`sᴇᴛ ᴘʀᴇғɪx\`*
│   - ᴄᴜʀʀᴇɴᴛ: ${config.PREFIX || '.'}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}setprefix <new_prefix>
│
├ 🤖 *18. \`sᴇᴛ ʙᴏᴛ ɴᴀᴍᴇ\`*
│   - ᴄᴜʀʀᴇɴᴛ: ${toTinyCaps(config.BOT_NAME || 'SUBZERO MD')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}setbotname <new_name>
│
├ 🤴 *19. \`sᴇᴛ ᴏᴡɴᴇʀ ɴᴀᴍᴇ\`*
│   - ᴄᴜʀʀᴇɴᴛ: ${toTinyCaps(config.OWNER_NAME || 'DEE')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}setownername <owner_name>
│
├ 🖼️ *20. \`sᴇᴛ ʙᴏᴛ ɪᴍᴀɢᴇ\`*
│   - ᴄᴜʀʀᴇɴᴛ: ${toTinyCaps(config.BOT_IMAGE || 'DEFAULT IMAGE')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}setbotimage <image_url> / reply to photo
│
├ 🔄 *21. \`ᴀᴜᴛᴏ ʙɪᴏ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.AUTO_BIO || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}autobio on/off [custom text]
│
├ 🫂 *22. \`ᴡᴇʟᴄᴏᴍᴇ & ɢᴏᴏᴅʙʏᴇ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps(config.WELCOME_GOODBYE || 'off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}welcome on/off
│
├ 🤖 *23. \`ᴀɪ ᴄʜᴀᴛʙᴏᴛ\`*
│   - sᴛᴀᴛᴜs: ${toTinyCaps('off')}
│   - ᴜsᴀɢᴇ: ${config.PREFIX}chatbot on/off
│
├ 📊 *24. \`ᴘᴏʟʟ\`*
│   - ᴜsᴀɢᴇ: ${config.PREFIX}poll question;option1,option2,...
│
├ 💞 *25. \`ʀᴀɴᴅᴏᴍ sʜɪᴘ\`*
│   - ᴜsᴀɢᴇ: ${config.PREFIX}randomship
│
├ 👥 *26. \`ɴᴇᴡ ɢʀᴏᴜᴘ\`*
│   - ᴜsᴀɢᴇ: ${config.PREFIX}newgc group_name;number1,number2,...
│
├ 🚪 *27. \`ᴇxɪᴛ ɢʀᴏᴜᴘ\`*
│   - ᴜsᴀɢᴇ: ${config.PREFIX}exit
│
├ 🔗 *28. \`ɢʀᴏᴜᴘ ɪɴᴠɪᴛᴇ ʟɪɴᴋ\`*
│   - ᴜsᴀɢᴇ: ${config.PREFIX}invite2
│
├ 📢 *29. \`ʙʀᴏᴀᴅᴄᴀsᴛ\`*
│   - ᴜsᴀɢᴇ: ${config.PREFIX}broadcast <text>
│
├ 🖼️ *30. \`sᴇᴛ ɢʀᴏᴜᴘ ᴘʀᴏғɪʟᴇ ᴘɪᴄᴛᴜʀᴇ\`*
│   - ᴜsᴀɢᴇ: ${config.PREFIX}setgrouppp (reply to an image)
│
╰───

📌 *Note*: Replace "on/off" with the desired state to enable or disable a feature.

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${toTinyCaps(config.OWNER_NAME || 'popkid tech')}
        `.trim();

        const isValidImage = ALIVE_IMG && ALIVE_IMG.startsWith('http');
        if (isValidImage) {
            await client.sendMessage(from, {
                image: { url: ALIVE_IMG },
                caption: formattedInfo,
                contextInfo: { mentionedJid: [sender] },
                quoted
            });
        } else {
            await client.sendMessage(from, { text: formattedInfo }, { quoted });
        }
    } catch (error) {
        console.error('Help Command Error:', error);
        await client.sendMessage(from, {
            text: `❌ ${toTinyCaps('error')}: ${toTinyCaps('failed to show help')}. ${error.message} 😞`,
            quoted
        });
        if (mek && mek.key) {
            try {
                await client.sendMessage(from, { react: { text: '❌', key: mek.key } });
            } catch (reactError) {
                console.error('Failed to send error reaction:', reactError.message);
            }
        }
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
}, async (client, mek, m, { from, sender, args, reply, quoted, isGroup, groupName, isOwner, isAdmins }) => {
    try {
        // Validate mek
        if (!mek || !mek.key || !mek.key.id) {
            console.error('Invalid mek object in menu:', JSON.stringify(mek, null, 2));
            return reply(`❌ ${toTinyCaps('invalid message context')}: please try again 😞`);
        }

        // Send initial reaction
        try {
            await client.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        } catch (reactError) {
            console.error('Failed to send processing reaction:', reactError.message);
            await client.sendMessage(from, { text: toTinyCaps('processing...') }, { quoted });
        }

        const prefix = getPrefix();
        const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log(`Starting menu, session: ${sessionId}`);

        // Group commands by category
        const categories = {};
        for (const cmd of commands) {
            if (cmd.category && !cmd.dontAdd && cmd.pattern) {
                categories[cmd.category] = categories[cmd.category] || [];
                categories[cmd.category].push(cmd.pattern.split('|')[0]);
            }
        }

        // Store session
        menuSessions.set(sessionId, { categories, categoryFilter: null, page: 1 });
        setTimeout(() => menuSessions.delete(sessionId), 2 * 60 * 1000); // Expire after 2 minutes

        // Handle category filter from args or select random category if no args
        let categoryFilter = args.length ? args.join(' ').toLowerCase() : null;
        if (!categoryFilter) {
            // Select a random category
            const categoryKeys = Object.keys(categories).sort();
            categoryFilter = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        } else if (!categories[categoryFilter]) {
            categoryFilter = null;
            await client.sendMessage(from, {
                text: toTinyCaps('invalid category. showing random category.'),
                quoted
            });
            const categoryKeys = Object.keys(categories).sort();
            categoryFilter = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        }
        if (categoryFilter) {
            menuSessions.set(sessionId, { categories, categoryFilter, page: 1 });
        }

        // Generate initial menu
        const { menu, totalPages } = await generateMenuText(from, sender, prefix, categories, sessionId, categoryFilter);

        // Initialize ButtonManager
        let buttonManager;
        try {
            buttonManager = new ButtonManager(client);
            console.log('ButtonManager initialized');
        } catch (error) {
            console.error('Failed to initialize ButtonManager:', error);
            throw new Error('Button system initialization failed');
        }

        // Define buttons
        const buttons = [];
        if (categoryFilter && categoryFilter !== 'viewall') {
            if (totalPages > 1) {
                if (menuSessions.get(sessionId).page > 1) {
                    buttons.push({
                        buttonId: `menu-prev-${sessionId}`,
                        buttonText: { displayText: '⬅️ ᴘʀᴇᴠɪᴏᴜs' },
                        type: 1
                    });
                }
                if (menuSessions.get(sessionId).page < totalPages) {
                    buttons.push({
                        buttonId: `menu-next-${sessionId}`,
                        buttonText: { displayText: 'ɴᴇxᴛ ➡️' },
                        type: 1
                    });
                }
            }
            buttons.push({
                buttonId: `menu-viewall-${sessionId}`,
                buttonText: { displayText: '📋 ᴠɪᴇᴡ ᴀʟʟ' },
                type: 1
            });
        } else if (categoryFilter === 'viewall') {
            buttons.push({
                buttonId: `menu-random-${sessionId}`,
                buttonText: { displayText: '🎲 ʀᴀɴᴅᴏᴍ' },
                type: 1
            });
        } else {
            const categoryButtons = Object.keys(categories)
                .sort()
                .slice(0, 2) // Adjust for WhatsApp button limit (max 5, reserving for View All, Help, About)
                .map(cat => ({
                    buttonId: `menu-cat-${cat}-${sessionId}`,
                    buttonText: { displayText: `${toTinyCaps(cat)}` },
                    type: 1
                }));
            buttons.push(...categoryButtons);
            buttons.push({
                buttonId: `menu-viewall-${sessionId}`,
                buttonText: { displayText: '📋 ᴠɪᴇᴡ ᴀʟʟ' },
                type: 1
            });
        }
        buttons.push(
            {
                buttonId: `menu-help-${sessionId}`,
                buttonText: { displayText: '❓ ʜᴇʟᴘ' },
                type: 1
            },
            {
                buttonId: `menu-about-${sessionId}`,
                buttonText: { displayText: 'ℹ️ ᴀʙᴏᴜᴛ' },
                type: 1
            }
        );
        if (isOwner) {
            buttons.push({
                buttonId: `menu-toggle-mode-${sessionId}`,
                buttonText: { displayText: `🔧 ${toTinyCaps(config.MODE === 'private' ? 'go public' : 'go private')}` },
                type: 1
            });
        }

        // Create and send buttons message
        const buttonsMessage = buttonManager.createButtonsMessage({
            imageUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/vf3uuk.jpg',
            caption: menu,
            footer: config.FOOTER || toTinyCaps('Powered by popkid'),
            buttons,
            contextInfo: { mentionedJid: [sender] },
            quoted: fakevCard
        });

        const sentMsg = await client.sendMessage(from, buttonsMessage);
        if (!sentMsg || !sentMsg.key || !sentMsg.key.id) {
            console.error('Failed to send buttons message:', JSON.stringify(sentMsg, null, 2));
            throw new Error('Failed to send buttons message');
        }
        const messageId = sentMsg.key.id;
        console.log(`Sent buttons message with ID: ${messageId}`);

        // Define button actions
        const actions = {
            'menu-help': async (receivedMsg) => {
                console.log('Help button clicked');
                await sendHelpCommand(client, receivedMsg, from, sender, receivedMsg);
            },
            'menu-about': async (receivedMsg) => {
                console.log('About button clicked');
                await client.sendMessage(from, {
                    text: `
╭──⟦ ℹ️ ${toTinyCaps(config.BOT_NAME || 'POPKID XTR')} [⟧
├ 
├ 📍 ᴠᴇʀsɪᴏɴ: ${config.version || '1.0.0'}
├ 🙃 ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ: ${toTinyCaps(config.DEV_NAME || 'popkid tech')}
├ ℹ️ ᴍᴏᴅᴇ: ${toTinyCaps(config.MODE || 'public')}
╰───
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${toTinyCaps(config.OWNER_NAME || 'popkid xtr')}
                    `,
                    quoted: receivedMsg
                });
            },
            'menu-audio': async (receivedMsg) => {
                console.log('Audio button clicked');
                if (config.MENU_AUDIO_URL) {
                    await client.sendMessage(from, {
                        audio: { url: config.MENU_AUDIO_URL },
                        mimetype: 'audio/mp4',
                        ptt: true
                    }, { quoted: receivedMsg });
                } else {
                    await client.sendMessage(from, {
                        text: toTinyCaps('no audio configured') + ' 🎵',
                        quoted: receivedMsg
                    });
                }
            },
            'menu-viewall': async (receivedMsg) => {
                console.log('View All button clicked');
                if (!menuSessions.has(sessionId)) {
                    await client.sendMessage(from, {
                        text: toTinyCaps('session expired, please run menu again') + ' 😔',
                        quoted: receivedMsg
                    });
                    return;
                }
                menuSessions.set(sessionId, { ...menuSessions.get(sessionId), categoryFilter: 'viewall', page: 1 });
                const { menu: newMenu, totalPages } = await generateMenuText(from, sender, prefix, categories, sessionId, 'viewall');
                const newButtons = [
                    { buttonId: `menu-random-${sessionId}`, buttonText: { displayText: '🎲 ʀᴀɴᴅᴏᴍ' }, type: 1 },
                    { buttonId: `menu-help-${sessionId}`, buttonText: { displayText: '❓ ʜᴇʟᴘ' }, type: 1 },
                    { buttonId: `menu-about-${sessionId}`, buttonText: { displayText: 'ℹ️ ᴀʙᴏᴜᴛ' }, type: 1 }
                ];
                if (isOwner) {
                    newButtons.push({
                        buttonId: `menu-toggle-mode-${sessionId}`,
                        buttonText: { displayText: `🔧 ${toTinyCaps(config.MODE === 'private' ? 'go public' : 'go private')}` },
                        type: 1
                    });
                }
                const newButtonsMessage = buttonManager.createButtonsMessage({
                    imageUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/vf3uuk.jpg',
                    caption: newMenu,
                    footer: config.FOOTER || toTinyCaps('Powered by popkid'),
                    buttons: newButtons,
                    contextInfo: { mentionedJid: [sender] },
                    quoted: receivedMsg
                });
                const newSentMsg = await client.sendMessage(from, newButtonsMessage);
                buttonManager.addHandler(newSentMsg.key.id, sessionId, (msg, btnId) => {
                    buttonManager.handleAction(msg, btnId, actions);
                });
            },
            'menu-random': async (receivedMsg) => {
                console.log('Random category button clicked');
                if (!menuSessions.has(sessionId)) {
                    await client.sendMessage(from, {
                        text: toTinyCaps('session expired, please run menu again') + ' 😔',
                        quoted: receivedMsg
                    });
                    return;
                }
                const categoryKeys = Object.keys(categories).sort();
                const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
                menuSessions.set(sessionId, { ...menuSessions.get(sessionId), categoryFilter: randomCategory, page: 1 });
                const { menu: newMenu, totalPages } = await generateMenuText(from, sender, prefix, categories, sessionId, randomCategory);
                const newButtons = [];
                if (totalPages > 1) {
                    newButtons.push(
                        { buttonId: `menu-prev-${sessionId}`, buttonText: { displayText: '⬅️ ᴘʀᴇᴠɪᴏᴜs' }, type: 1 },
                        { buttonId: `menu-next-${sessionId}`, buttonText: { displayText: 'ɴᴇxᴛ ➡️' }, type: 1 }
                    );
                }
                newButtons.push(
                    { buttonId: `menu-viewall-${sessionId}`, buttonText: { displayText: '📋 ᴠɪᴇᴡ ᴀʟʟ' }, type: 1 },
                    { buttonId: `menu-help-${sessionId}`, buttonText: { displayText: '❓ ʜᴇʟᴘ' }, type: 1 },
                    { buttonId: `menu-about-${sessionId}`, buttonText: { displayText: 'ℹ️ ᴀʙᴏᴜᴛ' }, type: 1 }
                );
                if (isOwner) {
                    newButtons.push({
                        buttonId: `menu-toggle-mode-${sessionId}`,
                        buttonText: { displayText: `🔧 ${toTinyCaps(config.MODE === 'private' ? 'go public' : 'go private')}` },
                        type: 1
                    });
                }
                const newButtonsMessage = buttonManager.createButtonsMessage({
                    imageUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/qumhu4.jpg',
                    caption: newMenu,
                    footer: config.FOOTER || toTinyCaps('Powered by popkid'),
                    buttons: newButtons,
                    contextInfo: { mentionedJid: [sender] },
                    quoted: receivedMsg
                });
                const newSentMsg = await client.sendMessage(from, newButtonsMessage);
                buttonManager.addHandler(newSentMsg.key.id, sessionId, (msg, btnId) => {
                    buttonManager.handleAction(msg, btnId, actions);
                });
            },
            'menu-toggle-mode': async (receivedMsg) => {
                if (!isOwner) {
                    await client.sendMessage(from, {
                        text: toTinyCaps('only owner can toggle mode') + ' 🔒',
                        quoted: receivedMsg
                    });
                    return;
                }
                console.log('Toggle mode button clicked');
                const newMode = config.MODE === 'private' ? 'public' : 'private';
                config.MODE = newMode;
                await client.sendMessage(from, {
                    text: toTinyCaps(`mode changed to ${newMode}`) + ' 🔄',
                    quoted: receivedMsg
                });
                const { menu: newMenu } = await generateMenuText(from, sender, prefix, categories, sessionId, categoryFilter);
                const newButtonsMessage = buttonManager.createButtonsMessage({
                    imageUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/vf3uuk.jpg',
                    caption: newMenu,
                    footer: config.FOOTER || toTinyCaps('Powered by popkid'),
                    buttons,
                    contextInfo: { mentionedJid: [sender] },
                    quoted: receivedMsg
                });
                const newSentMsg = await client.sendMessage(from, newButtonsMessage);
                buttonManager.addHandler(newSentMsg.key.id, sessionId, (msg, btnId) => {
                    buttonManager.handleAction(msg, btnId, actions);
                });
            }
        };

        // Add category-specific actions
        Object.keys(categories).forEach(cat => {
            actions[`menu-cat-${cat}`] = async (receivedMsg) => {
                console.log(`Category button clicked: ${cat}`);
                if (!menuSessions.has(sessionId)) {
                    await client.sendMessage(from, {
                        text: toTinyCaps('session expired, please run menu again') + ' 😔',
                        quoted: receivedMsg
                    });
                    return;
                }
                menuSessions.set(sessionId, { ...menuSessions.get(sessionId), categoryFilter: cat, page: 1 });
                const { menu: newMenu, totalPages } = await generateMenuText(from, sender, prefix, categories, sessionId, cat);
                const catButtons = [];
                if (totalPages > 1) {
                    catButtons.push(
                        { buttonId: `menu-prev-${sessionId}`, buttonText: { displayText: '⬅️ ᴘʀᴇᴠɪᴏᴜs' }, type: 1 },
                        { buttonId: `menu-next-${sessionId}`, buttonText: { displayText: 'ɴᴇxᴛ ➡️' }, type: 1 }
                    );
                }
                catButtons.push(
                    { buttonId: `menu-viewall-${sessionId}`, buttonText: { displayText: '📋 ᴠɪᴇᴡ ᴀʟʟ' }, type: 1 },
                    { buttonId: `menu-help-${sessionId}`, buttonText: { displayText: '❓ ʜᴇʟᴘ' }, type: 1 },
                    { buttonId: `menu-about-${sessionId}`, buttonText: { displayText: 'ℹ️ ᴀʙᴏᴜᴛ' }, type: 1 }
                );
                if (isOwner) {
                    catButtons.push({
                        buttonId: `menu-toggle-mode-${sessionId}`,
                        buttonText: { displayText: `🔧 ${toTinyCaps(config.MODE === 'private' ? 'go public' : 'go private')}` },
                        type: 1
                    });
                }
                const newButtonsMessage = buttonManager.createButtonsMessage({
                    imageUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/vf3uuk.jpg',
                    caption: newMenu,
                    footer: config.FOOTER || toTinyCaps('Powered by popkid'),
                    buttons: catButtons,
                    contextInfo: { mentionedJid: [sender] },
                    quoted: receivedMsg
                });
                const newSentMsg = await client.sendMessage(from, newButtonsMessage);
                buttonManager.addHandler(newSentMsg.key.id, sessionId, (msg, btnId) => {
                    buttonManager.handleAction(msg, btnId, actions);
                });
            };
        });

        // Add pagination actions (only for category-specific views)
        actions['menu-prev'] = async (receivedMsg) => {
            console.log('Previous page button clicked');
            if (!menuSessions.has(sessionId)) {
                await client.sendMessage(from, {
                    text: toTinyCaps('session expired, please run menu again') + ' 😔',
                    quoted: receivedMsg
                });
                return;
            }
            const session = menuSessions.get(sessionId);
            if (session.categoryFilter === 'viewall') {
                // No pagination in viewall mode, redirect to random category
                const categoryKeys = Object.keys(categories).sort();
                const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
                menuSessions.set(sessionId, { ...session, categoryFilter: randomCategory, page: 1 });
                const { menu: newMenu, totalPages } = await generateMenuText(from, sender, prefix, categories, sessionId, randomCategory);
                const newButtons = [];
                if (totalPages > 1) {
                    newButtons.push(
                        { buttonId: `menu-prev-${sessionId}`, buttonText: { displayText: '⬅️ ᴘʀᴇᴠɪᴏᴜs' }, type: 1 },
                        { buttonId: `menu-next-${sessionId}`, buttonText: { displayText: 'ɴᴇxᴛ ➡️' }, type: 1 }
                    );
                }
                newButtons.push(
                    { buttonId: `menu-viewall-${sessionId}`, buttonText: { displayText: '📋 ᴠɪᴇᴡ ᴀʟʟ' }, type: 1 },
                    { buttonId: `menu-help-${sessionId}`, buttonText: { displayText: '❓ ʜᴇʟᴘ' }, type: 1 },
                    { buttonId: `menu-about-${sessionId}`, buttonText: { displayText: 'ℹ️ ᴀʙᴏᴜᴛ' }, type: 1 }
                );
                if (isOwner) {
                    newButtons.push({
                        buttonId: `menu-toggle-mode-${sessionId}`,
                        buttonText: { displayText: `🔧 ${toTinyCaps(config.MODE === 'private' ? 'go public' : 'go private')}` },
                        type: 1
                    });
                }
                const newButtonsMessage = buttonManager.createButtonsMessage({
                    imageUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/qumhu4.jpg',
                    caption: newMenu,
                    footer: config.FOOTER || toTinyCaps('Powered by popkid'),
                    buttons: newButtons,
                    contextInfo: { mentionedJid: [sender] },
                    quoted: receivedMsg
                });
                const newSentMsg = await client.sendMessage(from, newButtonsMessage);
                buttonManager.addHandler(newSentMsg.key.id, sessionId, (msg, btnId) => {
                    buttonManager.handleAction(msg, btnId, actions);
                });
                return;
            }
            const newPage = Math.max(1, session.page - 1);
            menuSessions.set(sessionId, { ...session, page: newPage });
            const { menu: newMenu, totalPages } = await generateMenuText(from, sender, prefix, categories, sessionId, session.categoryFilter, newPage);
            const newButtons = [];
            if (newPage > 1) {
                newButtons.push({ buttonId: `menu-prev-${sessionId}`, buttonText: { displayText: '⬅️ ᴘʀᴇᴠɪᴏᴜs' }, type: 1 });
            }
            if (newPage < totalPages) {
                newButtons.push({ buttonId: `menu-next-${sessionId}`, buttonText: { displayText: 'ɴᴇxᴛ ➡️' }, type: 1 });
            }
            newButtons.push(
                { buttonId: `menu-viewall-${sessionId}`, buttonText: { displayText: '📋 ᴠɪᴇᴡ ᴀʟʟ' }, type: 1 },
                { buttonId: `menu-help-${sessionId}`, buttonText: { displayText: '❓ ʜᴇʟᴘ' }, type: 1 },
                { buttonId: `menu-about-${sessionId}`, buttonText: { displayText: 'ℹ️ ᴀʙᴏᴜᴛ' }, type: 1 }
            );
            if (isOwner) {
                newButtons.push({
                    buttonId: `menu-toggle-mode-${sessionId}`,
                    buttonText: { displayText: `🔧 ${toTinyCaps(config.MODE === 'private' ? 'go public' : 'go private')}` },
                    type: 1
                });
            }
            const newButtonsMessage = buttonManager.createButtonsMessage({
                imageUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/qumhu4.jpg',
                caption: newMenu,
                footer: config.FOOTER || toTinyCaps('Powered by popkid'),
                buttons: newButtons,
                contextInfo: { mentionedJid: [sender] },
                quoted: receivedMsg
            });
            const newSentMsg = await client.sendMessage(from, newButtonsMessage);
            buttonManager.addHandler(newSentMsg.key.id, sessionId, (msg, btnId) => {
                buttonManager.handleAction(msg, btnId, actions);
            });
        };
        actions['menu-next'] = async (receivedMsg) => {
            console.log('Next page button clicked');
            if (!menuSessions.has(sessionId)) {
                await client.sendMessage(from, {
                    text: toTinyCaps('session expired, please run menu again') + ' 😔',
                    quoted: receivedMsg
                });
                return;
            }
            const session = menuSessions.get(sessionId);
            if (session.categoryFilter === 'viewall') {
                // No pagination in viewall mode, redirect to random category
                const categoryKeys = Object.keys(categories).sort();
                const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
                menuSessions.set(sessionId, { ...session, categoryFilter: randomCategory, page: 1 });
                const { menu: newMenu, totalPages } = await generateMenuText(from, sender, prefix, categories, sessionId, randomCategory);
                const newButtons = [];
                if (totalPages > 1) {
                    newButtons.push(
                        { buttonId: `menu-prev-${sessionId}`, buttonText: { displayText: '⬅️ ᴘʀᴇᴠɪᴏᴜs' }, type: 1 },
                        { buttonId: `menu-next-${sessionId}`, buttonText: { displayText: 'ɴᴇxᴛ ➡️' }, type: 1 }
                    );
                }
                newButtons.push(
                    { buttonId: `menu-viewall-${sessionId}`, buttonText: { displayText: '📋 ᴠɪᴇᴡ ᴀʟʟ' }, type: 1 },
                    { buttonId: `menu-help-${sessionId}`, buttonText: { displayText: '❓ ʜᴇʟᴘ' }, type: 1 },
                    { buttonId: `menu-about-${sessionId}`, buttonText: { displayText: 'ℹ️ ᴀʙᴏᴜᴛ' }, type: 1 }
                );
                if (isOwner) {
                    newButtons.push({
                        buttonId: `menu-toggle-mode-${sessionId}`,
                        buttonText: { displayText: `🔧 ${toTinyCaps(config.MODE === 'private' ? 'go public' : 'go private')}` },
                        type: 1
                    });
                }
                const newButtonsMessage = buttonManager.createButtonsMessage({
                    imageUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/qumhu4.jpg',
                    caption: newMenu,
                    footer: config.FOOTER || toTinyCaps('Powered by popkid'),
                    buttons: newButtons,
                    contextInfo: { mentionedJid: [sender] },
                    quoted: receivedMsg
                });
                const newSentMsg = await client.sendMessage(from, newButtonsMessage);
                buttonManager.addHandler(newSentMsg.key.id, sessionId, (msg, btnId) => {
                    buttonManager.handleAction(msg, btnId, actions);
                });
                return;
            }
            const newPage = session.page + 1;
            menuSessions.set(sessionId, { ...session, page: newPage });
            const { menu: newMenu, totalPages } = await generateMenuText(from, sender, prefix, categories, sessionId, session.categoryFilter, newPage);
            const newButtons = [];
            if (newPage > 1) {
                newButtons.push({ buttonId: `menu-prev-${sessionId}`, buttonText: { displayText: '⬅️ ᴘʀᴇᴠɪᴏᴜs' }, type: 1 });
            }
            if (newPage < totalPages) {
                newButtons.push({ buttonId: `menu-next-${sessionId}`, buttonText: { displayText: 'ɴᴇxᴛ ➡️' }, type: 1 });
            }
            newButtons.push(
                { buttonId: `menu-viewall-${sessionId}`, buttonText: { displayText: '📋 ᴠɪᴇᴡ ᴀʟʟ' }, type: 1 },
                { buttonId: `menu-help-${sessionId}`, buttonText: { displayText: '❓ ʜᴇʟᴘ' }, type: 1 },
                { buttonId: `menu-about-${sessionId}`, buttonText: { displayText: 'ℹ️ ᴀʙᴏᴜᴛ' }, type: 1 }
            );
            if (isOwner) {
                newButtons.push({
                    buttonId: `menu-toggle-mode-${sessionId}`,
                    buttonText: { displayText: `🔧 ${toTinyCaps(config.MODE === 'private' ? 'go public' : 'go private')}` },
                    type: 1
                });
            }
            const newButtonsMessage = buttonManager.createButtonsMessage({
                imageUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/qumhu4.jpg',
                caption: newMenu,
                footer: config.FOOTER || toTinyCaps('Powered by popkid'),
                buttons: newButtons,
                contextInfo: { mentionedJid: [sender] },
                quoted: receivedMsg
            });
            const newSentMsg = await client.sendMessage(from, newButtonsMessage);
            buttonManager.addHandler(newSentMsg.key.id, sessionId, (msg, btnId) => {
                buttonManager.handleAction(msg, btnId, actions);
            });
        };

        // Add button handler
        try {
            buttonManager.addHandler(messageId, sessionId, (receivedMsg, buttonId) => {
                console.log(`Handling button click: ${buttonId}`);
                buttonManager.handleAction(receivedMsg, buttonId, actions);
            });
        } catch (handlerError) {
            console.error('Failed to add button handler:', handlerError);
        }

        // Send success reaction
        try {
            await client.sendMessage(from, { react: { text: '✅', key: mek.key } });
        } catch (reactError) {
            console.error('Failed to send success reaction:', reactError.message);
        }
    } catch (error) {
        console.error('Menu Error:', error);
        await reply(`❌ ${toTinyCaps('failed to show menu')}: ${error.message || 'unknown error'} 😞`);
        if (mek && mek.key) {
            try {
                await client.sendMessage(from, { react: { text: '❌', key: mek.key } });
            } catch (reactError) {
                console.error('Failed to send error reaction:', reactError.message);
            }
        }
    }
});
