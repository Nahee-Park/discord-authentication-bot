import { edit_nft_role } from '../bot';

const db = require('./db/db');
const userDB = require('./db/user');
const Caver = require('caver-js');
const rpcURL = 'https://public-node-api.klaytnapi.com/v1/cypress';
const caver = new Caver(rpcURL);
// @TODO Replace me
const CONTRACT_ADDR = '0x898f2afc07924f5a4f9612449e4c4f8eca527515';

export const updateRole = async () => {
  const client = await db.connect();
  const allUser = await userDB.getAllUser(client);
  const contract = await caver.kct.kip17.create(CONTRACT_ADDR);

  const cleanData = {};
  allUser.map((item) => {
    cleanData[item.userId] = item;
  });

  const balanceObj = await allUser.reduce(async (promise, user) => {
    let result = await promise;
    result[user.userId] = await contract.balanceOf(user.address);
    return result;
  }, {});

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
      console.log('[log] edit_nft_role return value', returnValue);
    }
  }
};
