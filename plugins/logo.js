//---------------------------------------------
//           popkid logo commands (simple)
//---------------------------------------------

const { cmd } = require('../command');
const { getBuffer, fetchJson } = require('../lib/functions2');

// Tiny caps converter
const toTinyCaps = (str) => {
    const map = {
        a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ғ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',
        l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'s',t:'ᴛ',u:'ᴜ',v:'ᴠ',
        w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',
        A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ғ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',
        L:'ʟ',M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'ǫ',R:'ʀ',S:'s',T:'ᴛ',U:'ᴜ',V:'ᴠ',
        W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'
    };
    return str.split('').map(c => map[c] || c).join('');
};

// List of all effects and their API URLs
const effectApis = {
    '3dcomic': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html&name=',
    'dragonball': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html&name=',
    'deadpool': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html&name=',
    'blackpink': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html&name=',
    'neonlight': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html&name=',
    'cat': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html&name=',
    'sadgirl': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-text-on-wet-glass-online-589.html&name=',
    'pornhub': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html&name=',
    'naruto': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html&name=',
    'thor': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html&name=',
    'america': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html&name=',
    'eraser': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html&name=',
    '3dpaper': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html&name=',
    'futuristic': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html&name=',
    'clouds': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html&name=',
    'sand': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html&name=',
    'galaxy': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html&name=',
    'leaf': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html&name=',
    'sunset': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-sunset-light-text-effects-online-807.html&name=',
    'nigeria': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html&name=',
    'devilwings': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html&name=',
    'hacker': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html&name=',
    'boom': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/boom-text-comic-style-text-effect-675.html&name=',
    'luxury': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/floral-luxury-logo-collection-for-branding-616.html&name=',
    'zodiac': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-star-zodiac-wallpaper-mobile-604.html&name=',
    'angelwings': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/angel-wing-effect-329.html&name=',
    'bulb': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/text-effects-incandescent-bulbs-219.html&name=',
    'tatoo': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/make-tattoos-online-by-empire-tech-309.html&name=',
    'castle': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-3d-castle-pop-out-mobile-photo-effect-786.html&name=',
    'frozen': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html&name=',
    'paint': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html&name=',
    'birthday': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/beautiful-3d-foil-balloon-effects-for-holidays-and-birthday-803.html&name=',
    'typography': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-typography-status-online-with-impressive-leaves-357.html&name=',
    'bear': 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/free-bear-logo-maker-online-673.html&name='
};

// Create a command for each effect
for (const effect in effectApis) {
    cmd.add(effect, async (client, mek, args, quoted) => {
        const from = mek.key.remoteJid;
        const text = args.join(' ');
        if (!text) return client.sendMessage(from, { text: toTinyCaps(`error: provide text for ${effect}`), quoted });

        try {
            const apiUrl = effectApis[effect] + encodeURIComponent(text);
            const result = await fetchJson(apiUrl);

            if (!result?.result?.download_url) {
                return client.sendMessage(from, { text: toTinyCaps('error: API did not return an image.'), quoted });
            }

            const imageBuffer = await getBuffer(result.result.download_url);
            await client.sendMessage(from, {
                image: imageBuffer,
                caption: `
╭─[ *${toTinyCaps(effect)}* ]──
├ *status*: ᴘʀᴏᴄᴇssᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ
├ *text*: ${text}
╰───[ *popkid* ]───
`,
                quoted
            });

        } catch (err) {
            console.error(err);
            client.sendMessage(from, { text: toTinyCaps('error: something went wrong.'), quoted });
        }
    });
}
