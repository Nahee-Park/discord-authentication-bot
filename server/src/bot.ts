import { getHoldingType } from './utils/getHoldingType';

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const dotenv = require('dotenv');
const userDB = require('./db/user');

dotenv.config();

const token = process.env.TOKEN;
// @TODO 서버 아이디
// export const GUILD_ID = '1016405367053373490';
export const GUILD_ID = '1096005938940481628';

// 롤을 부여할 테스트 멤버 아이디
const MEMBER_ID = '753607553061093487';
// @TODO 홀더 인증 채널 아이디
// const CH_VERIFY = '1016692813984964671';
const CH_VERIFY = '1096005938940481631';

// @TODO ROLE ID
// const NO_ROLE = '1016409347221377045';
// const ROLE_ID_NFT = '1016407348157370419';
// const SUPER_ROLE_ID_NFT = '1016407416293834913';
// const WHALE_ROLE_ID_NFT = '1016407638516441120';
// const ROLE_ID_NFT = '1012608187398098986';
// const SUPER_ROLE_ID_NFT = '1015048331690508328';
// const WHALE_ROLE_ID_NFT = '1015048466931646545';

// NEW ROLE ID
const SPORTS_FIGURE_ROLE_ID = '1096009423660515429';
const SUPER_SPORTS_FIGURE_ROLE_ID = '1096257012582588436';
const DUMBELL_ROLE_ID = '1096256540454957226';
const SUPER_DUMBELL_ROLE_ID = '1096257307962261604';

