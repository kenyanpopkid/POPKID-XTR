import config from '../../config.cjs';

const alwaysonlineCommand = async (m, Matrix) => {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    // Show menu if no argument
    if (cmd === "alwaysonline" && !text) {
        if (!isCreator) {
            return m.reply(
                `✖️ *ACCESS DENIED!*\n\n` +
                `🔒 Only the *bot owner* can use this command.`
            );
        }

        // Buttons
        const enableBtn = {
            buttonId: `${prefix}alwaysonline on`,
            buttonText: { displayText: "🟢 Enable Always Online" },
            type: 1
        };

        const disableBtn = {
            buttonId: `${prefix}alwaysonline off`,
            buttonText: { displayText: "🔴 Disable Always Online" },
            type: 1
        };

        const contextInfo = {
            forwardedNewsletterMessageInfo: {
                newsletterName: "Popkid-Xmd ⚙️",
                newsletterJid: "120363420342566562@newsletter"
            }
        };

        // Fancy Loader Animation
        const loader = `
╭─────────⭓
│ ⏳ Loading Control Panel...
│ █▒▒▒▒▒▒▒▒▒ 10%
│ ████▒▒▒▒▒▒ 40%
│ ███████▒▒▒ 70%
│ ██████████ 100%
╰─────────────⭓
`;

        await m.reply(loader);

        return await Matrix.sendMessage(
            m.from,
            {
                text:
`✨ *ALWAYS ONLINE CONTROL PANEL* ✨

💡 Choose an option below:

📶 Stay Online: Keeps bot active 24/7.  
😴 Idle Mode: Disconnects when inactive.  

⚙️ _Tap a button to apply setting._`,
                buttons: [enableBtn, disableBtn],
                headerType: 1,
                contextInfo
            },
            { quoted: m }
        );
    }

    // Handle enable / disable
    if (cmd === "alwaysonline" && text) {
        if (!isCreator) {
            return m.reply("✖️ *ACCESS DENIED!*\n\n🔒 Only the *bot owner* can use this command.");
        }

        let message;
        if (text === "on") {
            config.ALWAYS_ONLINE = true;
            message = `
╭───◇ *🟢 ALWAYS ONLINE ENABLED* ◇───╮
│ ✅ Bot will now stay connected 24/7  
│ 🌐 Useful for continuous uptime  
│ ⚡ Real-time responses guaranteed  
│  
│ 🚀 Powered by *Popkid-Xmd*  
╰───────────────────────────────╯
`;
        } else if (text === "off") {
            config.ALWAYS_ONLINE = false;
            message = `
╭───◇ *🔴 ALWAYS ONLINE DISABLED* ◇───╮
│ ❌ Bot will idle when inactive  
│ 💤 Saves system resources  
│ 🛠️ You can re-enable anytime  
│  
│ 🚀 Powered by *Popkid-Xmd*  
╰───────────────────────────────╯
`;
        } else {
            message = `
╭───◇ *📛 INVALID USAGE* ◇───╮
│ ⚠️ Please choose a valid option  
│ ✅ Use the provided buttons  
│  
│ 🚀 Powered by *Popkid-Xmd*  
╰───────────────────────────────╯
`;
        }

        const contextInfo = {
            forwardedNewsletterMessageInfo: {
                newsletterName: "Popkid-Xmd ⚙️",
                newsletterJid: "120363420342566562@newsletter"
            }
        };

        // Stylish "applied" loader
        const loaderApplied = `
🔄 Applying changes...
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 25%
██████▒▒▒▒▒▒▒▒▒▒▒ 50%
██████████▒▒▒▒▒▒▒ 75%
█████████████████ 100%
✅ Changes Applied!
`;

        await m.reply(loaderApplied);

        return await Matrix.sendMessage(
            m.from,
            {
                text: message,
                contextInfo
            },
            { quoted: m }
        );
    }
};

export default alwaysonlineCommand;