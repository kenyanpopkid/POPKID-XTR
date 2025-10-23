import config from '../../config.cjs';

const ping = async (message, sock) => {
  const prefix = config.PREFIX;

  const command = message.body.startsWith(prefix)
    ? message.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : '';

  if (command === "ping") {
    const startTime = Date.now();
    await sock.sendPresenceUpdate("composing", message.from);
    const endTime = Date.now();
    const pingSpeed = (endTime - startTime).toFixed(2);

    // 🌸 Fancy Compact Flowery Box
    function createFloweryBox(lines) {
      const maxLength = Math.max(...lines.map(line => line.length));
      const top = `✿${"═".repeat(maxLength + 2)}✿`;
      const bottom = `✿${"═".repeat(maxLength + 2)}✿`;
      const middle = lines.map(line => `❀ ${line.padEnd(maxLength, " ")} ❀`);
      return [top, ...middle, bottom].join("\n");
    }

    // 🌸 Status check
    const status = pingSpeed < 200 ? "🌸 Excellent"
                 : pingSpeed < 500 ? "🌼 Fair"
                 : "🥀 Slow";

    // 🌸 Compact lines
    const pingLines = [
      "🌺 *Popkid XMD* 🌺",
      `🏓 Ping: ${pingSpeed} ms`,
      `📡 Status: ${status}`,
      "🌷 Always Fast ✨"
    ];

    const pingText = createFloweryBox(pingLines);

    // Buttons
    const buttons = [
      { buttonId: `${prefix}uptime`, buttonText: { displayText: '⏳ UPTIME' }, type: 1 },
      { buttonId: `${prefix}menu`, buttonText: { displayText: '📜 MENU' }, type: 1 },
      { buttonId: `${prefix}owner`, buttonText: { displayText: '👑 OWNER' }, type: 1 }
    ];

    // Newsletter branding
    const newsletterInfo = {
      newsletterJid: '120363420342566562@newsletter',
      newsletterName: "Popkid XMD",
      serverMessageId: -1
    };

    // External preview
    const externalPreview = {
      title: "⚡ Popkid XMD Bot",
      body: "Fancy Flowery Ping Test",
      thumbnailUrl: "https://i.ibb.co/zhWGyVZL/file-00000000c6b0624388a556a5aa392449.png",
      sourceUrl: 'https://whatsapp.com/channel/0029VbB6d0KKAwEdvcgqrH26',
      mediaType: 1,
      renderLargerThumbnail: false
    };

    const contextInfo = {
      isForwarded: true,
      forwardedNewsletterMessageInfo: newsletterInfo,
      forwardingScore: 999,
      externalAdReply: externalPreview
    };

    await message.React('✅');

    // Send fancy compact result
    await sock.sendMessage(
      message.from,
      {
        text: pingText,
        footer: "🌸 Powered by Popkid-XMD 🌸",
        buttons,
        headerType: 4,
        contextInfo
      },
      { quoted: message }
    );
  }
};

export default ping;
