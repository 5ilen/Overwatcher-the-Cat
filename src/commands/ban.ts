import { Client, Message } from 'discord.js';
import { hasManageRolesPermission, handleNoPermission, logAction, safeSend } from '../utils';

export async function handleBanCommand(client: Client, message: Message) {
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

  if (!member.bannable) {
    await safeSend(message.channel, `Я не могу забанить пользователя <@${member.id}>.`);
    return;
  }

  const args = message.content.trim().split(/\s+/);
  const reasonIndex = args.findIndex(arg => arg.startsWith('<@')) + 1;
  const reason = reasonIndex > 0 && reasonIndex < args.length ? args.slice(reasonIndex).join(' ') : 'Причина не указана';

  try {
    await member.ban({ reason });
    await safeSend(message.channel, `<@${member.id}> получил банчик. Причина: ${reason}`);
    await logAction(message, `<@${message.author.id}> дал банчик <@${member.id}>. Причина: ${reason}`);
  } catch (error) {
    console.error('Ошибка при бане:', error);
    await safeSend(message.channel, 'Произошла ошибка при попытке бана.');
  }
}
