// sundaymass.js
const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

cmd({
  pattern: "sundaymass",
  alias: ["mass", "readings", "sundayreadings"],
  desc: "Get Catholic Sunday Mass readings automatically",
  category: "catholic",
  use: "",
}, async (m, conn) => {
  try {
    // React while fetching
    await conn.sendMessage(m.chat, { react: { text: "🙏", key: m.key } });

    // Fetch from API
    const res = await axios.get("https://api.daily-mass.com/sunday");

    if (!res.data) {
      return m.reply("❌ Could not fetch Sunday readings.");
    }

    const { first_reading, second_reading, gospel } = res.data;

    let caption = `✝️ *Catholic Sunday Mass Readings* ✝️\n\n`;

    caption += `📖 *First Reading*:\n${first_reading.title}\n${first_reading.text}\n\n`;
    caption += `📖 *Second Reading*:\n${second_reading.title}\n${second_reading.text}\n\n`;
    caption += `✝️ *Gospel*:\n${gospel.title}\n${gospel.text}`;

    await conn.sendMessage(
      m.chat,
      { text: caption },
      { quoted: m }
    );
  } catch (e) {
    console.error("Sunday Mass Error:", e);
    m.reply("⚠️ An error occurred while fetching Sunday readings.");
  }
});
