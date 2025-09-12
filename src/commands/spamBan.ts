import { Client, Message, TextChannel } from 'discord.js';
import { hasManageRolesPermission, handleNoPermission, logAction, safeSend } from '../utils';

const MS_24H = 24 * 60 * 60 * 1000;

export async function handleSpamBanCommand(client: Client, message: Message) {
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

  try {
    const channels = message.guild.channels.cache.filter(c => c.isTextBased() && !c.isThread()) as Map<string, TextChannel>;

    for (const [, channel] of channels) {
      const fetchedMessages = await channel.messages.fetch({ limit: 100 });
      const toDelete = fetchedMessages.filter(msg =>
        msg.author.id === member.id && (Date.now() - msg.createdTimestamp) <= MS_24H
      );
      if (toDelete.size > 0) {
        await channel.bulkDelete(toDelete, true).catch(() => {});
      }
    }

    await member.ban({ reason: 'Спам бан (удаление сообщений за 24 часа)' });

    await safeSend(message.channel, `<@${member.id}> получил спамбанчик (удалены сообщения за 24 часа, и бан).`);
    await logAction(message, `<@${message.author.id}> дал спамбанчик <@${member.id}>`);

  } catch (error) {
    console.error('Ошибка при спамбане:', error);
    await safeSend(message.channel, 'Произошла ошибка при выполнении спамбана.');
  }
}
