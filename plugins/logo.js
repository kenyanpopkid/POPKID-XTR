//---------------------------------------------
//           popkid logo commands
//---------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE OR REMOVE THIS CREDIT⚠️  
//---------------------------------------------

const { cmd } = require('../command');
const { ButtonManager } = require('../button');
const { getBuffer, fetchJson } = require('../lib/functions2');

// Effect APIs
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

// Tiny caps converter
const toTinyCaps = (str) => {
    const tinyCapsMap = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
        j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
        s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
        A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ', I: 'ɪ',
        J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ǫ', R: 'ʀ',
        S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ'
    };
    return str.split('').map(c => tinyCapsMap[c] || c).join('');
};

// Dynamically create commands for all effects
for (const effect in effectApis) {
    cmd.add(effect, async (client, mek, args, quoted, react, sessionId) => {
        try {
            const from = mek.key.remoteJid;
            const text = args.join(' ');
            if (!text) return client.sendMessage(from, { text: toTinyCaps(`error: provide text for ${effect}`), quoted });

            // Build API URL
            const apiUrl = effectApis[effect].replace('${encodeURIComponent(text)}', encodeURIComponent(text));
            const result = await fetchJson(apiUrl);

            if (!result?.result?.download_url) {
                return client.sendMessage(from, { text: toTinyCaps('error: API did not return a valid image.'), quoted });
            }

            const imageBuffer = await getBuffer(result.result.download_url);

            const caption = `
╭─[ *${toTinyCaps(effect)}* ]──
├ *status*: ᴘʀᴏᴄᴇssᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ ${react || ''}
├ *text*: ${text}
╰───[ *popkid* ]───
`;

            const buttonManager = new ButtonManager(client);
            const allEffects = Object.keys(effectApis);
            const otherEffects = allEffects.filter(e => e !== effect).slice(0, 5);

            const buttons = otherEffects.map(e => ({
                buttonId: `${e} ${text}`,
                buttonText: { displayText: toTinyCaps(e) },
                type: 1
            }));

            const buttonsMessage = buttonManager.createButtonsMessage({
                imageUrl: result.result.download_url,
                caption,
                footer: toTinyCaps('> powered by popkid'),
                buttons,
                contextInfo: { mentionedJid: [mek.sender || from], forwardingScore: 999, isForwarded: true },
                quoted
            });

            await client.sendMessage(from, buttonsMessage);

        } catch (err) {
            console.error(`Error in ${effect} command:`, err);
            await client.sendMessage(mek.key.remoteJid, { text: toTinyCaps('error: something went wrong.'), quoted: mek });
        }
    });
}
