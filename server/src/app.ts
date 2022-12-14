import { ROLE_TEXT } from './bot';
import { updateRole } from './utils/updateRole';
const db = require('./db/db');
const express = require('express');
const Caver = require('caver-js');
const cors = require('cors');
const dotenv = require('dotenv');
const { add_nft_role } = require('./bot');
const schedule = require('node-schedule');
const userDB = require('./db/user');
dotenv.config();

const REDIRECT_URL = 'https://www.endolphin.link/';
const rpcURL = 'https://public-node-api.klaytnapi.com/v1/cypress';
const port = process.env.PORT;
const networkID = '8217';
const caver = new Caver(rpcURL);

// @TODO Replace me
const CONTRACT_ADDR = '0x898f2afc07924f5a4f9612449e4c4f8eca527515';
let contract = null;
// const WALLET_ADDR = '0x88d4e393a3d2e4cbb4e4192233c3bb59ed8de9cd';
async function initContract() {
  contract = await caver.kct.kip17.create(CONTRACT_ADDR);
  console.log('[log] initContract ok');
  let ret;
  ret = await contract.totalSupply();
  console.log('[log] contract totalSupply', ret);
  // ret = await contract.balanceOf(WALLET_ADDR);
  // console.log('balanceOf', ret);
}
initContract();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');
  next();
});

function handleHome(req, res) {
  res.status(200).send('404 page');
}

app.get('*', handleHome);

/**
 * @params code
 */

app.post('/user-token', async (request, response) => {
  try {
    const bodyData = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: request.body.code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URL,
      scope: 'identify',
    });

    const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: bodyData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).catch((e) => {
      throw new Error(e.message);
    });

    const oauthData = await oauthResult.json();
    console.log('[log] ?????? oauth ?????? ?????????', oauthData);

    if (oauthData?.error) {
      throw new Error(oauthData.data.data.error_description);
    } else {
      return response.json({
        code: 200,
        message: '?????? ?????? ?????? ??????',
        data: oauthData,
      });
    }
  } catch (e) {
    console.log('[log] ?????? ?????? ?????? ??? ??????', e);
    throw new Error(e.message);
  }
});

/**
 * @params token
 * ?????? ????????? ????????? ?????? ????????? ?????????
 */
app.post('/user-data', async (request, response) => {
  // console.log('?????? ?????? ????????????', request.body);
  try {
    const userResult = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${request.body.token_type} ${request.body.access_token}`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });
    const userData = await userResult.json();

    console.log('[log] ?????? ?????? ?????????', userData);

    if (userData.id) {
      return response.json({
        code: 200,
        message: '?????? ?????? ?????? ??????',
        data: userData,
      });
    } else {
      throw new Error('?????? ????????? ?????????????????????.');
    }
  } catch (e) {
    console.log('[log] ?????? ?????? ????????? ?????? ??? ??????', e);
    throw new Error(e.message);
  }
});

/**
 * @params address
 * ?????? ????????? ????????? ?????? ???????????? ?????????
 */
app.post('/api_wallet', async (request, response) => {
  console.log('[log] api_wallet api call', request.body);
  const addr = request.body.address;
  const userId = request.body.userId;
  let ret;
  ret = await contract.balanceOf(addr);
  const count = Number(ret);
  console.log('[log] user id', userId);
  console.log('[log] nft count', count);

  // ??? ?????? ?????? ??????
  const role = await add_nft_role(userId, count);
  console.log('[log] user new role', role);

  const client = await db.connect();
  const user = await userDB.createUser(client, userId, addr, count, role);

  return response.json({
    code: 200,
    message: 'ok',
    count,
    role: ROLE_TEXT[role],
  });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

const regularExec = schedule.scheduleJob('0 0 12 * * *', () => {
  // ?????? ??? 12??? ???????????? ??????
  console.log('[log] ??? 12?????? ?????? role ???????????? ???????????????');
  updateRole();
});
