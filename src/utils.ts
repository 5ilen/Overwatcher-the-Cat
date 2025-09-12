import { Channel, TextChannel, NewsChannel, ThreadChannel, Message, PermissionsBitField, MessagePayload, MessageCreateOptions } from 'discord.js';
import { CHANNEL_IDS, ROLE_IDS } from './constants';

const logChannelId = CHANNEL_IDS.log;

const userCooldowns = new Map<string, number>();

export function hasManageRolesPermission(message: Message) {
  return message.member?.permissions.has(PermissionsBitField.Flags.ManageRoles) ?? false;
}

export async function safeSend(channel: Channel, content: string | MessagePayload | MessageCreateOptions) {
  if (
    channel instanceof TextChannel ||
    channel instanceof NewsChannel ||
    channel instanceof ThreadChannel
  ) {
    return channel.send(content);
  }
  return null;
}

export async function logAction(message: Message, text: string) {
  const logChannel = message.guild?.channels.cache.get(logChannelId) as TextChannel;
  if (!logChannel) return;
  await logChannel.send(text);
}

export async function handleNoPermission(message: Message): Promise<boolean> {
  const now = Date.now();
  const userId = message.author.id;

  if (userCooldowns.has(userId) && now - userCooldowns.get(userId)! < 3600000) {
    await message.delete().catch(() => {});
    return true;
  }

  await message.delete().catch(() => {});
  const warnMsg = await safeSend(message.channel, `${message.author}, у тебя нет прав для применения этой команды.`);
  if (warnMsg) {
    setTimeout(() => warnMsg.delete().catch(() => {}), 10000);
  }
  userCooldowns.set(userId, now);
  return true;
}
