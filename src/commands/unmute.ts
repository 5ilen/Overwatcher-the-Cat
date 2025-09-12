import { Client, Message } from 'discord.js';
import { hasManageRolesPermission, handleNoPermission, logAction, safeSend } from '../utils';
import { ROLE_IDS } from '../constants';

const muteRoleId = ROLE_IDS.mute;

export async function handleUnmuteCommand(client: Client, message: Message) {
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

  const muteRole = message.guild.roles.cache.get(muteRoleId);
  if (!muteRole) {
    await safeSend(message.channel, 'Роль мута не найдена.');
    return;
  }

  if (!member.roles.cache.has(muteRoleId)) {
    await safeSend(message.channel, `<@${member.id}> не имеет роли мута.`);
    return;
  }

  try {
    await member.roles.remove(muteRole);
    await safeSend(message.channel, `<@${member.id}> получил размутик ура!`);
    await logAction(message, `<@${message.author.id}> снял мутик <@${member.id}>`);
  } catch (error) {
    console.error('Ошибка при снятии мута:', error);
    await safeSend(message.channel, 'Произошла ошибка при снятии мута.');
  }
}
