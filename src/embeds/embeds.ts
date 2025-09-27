import { Client, TextChannel, EmbedBuilder, Colors, Message } from 'discord.js';
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

export function createImageEmbed(command: string): EmbedBuilder | null {
  const url = imageLinks[command];
  if (!url) return null;
  return new EmbedBuilder()
    .setTitle(`Команда ${command}`)
    .setImage(url)
    .setColor(0x60519b);
}

// ---------- Инструкция по приватным войсам ----------
const VOICE_CONTROL_TEXT_CHANNEL_ID = CHANNEL_IDS.voiceControlTextChannel
const VOICE_CREATE_CHANNEL_ID = CHANNEL_IDS.voiceCreateChannel

export async function ensureInstructionEmbed(client: Client): Promise<string | null> {
  const controlChannel = client.channels.cache.get(VOICE_CONTROL_TEXT_CHANNEL_ID) as TextChannel | undefined;
  if (!controlChannel) {
    console.error('Канал управления не найден');
    return null;
  }

  const messages = await controlChannel.messages.fetch({ limit: 50 });
  let instructionMessage = messages.find(
    (msg: Message) =>
      msg.author.id === client.user?.id &&
      msg.embeds.length > 0 &&
      msg.embeds[0]?.title === 'Приватные войсчаты'
  );

  const embed = new EmbedBuilder()
    .setTitle('Приватные войсчаты')
    .setDescription(
      [
        `Зайди в канал <#${VOICE_CREATE_CHANNEL_ID}>, чтобы создать комнату.`,
        ``,
        `Команды владельца канала:`,
        `• !имя новое_название — переименовать свой канал`,
        `• !лимит число — установить ограничение на количество участников (0 — без лимита)`,
        `• !кик @пользователь — выгнать пользователя из своего канала`,
      ].join('\n')
    )
    .setColor(0x60519b);

  if (!instructionMessage) {
    const sent = await controlChannel.send({ embeds: [embed] });
    return sent.id;
  } else {
    await instructionMessage.edit({ embeds: [embed] });
    return instructionMessage.id;
  }
}

// ---------- Правила и роли ----------
const RULES_CHANNEL_ID = '1405920136464171060';

// Роли-идентификаторы
const OWNER_ROLE = '1405918254693617724';
const MOD_ROLE = '1408798930732449852';

const EXPERT_ROLES = [
  '1409773861783994415',
  '1409774111424778303',
  '1409774165308739644',
  '1409774040662544415',
];

const GAME_ROLE_PRO = '1411792485167923301';
const GAME_ROLE_ALLSTAR = '1417570973577642167';
const GAME_SUBMIT_CHANNEL = '1406031352071061544';
const GAME_SUBMIT_RULES_LINK =
  'https://docs.google.com/document/d/14mdT59-8gZwZyxmVbSPa0VE7EDecwZN3Imntit6rcL8/edit?usp=sharing';

// Колонки игровых ролей
const ROW1_COL1 = [
  '1411426306679111790',
  '1411457969132142654',
  '1411454416220983381',
  '1411454574652428400',
  '1411454632009400490',
  '1411454706903023759',
  '1411454816256921651',
];

const ROW1_COL2 = [
  '1411426443229139026',
  '1411457890447003668',
  '1411454951024230551',
  '1411455381267415142',
  '1411455505657888838',
  '1411455585991393310',
  '1411455661904236564',
];

const ROW2_COL1 = [
  '1411426572845449317',
  '1411457815272358039',
  '1411428409807994980',
  '1411455883946360935',
  '1411455945028141077',
  '1411456010593505331',
  '1411456088494178304',
  '1411456154588024894',
];

const ROW2_COL2 = [
  '1417572199514247238',
  '1417572687093694606',
  '1417572758182690966',
  '1417572810288533504',
  '1417572980858294362',
  '1417573068213059786',
  '1417573154359873709',
  '1417573811175428247',
];

const START_ROLE = '1411428408105373858';
const SECRET_ROLE = '1408713657780666428';
const TROLL_LIMIT_ROLE = '1408794153491501177';
const SUSPICIOUS_IDEAS_ROLE = '1409774775722836038';

