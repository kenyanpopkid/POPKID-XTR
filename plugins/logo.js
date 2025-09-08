//---------------------------------------------
//           popkid-XD  
//---------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE OR REMOVE THIS CREDIT⚠️  
//---------------------------------------------

const { cmd } = require('../command');
const { getBuffer, fetchJson } = require('../lib/functions2');
const config = require('../config');

// Tiny caps converter
const toTinyCaps = (str) => {
    const tinyCapsMap = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
        j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'q', r: 'ʀ',
        s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
    };
    return str.split('').map(c => tinyCapsMap[c.toLowerCase()] || c).join('');
};

// All effects using the pink-venom API
const allEffects = [
    '3dcomic','dragonball','deadpool','blackpink','neonlight','cat','sadgirl','pornhub',
    'naruto','thor','america','eraser','3dpaper','futuristic','clouds','sand','galaxy',
    'leaf','sunset','nigeria','devilwings','hacker','boom','luxury','zodiac','angelwings',
    'bulb','tatoo','castle','frozen','paint','birthday','typography','bear'
];

// Dynamically create commands
allEffects.forEach(effectName => {
    cmd({
        pattern: effectName,
        alias: [],
        desc: `${toTinyCaps(effectName)} text effect`,
        category: 'main',
        react: '🎨',
        use: `.${toTinyCaps(effectName)} <text>\nExample: .${toTinyCaps(effectName)} Popkid`,
        filename: __filename
    }, async (conn, mek, m, { from, args, reply, sender }) => {
        try {
            const text = args.join(' ');
            if (!text) {
                await reply(`❌ Please provide text.\nExample: .${toTinyCaps(effectName)} Popkid`);
                return;
            }

            // Build API URL using pink-venom
            const requestUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-${effectName}-style-text-effects-online&name=${encodeURIComponent(text)}`;

            const apiResponse = await fetchJson(requestUrl);

            if (!apiResponse || !apiResponse.result || !apiResponse.result.download_url) {
                await reply(`❌ Failed to generate logo for ${effectName}. API may be down.`);
                return;
            }

            const imageBuffer = await getBuffer(apiResponse.result.download_url);
            const ownerName = config.OWNER_NAME || 'popkid';
            const botName = config.BOT_NAME || 'popkid';

            const caption = `
✨ ${toTinyCaps(effectName)} Text Effect
✍️ Text: ${text}
🤖 Bot: ${botName}
👨‍💻 Developer: ${ownerName}
            `.trim();

            await conn.sendMessage(from, {
                image: imageBuffer,
                caption,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });

        } catch (err) {
            console.error(`❌ ${effectName} Command Error:`, err);
            await reply(`❌ Error: API not responding. Try again later.`);
        }
    });
});
