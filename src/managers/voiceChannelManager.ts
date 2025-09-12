import { Client, Message, PermissionsBitField, GuildMember, VoiceBasedChannel, TextChannel } from 'discord.js';
import { safeSend } from '../utils';
import { CHANNEL_IDS } from '../constants';
import { userVoiceChannels } from '../state';
import { ensureInstructionEmbed } from '../embeds/embeds';

const controlTextChannelId = CHANNEL_IDS.voiceControlTextChannel;

function isAdminOrMod(member: GuildMember): boolean {
  return member.permissions.has(PermissionsBitField.Flags.Administrator) ||
    member.permissions.has(PermissionsBitField.Flags.KickMembers) ||
    member.permissions.has(PermissionsBitField.Flags.BanMembers) ||
    member.roles.cache.some(role => role.name.toLowerCase().includes('модер'));
}

function deleteMessageAfter(message: Message, delayMs = 30_000) {
  setTimeout(() => {
    message.delete().catch(() => {});
  }, delayMs);
}

let instructionMessageId: string | null = null;

export function setupVoiceChannelManager(client: Client) {
  client.once('ready', async () => {
    instructionMessageId = await ensureInstructionEmbed(client);
  });
  client.on('messageCreate', async (message: Message) => {
    try {

      if (message.author.bot) return;

      if (message.channel.id !== controlTextChannelId) return;

      if (message.id === instructionMessageId) return;

      await message.delete().catch(() => {});

      if (!message.guild) return;

      const creatorId = message.author.id;
      const voiceChannelId = userVoiceChannels.get(creatorId);

      const args = message.content.trim().split(/\s+/);
      const command = args.shift()?.toLowerCase();

      if (!voiceChannelId) {
        const reply = await safeSend(
          message.channel,
          `<@${creatorId}>, ты не создал ни одного голосового канала, зайди в канал <#${CHANNEL_IDS.voiceCreateChannel}>, чтобы создать приватный войсчат.`
        );
        if (reply) deleteMessageAfter(reply);
        return;
      }

      const voiceChannel = message.guild.channels.cache.get(voiceChannelId) as VoiceBasedChannel | undefined;
      if (!voiceChannel || !voiceChannel.isVoiceBased()) {
        const reply = await safeSend(message.channel, 'Ваш голосовой канал не найден.');
        if (reply) deleteMessageAfter(reply);
        return;
      }

      if (command === '!кик') {
        const mention = message.mentions.members?.first();
        if (!mention) {
          const reply = await safeSend(message.channel, `<@${creatorId}>, укажите пользователя для кика.`);
          if (reply) deleteMessageAfter(reply);
          return;
        }
        if (!voiceChannel.members.has(mention.id)) {
          const reply = await safeSend(message.channel, `<@${creatorId}>, пользователь не в вашем канале.`);
          if (reply) deleteMessageAfter(reply);
          return;
        }
        if (isAdminOrMod(mention)) {
          const reply = await safeSend(message.channel, `<@${creatorId}>, недостаточно прав, чтобы выгнать <@${mention.id}>.`);
          if (reply) deleteMessageAfter(reply);
          return;
        }

        try {
          await mention.voice.disconnect();
          const reply = await safeSend(
            message.channel,
            `@${message.author.username} выгнал <@${mention.id}> из канала <#${voiceChannel.id}>`
          );
          if (reply) deleteMessageAfter(reply);
        } catch {
          const reply = await safeSend(message.channel, 'Ошибка при кике пользователя.');
          if (reply) deleteMessageAfter(reply);
        }

      } else if (command === '!лимит') {
        const limitStr = args[0];
        if (!limitStr || isNaN(Number(limitStr))) {
          const reply = await safeSend(message.channel, `<@${creatorId}>, укажите число для лимита.`);
          if (reply) deleteMessageAfter(reply);
          return;
        }
        let limit = Number(limitStr);
        if (limit < 0) limit = 0;

        try {
          await voiceChannel.edit({ userLimit: limit });
          const reply = await safeSend(
            message.channel,
            `В канале <#${voiceChannel.id}> установлен лимит в ${limit === 0 ? 'без ограничения' : limit} участников.`
          );
          if (reply) deleteMessageAfter(reply);
        } catch {
          const reply = await safeSend(message.channel, 'Не удалось изменить лимит.');
          if (reply) deleteMessageAfter(reply);
        }

      } else if (command === '!имя') {
        const newName = args.join(' ');
        if (!newName) {
          const reply = await safeSend(message.channel, `<@${creatorId}>, укажите новое имя для канала.`);
          if (reply) deleteMessageAfter(reply);
          return;
        }

        try {
          const oldName = voiceChannel.name;
          await voiceChannel.edit({ name: newName });
          const reply = await safeSend(
            message.channel,
            `Название канала <#${voiceChannel.id}> изменено на "${newName}".`
          );
          if (reply) deleteMessageAfter(reply);
        } catch {
          const reply = await safeSend(message.channel, 'Не удалось изменить название.');
          if (reply) deleteMessageAfter(reply);
        }

      } else {          
        const reply = await safeSend(
          message.channel,
          `<@${creatorId}>, неправильная команда, посмотри пост выше со списком всех команд.`
        );
        if (reply) deleteMessageAfter(reply);
      }
    } catch (error) {
      console.error('Ошибка в обработчике команд управления голосовым каналом:', error);
    }
  });
}