function mentionRoles(list: string[]) {
  return list.map((id) => `<@&${id}>`).join(' ');
}

export async function ensureRulesAndRolesEmbeds(client: Client): Promise<{ rulesId: string; rolesId: string } | null> {
  const channel = client.channels.cache.get(RULES_CHANNEL_ID) as TextChannel | undefined;
  if (!channel) {
    console.error('Канал правил не найден');
    return null;
  }

  const recent = await channel.messages.fetch({ limit: 50 });
  let rulesMsg = recent.find((m) => m.author.id === client.user?.id && m.embeds[0]?.title === 'Правила сервера');
  let rolesMsg = recent.find((m) => m.author.id === client.user?.id && m.embeds[0]?.title === 'Роли');

  // Правила
  const rulesEmbed = new EmbedBuilder()
    .setTitle('Правила сервера')
    .setColor(Colors.Purple)
    .setDescription(
      [
        `Мгновенный банчик за:`,
        `— Раздувание политоты и выплывающей из неё чернухи;`,
        `— Сливы персональной информации, угрозы и прочий негатив, связанный с IRL;`,
        `— Постинг контента, нарушающего правила Discord: порнография, жестокость, запрещённое ПО и прочее;`,
        `— Призывы к действиям из пунктов выше;`,
        ``,
        `Также запрещается:`,
        `— Откровенный троллинг новичков и намеренное введение их в заблуждение;`,
        `— Особо отвратительные оскорбления или травля; трешток сам по себе не запрещён.`,
      ].join('\n')
    );

  // Роли
  const rolesEmbed = new EmbedBuilder()
    .setTitle('Роли')
    .setColor(Colors.Blurple)
    .addFields(
      {
        name: 'Администраторские роли',
        value: `${`<@&${OWNER_ROLE}>`} — владельцы\n${`<@&${MOD_ROLE}>`} — модераторы`,
      },
      {
        name: 'Экспертные роли',
        value: `${mentionRoles(EXPERT_ROLES)} — участники, компетентные в своих сферах; к мнению можно прислушиваться`,
      },
      {
        name: 'Игровые роли — как получить',
        value: [
          `Для сабмита игровой роли отправьте подтверждение в канал <#${GAME_SUBMIT_CHANNEL}>;`,
          `Правила подачи: [тут](<${GAME_SUBMIT_RULES_LINK}>)`,
          `${`<@&${GAME_ROLE_PRO}>`} — профессиональный или полупрофессиональный игрок, играет турниры и получает призовые (выдаётся индивидуально).`,
          `${`<@&${GAME_ROLE_ALLSTAR}>`} — получил 143 All-Star ранги в трёх играх (учитываются с момента вступления роли; прайм не в счёт).`,
        ].join('\n'),
      },
      { name: 'Игровые роли', value: mentionRoles(ROW1_COL1), inline: true },
      { name: 'Игровые роли', value: mentionRoles(ROW1_COL2), inline: true },
      { name: '\u200B', value: '\u200B', inline: false },
      { name: 'Игровые роли', value: mentionRoles(ROW2_COL1), inline: true },
      { name: 'Игровые роли', value: mentionRoles(ROW2_COL2), inline: true },
      {
        name: 'Прочее',
        value: [
          `${`<@&${START_ROLE}>`} — начальная роль для всех;`,
          `${`<@&${SECRET_ROLE}>`} — секретная роль;`,
          `${`<@&${TROLL_LIMIT_ROLE}>`} — замечен в троллинге новичков (доступ к вопросам ограничен);`,
          `${`<@&${SUSPICIOUS_IDEAS_ROLE}>`} — склонен к странным/бредовым идеям (прислушиваться с осторожностью).`,
        ].join('\n'),
      }
    );

  if (!rulesMsg) rulesMsg = await channel.send({ embeds: [rulesEmbed] });
  else await rulesMsg.edit({ embeds: [rulesEmbed] });

  if (!rolesMsg) rolesMsg = await channel.send({ embeds: [rolesEmbed] });
  else await rolesMsg.edit({ embeds: [rolesEmbed] });

  return { rulesId: rulesMsg.id, rolesId: rolesMsg.id };
}
