import axios from 'axios';

const Api = axios.create({
  // baseURL: 'http://localhost:8000',
  baseURL: 'https://server.endolphin.link/',
  timeout: 6000,
});

let isGetToken = false;

export const getUserToken = async () => {
  if (isGetToken) {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  // console.log('code>>>>>>>>>>>>>..', code);
  if (code === null) return;

  const oauthResult = await Api.post('/user-token', {
    code,
  });

  isGetToken = oauthResult?.data?.data;
  return oauthResult?.data?.data;
};

export const getUserData = async () => {
  let oauthData = await getUserToken();
  if (!oauthData) {
    oauthData = isGetToken;
  }

  const userResult = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${oauthData.token_type} ${oauthData.access_token}`,
    },
  });

  const userData = await userResult.json();

  if (userData.message === '401: Unauthorized') {
    alert('인증시간이 만료되었습니다. \n 『✅』｜holder-verification 채널에서 다시 들어와주세요');
    window.location.href = 'https://discord.com/channels/975661849154580520/1098467887351595038';
  }
  return userData;
};

export const connectDiscord = async (address: string, userId: string): Promise<any> => {
  const resultData = await Api.post('/api_wallet', {
    address,
    userId,
  });

  return resultData;
};
