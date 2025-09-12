import { Client, Message } from 'discord.js';
import { hasManageRolesPermission, handleNoPermission, logAction, safeSend } from '../utils';
import { ROLE_IDS } from '../constants';

const muteRoleId = ROLE_IDS.mute;

export async function handleMuteCommand(client: Client, message: Message) {
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

  if (member.roles.cache.has(muteRoleId)) {
    await safeSend(message.channel, `<@${member.id}> уже с мутом.`);
    return;
  }

  await member.roles.add(muteRole);
  await safeSend(message.channel, `<@${member.id}> получает мутик на 14 минут 37 секунд`);
  await logAction(message, `<@${message.author.id}> дал мутик <@${member.id}>`);

  setTimeout(async () => {
    const refreshedMember = await message.guild?.members.fetch(member.id);
    if (refreshedMember && refreshedMember.roles.cache.has(muteRoleId)) {
      await refreshedMember.roles.remove(muteRole);
      await safeSend(message.channel, `<@${member.id}> получил размутик ура!`);
      await logAction(message, `<@${message.author.id}> снял мутик <@${member.id}>`);
    }
  }, (14 * 60 + 37) * 1000);
}
