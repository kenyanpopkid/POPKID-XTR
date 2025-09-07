//---------------------------------------------
//           popkid-XD  
//---------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE OR REMOVE THIS CREDIT⚠️  
//---------------------------------------------

const { cmd } = require('../command');
const { ButtonManager } = require('../button');
const axios = require('axios');
const { getBuffer, fetchJson } = require('../lib/functions2');
const config = require('../config');

// Session storage for text inputs
const textSessions = new Map();

const LIST_IMAGE = 'https://files.catbox.moe/tbdd5d.jpg';
const NEWSLETTER_JID = config.NEWSLETTER_JID || '120363420342566562@newsletter';

// Tiny caps converter
const toTinyCaps = (str) => {
    const tinyCapsMap = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
        j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'q', r: 'ʀ',
        s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
    };
    return str
        .split('')
        .map((char) => tinyCapsMap[char.toLowerCase()] || char)
        .join('');
};

// Helper function to process text effect with buttons
async function processTextEffect(client, mek, from, effect, desc, react, text, quoted, sessionId) {
    try {
        // Validate mek and mek.key
        if (!mek || !mek.key || !mek.key.id) {
            console.error('Invalid mek object:', mek);
            throw new Error('Invalid message object');
        }
        console.log(`Processing effect: ${effect} for text: ${text}, session: ${sessionId}`);

        // Send processing reaction
        await client.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // Store text in session
        if (!textSessions.has(sessionId)) {
            textSessions.set(sessionId, { text });
            setTimeout(() => textSessions.delete(sessionId), 2 * 60 * 1000); // Expire after 2 minutes
            console.log(`Stored text in session: ${sessionId}`);
        }

        // Define API endpoints for each effect
        const effectApis = {
            '3dcomic': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html&name=${encodeURIComponent(text)}`,
            'dragonball': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html&name=${encodeURIComponent(text)}`,
            'deadpool': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html&name=${encodeURIComponent(text)}`,
            'blackpink': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html&name=${encodeURIComponent(text)}`,
            'neonlight': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html&name=${encodeURIComponent(text)}`,
            'cat': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html&name=${encodeURIComponent(text)}`,
            'sadgirl': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-text-on-wet-glass-online-589.html&name=${encodeURIComponent(text)}`,
            'pornhub': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html&name=${encodeURIComponent(text)}`,
            'naruto': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html&name=${encodeURIComponent(text)}`,
            'thor': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html&name=${encodeURIComponent(text)}`,
            'america': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html&name=${encodeURIComponent(text)}`,
            'eraser': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html&name=${encodeURIComponent(text)}`,
            '3dpaper': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html&name=${encodeURIComponent(text)}`,
            'futuristic': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html&name=${encodeURIComponent(text)}`,
            'clouds': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html&name=${encodeURIComponent(text)}`,
            'sand': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html&name=${encodeURIComponent(text)}`,
            'galaxy': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html&name=${encodeURIComponent(text)}`,
            'leaf': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html&name=${encodeURIComponent(text)}`,
            'sunset': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-sunset-light-text-effects-online-807.html&name=${encodeURIComponent(text)}`,
            'nigeria': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html&name=${encodeURIComponent(text)}`,
            'devilwings': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html&name=${encodeURIComponent(text)}`,
            'hacker': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html&name=${encodeURIComponent(text)}`,
            'boom': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/boom-text-comic-style-text-effect-675.html&name=${encodeURIComponent(text)}`,
            'luxury': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/floral-luxury-logo-collection-for-branding-616.html&name=${encodeURIComponent(text)}`,
            'zodiac': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-star-zodiac-wallpaper-mobile-604.html&name=${encodeURIComponent(text)}`,
            'angelwings': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/angel-wing-effect-329.html&name=${encodeURIComponent(text)}`,
            'bulb': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/text-effects-incandescent-bulbs-219.html&name=${encodeURIComponent(text)}`,
            'tatoo': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/make-tattoos-online-by-empire-tech-309.html&name=${encodeURIComponent(text)}`,
            'castle': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-3d-castle-pop-out-mobile-photo-effect-786.html&name=${encodeURIComponent(text)}`,
            'frozen': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html&name=${encodeURIComponent(text)}`,
            'paint': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html&name=${encodeURIComponent(text)}`,
            'birthday': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/beautiful-3d-foil-balloon-effects-for-holidays-and-birthday-803.html&name=${encodeURIComponent(text)}`,
            'typography': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-typography-status-online-with-impressive-leaves-357.html&name=${encodeURIComponent(text)}`,
            'bear': `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/free-bear-logo-maker-online-673.html&name=${encodeURIComponent(text)}`
        };

        const apiUrl = effectApis[effect];
        console.log(`Fetching from API: ${apiUrl}`);
        const result = await fetchJson(apiUrl);

        if (!result?.result?.download_url) {
            console.error('API did not return a valid image URL');
            return await client.sendMessage(from, {
                text: toTinyCaps('error: the API did not return a valid image. try again later.'),
                quoted
            });
        }

        console.log(`Downloading image from: ${result.result.download_url}`);
        const imageBuffer = await getBuffer(result.result.download_url);

        const caption = `
╭─[ *${toTinyCaps(desc)}* ]──
│
├ *sᴛᴀᴛᴜs*: ᴘʀᴏᴄᴇssᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ ${react}
├ *ᴛᴇxᴛ*: ${text}
│
╰───[ *ᴍᴀʟᴠɪɴ-xᴅ* ]───
`;

        // Initialize ButtonManager
        let buttonManager;
        try {
            buttonManager = new ButtonManager(client);
            console.log('ButtonManager initialized');
        } catch (error) {
            console.error('Failed to initialize ButtonManager:', error);
            throw new Error('Button system initialization failed');
        }

        // Define available effects
        const allEffects = [
            { name: '3dcomic', emoji: '🎨', desc: '3D Comic text effect' },
            { name: 'dragonball', emoji: '🐉', desc: 'Dragon Ball text effect' },
            { name: 'deadpool', emoji: '🦁', desc: 'Deadpool text effect' },
            { name: 'blackpink', emoji: '🌸', desc: 'Blackpink text effect' },
            { name: 'neonlight', emoji: '💡', desc: 'Neon Light text effect' },
            { name: 'cat', emoji: '🐱', desc: 'Cat text effect' },
            { name: 'sadgirl', emoji: '😢', desc: 'Sadgirl text effect' },
            { name: 'pornhub', emoji: '🔞', desc: 'Pornhub text effect' },
            { name: 'naruto', emoji: '🍥', desc: 'Naruto text effect' },
            { name: 'thor', emoji: '⚡', desc: 'Thor text effect' },
            { name: 'america', emoji: '🇺🇸', desc: 'American text effect' },
            { name: 'eraser', emoji: '🧽', desc: 'Eraser text effect' },
            { name: '3dpaper', emoji: '📜', desc: '3D Paper text effect' },
            { name: 'futuristic', emoji: '🚀', desc: 'Futuristic text effect' },
            { name: 'clouds', emoji: '☁️', desc: 'Clouds text effect' },
            { name: 'sand', emoji: '🏖️', desc: 'Sand text effect' },
            { name: 'galaxy', emoji: '🌌', desc: 'Galaxy text effect' },
            { name: 'leaf', emoji: '🍃', desc: 'Leaf text effect' },
            { name: 'sunset', emoji: '🌅', desc: 'Sunset text effect' },
            { name: 'nigeria', emoji: '🇳🇬', desc: 'Nigeria text effect' },
            { name: 'devilwings', emoji: '😈', desc: 'Devil Wings text effect' },
            { name: 'hacker', emoji: '💻', desc: 'Hacker text effect' },
            { name: 'boom', emoji: '💥', desc: 'Boom text effect' },
            { name: 'luxury', emoji: '💎', desc: 'Luxury text effect' },
            { name: 'zodiac', emoji: '🌟', desc: 'Zodiac text effect' },
            { name: 'angelwings', emoji: '👼', desc: 'Angel Wings text effect' },
            { name: 'bulb', emoji: '💡', desc: 'Bulb text effect' },
            { name: 'tatoo', emoji: '🖤', desc: 'Tatoo text effect' },
            { name: 'castle', emoji: '🏰', desc: 'Castle text effect' },
            { name: 'frozen', emoji: '❄️', desc: 'Frozen text effect' },
            { name: 'paint', emoji: '🎨', desc: 'Paint text effect' },
            { name: 'birthday', emoji: '🎉', desc: 'Birthday text effect' },
            { name: 'typography', emoji: '📝', desc: 'Typography text effect' },
            { name: 'bear', emoji: '🐻', desc: 'Bear text effect' }
        ];

        // Select up to 5 other effects (excluding current effect)
        const otherEffects = allEffects
            .filter(e => e.name !== effect)
            .slice(0, 5); // WhatsApp button limit

        // Define buttons
        const buttons = otherEffects.map(e => ({
            buttonId: `${e.name}-effect-${sessionId}`,
            buttonText: { displayText: `${e.emoji} ${toTinyCaps(e.name)}` },
            type: 1
        }));

        // Create and send buttons message
        const buttonsMessage = buttonManager.createButtonsMessage({
            imageUrl: LIST_IMAGE,
            caption,
            footer: toTinyCaps('> powered by popkid xtr'),
            buttons,
            contextInfo: {
                mentionedJid: [mek.sender || from],
                forwardingScore: 999,
                isForwarded: true
            },
            quoted
        });

        const sentMsg = await client.sendMessage(from, buttonsMessage);
        if (!sentMsg || !sentMsg.key || !sentMsg.key.id) {
            console.error('Failed to send buttons message:', sentMsg);
            throw new Error('Failed to send buttons message');
        }
        const messageId = sentMsg.key.id;
        console.log(`Sent buttons message with ID: ${messageId}`);

        // Send image separately
        await client.sendMessage(from, {
            image: imageBuffer,
            caption: `> *${toTinyCaps('powered by popkid xtr')}*`,
            quoted
        });

        // Define button actions
        const actions = {};
        otherEffects.forEach(e => {
            actions[`${e.name}-effect`] = async (receivedMsg) => {
                if (!textSessions.has(sessionId)) {
                    console.log(`Session expired: ${sessionId}`);
                    await client.sendMessage(from, {
                        text: toTinyCaps('session expired, please provide text again') + ' 😔',
                        quoted: receivedMsg
                    });
                    return;
                }
                const { text: sessionText } = textSessions.get(sessionId);
                console.log(`Button clicked: ${e.name}, using text: ${sessionText}`);
                await processTextEffect(client, receivedMsg, from, e.name, e.desc, e.emoji, sessionText, receivedMsg, sessionId);
            };
        });

        // Add button handler
        buttonManager.addHandler(messageId, sessionId, (receivedMsg, buttonId) => {
            console.log(`Handling button click: ${buttonId}`);
            buttonManager.handleAction(receivedMsg, buttonId, actions);
        });

        await client.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (error) {
        console.error(`${effect} Error:`, error);
        await client.sendMessage(from, {
            text: `❌ ${toTinyCaps('failed to process text')}: ${error.message || 'unknown error'} 😞`,
            quoted
        });
        if (mek && mek.key) {
            await client.sendMessage(from, { react: { text: '❌', key: mek.key } });
        }
    }
}

// Text effect commands
const textEffects = [
    { pattern: '3dcomic', desc: '3D Comic text effect', react: '🎨' },
    { pattern: 'dragonball', desc: 'Dragon Ball text effect', react: '🐉' },
    { pattern: 'deadpool', desc: 'Deadpool text effect', react: '🦁' },
    { pattern: 'blackpink', desc: 'Blackpink text effect', react: '🌸' },
    { pattern: 'neonlight', desc: 'Neon Light text effect', react: '💡' },
    { pattern: 'cat', desc: 'Cat text effect', react: '🐱' },
    { pattern: 'sadgirl', desc: 'Sadgirl text effect', react: '😢' },
    { pattern: 'pornhub', desc: 'Pornhub text effect', react: '🔞' },
    { pattern: 'naruto', desc: 'Naruto text effect', react: '🍥' },
    { pattern: 'thor', desc: 'Thor text effect', react: '⚡' },
    { pattern: 'america', desc: 'American text effect', react: '🇺🇸' },
    { pattern: 'eraser', desc: 'Eraser text effect', react: '🧽' },
    { pattern: '3dpaper', desc: '3D Paper text effect', react: '📜' },
    { pattern: 'futuristic', desc: 'Futuristic text effect', react: '🚀' },
    { pattern: 'clouds', desc: 'Clouds text effect', react: '☁️' },
    { pattern: 'sand', desc: 'Sand text effect', react: '🏖️' },
    { pattern: 'galaxy', desc: 'Galaxy text effect', react: '🌌' },
    { pattern: 'leaf', desc: 'Leaf text effect', react: '🍃' },
    { pattern: 'sunset', desc: 'Sunset text effect', react: '🌅' },
    { pattern: 'nigeria', desc: 'Nigeria text effect', react: '🇳🇬' },
    { pattern: 'devilwings', desc: 'Devil Wings text effect', react: '😈' },
    { pattern: 'hacker', desc: 'Hacker text effect', react: '💻' },
    { pattern: 'boom', desc: 'Boom text effect', react: '💥' },
    { pattern: 'luxury', desc: 'Luxury text effect', react: '💎' },
    { pattern: 'zodiac', desc: 'Zodiac text effect', react: '🌟' },
    { pattern: 'angelwings', desc: 'Angel Wings text effect', react: '👼' },
    { pattern: 'bulb', desc: 'Bulb text effect', react: '💡' },
    { pattern: 'tatoo', desc: 'Tatoo text effect', react: '🖤' },
    { pattern: 'castle', desc: 'Castle text effect', react: '🏰' },
    { pattern: 'frozen', desc: 'Frozen text effect', react: '❄️' },
    { pattern: 'paint', desc: 'Paint text effect', react: '🎨' },
    { pattern: 'birthday', desc: 'Birthday text effect', react: '🎉' },
    { pattern: 'typography', desc: 'Typography text effect', react: '📝' },
    { pattern: 'bear', desc: 'Bear text effect', react: '🐻' }
];

textEffects.forEach(({ pattern, desc, react }) => {
    cmd({
        pattern,
        desc: toTinyCaps(desc),
        category: 'logo',
        react,
        use: `.${pattern} <text>`,
        filename: __filename
    }, async (client, mek, m, { from, args, reply, quoted }) => {
        try {
            if (!mek || !mek.key) {
                console.error('Invalid mek object in command handler:', mek);
                return reply(`❌ ${toTinyCaps('invalid message context')}: please try again 😞`);
            }

            if (!args.length) {
                return reply(`❌ ${toTinyCaps('please provide a name')} Example: .${pattern} Empire`);
            }

            const text = args.join(' ');
            const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            console.log(`Starting text effect: ${pattern}, text: ${text}, session: ${sessionId}`);

            await processTextEffect(client, mek, from, pattern, desc, react, text, quoted, sessionId);
        } catch (error) {
            console.error(`${pattern} Error:`, error);
            reply(`❌ ${toTinyCaps('failed to process text')}: ${error.message || 'unknown error'} 😞`);
            if (mek && mek.key) {
                await client.sendMessage(from, { react: { text: '❌', key: mek.key } });
            }
        }
    });
});
