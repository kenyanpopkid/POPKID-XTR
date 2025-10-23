import { serialize } from '../../lib/Serializer.js';
import config from '../../config.cjs';

const antilinkSettings = {}; // { groupId: { mode: 'off' | 'delete' | 'warn' | 'kick', warnings: {} } }

export const handleAntilink = async (m, sock, logger, _isBotAdmins, _isAdmins, isCreator) => {
    const PREFIX = /^[\\/!#.]/;
    const isCOMMAND = (body) => PREFIX.test(body);
    const prefixMatch = isCOMMAND(m.body) ? m.body.match(PREFIX) : null;
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    let isBotAdmins = false;
    let isAdmins = false;

    if (m.isGroup) {
        try {
            const metadata = await sock.groupMetadata(m.from);
            const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);
            const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            isBotAdmins = admins.includes(botNumber);
            isAdmins = admins.includes(m.sender);
        } catch (err) {
            console.error('Group metadata error:', err);
        }
    }

    if (!antilinkSettings[m.from]) {
        antilinkSettings[m.from] = { mode: 'off', warnings: {} };
    }

    if (cmd === 'antilink') {
        if (!m.isGroup) return await sock.sendMessage(m.from, {
            text: `🚫 *Group Only*\n\n🛡️ This command works only in groups.`,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363290715861418@newsletter",
                newsletterName: "Popkid-Xmd",
                serverMessageId: "",
            }
        }, { quoted: m });

        if (!isBotAdmins) return await sock.sendMessage(m.from, {
            text: `❌ *Bot Is Not Admin*\n\n🔧 Please make me an *admin* to use Antilink features.`,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363290715861418@newsletter",
                newsletterName: "Popkid-Xmd",
                serverMessageId: "",
            }
        }, { quoted: m });

        if (!isAdmins && !isCreator) return await sock.sendMessage(m.from, {
            text: `🔒 *Permission Denied*\n\nOnly *group admins* can configure Antilink.`,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363290715861418@newsletter",
                newsletterName: "Popkid-Xmd",
                serverMessageId: "",
            }
        }, { quoted: m });

        const args = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();
        const validModes = ['off', 'delete', 'warn', 'kick'];

        if (!validModes.includes(args)) {
            return await sock.sendMessage(m.from, {
                text:
`🛡️ *Antilink Configuration*

📍 *Current Mode:* ${antilinkSettings[m.from].mode.toUpperCase()}

📌 *Available Modes:*
   ├ ${prefix}antilink off     ❎ Disable
   ├ ${prefix}antilink delete  🗑️ Delete Only
   ├ ${prefix}antilink warn    ⚠️ Warn Users
   └ ${prefix}antilink kick    🚫 Kick After Warnings`,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363290715861418@newsletter",
                    newsletterName: "Popkid-Xmd",
                    serverMessageId: "",
                }
            }, { quoted: m });
        }

        antilinkSettings[m.from].mode = args;
        return await sock.sendMessage(m.from, {
            text: `✅ *Antilink Mode Updated!*\n\n🛡️ New Mode: *${args.toUpperCase()}* successfully set.`,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363290715861418@newsletter",
                newsletterName: "Popkid-Xmd",
                serverMessageId: "",
            }
        }, { quoted: m });
    }

    // link detection
    const body = m.body || '';
    if (m.isGroup && /https?:\/\/[^\s]+/.test(body)) {
        const mode = antilinkSettings[m.from].mode;
        if (mode === 'off' || !isBotAdmins) return;

        const gclink = `https://chat.whatsapp.com/${await sock.groupInviteCode(m.from)}`;
        const isGroupLink = new RegExp(gclink, 'i').test(body);

        if (isGroupLink) return;
        if (isAdmins || isCreator) return;

        await sock.sendMessage(m.from, { delete: m.key });

        if (mode === 'delete') {
            return await sock.sendMessage(m.from, {
                text: `🗑️ *Link Message Deleted!*\n\nNo further actions taken.`,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363290715861418@newsletter",
                    newsletterName: "Popkid-Xmd",
                    serverMessageId: "",
                }
            });
        }

        if (!antilinkSettings[m.from].warnings[m.sender]) {
            antilinkSettings[m.from].warnings[m.sender] = 0;
        }
        antilinkSettings[m.from].warnings[m.sender] += 1;

        const userWarnings = antilinkSettings[m.from].warnings[m.sender];
        const maxWarnings = config.ANTILINK_WARNINGS || 3;

        if (mode === 'warn') {
            return await sock.sendMessage(m.from, {
                text: `⚠️ *Warning ${userWarnings}/${maxWarnings}*\n\n@${m.sender.split('@')[0]}, sharing links is *not allowed!*`,
                mentions: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363290715861418@newsletter",
                    newsletterName: "Popkid-Xmd",
                    serverMessageId: "",
                }
            }, { quoted: m });
        }

        if (mode === 'kick') {
            if (userWarnings >= maxWarnings) {
                await sock.groupParticipantsUpdate(m.from, [m.sender], 'remove');
                delete antilinkSettings[m.from].warnings[m.sender];
                return await sock.sendMessage(m.from, {
                    text: `🚫 *@${m.sender.split('@')[0]}* was removed after *${maxWarnings}* warnings.`,
                    mentions: [m.sender],
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363290715861418@newsletter",
                        newsletterName: "Popkid-Xmd",
                        serverMessageId: "",
                    }
                });
            } else {
                return await sock.sendMessage(m.from, {
                    text: `⚠️ *Warning ${userWarnings}/${maxWarnings}*\n\n@${m.sender.split('@')[0]}, this is a final warning.`,
                    mentions: [m.sender],
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363290715861418@newsletter",
                        newsletterName: "Popkid-Xmd",
                        serverMessageId: "",
                    }
                }, { quoted: m });
            }
        }
    }
};
