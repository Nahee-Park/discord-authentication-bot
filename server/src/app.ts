import { ROLE_TEXT } from './bot';
import { updateRole } from './utils/updateRole';
const db = require('./db/db');
const express = require('express');
// const Caver = require('caver-js');
const cors = require('cors');
const dotenv = require('dotenv');
const { add_nft_role } = require('./bot');
const schedule = require('node-schedule');
const userDB = require('./db/user');
const axios = require('axios');
import { ethers } from 'ethers';

dotenv.config();

// NFT 컨트랙트 인터페이스
export const nftContractInterface = [
  // NFT 보유량 확인하는 함수 (balanceOf)
  'function balanceOf(address _owner) view returns (uint256)',
];

// const REDIRECT_URL = 'https://www.endolphin.link/';
export const REDIRECT_URL = 'http://127.0.0.1:5173/';
export const rpcURL = 'https://polygon-rpc.com';
export const port = process.env.PORT;
export const provider = new (ethers as any).providers.JsonRpcProvider(rpcURL);

// @TODO Replace me
export const SPORTS_CONTRACT_ADDR = '0x81E62F370329F4cc84e2c381bA6EF61705085251';
export const DUMBELL_CONTRACT_ADDR = '0x81E62F370329F4cc84e2c381bA6EF61705085251';
let sportsContract,
  dumbellContract = null;
const TEST_WALLET_ADDR = '0x72CD037aC70e68ec3d46F035b657Cd39203FF5a0';
async function initContract() {
  sportsContract = new ethers.Contract(SPORTS_CONTRACT_ADDR, nftContractInterface, provider);
  dumbellContract = new ethers.Contract(
    DUMBELL_CONTRACT_ADDR,
    nftContractInterface,
    provider,
  );
  console.log('[log] initContract ok');

  const testCount = await sportsContract.balanceOf(TEST_WALLET_ADDR);
  console.log('balanceOf', testCount);
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

    try {
      const responseResult = await axios.post('https://discord.com/api/oauth2/token', bodyData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // 성공적으로 응답 받았을 때 처리
      const oauthResult = responseResult.data;
      console.log(oauthResult);
      console.log(typeof oauthResult);

      console.log('[log] 유저 oauth 인증 데이터', oauthResult);

      if (oauthResult?.error) {
        throw new Error(oauthResult.data.data.error_description);
      } else {
        return response.json({
          code: 200,
          message: '유저 토큰 생성 성공',
          data: oauthResult,
        });
      }
    } catch (error) {
      // 에러 발생 시 처리
      throw new Error(error.message);
    }
  } catch (e) {
    console.log('[log] 유저 토큰 생성 중 에러', e);
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

    console.log('[log] 최종 유저 데이터', userData);

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
    console.log('[log] 최종 유저 데이터 호출 중 에러', e);
    throw new Error(e.message);
  }
});

/**
 * @params address
 * 지갑 주소를 받아서 관련 정보들을 넘겨줌
 */
app.post('/api_wallet', async (request, response) => {
  console.log('[log] api_wallet api call', request.body);
  // 지갑 주소를 받아서
  const addr = request.body.address;
  const userId = request.body.userId;

  console.log('sportsContract', sportsContract);

  // nft 갯수를 가져옴
  const sportsNftCount = await sportsContract?.balanceOf(addr);
  const dumbellNftCount = await dumbellContract?.balanceOf(addr);


  console.log('[log] user id', userId);
  console.log('[log] sportsNftCount count', sportsNftCount);
  console.log('[log] dumbellNftCount count', dumbellNftCount);

  // 롤 부여 코드 추가
  const { sportsRole, dumbellRole } = await add_nft_role(
    userId,
    Number(sportsNftCount),
    Number(dumbellNftCount),
  );
  console.log('[log] user new role', sportsRole, dumbellRole);

  const client = await db.connect();
  const user = await userDB.createUser(
    client,
    userId,
    addr,
    Number(sportsNftCount),
    Number(dumbellNftCount),
    sportsRole,
    dumbellRole,
  );

  return response.json({
    code: 200,
    message: 'ok',
    sportsNftCount : Number(sportsNftCount),
    dumbellNftCount : Number(dumbellNftCount),
    sportsRole: ROLE_TEXT[sportsRole],
    dumbellRole: ROLE_TEXT[dumbellRole],
  });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

const regularExec = schedule.scheduleJob('0 0 12 * * *', () => {
  // 매일 낮 12시 정각마다 실행
  console.log('[log] 낮 12시가 되어 role 재점검을 실시합니다');
  updateRole();
});
