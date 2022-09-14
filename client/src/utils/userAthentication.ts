import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:8000',
  // baseURL: 'https://discord.com/api/oauth2',
  timeout: 3000,
});

let isGetToken = false;

export const getUserToken = async () => {
  if (isGetToken) {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
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
  console.log('>>받은 토큰', oauthData.access_token);
  console.log('>>타입', oauthData.token_type);

  const userResult = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${oauthData.token_type} ${oauthData.access_token}`,
    },
  });

  const userData = await userResult.json();

  console.log('userData', userData);
  return userData;
};

export const connectDiscord = async (address: string, userId: string) => {
  const resultData = await Api.post('/api_wallet', {
    address,
    userId,
  });

  console.log('>>resultData', resultData);

  return resultData;
};
