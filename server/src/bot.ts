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
export const DIVIDE_NUMBER = 30;

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

  console.log('[test] holdingType', holdingType)

  let role, member, userEmbed;
  switch (holdingType) {
    // NFT 개수가 0개인 경우
    case 'NO_ROLE':
      userEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('LILLIUS NFT 홀더 인증 완료')
        .setDescription('LILLIUS NFT 홀더가 아닙니다');
      user.send({ embeds: [userEmbed] }).then(() => {});
      return { sportsRole: 'NO_ROLE', dumbellRole: 'NO_ROLE' };
    // 스포츠 피규어 홀더
    case 'SPORTS_FIGURE_HOLDER':
      // 스포츠 피규어 홀더에 대한 롤 부여
      role = guild.roles.cache.get(SPORTS_FIGURE_ROLE_ID);

      if (DIVIDE_NUMBER > sportsNftCount && sportsNftCount >= 1) {
        role = guild.roles.cache.get(SPORTS_FIGURE_ROLE_ID);
        ROLE_ID = SPORTS_FIGURE_ROLE_ID;
      } else if (sportsNftCount >= DIVIDE_NUMBER) {
        role = guild.roles.cache.get(SUPER_SPORTS_FIGURE_ROLE_ID);
        ROLE_ID = SUPER_SPORTS_FIGURE_ROLE_ID;
      }
      member = await guild.members.fetch(user_id);
      console.log('[test] member까지는 잘 나오니', member)
      await member.roles.add(role);
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
      if (DIVIDE_NUMBER > dumbellNftCount && dumbellNftCount >= 1) {
        role = guild.roles.cache.get(DUMBELL_ROLE_ID);
        ROLE_ID = DUMBELL_ROLE_ID;
      } else if (dumbellNftCount >= DIVIDE_NUMBER) {
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
      if (DIVIDE_NUMBER > sportsNftCount && sportsNftCount >= 1) {
        role = guild.roles.cache.get(SPORTS_FIGURE_ROLE_ID);
        sportsRole = SPORTS_FIGURE_ROLE_ID;
      } else if (sportsNftCount >= DIVIDE_NUMBER) {
        role = guild.roles.cache.get(SUPER_SPORTS_FIGURE_ROLE_ID);
        sportsRole = SUPER_SPORTS_FIGURE_ROLE_ID;
      }
      member = await guild.members.fetch(user_id);
      console.log('[test] member까지는 잘 나오니1', member)
      await member.roles.add(role);
      console.log('[log] add_nft_role new role 1', role);

      if (DIVIDE_NUMBER > dumbellNftCount && dumbellNftCount >= 1) {
        role = guild.roles.cache.get(DUMBELL_ROLE_ID);
        dumbellRole = DUMBELL_ROLE_ID;
      } else if (dumbellNftCount >= DIVIDE_NUMBER) {
        role = guild.roles.cache.get(SUPER_DUMBELL_ROLE_ID);
        dumbellRole = SUPER_DUMBELL_ROLE_ID;
      }
      member = await guild.members.fetch(user_id);
      console.log('[test] member까지는 잘 나오니2', member)
      await member.roles.add(role);
      console.log('[log] add_nft_role new role 2', role);

      userEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('LILLIUS NFT 홀더 인증완료')
        .setDescription(`Role : ${ROLE_TEXT[sportsRole]} , ${ROLE_TEXT[dumbellRole]}`);
      user.send({ embeds: [userEmbed] }).then(() => {});
      return { sportsRole, dumbellRole };
  }
};

