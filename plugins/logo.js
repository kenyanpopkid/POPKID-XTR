//---------------------------------------------
//           popkid-XD  
//---------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE OR REMOVE THIS CREDIT ⚠️  
//---------------------------------------------

const { cmd } = require('../command');
const { ButtonManager } = require('../button');
const { getBuffer, fetchJson } = require('../lib/functions2');
const config = require('../config');

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

// Text effect definitions
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

// API list for each effect
const effectApis = {
    '3dcomic': 'https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html',
    'dragonball': 'https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html',
    'deadpool': 'https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html',
    'blackpink': 'https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html',
    'neonlight': 'https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html',
    'cat': 'https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html',
    'sadgirl': 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html',
    'pornhub': 'https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html',
    'naruto': 'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html',
    'thor': 'https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html',
    'america': 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html',
    'eraser': 'https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html',
    '3dpaper': 'https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html',
    'futuristic': 'https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html',
    'clouds': 'https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html',
    'sand': 'https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html',
    'galaxy': 'https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html',
    'leaf': 'https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html',
    'sunset': 'https://en.ephoto360.com/create-sunset-light-text-effects-online-807.html',
    'nigeria': 'https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html',
    'devilwings': 'https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html',
    'hacker': 'https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html',
    'boom': 'https://en.ephoto360.com/boom-text-comic-style-text-effect-675.html',
    'luxury': 'https://en.ephoto360.com/floral-luxury-logo-collection-for-branding-616.html',
    'zodiac': 'https://en.ephoto360.com/create-star-zodiac-wallpaper-mobile-604.html',
    'angelwings': 'https://en.ephoto360.com/angel-wing-effect-329.html',
    'bulb': 'https://en.ephoto360.com/text-effects-incandescent-bulbs-219.html',
    'tatoo': 'https://en.ephoto360.com/make-tattoos-online-by-empire-tech-309.html',
    'castle': 'https://en.ephoto360.com/create-a-3d-castle-pop-out-mobile-photo-effect-786.html',
    'frozen': 'https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html',
    'paint': 'https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html',
    'birthday': 'https://en.ephoto360.com/beautiful-3d-foil-balloon-effects-for-holidays-and-birthday-803.html',
    'typography': 'https://en.ephoto360.com/create-typography-status-online-with-impressive-leaves-357.html',
    'bear': 'https://en.ephoto360.com/free-bear-logo-maker-online-673.html'
};

// Core processor
async function processTextEffect(client, mek, from, effect, desc, react, text, quoted) {
    try {
        await client.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=${encodeURIComponent(effectApis[effect])}&name=${encodeURIComponent(text)}`;
        const result = await fetchJson(apiUrl);

        if (!result?.result?.download_url) {
            return client.sendMessage(from, { text: toTinyCaps('error: api did not return a valid image') }, { quoted });
        }

        const imageBuffer = await getBuffer(result.result.download_url);

        const caption = `
╭─[ *${toTinyCaps(desc)}* ]──
│
├ *sᴛᴀᴛᴜs*: ᴘʀᴏᴄᴇssᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ ${react}
├ *ᴛᴇxᴛ*: ${text}
│
╰───[ *${toTinyCaps('popkid-xtr')}* ]───
`;

        await client.sendMessage(from, {
            image: imageBuffer,
            caption,
            quoted
        });

        await client.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        console.error(e);
        await client.sendMessage(from, { text: `❌ ${toTinyCaps('failed to process text')}` }, { quoted });
        await client.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
}

// Generate commands for all logos
textEffects.forEach(({ pattern, desc, react }) => {
    cmd({
        pattern,
        desc: toTinyCaps(desc),
        category: 'logo',
        react,
        use: `.${pattern} <text>`,
        filename: __filename
    }, async (client, mek, m, { from, args, reply, quoted }) => {
        if (!args.length) return reply(`❌ ${toTinyCaps('please provide text')} Example: .${pattern} Empire`);
        const text = args.join(' ');
        await processTextEffect(client, mek, from, pattern, desc, react, text, quoted);
    });
});

// Logo Menu
cmd({
    pattern: "logo",
    desc: toTinyCaps("show all popkid logos menu"),
    category: "logo",
    react: "🖼️",
    use: ".logo",
    filename: __filename
}, async (client, mek, m, { from, quoted }) => {
    try {
        let buttonManager = new ButtonManager(client);
        const buttonEffects = textEffects.slice(0, 5);

        const buttons = buttonEffects.map(e => ({
            buttonId: `${e.pattern}-menu-${Date.now()}`, 
            buttonText: { displayText: `${e.react} ${toTinyCaps(e.pattern)}` },
            type: 1
        }));

        const caption = `
╭─[ *${toTinyCaps('popkid logo menu')}* ]──
│
${textEffects.map(e => `├ ${e.react} .${e.pattern} <${toTinyCaps('text')}>`).join("\n")}
│
╰───[ *${toTinyCaps('popkid-xtr')}* ]───

> ${toTinyCaps('powered by popkid xtr')}
`;

        const buttonsMessage = buttonManager.createButtonsMessage({
            imageUrl: LIST_IMAGE,
            caption,
            footer: toTinyCaps('🔥 popkid exclusive 🔥'),
            buttons,
            quoted
        });

        await client.sendMessage(from, buttonsMessage);
    } catch (e) {
        console.error(e);
        await client.sendMessage(from, { text: "❌ " + toTinyCaps("failed to load popkid logo menu") }, { quoted: mek });
    }
});
