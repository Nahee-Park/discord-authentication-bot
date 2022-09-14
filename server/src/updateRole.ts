import { ApplicationCommandPermissionType } from 'discord.js';
import { add_nft_role, edit_nft_role } from './bot';

const db = require('./db/db');
const userDB = require('./db/user');
const Caver = require('caver-js');
const rpcURL = 'https://public-node-api.klaytnapi.com/v1/cypress';
const caver = new Caver(rpcURL);
// @TODO Replace me
const CONTRACT_ADDR = '0x898f2afc07924f5a4f9612449e4c4f8eca527515';

export const updateRole = async () => {
  console.log('>>>>update role에 들어옴');
  const client = await db.connect();
  const allUser = await userDB.getAllUser(client);
  const contract = await caver.kct.kip17.create(CONTRACT_ADDR);

  const cleanData = {};
  allUser.map((item) => {
    cleanData[item.userId] = item;
  });
  // console.log('>>alluser', allUser);
  // const promiseBalanceList = allUser.map((user) => {
  //   return contract.balanceOf(user.address);
  // });

  // console.log(promiseBalanceList);

  const balanceObj = await allUser.reduce(async (promise, user) => {
    // 누산값 받아오기 (2)
    let result = await promise;
    // 누산값 변경 (3)
    result[user.userId] = await contract.balanceOf(user.address);
    // 다음 Promise 리턴
    return result;
  }, {}); // 초기값 (1)

  console.log('66666666bala', balanceObj);
  console.log('>>cleanData', cleanData);

  for (const [key, value] of Object.entries(balanceObj)) {
    if (cleanData[key].count !== Number(value)) {
      console.log('cleanData[key]', cleanData[key]);
      console.log('value', value);
      const returnValue = await edit_nft_role(
        client,
        cleanData[key].userId,
        cleanData[key].address,
        Number(value),
        cleanData[key].count,
        cleanData[key].role,
      );
      console.log('>=%%%%%%%%%%%%%%%returnValue', returnValue);
    }
  }

  // await Promise.allSettled(promiseBalanceList).then((balance) => {
  //   balance.map(async (result, idx) => {
  //     if (result.status === 'fulfilled') {
  //       if (Number(result.value) !== allUser[idx].count) {
  //         const returnValue = await edit_nft_role(
  //           client,
  //           allUser[idx].userId,
  //           allUser[idx].address,
  //           Number(result.value),
  //           allUser[idx].count,
  //           allUser[idx].role,
  //         );
  //         console.log('**********returl', returnValue);
  //         // updateResult.push({
  //         //   userId: allUser[idx].userId,
  //         //   address: allUser[idx].address,
  //         //   count: Number(result.value),
  //         // });
  //         // userDB.createUser(
  //         //   client,
  //         //   allUser[idx].userId,
  //         //   allUser[idx].address,
  //         //   Number(result.value),
  //         //   role,
  //         // );
  //       }
  //     }
  //   });
  // });
  // await Promise.allSettled(editListPromise).then((roles) => {
  //   roles.map((result) => {
  //     console.log('최종 result', result);
  //   });
  // });
};
