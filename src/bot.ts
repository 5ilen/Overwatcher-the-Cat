import * as dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits, Message} from 'discord.js';
import { handleMuteCommand } from './commands/mute';
import { handleUnmuteCommand } from './commands/unmute';
import { handleBanCommand } from './commands/ban';
import { handleSpamBanCommand } from './commands/spamBan';
import { handleTrollCommand } from './commands/troll';
import { handleClownCommand, attachClownReactionHandler } from './commands/clown';
import { setupAutoRole } from './managers/autoRole';
import { setupVoicePrivates } from './managers/voicePrivates';
import { setupVoiceChannelManager } from './managers/voiceChannelManager';
import { setupImageCommands } from './embeds/image';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });
const prefix = "!";

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

attachClownReactionHandler(client);
setupAutoRole(client);
setupVoicePrivates(client);
setupVoiceChannelManager(client);
setupImageCommands(client);

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();

  if (command === 'мутик') {
    await handleMuteCommand(client, message);
  } else if (command === 'анмутик') {
    await handleUnmuteCommand(client, message);
  } else if (command === 'банчик') {
    await handleBanCommand(client, message);
  } else if (command === 'спамбанчик') {
    await handleSpamBanCommand(client, message);
  } else if (command === 'тролль') {
    await handleTrollCommand(client, message);
  } else if (command === 'тролль') {
    await handleTrollCommand(client, message);
  } else if (command === 'клоун') {
    await handleClownCommand(client, message);
  }
});

client.login(process.env.DISCORD_TOKEN);
