import { Client, VoiceState, ChannelType, VoiceBasedChannel, Guild } from 'discord.js';
import { CHANNEL_IDS } from '../constants';
import { userVoiceChannels } from '../state';

const createVoiceChannelId = CHANNEL_IDS.voiceCreateChannel;

function getMaxBitrate(guild: Guild): number {
  return guild.maximumBitrate ?? 96000;
}

export function setupVoicePrivates(client: Client) {
  const createdChannels = new Set<string>();

  client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
    if (
      newState.channelId === createVoiceChannelId &&
      oldState.channelId !== createVoiceChannelId &&
      newState.member
    ) {
      const guild = newState.guild;
      const user = newState.member.user;

      const createdChannel = await guild.channels.create({
        name: `${user.username} voice chat`,
        type: ChannelType.GuildVoice,
        bitrate: getMaxBitrate(guild),
        parent: newState.channel?.parent ?? null,
      });

      createdChannels.add(createdChannel.id);

      userVoiceChannels.set(user.id, createdChannel.id);

      await newState.member.voice.setChannel(createdChannel);

      setTimeout(async () => {
        const refreshed = await guild.channels.fetch(createdChannel.id).catch(() => null);
        if (
          refreshed &&
          'isVoiceBased' in refreshed &&
          refreshed.isVoiceBased() &&
          (refreshed as VoiceBasedChannel).members.size === 0
        ) {
          await refreshed.delete().catch(() => {});
          createdChannels.delete(createdChannel.id);
          userVoiceChannels.delete(user.id);
        }
      }, 10_000);
    }

    if (
      oldState.channelId &&
      createdChannels.has(oldState.channelId)
    ) {
      const channel = oldState.guild.channels.cache.get(oldState.channelId);
      if (
        channel &&
        'isVoiceBased' in channel &&
        channel.isVoiceBased() &&
        channel.members.size === 0
      ) {
        setTimeout(async () => {
          const refreshed = await oldState.guild.channels.fetch(channel.id).catch(() => null);
          if (
            refreshed &&
            'isVoiceBased' in refreshed &&
            refreshed.isVoiceBased() &&
            (refreshed as VoiceBasedChannel).members.size === 0
          ) {
            await refreshed.delete().catch(() => {});
            createdChannels.delete(channel.id);

            for (const [userId, chanId] of userVoiceChannels.entries()) {
              if (chanId === channel.id) {
                userVoiceChannels.delete(userId);
                break;
              }
            }
          }
        }, 10_000);
      }
    }
  });
}