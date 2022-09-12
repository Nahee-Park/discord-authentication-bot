const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();

const token = process.env.TOKEN;
// @TODO 서버 아이디
const GUILD_ID = '1016405367053373490';

// 롤을 부여할 테스트 멤버 아이디
const MEMBER_ID = '753607553061093487';
// @TODO 홀더 인증 채널 아이디
const CH_VERIFY = '1016692813984964671';
// @TODO ROLE ID
const NO_ROLE = '1016409347221377045';
const ROLE_ID_NFT = '1016407348157370419';
const SUPER_ROLE_ID_NFT = '1016407416293834913';
const WHALE_ROLE_ID_NFT = '1016407638516441120';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.login(token);

client.on('ready', () => {
  const ch = client.channels.cache.get(CH_VERIFY);
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Verify your assets!')
      .setStyle(ButtonStyle.Link)
      .setURL(process.env.URL),
  );
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setAuthor({
      name: '엔돌핀팩토리 홀더 인증 Bot',
      iconURL: 'https://endorphin-factory.s3.ap-northeast-2.amazonaws.com/ef_favicon.png',
    })
    .setTitle('Verify your assets')
    .setDescription(
      'This is a read-only connection. Do not share your private keys. We will never ask for your seed phrase.',
    )
    .setThumbnail('https://endorphin-factory.s3.ap-northeast-2.amazonaws.com/ef_image.png')
    // .setTimestamp()
    .setFooter({
      text: 'Endorphin Factory',
      iconURL: 'https://endorphin-factory.s3.ap-northeast-2.amazonaws.com/ef_favicon.png',
    });
  ch.send({ embeds: [exampleEmbed], components: [row] }).then(() => {});
});

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// client.on('interactionCreate', async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === 'button') {
//     const row = new ActionRowBuilder().addComponents(
//       new ButtonBuilder()
//         .setCustomId('primary')
//         .setLabel('Click me!')
//         .setStyle(ButtonStyle.Primary),
//     );

//     await interaction.reply({ content: 'I think you should,', components: [row] });
//   }
// });

export const add_nft_role = async (user_id: string, count: number) => {
  console.log('add_nft_role', user_id);

  const user = await client.users.fetch(user_id);
  const guild = client.guilds.cache.get(GUILD_ID);
  let readableRole = 'member';
  if (count === 0) {
    // send message
    const userEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('앤돌핀 팩토리 NFT 홀더 인증 완료')
      .setDescription(`Role : ${readableRole}`);
    user.send({ embeds: [userEmbed] }).then(() => {});
    return;
  }
  let role = guild.roles.cache.get(ROLE_ID_NFT);

  if (10 > count && count >= 1) {
    role = guild.roles.cache.get(ROLE_ID_NFT);
    readableRole = 'Holder';
  } else if (100 > count && count >= 10) {
    role = guild.roles.cache.get(SUPER_ROLE_ID_NFT);
    readableRole = 'Super Holder';
  } else if (count > 100) {
    role = guild.roles.cache.get(WHALE_ROLE_ID_NFT);
    readableRole = 'Whale Holder';
  }
  const member = await guild.members.fetch(user_id);
  member.roles.add(role);
  console.log('>>>>>>>>>>>', role);
  const userEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('앤돌핀 팩토리 NFT 홀더 인증완료')
    .setDescription(`Role : ${readableRole}`);
  user.send({ embeds: [userEmbed] }).then(() => {});

  return readableRole;
};
