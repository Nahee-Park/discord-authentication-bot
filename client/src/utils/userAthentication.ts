const { VITE_CLIENT_SECRET, VITE_CLIENT_ID } = import.meta.env;
import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:53134',
  // baseURL: 'https://discord.com/api/oauth2',
  timeout: 3000,
});

export const getUserToken = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  // console.log('urlParams', urlParams);
  const code = urlParams.get('code');
  // console.log('code', code);
  if (code === null) return;

  // const CLIENT_ID = VITE_CLIENT_ID;
  // const CLIENT_SECRET = VITE_CLIENT_SECRET;
  // const REDIRECT_URL = 'http://127.0.0.1:5173';

  // console.log('>>', CLIENT_ID);
  // console.log('>>>>>>', CLIENT_SECRET);

  // const bodyData = new URLSearchParams({
  //   client_id: CLIENT_ID,
  //   client_secret: CLIENT_SECRET,
  //   code,
  //   grant_type: 'authorization_code',
  //   redirect_uri: REDIRECT_URL,
  //   scope: 'identify',
  // });
  // const bodyData = new URLSearchParams();
  // bodyData.append('client_id', CLIENT_ID);
  // bodyData.append('client_secret', CLIENT_SECRET);
  // bodyData.append('grant_type', 'authorization_code');
  // bodyData.append('redirect_uri', REDIRECT_URL);
  // bodyData.append('scope', 'identify');
  // bodyData.append('code', code);

  // console.log('>>bodyData', bodyData);

  // const oauthResult = await Api.post('/token', {
  //   body: bodyData,
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  // });

  const oauthResult = await Api.post('/user-token', {
    code,
  });

  // console.log('?>>oauthResult', oauthResult);
  return oauthResult?.data?.data;
};

export const getUserData = async () => {
  const oauthData = await getUserToken();
  console.log('>>받은 토큰', oauthData.access_token);
  console.log('>>타입', oauthData.token_type);

  // const userData = await Api.post('/user-data', {
  //   oauthData,
  // });

  const userResult = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${oauthData.token_type} ${oauthData.access_token}`,
    },
  });

  const userData = await userResult.json();

  console.log('userData', userData);
  return userData;
};
