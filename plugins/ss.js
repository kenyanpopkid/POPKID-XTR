const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "ss",
  alias: ["screenshot", "ssweb"],
  desc: "Take royal fancy screenshots 👑",
  category: "tools",
  react: "⚡",
  filename: __filename
}, async (gss, m, { args }) => {
  try {
    const url = args[0];

    if (!url) {
      await gss.sendMessage(
        m.from,
        {
          text: `
═══════════════════════
👑 𝗥𝗢𝗬𝗔𝗟 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 𝗧𝗢𝗢𝗟 👑
═══════════════════════

📌 Usage: *!ss <url>*
🌍 Example: *!ss https://google.com*

⚠️ Please provide a valid link!
═══════════════════════
          `,
        },
        { quoted: m }
      );
      return;
    }

    const ssApiUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}`;

    // Notify user of processing
    await gss.sendMessage(
      m.from,
      {
        text: `
═══════════════════════
⚡ *PROCESSING REQUEST* ⚡
═══════════════════════
📸 Capturing screenshot for:
🌐 ${url}
Please wait...
═══════════════════════
        `,
      },
      { quoted: m }
    );

    // Fetch screenshot
    const response = await axios.get(ssApiUrl, { responseType: "arraybuffer" });

    if (!response || response.status !== 200) {
      await gss.sendMessage(
        m.from,
        {
          text: `
═══════════════════════
❌ *FAILED TO CAPTURE* ❌
═══════════════════════
⚠️ Could not capture:
🌐 ${url}

✅ Try again with a valid link.
═══════════════════════
          `,
        },
        { quoted: m }
      );
      return;
    }

    // Send screenshot result
    await gss.sendMessage(
      m.from,
      {
        image: Buffer.from(response.data, "binary"),
        caption: `
═══════════════════════
✅ *𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 𝗥𝗘𝗔𝗗𝗬!* ✅
═══════════════════════
🌍 Website: ${url}
📸 Captured Successfully

👑 Powered by: *Popkid GLE*
═══════════════════════
        `,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Screenshot Command Error:", error);

    await gss.sendMessage(
      m.from,
      {
        text: `
═══════════════════════
⚠️ *𝗘𝗥𝗥𝗢𝗥 𝗢𝗖𝗖𝗨𝗥𝗥𝗘𝗗* ⚠️
═══════════════════════
❌ Something went wrong.
🔄 Please try again later.
═══════════════════════
        `,
      },
      { quoted: m }
    );
  }
});
