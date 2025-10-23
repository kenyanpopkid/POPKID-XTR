import config from '../../config.cjs';
import axios from 'axios';

// Your newsletter display name and JID
const newsletterName = "Popkid-Xmd";
const newsletterJid = "120363420342566562@newsletter";

const weather = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : '';
  const args = m.body.trim().split(" ").slice(1);
  const location = args.join(" ");

  if (cmd !== "weather") return;

  if (!location) {
    await sock.sendMessage(m.from, {
      text: `❌ *Please provide a location!*\n💡 Try: *${prefix}weather Nairobi*`
    }, { quoted: m });
    return;
  }

  await m.React("🌦️");

  try {
    const apiKey = config.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    const { data } = await axios.get(url);

    const name = data.name;
    const country = data.sys.country;
    const temp = data.main.temp.toFixed(1);
    const feels = data.main.feels_like.toFixed(1);
    const humidity = data.main.humidity;
    const weatherDesc = capitalize(data.weather[0].description);
    const wind = data.wind.speed;
    const condition = data.weather[0].main;
    const weatherIcon = data.weather[0].icon;
    const iconURL = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

    const emoji = getEmoji(condition);

    // Response to USER
    const userText = `╭───『 *🌍 Weather Report* 』
│ 🏙️ *Location:* ${name}, ${country}
│ ${emoji} *Condition:* ${weatherDesc}
│ 🌡️ *Temperature:* ${temp}°C
│ 🤒 *Feels Like:* ${feels}°C
│ 💧 *Humidity:* ${humidity}%
│ 💨 *Wind Speed:* ${wind} m/s
╰──────────────────────`;

    // Newsletter-styled version (for fake-forward)
    const forwardedText = `📰 *POPBOT GLE Weather Bulletin*\n
📍 *${name}, ${country}*
${emoji} *${weatherDesc}*
🌡️ *${temp}°C* | 🤒 Feels Like *${feels}°C*
💧 Humidity: *${humidity}%*
💨 Wind: *${wind} m/s*

📅 ${new Date().toLocaleDateString('en-GB')}
🕓 ${new Date().toLocaleTimeString('en-GB')}

🔔 _Brought to you by Popkid GLE Channel™_`;

    // Send to user
    await sock.sendMessage(m.from, {
      image: { url: iconURL },
      caption: userText
    }, { quoted: m });

    // Send as a fake forward from newsletter
    await sock.sendMessage(m.from, {
      image: { url: iconURL },
      caption: forwardedText,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: newsletterName,
          newsletterJid: newsletterJid
        }
      }
    });

  } catch (error) {
    await sock.sendMessage(m.from, {
      text: `❌ *Couldn't find weather for:* _${location}_\n📍 Make sure the city name is correct.`
    }, { quoted: m });
  }
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getEmoji(condition) {
  const map = {
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Rain: "🌧️",
    Snow: "❄️",
    Clear: "☀️",
    Clouds: "☁️",
    Mist: "🌫️",
    Smoke: "🚬",
    Haze: "🌁",
    Dust: "🌪️",
    Fog: "🌫️",
    Sand: "🏜️",
    Ash: "🌋",
    Squall: "💨",
    Tornado: "🌪️",
  };
  return map[condition] || "🌍";
}

export default weather;
