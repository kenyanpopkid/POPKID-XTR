import config from '../../config.cjs';

const createVCF = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd !== "vcf") return;

  if (!m.isGroup) {
    return m.reply("❌ This command only works in *group chats*.");
  }

  await m.React('⏳');

  try {
    const metadata = await sock.groupMetadata(m.from);
    const participants = metadata.participants;

    let vcfContent = '';
    let unnamedCounter = 1;

    for (const participant of participants) {
      const jid = participant.id;
      const waid = jid.split('@')[0];

      // Get display name or fallback
      let name = await sock.getName(jid);
      if (!name || name.trim() === '') {
        name = `Unnamed Contact ${unnamedCounter++}`;
      }

      vcfContent += `BEGIN:VCARD\nVERSION:3.0\n`;
      vcfContent += `FN:${name}\n`;
      vcfContent += `TEL;type=CELL;waid=${waid}:+${waid}\n`;
      vcfContent += `END:VCARD\n`;
    }

    if (!vcfContent) {
      return m.reply("⚠️ No contacts found to export.");
    }

    await sock.sendMessage(
      m.from,
      {
        document: Buffer.from(vcfContent, 'utf-8'),
        mimetype: 'text/vcard',
        fileName: `group_contacts_${Date.now()}.vcf`,
        caption: `📇 *VCF File Created!*\nAll ${participants.length} contacts saved.`,
      },
      { quoted: m }
    );

    await m.React('✅');

  } catch (err) {
    console.error("❌ Error generating VCF:", err);
    await m.reply("⚠️ Failed to generate VCF. Please try again later.");
    await m.React('❌');
  }
};

export default createVCF;
