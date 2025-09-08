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
    return str.split('').map(char => tinyCapsMap[char.toLowerCase()] || char).join('');
};

// All logo effects
const allEffects = {
    '3dcomic': { emoji: '🎨', desc: '3D Comic text effect', url: 'https://api.ephoto360.com/create-online-3d-comic-style-text-effects-817.html?name=' },
    'dragonball': { emoji: '🐉', desc: 'Dragon Ball text effect', url: 'https://api.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html?name=' },
    'deadpool': { emoji: '🦁', desc: 'Deadpool text effect', url: 'https://api.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html?name=' },
    'blackpink': { emoji: '🌸', desc: 'Blackpink text effect', url: 'https://api.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html?name=' },
    'neonlight': { emoji: '💡', desc: 'Neon Light text effect', url: 'https://api.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html?name=' },
    'cat': { emoji: '🐱', desc: 'Cat text effect', url: 'https://api.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html?name=' },
    'sadgirl': { emoji: '😢', desc: 'Sadgirl text effect', url: 'https://api.ephoto360.com/write-text-on-wet-glass-online-589.html?name=' },
    'pornhub': { emoji: '🔞', desc: 'Pornhub text effect', url: 'https://api.ephoto360.com/create-pornhub-style-logos-online-free-549.html?name=' },
    'naruto': { emoji: '🍥', desc: 'Naruto text effect', url: 'https://api.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html?name=' },
    'thor': { emoji: '⚡', desc: 'Thor text effect', url: 'https://api.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html?name=' },
    'america': { emoji: '🇺🇸', desc: 'American text effect', url: 'https://api.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html?name=' },
    'eraser': { emoji: '🧽', desc: 'Eraser text effect', url: 'https://api.ephoto360.com/create-eraser-deleting-text-effect-online-717.html?name=' },
    '3dpaper': { emoji: '📜', desc: '3D Paper text effect', url: 'https://api.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html?name=' },
    'futuristic': { emoji: '🚀', desc: 'Futuristic text effect', url: 'https://api.ephoto360.com/light-text-effect-futuristic-technology-style-648.html?name=' },
    'clouds': { emoji: '☁️', desc: 'Clouds text effect', url: 'https://api.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html?name=' },
    'sand': { emoji: '🏖️', desc: 'Sand text effect', url: 'https://api.ephoto360.com/write-in-sand-summer-beach-online-free-595.html?name=' },
    'galaxy': { emoji: '🌌', desc: 'Galaxy text effect', url: 'https://api.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html?name=' },
    'leaf': { emoji: '🍃', desc: 'Leaf text effect', url: 'https://api.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html?name=' },
    'sunset': { emoji: '🌅', desc: 'Sunset text effect', url: 'https://api.ephoto360.com/create-sunset-light-text-effects-online-807.html?name=' },
    'nigeria': { emoji: '🇳🇬', desc: 'Nigeria text effect', url: 'https://api.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html?name=' },
    'devilwings': { emoji: '😈', desc: 'Devil Wings text effect', url: 'https://api.ephoto360.com/neon-devil-wings-text-effect-online-683.html?name=' },
    'hacker': { emoji: '💻', desc: 'Hacker text effect', url: 'https://api.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html?name=' },
    'boom': { emoji: '💥', desc: 'Boom text effect', url: 'https://api.ephoto360.com/boom-text-comic-style-text-effect-675.html?name=' },
    'luxury': { emoji: '💎', desc: 'Luxury text effect', url: 'https://api.ephoto360.com/floral-luxury-logo-collection-for-branding-616.html?name=' },
    'zodiac': { emoji: '🌟', desc: 'Zodiac text effect', url: 'https://api.ephoto360.com/create-star-zodiac-wallpaper-mobile-604.html?name=' },
    'angelwings': { emoji: '👼', desc: 'Angel Wings text effect', url: 'https://api.ephoto360.com/angel-wing-effect-329.html?name=' },
    'bulb': { emoji: '💡', desc: 'Bulb text effect', url: 'https://api.ephoto360.com/text-effects-incandescent-bulbs-219.html?name=' },
    'tatoo': { emoji: '🖤', desc: 'Tatoo text effect', url: 'https://api.ephoto360.com/make-tattoos-online-by-empire-tech-309.html?name=' },
    'castle': { emoji: '🏰', desc: 'Castle text effect', url: 'https://api.ephoto360.com/create-a-3d-castle-pop-out-mobile-photo-effect-786.html?name=' },
    'frozen': { emoji: '❄️', desc: 'Frozen text effect', url: 'https://api.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html?name=' },
    'paint': { emoji: '🎨', desc: 'Paint text effect', url: 'https://api.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html?name=' },
    'birthday': { emoji: '🎉', desc: 'Birthday text effect', url: 'https://api.ephoto360.com/beautiful-3d-foil-balloon-effects-for-holidays-and-birthday-803.html?name=' },
    'typography': { emoji: '📝', desc: 'Typography text effect', url: 'https://api.ephoto360.com/create-typography-status-online-with-impressive-leaves-357.html?name=' },
    'bear': { emoji: '🐻', desc: 'Bear text effect', url: 'https://api.ephoto360.com/free-bear-logo-maker-online-673.html?name=' }
};

// Dynamically create commands for all effects
Object.entries(allEffects).forEach(([effectName, effectData]) => {
    cmd({
        pattern: effectName,
        alias: [],
        desc: effectData.desc,
        category: 'main',
        react: effectData.emoji,
        use: `.${toTinyCaps(effectName)} <text>\nExample: .${toTinyCaps(effectName)} Popkid`,
        filename: __filename
    }, async (conn, mek, m, { from, args, reply, sender }) => {
        try {
            await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } }).catch(() => {});
            const text = args.join(' ');
            if (!text) {
                await reply(`❌ ${toTinyCaps('Please provide a name for the logo')}.\nExample: .${toTinyCaps(effectName)} Empire`);
                await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
                return;
            }

            const requestUrl = `${effectData.url}${encodeURIComponent(text)}`;
            console.log(`[LOGO] Fetching from API: ${requestUrl}`);

            const apiResponse = await fetchJson(requestUrl);

            if (!apiResponse || !apiResponse.result || !apiResponse.result.download_url) {
                await reply(`❌ ${toTinyCaps(`Failed to generate logo with ${effectData.desc}. The third-party API may be down.`)}`);
                await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
                return;
            }

            const imageBuffer = await getBuffer(apiResponse.result.download_url);
            
            const ownerName = config.OWNER_NAME || 'popkid';
            const botName = config.BOT_NAME || 'popkid';
            const repoLink = config.REPO || 'https://github.com/kenyanpopkid/POPKID-XTR';

            const caption = `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ ✨ *${toTinyCaps(botName)} Logo Panel* ✨ ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

🎨 *Effect* : ${toTinyCaps(effectData.desc)}
✍️ *Text* : ${text}
📡 *Status* : ✅ Processed Successfully
🤖 *Bot Name* : ${botName}
👨‍💻 *Developer* : ${ownerName}

┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🌟 Support & Contribute 🌟 ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛
🔗 ${repoLink}
            `.trim();

            await conn.sendMessage(from, {
                image: imageBuffer,
                caption,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

        } catch (err) {
            console.error('❌ Logo Command Error:', err);
            await reply(`❌ Error: The API for logo generation is not responding. Please check your internet connection or try again later. If the problem persists, the third-party API might be down.`);
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        }
    });
});
