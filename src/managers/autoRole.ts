import { Client, GuildMember } from 'discord.js';
import { ROLE_IDS } from '../constants';

const autoRoleId = ROLE_IDS.autoRole;

export function setupAutoRole(client: Client) {
  client.on('guildMemberAdd', async (member: GuildMember) => {
    try {
      await member.roles.add(autoRoleId);
      console.log(`Роль автоматически выдана пользователю ${member.user.tag}`);
    } catch (error) {
      console.error(`Не удалось выдать роль пользователю ${member.user.tag}:`, error);
    }
  });
}
