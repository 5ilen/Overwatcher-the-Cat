import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { CHANNEL_IDS } from '../constants';

export const imageLinks: Record<string, string> = {
  "!аимер": "https://media.discordapp.net/attachments/1410582185592750152/1410582221999443998/9a5f61bd28afd459.png?ex=68b18a91&is=68b03911&hm=c1688cf79612a0fefc7db4bd8332cc25aadbd12c823b6faa70c8bcb54216282b&=&format=webp&quality=lossless",
  "!инпут": "https://media.discordapp.net/attachments/1410582185592750152/1410582234708054188/f968f37b89958d81.png?ex=68b18a94&is=68b03914&hm=18a964c400407899d1caba874f79005cf5d6ae0b8954e37ea6b0b089ba9cc492&=&format=webp&quality=lossless",
  "!научи": "https://media.discordapp.net/attachments/1410582185592750152/1410599392041242744/17b935920e8d9731.png?ex=68b19a8e&is=68b0490e&hm=a5de028a95cdb6e04628d66958e7958ced989612f2271e56669e5ffa71f2830f&=&format=webp&quality=lossless",
  "!въебу": "https://media.discordapp.net/attachments/1410582185592750152/1410599720115638362/image.png?ex=68b19adc&is=68b0495c&hm=a845d15b44ccc99e4b59f7c48d7c0b294c623d6f165dcc37471f5a563e3ad625&=&format=webp&quality=lossless",
  "!ладонь": "https://media.discordapp.net/attachments/1410582185592750152/1410601219902279740/IMG_9716.webp?ex=68b19c42&is=68b04ac2&hm=d2c79ccd831b9c429ebd5b0b249431699d69eb57d7a228a70aeff87a79efc613&=&format=webp",
  "!постирал": "https://media.discordapp.net/attachments/1410582185592750152/1411060422789824683/IMG_20250820_181600_188.jpg?ex=68be7cad&is=68bd2b2d&hm=39bb2efe63fc0c5ea6a4c3a4b473005bb16aec539d15baac2c5f44b8517892df&=&format=webp&width=720&height=960",
  "!пинг": "https://media.discordapp.net/attachments/1410582185592750152/1411006473663942859/4918359e8a099529.gif?ex=68b4672e&is=68b315ae&hm=c43afcb891830523aeb5ed04b8ecbf8aee453414a4e87f8f3b0d2690b8412bb6&=",
  "!помеха": "https://media.discordapp.net/attachments/1410582185592750152/1412042659090006076/a203387e585ce389.png?ex=68bec3b4&is=68bd7234&hm=3dcc32d4e2f7a5c09383dbb6f866f76e4092f6452e969092f3d4092876f039f1&=&format=webp&quality=lossless",
  "!лень": "https://media.discordapp.net/attachments/1410582185592750152/1410600368957816863/ebc48d4a1e9406c3.png?ex=68beca77&is=68bd78f7&hm=27e315e5d656458a5a2801a9629af3e4a56e5ea816307dd38227be2208a9d636&=&format=webp&quality=lossless",
};

export function createImageEmbed(command: string) {
  const url = imageLinks[command];
  if (!url) return null;
  return new EmbedBuilder()
    .setTitle(`Команда ${command}`)
    .setImage(url)
    .setColor(0x60519b);
}

export async function ensureInstructionEmbed(client: Client): Promise<string | null> {
  const controlChannel = client.channels.cache.get(CHANNEL_IDS.voiceControlTextChannel) as TextChannel;
  if (!controlChannel) {
    console.error('Канал управления не найден');
    return null;
  }

  const messages = await controlChannel.messages.fetch({ limit: 50 });
  let instructionMessage = messages.find(msg =>
    msg.author.id === client.user?.id &&
    msg.embeds.length > 0 &&
    msg.embeds[0]?.title === 'Приватные войсчаты'
  );

  const embed = new EmbedBuilder()
    .setTitle('Приватные войсчаты')
    .setDescription(
      `Зайди в канал <#${CHANNEL_IDS.voiceCreateChannel}>, чтобы создать комнату.\n\n` +
      `**Команды:**\n` +
      `!имя новое_название - переименовать свой канал\n` +
      `!лимит число - установить ограничение на количество участников (0 = нет лимита)\n` +
      `!кик @пользователь - выгнать пользователя из своего канала`
    )
    .setColor(0x60519b);

  if (!instructionMessage) {
    instructionMessage = await controlChannel.send({ embeds: [embed] });
    console.log('Создано сообщение с инструкциями в канале управления');
  } else {
    await instructionMessage.edit({ embeds: [embed] });
  }

  return instructionMessage.id;
}