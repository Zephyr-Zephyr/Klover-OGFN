# 🌙 Lunaris Bot

A modern Discord bot with ticket, welcome, and giveaway systems, built with discord.js.

## ✨ Features

* 🎫 **Ticket System** – Users can create support tickets
* 👋 **Welcome System** – Automatic welcome messages for new members
* 🎉 **Giveaway System** – Easy giveaway management
* 🚀 **Railway Ready** – Optimized for deployment on Railway
* 📦 **GitHub Integration** – Automatic deployment via GitHub Actions
* 💾 **Database Support** – Optional MongoDB integration available

---

# 🚀 Quick Start

## Requirements

* Node.js 18+
* Discord Bot Token
* GitHub Account (for CI/CD)
* Railway Account (for hosting)

## Installation

### Clone or set up the repository:

```bash
cd "d:\New Brave\Lunaris Ticket Bot\New Bot"
npm install
```

### Create a `.env` file:

```bash
cp .env.example .env
```

Then enter your values:

```env
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id (optional)
```

### Test locally:

```bash
npm run dev
```

---

# 📖 Commands

## Ticket Commands

* `/ticket setup <channel>` – Set up the ticket system
* `/ticket close` – Close the current ticket

## Welcome Commands

* `/welcome set <channel> <message>` – Configure the welcome message
* `/welcome test` – Test the welcome message

## Giveaway Commands

* `/giveaway start <prize> <duration> <winners>` – Start a giveaway

## Other Commands

* `/ping` – Display bot latency

---

# 🚀 Deployment on Railway

## Step 1: Create a Railway Account

1. Go to https://railway.app
2. Sign in with GitHub
3. Create a new project

## Step 2: Add a GitHub Secret

1. Open your GitHub repository
2. Go to **Settings → Secrets and variables → Actions**
3. Create a new secret called: `RAILWAY_TOKEN`
4. Copy the token from your Railway dashboard

## Step 3: Configure Environment Variables on Railway

In the Railway Dashboard, open **Variables** and add all variables from your `.env` file:

* `DISCORD_TOKEN`
* `CLIENT_ID`
* etc.

## Step 4: Deploy

```bash
git push main
```

GitHub Actions will automatically deploy the bot!

---

# 🔗 GitHub Integration

## Automatic Deployment

The repository is configured with GitHub Actions:

* ✅ Automatic deployment on pushes to the `main` branch
* ✅ Code quality checks before deployment
* ✅ Security audits for dependencies

### View Workflows

Go to:

**Actions → Workflow Runs**

---

# 📦 Extending the Bot

## Add a New Command

Create a new file in `src/commands/`:

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('Description'),

  async execute(interaction) {
    await interaction.reply('Response');
  },
};
```

## Add a New Event

Create a new file in `src/events/`:

```js
module.exports = {
  name: 'eventName',
  once: false, // true if the event should only be triggered once
  execute(event, client) {
    console.log('Event triggered!');
  },
};
```

---

# 📝 Project Structure

```text
├── index.js                 # Main file
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── Dockerfile               # Docker configuration
├── Procfile                 # Railway/Heroku configuration
├── railway.json             # Railway specifications
├── README.md                # This file
├── .github/
│   └── workflows/           # GitHub Actions
│       ├── deploy.yml       # Auto deployment
│       └── lint.yml         # Code quality
└── src/
    ├── commands/           # Slash commands
    │   ├── ping.js
    │   ├── ticket.js
    │   ├── giveaway.js
    │   └── welcome.js
    ├── events/             # Event handlers
    │   ├── ready.js
    │   ├── interactionCreate.js
    │   └── guildMemberAdd.js
    ├── models/             # Database models (optional)
    └── utils/              # Utility functions
```

---

# 🐛 Troubleshooting

## Bot Does Not Appear Online

* ✅ Verify `DISCORD_TOKEN` in your `.env`
* ✅ Check bot permissions
* ✅ Enable required intents

## Commands Are Not Showing

* ✅ Restart the bot
* ✅ Clear cache: `npm run dev`
* ✅ Verify the Guild ID

## Deployment Failed

* ✅ Verify the `RAILWAY_TOKEN` secret
* ✅ Check GitHub Actions logs
* ✅ Review Railway logs

---

# 📚 Additional Resources

* discord.js Documentation
* Discord Developer Portal
* Railway Documentation
* GitHub Actions Documentation

---

# 📄 License

MIT License – see the `LICENSE` file for details.

---

# 👥 Support

If you have questions or encounter issues:

* Create a GitHub Issue
* Join the Discord Support Server

Made with ❤️ for Discord communities.
