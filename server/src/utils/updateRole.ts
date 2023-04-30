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

  console.log('[log] cleanData', cleanData);

  const sportsContract = new ethers.Contract(SPORTS_CONTRACT_ADDR, nftContractInterface, provider);
  const dumbellContract = new ethers.Contract(
    DUMBELL_CONTRACT_ADDR,
    nftContractInterface,
    provider,
  );
  const balanceObj = await allUser.reduce(async (promise, user) => {
    let result = await promise;
    result[user.userId] = {
      sports: Number(await sportsContract.balanceOf(user.address)),
      dumbell: Number(await dumbellContract.balanceOf(user.address)),
    };
    return result;
  }, {});

  console.log('[log] update role balanceObj>>>', balanceObj);

  for (const [key, value] of Object.entries(balanceObj)) {
    if (cleanData[key].count !== Number(value)) {
      console.log('[log] update role  cleanData[key]', cleanData[key]);

      const returnValue = await edit_nft_role(
        client,
        cleanData[key].userId,
        cleanData[key].address,
        (value as any)?.sports, // sportsCount
        cleanData[key].sportsNftCount, // sportsPreviousCount
        cleanData[key].sportsRole, // sportsPreviousRole
        (value as any)?.dumbell, // dumbellCount
        cleanData[key].dumbellNftCount, // dumbellPreviousCount
        cleanData[key].dumbellRole, // dumbellPreviousRole
      );
      console.log('[log] edit_nft_role return value', returnValue);
    }
  }
};
