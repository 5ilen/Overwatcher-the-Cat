import { Client, Message } from 'discord.js';
import { hasManageRolesPermission, handleNoPermission, logAction, safeSend } from '../utils';
import { ROLE_IDS } from '../constants';

const clownRoleId = ROLE_IDS.clown;

const guildId = '1405267732106055783';
 
const clownEmoji = '🤡';

export async function handleClownCommand(client: Client, message: Message) {
  if (!message.guild) return;

  if (!hasManageRolesPermission(message)) {
    if (await handleNoPermission(message)) return;
  }

  await message.delete().catch(() => {});

  const member = message.mentions.members?.first();
  if (!member) {
    await safeSend(message.channel, 'Пользователь не указан.');
    return;
  }

  const clownRole = message.guild.roles.cache.get(clownRoleId);
  if (!clownRole) {
    await safeSend(message.channel, 'Роль клоуна не найдена.');
    return;
  }

  if (member.roles.cache.has(clownRoleId)) {
    await safeSend(message.channel, `<@${member.id}> уже с ролью клоуна.`);
    return;
  }

  try {
    await member.roles.add(clownRole);
    await safeSend(message.channel, `<@${member.id}> получил роль клоуна!`);
    await logAction(message, `<@${message.author.id}> дал роль клоуна <@${member.id}>`);
  } catch (error) {
    console.error('Ошибка при выдаче роли клоуна:', error);
    await safeSend(message.channel, 'Произошла ошибка при выдаче роли клоуна.');
  }
}

export function attachClownReactionHandler(client: Client) {
  client.on('messageCreate', async (message) => {
    if (!message.guild || message.author.bot) return;

    if (message.guild.id !== guildId) return;

    try {
      const member = await message.guild.members.fetch(message.author.id);
      if (member.roles.cache.has(clownRoleId)) {
        await message.react(clownEmoji).catch(() => {});
      }
    } catch {

    }
  });
}