export const edit_nft_role = async (
  clientDb,
  user_id: string,
  address: string,
  sportsCount: number,
  sportsPreviousCount: number,
  dumbellCount: number,
  dumbellPreviousCount: number,
  sportsPreviousRole: string,
  dumbellPreviousRole: string,
) => {
  console.log('[log] edit_nft_role user id', user_id);

  const user = await client.users.fetch(user_id);
  GlobalGuild = await client.guilds.fetch(GUILD_ID);
  if (!GlobalGuild) return console.log('guild not found :(');
  let SPORTS_ROLE_ID_TEMP,
    DUMBELL_ROLE_ID_TEMP = 'NO_ROLE';
  let SPORT_NEW_ROLE, DUMBELL_NEW_ROLE;

  // sports nft count에 따라 role부여
  if (DIVIDE_NUMBER > sportsCount && sportsCount >= 1) {
    SPORT_NEW_ROLE = GlobalGuild.roles.cache.get(SPORTS_FIGURE_ROLE_ID);
    SPORTS_ROLE_ID_TEMP = 'SPORTS_FIGURE_ROLE_ID';
  } else if (sportsCount >= DIVIDE_NUMBER) {
    SPORT_NEW_ROLE = GlobalGuild.roles.cache.get(SUPER_SPORTS_FIGURE_ROLE_ID);
    SPORTS_ROLE_ID_TEMP = 'SUPER_SPORTS_FIGURE_ROLE_ID';
  }

  // dumbell nft count에 따라 role부여
  if (DIVIDE_NUMBER > dumbellCount && dumbellCount >= 1) {
    DUMBELL_NEW_ROLE = GlobalGuild.roles.cache.get(DUMBELL_ROLE_ID);
    DUMBELL_ROLE_ID_TEMP = 'DUMBELL_ROLE_ID';
  } else if (dumbellCount >= DIVIDE_NUMBER) {
    DUMBELL_NEW_ROLE = GlobalGuild.roles.cache.get(SUPER_DUMBELL_ROLE_ID);
    DUMBELL_ROLE_ID_TEMP = 'SUPER_DUMBELL_ROLE_ID';
  }

  if (SPORTS_ROLE_ID_TEMP !== sportsPreviousRole || DUMBELL_ROLE_ID_TEMP !== dumbellPreviousRole) {
    const member = await GlobalGuild.members.fetch(user_id);

    // 지울 롤이 있으면 삭제
    if (sportsPreviousRole !== 'NO_RULE') member.roles.remove(sportsPreviousRole);
    if (dumbellPreviousRole !== 'NO_RULE') member.roles.remove(dumbellPreviousRole);

    // 추가할 롤이 있으면 추가
    if (SPORT_NEW_ROLE) member?.roles.add(SPORT_NEW_ROLE);
    if (DUMBELL_NEW_ROLE) member?.roles.add(DUMBELL_NEW_ROLE);

    const description =
      SPORTS_ROLE_ID_TEMP === SPORTS_ROLE_ID_TEMP
        ? `Role : ${ROLE_TEXT[SPORTS_ROLE_ID_TEMP]} , ${ROLE_TEXT[DUMBELL_ROLE_ID_TEMP]}`
        : 'LILLIUS NFT 홀더가 아닙니다';
    const userEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Role이 변경되었습니다.')
      .setDescription(description)
      .addFields(
        { name: '기존 Sports Figure NFT 보유량', value: sportsPreviousCount.toString() },
        { name: '현재 Sports Figure NFT 보유량', value: sportsCount.toString() },
        { name: '기존 Dumbell NFT 보유량', value: dumbellPreviousCount.toString() },
        { name: '현재 Dumbell NFT 보유량', value: dumbellCount.toString() },
      );
    user.send({ embeds: [userEmbed] }).then(() => {});
    // const result = await userDB.createUser(clientDb, user_id, address, count, ROLE_ID);
    // console.log('[log] role update 완료', result);
    return { SPORTS_ROLE_ID: SPORTS_ROLE_ID_TEMP, DUMBELL_ROLE_ID: DUMBELL_ROLE_ID_TEMP };
  } else {
    // const result = await userDB.createUser(clientDb, user_id, address, count, ROLE_ID);
    // console.log('[log] role update는 아니지만 db update 완료', result);
    return { SPORTS_ROLE_ID: SPORTS_ROLE_ID_TEMP, DUMBELL_ROLE_ID: DUMBELL_ROLE_ID_TEMP };
  }
};

client.login(token);
