import axios from 'axios';
import config from '../../config.cjs';

const githubStalk = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const body = m.body.trim();
    const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(/\s+/)[0].toLowerCase() : '';
    const text = body.slice(prefix.length + cmd.length).trim();
    const args = text.split(' ');

    const validCommands = ['githubstalk', 'ghstalk'];
    if (!validCommands.includes(cmd)) return;

    if (!args[0]) return m.reply('⚠️ Please provide a GitHub username.\n💡 Example: `.ghstalk mrpopkid`');

    const username = args[0];
    try {
      // Fetch user profile
      const { data: user } = await axios.get(`https://api.github.com/users/${username}`);

      if (!user?.login) return m.reply(`❌ GitHub user *${username}* not found.`);

      // Format dates nicely
      const formatDate = (date) => new Date(date).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
      });

      // Build profile card
      let caption = `🌟 *GitHub Profile — @${user.login}*\n\n`;
      caption += `👤 *Name:* ${user.name || 'N/A'}\n`;
      caption += `💬 *Bio:* ${user.bio || 'N/A'}\n`;
      caption += `🆔 *ID:* ${user.id}\n`;
      caption += `🏢 *Company:* ${user.company || 'N/A'}\n`;
      caption += `📍 *Location:* ${user.location || 'N/A'}\n`;
      caption += `📧 *Email:* ${user.email || 'N/A'}\n`;
      caption += `🔗 *Blog:* ${user.blog || 'N/A'}\n`;
      caption += `🔗 *Profile:* ${user.html_url}\n`;
      caption += `📦 *Public Repos:* ${user.public_repos}\n`;
      caption += `📜 *Public Gists:* ${user.public_gists}\n`;
      caption += `👥 *Followers:* ${user.followers}\n`;
      caption += `➡️ *Following:* ${user.following}\n`;
      caption += `📅 *Joined:* ${formatDate(user.created_at)}\n`;
      caption += `♻️ *Updated:* ${formatDate(user.updated_at)}\n`;

      // Fetch top repos
      const { data: repos } = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=5&sort=stargazers_count&direction=desc`
      );

      if (repos.length > 0) {
        caption += `\n📚 *Top Starred Repositories*\n`;
        repos.forEach((repo, index) => {
          caption += `\n${index + 1}. *${repo.name}* — ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks}\n🔗 ${repo.html_url}\n📖 ${repo.description || 'No description'}\n`;
        });
      } else {
        caption += `\n📚 No public repositories found.`;
      }

      // Send profile with avatar
      await gss.sendMessage(
        m.from,
        { image: { url: user.avatar_url }, caption },
        { quoted: m }
      );

    } catch (err) {
      console.error('❌ GitHub API Error:', err.message);
      m.reply('⚠️ Failed to fetch GitHub data. Please try again later.');
    }
  } catch (err) {
    console.error('❌ Command Error:', err.message);
    m.reply('⚠️ An error occurred while processing your request.');
  }
};

export default githubStalk;
