import config from '../../config.cjs';

const add = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['add', 'invite', 'bring'];
    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) return m.reply("*gяσυρ ¢σммαη∂*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;

    const isBotAdmin = participants.find(p => p.id === botNumber)?.admin;
    if (!isBotAdmin) return m.reply("*αм ησт α∂мιη ιη тнιѕ ι∂ισт gяσυρ*");

    const sender = m.sender;
    const isOwner = sender === config.OWNER_NUMBER + '@s.whatsapp.net';
    const isSudo = config.SUDO?.includes(sender);
    const isGroupAdmin = participants.find(p => p.id === sender)?.admin;

    if (!isOwner && !isSudo && !isGroupAdmin) {
      return m.reply("*α∂мιη яυℓє ι∂ισт*");
    }

    const number = text.replace(/[^0-9]/g, '');
    if (!number) return m.reply("*ρяσνι∂є α ναℓι∂ иυмвєя тσ α∂∂*");

    const userId = number + '@s.whatsapp.net';

    await gss.groupParticipantsUpdate(m.from, [userId], 'add')
      .then(() => {
        m.reply(`*User @${number} added successfully to the group ${groupMetadata.subject}.*`);
      })
      .catch((e) => {
        console.error('Add Error:', e);
        m.reply("*¢συℓ∂ иσт α∂∂ тнє υѕєя. мαувє нє/ѕнє нαѕ ρяινα¢у σи σя ℓєƒт тσσ мαиу тιмєѕ.*");
      });
  } catch (error) {
    console.error('Error:', error);
    m.reply('An error occurred while processing the command.');
  }
};

export default add;
