import { Client, Message } from 'discord.js';
import { hasManageRolesPermission, handleNoPermission, logAction, safeSend } from '../utils';
import { ROLE_IDS } from '../constants';

const trollRoleId = ROLE_IDS.mediaBan;

export async function handleMediaBanCommand(client: Client, message: Message) {
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

  const trollRole = message.guild.roles.cache.get(trollRoleId);
  if (!trollRole) {
    await safeSend(message.channel, 'Роль медиабана не найдена.');
    return;
  }

  if (member.roles.cache.has(trollRoleId)) {
    await safeSend(message.channel, `<@${member.id}> уже с медиабаном.`);
    return;
  }

  try {
    await member.roles.add(trollRole);
    await safeSend(message.channel, `<@${member.id}> получил медиабан!`);
    await logAction(message, `<@${message.author.id}> дал медиабан <@${member.id}>`);
  } catch (error) {
    console.error('Ошибка при выдаче медиабана:', error);
    await safeSend(message.channel, 'Произошла ошибка при выдаче медиабана.');
  }
}
