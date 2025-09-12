// sundaymassauto.js

const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

// helper to get next Sunday (or today if Sunday)
function getNextSundayDate() {
  const now = new Date();
  const day = now.getUTCDay();  // 0=Sunday, 1=Monday, ..., 6=Saturday
  const diff = (7 - day) % 7;    // days until next Sunday (0 if today)
  const nextSun = new Date(now);
  nextSun.setUTCDate(now.getUTCDate() + diff);
  const yyyy = nextSun.getUTCFullYear();
  const mm = String(nextSun.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(nextSun.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

cmd({
  pattern: "sundaymass",
  alias: ["mass", "readings", "sundayreadings"],
  desc: "Get Catholic Sunday Mass readings automatically",
  category: "catholic",
  use: "",
}, async (m, conn) => {
  try {
    // React
    await conn.sendMessage(m.chat, { react: { text: "🙏", key: m.key } });

    // Compute date for next Sunday
    const date = getNextSundayDate();

    // Call Universalis API
    const url = `https://universalis.app/api/daily-readings?date=${date}`;
    const res = await axios.get(url);

    if (!res.data || !res.data.readings) {
      return m.reply("❌ Could not fetch Sunday Mass readings at the moment.");
    }

    const readings = res.data.readings;  // array of reading objects
    // Example item: { title: "First Reading", text: "..." }, and others including Gospel

    // Format
    let caption = `✝️ *Catholic Sunday Mass Readings for ${date}* ✝️\n\n`;

    readings.forEach((rd) => {
      // Only include the main readings: First Reading, Second Reading (if present), Gospel
      // Universalis might include Responsorial Psalm etc., you can filter by title
      const t = rd.title || "";
      const txt = rd.text || "";
      if (
        /first reading/i.test(t) ||
        /second reading/i.test(t) ||
        /gospel/i.test(t)
      ) {
        caption += `*${t}*\n${txt}\n\n`;
      }
    });

    // If none of the needed found
    if (caption.endsWith("\n\n") === false) {
      // optionally fallback or inform user
    }

    await conn.sendMessage(
      m.chat,
      { text: caption.trim() },
      { quoted: m }
    );

  } catch (e) {
    console.error("Sunday Mass Auto Error:", e);
    m.reply("⚠️ An error occurred while fetching Sunday Mass readings.");
  }
});
