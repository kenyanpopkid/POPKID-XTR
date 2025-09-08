//---------------------------------------------
//           popkid-XD  
//---------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE OR REMOVE THIS CREDIT⚠️  
//---------------------------------------------

const { cmd } = require('../command');

// Tiny caps font converter
const toTinyCaps = (str) => {
    const tinyCapsMap = {
        a:"ᴀ", b:"ʙ", c:"ᴄ", d:"ᴅ", e:"ᴇ", f:"ғ", g:"ɢ", h:"ʜ",
        i:"ɪ", j:"ᴊ", k:"ᴋ", l:"ʟ", m:"ᴍ", n:"ɴ", o:"ᴏ", p:"ᴘ",
        q:"ǫ", r:"ʀ", s:"s", t:"ᴛ", u:"ᴜ", v:"ᴠ", w:"ᴡ", x:"x",
        y:"ʏ", z:"ᴢ"
    };
    return str.toLowerCase().split("").map(c => tinyCapsMap[c] || c).join("");
};

cmd({
    pattern: "ping",
    desc: "Check bot response time",
    category: "general",
    react: "🏓"
}, async (conn, mek, m) => {
    const start = Date.now();
    const msg = await m.reply("🏓 " + toTinyCaps("Pong!"));
    const end = Date.now();

    await conn.sendMessage(m.chat, { 
        text: `⚡ ${toTinyCaps("Popkid xtr Speed")}: *${end - start}ms*`
    }, { quoted: mek });
});
