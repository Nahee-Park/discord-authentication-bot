const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const dotenv = require('dotenv');
const userDB = require('./db/user');

dotenv.config();

const token = process.env.TOKEN;
// @TODO 서버 아이디
export const GUILD_ID = '1016405367053373490';

// 롤을 부여할 테스트 멤버 아이디
const MEMBER_ID = '753607553061093487';
// @TODO 홀더 인증 채널 아이디
const CH_VERIFY = '1016692813984964671';
// @TODO ROLE ID
const NO_ROLE = '1016409347221377045';
const ROLE_ID_NFT = '1016407348157370419';
const SUPER_ROLE_ID_NFT = '1016407416293834913';
const WHALE_ROLE_ID_NFT = '1016407638516441120';

const ROLE_TEXT = {
  NO_ROLE: '홀더가 아닙니다.',
  ROLE_ID_NFT: 'Holder',
  SUPER_ROLE_ID_NFT: 'Super Holder',
  WHALE_ROLE_ID_NFT: 'Whale Holder',
};

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

let GlobalGuild;

// client.on('ready', () => {
//   GlobalGuild = client.guilds.cache.get(GUILD_ID);
// });

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
      name: '엔돌핀 팩토리 홀더 인증 봇',
      iconURL: 'https://endorphin-factory.s3.ap-northeast-2.amazonaws.com/ef_favicon.png',
    })
    .setTitle('Verify your assets')
    .setDescription(
      'This is a read-only connection. Do not share your private keys. We will never ask for your seed phrase.',
    )
    .setThumbnail('https://endorphin-factory.s3.ap-northeast-2.amazonaws.com/ef_image_white.png')
    // .setTimestamp()
    .setFooter({
      text: 'Endorphin Factory',
      iconURL: 'https://endorphin-factory.s3.ap-northeast-2.amazonaws.com/ef_favicon.png',
    });
  ch.send({ embeds: [exampleEmbed], components: [row] }).then(() => {});
});

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * 유저에게 role 부여
 * @param user_id
 * @param count
 * @returns
 */
export const add_nft_role = async (user_id: string, count: number) => {
  console.log('add_nft_role', user_id);

  const user = await client.users.fetch(user_id);
  const guild = client.guilds.cache.get(GUILD_ID);
  let ROLE_ID = 'NO_ROLE';
  // NFT 개수가 0개인 경우
  if (count === 0) {
    // send message
    const userEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('앤돌핀 팩토리 NFT 홀더 인증 완료')
      .setDescription('앤돌핀 팩토리 NFT 홀더가 아닙니다');
    user.send({ embeds: [userEmbed] }).then(() => {});
    return ROLE_TEXT[ROLE_ID];
  }
  let role = guild.roles.cache.get(ROLE_ID_NFT);

  if (10 > count && count >= 1) {
    role = guild.roles.cache.get(ROLE_ID_NFT);
    ROLE_ID = ROLE_ID_NFT;
  } else if (100 > count && count >= 10) {
    role = guild.roles.cache.get(SUPER_ROLE_ID_NFT);
    ROLE_ID = SUPER_ROLE_ID_NFT;
  } else if (count > 100) {
    role = guild.roles.cache.get(WHALE_ROLE_ID_NFT);
    ROLE_ID = WHALE_ROLE_ID_NFT;
  }
  const member = await guild.members.fetch(user_id);
  member.roles.add(role);
  console.log('New Member Role', role);
  const userEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('앤돌핀 팩토리 NFT 홀더 인증완료')
    .setDescription(`Role : ${ROLE_TEXT[ROLE_ID]}`);
  user.send({ embeds: [userEmbed] }).then(() => {});

  return ROLE_TEXT[ROLE_ID];
};

/**
 * 유저의 role 수정
 * @param clientDb
 * @param user_id
 * @param address
 * @param count
 * @param previousCount
 * @param previousRole
 * @returns
 */
export const edit_nft_role = async (
  clientDb,
  user_id: string,
  address: string,
  count: number,
  previousCount: number,
  previousRole: string,
) => {
  console.log('edit_nft_role', user_id);

  const user = await client.users.fetch(user_id);
  GlobalGuild = await client.guilds.fetch(GUILD_ID);
  if (!GlobalGuild) return console.log('guild not found :(');
  let ROLE_ID = 'NO_ROLE';
  let role;

  if (10 > count && count >= 1) {
    role = GlobalGuild.roles.cache.get(ROLE_ID_NFT);
    ROLE_ID = ROLE_ID_NFT;
  } else if (100 > count && count >= 10) {
    role = GlobalGuild.roles.cache.get(SUPER_ROLE_ID_NFT);
    ROLE_ID = SUPER_ROLE_ID_NFT;
  } else if (count > 100) {
    role = GlobalGuild.roles.cache.get(WHALE_ROLE_ID_NFT);
    ROLE_ID = WHALE_ROLE_ID_NFT;
  }

  if (ROLE_ID !== previousRole) {
    const member = await GlobalGuild.members.fetch(user_id);

    // 지울 롤이 있으면 삭제
    if (previousRole !== 'NO_RULE') member.roles.remove(previousRole);
    // 추가할 롤이 있으면 추가
    if (role) member?.roles.add(role);

    const description = ROLE_ID === 'NO_ROLE' ? '홀더가 아닙니다' : `Role : ${ROLE_TEXT[ROLE_ID]}`;

    const userEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Role이 변경되었습니다.')
      .setDescription(description)
      .addFields(
        { name: '기존 NFT 보유량', value: previousCount.toString() },
        { name: '현재 NFT 보유량', value: count.toString() },
      );
    user.send({ embeds: [userEmbed] }).then(() => {});
    const result = await userDB.createUser(clientDb, user_id, address, count, ROLE_ID);
    console.log('>>>>>>>update 완료!!', result);
    return ROLE_TEXT[ROLE_ID];
  } else {
    const result = await userDB.createUser(clientDb, user_id, address, count, ROLE_ID);
    console.log('>>>>>>>update 완료!!', result);
    return ROLE_TEXT[ROLE_ID];
  }
};

client.login(token);
