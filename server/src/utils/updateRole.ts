import {
  DUMBELL_CONTRACT_ADDR,
  SPORTS_CONTRACT_ADDR,
  nftContractInterface,
  provider,
} from '../app';
import { edit_nft_role } from '../bot';

const db = require('../db/db');
const userDB = require('../db/user');
import { ethers } from 'ethers';

export const updateRole = async () => {
  const client = await db.connect();
  const allUser = await userDB.getAllUser(client);

  const cleanData = {};
  allUser.map((item) => {
    cleanData[item.userId] = item;
  });

  const sportsContract = new ethers.Contract(SPORTS_CONTRACT_ADDR, nftContractInterface, provider);
  const dumbellContract = new ethers.Contract(
    DUMBELL_CONTRACT_ADDR,
    nftContractInterface,
    provider,
  );
  const balanceObj = await allUser.reduce(async (promise, user) => {
    let result = await promise;
    result[user.userId] = {
      sports: await sportsContract.balanceOf(user.address),
      dumbell: await dumbellContract.balanceOf(user.address),
    };
    return result;
  }, {});

  console.log(balanceObj);

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