export const ROLE_TEXT = {
  NO_ROLE: '홀더가 아닙니다.',
  SPORTS_FIGURE_ROLE_ID: 'LILLIUS SPORTS FIGURE NFT Holder',
  SUPER_SPORTS_FIGURE_ROLE_ID: 'LILLIUS SPORTS FIGURE NFT SUPER Holder',
  DUMBELL_ROLE_ID: 'LILLIUS DUMBELL NFT Holder',
  SUPER_DUMBELL_ROLE_ID: 'LILLIUS DUMBELL NFT SUPER Holder',
  // ROLE_ID_NFT: 'Holder',
  // SUPER_ROLE_ID_NFT: 'Super Holder',
  // WHALE_ROLE_ID_NFT: 'Whale Holder',
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

// @TODO 한 번 불러온 이후 서버 재시작할 땐 주석처리하기
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
      name: 'LILLIUS Holder Verification Bot',
      iconURL: 'https://lillius.s3.ap-northeast-2.amazonaws.com/bot-favicon.png',
    })
    .setTitle('Verify your assets')
    .setDescription(
      'This is a read-only connection. Do not share your private keys. We will never ask for your seed phrase.',
    )
    .setThumbnail('https://lillius.s3.ap-northeast-2.amazonaws.com/bot-thumbnail.png')
    // .setTimestamp()
    .setFooter({
      text: 'LILLIUS',
      iconURL: 'https://lillius.s3.ap-northeast-2.amazonaws.com/bot-favicon.png',
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
export const add_nft_role = async (
  user_id: string,
  sportsNftCount: number,
  dumbellNftCount: number,
) => {
  console.log('[log] add_nft_role user id', user_id);

  const user = await client.users.fetch(user_id);
  const guild = client.guilds.cache.get(GUILD_ID);
  let ROLE_ID = 'NO_ROLE';

  const holdingType = getHoldingType(sportsNftCount, dumbellNftCount);

  switch (holdingType) {
    // NFT 개수가 0개인 경우
    case 'NO_ROLE':
      let userEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('LILLIUS NFT 홀더 인증 완료')
        .setDescription('LILLIUS NFT 홀더가 아닙니다');
      user.send({ embeds: [userEmbed] }).then(() => {});
      return { sportsRole: 'NO_ROLE', dumbellRole: 'NO_ROLE' };
    // 스포츠 피규어 홀더
    case 'SPORTS_FIGURE_HOLDER':
      // 스포츠 피규어 홀더에 대한 롤 부여
      let role = guild.roles.cache.get(SPORTS_FIGURE_ROLE_ID);

      if (30 > sportsNftCount && sportsNftCount >= 1) {
        role = guild.roles.cache.get(SPORTS_FIGURE_ROLE_ID);
        ROLE_ID = SPORTS_FIGURE_ROLE_ID;
      } else if (sportsNftCount >= 30) {
        role = guild.roles.cache.get(SUPER_SPORTS_FIGURE_ROLE_ID);
        ROLE_ID = SUPER_SPORTS_FIGURE_ROLE_ID;
      }
      let member = await guild.members.fetch(user_id);
      member.roles.add(role);
      console.log('[log] add_nft_role new role', role);
      userEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('LILLIUS NFT 홀더 인증완료')
        .setDescription(`Role : ${ROLE_TEXT[ROLE_ID]}`);
      user.send({ embeds: [userEmbed] }).then(() => {});

      return { sportsRole: ROLE_ID, dumbellRole: 'NO_ROLE' };

    // 덤벨 홀더
    case 'DUMBBELL_FIGURE_HOLDER':
      // 덤벨 홀더에 대한 롤 부여
      role = guild.roles.cache.get(DUMBELL_ROLE_ID);
      if (30 > dumbellNftCount && dumbellNftCount >= 1) {
        role = guild.roles.cache.get(DUMBELL_ROLE_ID);
        ROLE_ID = DUMBELL_ROLE_ID;
      } else if (dumbellNftCount >= 30) {
        role = guild.roles.cache.get(SUPER_DUMBELL_ROLE_ID);
        ROLE_ID = SUPER_DUMBELL_ROLE_ID;
      }
      member = await guild.members.fetch(user_id);
      member.roles.add(role);
      console.log('[log] add_nft_role new role', role);
      userEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('LILLIUS NFT 홀더 인증완료')
        .setDescription(`Role : ${ROLE_TEXT[ROLE_ID]}`);
      user.send({ embeds: [userEmbed] }).then(() => {});

      return { sportsRole: 'NO_ROLE', dumbellRole: ROLE_ID };
    default:
      let sportsRole = SPORTS_FIGURE_ROLE_ID;
      let dumbellRole = DUMBELL_ROLE_ID;
      if (30 > sportsNftCount && sportsNftCount >= 1) {
        role = guild.roles.cache.get(SPORTS_FIGURE_ROLE_ID);
        sportsRole = SPORTS_FIGURE_ROLE_ID;
      } else if (sportsNftCount >= 30) {
        role = guild.roles.cache.get(SUPER_SPORTS_FIGURE_ROLE_ID);
        sportsRole = SUPER_SPORTS_FIGURE_ROLE_ID;
      }
      member = await guild.members.fetch(user_id);
      member.roles.add(role);

      if (30 > dumbellNftCount && dumbellNftCount >= 1) {
        role = guild.roles.cache.get(DUMBELL_ROLE_ID);
        dumbellRole = DUMBELL_ROLE_ID;
      } else if (dumbellNftCount >= 30) {
        role = guild.roles.cache.get(SUPER_DUMBELL_ROLE_ID);
        dumbellRole = SUPER_DUMBELL_ROLE_ID;
      }
      member = await guild.members.fetch(user_id);
      member.roles.add(role);

      userEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('LILLIUS NFT 홀더 인증완료')
        .setDescription(`Role : ${ROLE_TEXT[sportsRole]} , ${ROLE_TEXT[dumbellRole]}`);
      user.send({ embeds: [userEmbed] }).then(() => {});
      return { sportsRole, dumbellRole };
  }
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
  console.log('[log] edit_nft_role user id', user_id);

  const user = await client.users.fetch(user_id);
  GlobalGuild = await client.guilds.fetch(GUILD_ID);
  if (!GlobalGuild) return console.log('guild not found :(');
  let ROLE_ID = 'NO_ROLE';
  let role;

  // @TODO 두 NFT홀더에 대한 롤 부여
  // if (10 > count && count >= 1) {
  //   role = GlobalGuild.roles.cache.get(ROLE_ID_NFT);
  //   ROLE_ID = ROLE_ID_NFT;
  // } else if (100 > count && count >= 10) {
  //   role = GlobalGuild.roles.cache.get(SUPER_ROLE_ID_NFT);
  //   ROLE_ID = SUPER_ROLE_ID_NFT;
  // } else if (count > 100) {
  //   role = GlobalGuild.roles.cache.get(WHALE_ROLE_ID_NFT);
  //   ROLE_ID = WHALE_ROLE_ID_NFT;
  // }

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
    console.log('[log] role update 완료', result);
    return ROLE_ID;
  } else {
    const result = await userDB.createUser(clientDb, user_id, address, count, ROLE_ID);
    console.log('[log] role update는 아니지만 db update 완료', result);
    return ROLE_ID;
  }
};

client.login(token);
