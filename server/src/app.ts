const express = require('express');
const bodyParser = require('body-parser');
const Caver = require('caver-js');
const cors = require('cors');
const dotenv = require('dotenv');
const { add_nft_role } = require('./bot');
dotenv.config();

const REDIRECT_URL = 'https://main.dxl01j7nzkmcx.amplifyapp.com/';
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
  console.log('initContract ok');
  let ret;
  ret = await contract.totalSupply();
  console.log('totalSupply', ret);
  // ret = await contract.balanceOf(WALLET_ADDR);
  // console.log('balanceOf', ret);
}
initContract();

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');
  next();
});

app.get('/',(response)=>{
  response.send('홀더 인증 서버입니다.')
})

/**
 * @params code
 */

app.post('/user-token', async (request, response) => {
  try {
    console.log('user-auth', request.body);

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
    console.log('유저 인증 데이터', oauthData);

    if (oauthData?.error) {
      throw new Error(oauthData.data.data.error_description);
    } else {
      return response.json({
        code: 200,
        message: '유저 토큰 생성 성공',
        data: oauthData,
      });
    }
  } catch (e) {
    console.log('유저 토큰 생성 중 에러', e);
    throw new Error(e.message);
  }
});

/**
 * @params token
 * 유저 토큰을 가지고 유저 데이터 가져옴
 */
app.post('/user-data', async (request, response) => {
  // console.log('유저 토큰 기반으로', request.body);
  try {
    const userResult = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${request.body.token_type} ${request.body.access_token}`,
      },
    }).catch((e) => {
      throw new Error(e.message);
    });
    const userData = await userResult.json();

    console.log('최종 유저 데이터', userData);

    if (userData.id) {
      return response.json({
        code: 200,
        message: '유저 정보 생성 성공',
        data: userData,
      });
    } else {
      throw new Error('인증 시간이 만료되었습니다.');
    }
  } catch (e) {
    console.log('최종 유저 데이터 호출 중 에러', e);
    throw new Error(e.message);
  }
});

/**
 * @params address, userId
 * 디스코드봇이 유저에게 권한을 줌
 */
app.post('/api_discord_connect', async (request, response) => {
  console.log('api_discord_connect', request.body);

  return response.json({
    code: 200,
    message: 'ok',
  });
});

/**
 * @params address
 * 지갑 주소를 받아서 관련 정보들을 넘겨줌
 */
app.post('/api_wallet', async (request, response) => {
  console.log('api_wallet', request.body);
  const addr = request.body.address;
  const userId = request.body.userId;
  let ret;
  ret = await contract.balanceOf(addr);
  const count = Number(ret);
  console.log('count', count);

  // 롤 부여 코드 추가
  const role = await add_nft_role(userId, count);

  return response.json({
    code: 200,
    message: 'ok',
    count,
    role,
  });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
