import React, { Suspense, useEffect, useState } from 'react';
import ErrorBoundary from './common/ErrorBoundary';
import { ClipLoader } from 'react-spinners';
import { useQuery } from 'react-query';
import CommonError from './common/CommonError';
import { getUserData } from '../utils/userAthentication';
import AuthModal from './common/AuthModal';
import styled from 'styled-components';
import Result from './Result';
import { ethers } from 'ethers';
import { Web3Button } from '@web3modal/react';
import { useAccount, useContract, useSigner, useDisconnect } from 'wagmi';

// import NeopinConnectQRCode from 'nptconnect-qrcode-modal';
// import NeopinConnect from 'nptconnect-client';

// const POLLING_INTERVAL = 12000;

// import NeopinConnect from 'nptconnect-client';
// import QRCodeModal from 'nptconnect-qrcode-modal';
// export const connector = new WalletConnectConnector({
//   rpc: { '137': 'https://polygon-rpc.com/' },
//   chainId: 137,
//   qrcode: true,
// });

// 봇 불러오는 URL
// https://discord.com/api/oauth2/authorize?client_id=1096241985519616120&permissions=8&scope=applications.commands%20bot

// 봇 불러오는 URL WITH amplify
// https://discord.com/api/oauth2/authorize?client_id=1096241985519616120&permissions=8&redirect_uri=https%3A%2F%2Fmain.dxl01j7nzkmcx.amplifyapp.com&response_type=code&scope=identify%20guilds%20bot

function Auth() {
  return (
    <ErrorBoundary renderFallback={({ error, reset }) => <AuthModal error={error} reset={reset} />}>
      <Suspense fallback={<ClipLoader size={50} color={'#ffffff'} />}>
        <Resolved />
      </Suspense>
    </ErrorBoundary>
  );
}

const Resolved = () => {
  const [userId, setUserId] = useState('');
  const { data } = useQuery(['auth'], () => getUserData(), {
    suspense: true,
    retry: 0,
  });
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  // const [wagmiAddress, setWagmiAddress] = useState<string | undefined>('');

  useEffect(() => {
    setUserId(data?.id);
    disconnect();
  }, []);

  // useEffect(() => {
  //   if (address) {
  //     setWagmiAddress(address);
  //   }
  // }, [address]);

  const handleWalletConnect = async () => {
    // setWagmiAddress(address);
    // setAddress(wagmiAddress);
    // 이더리움 provider 연결
    // if (!(window as any)?.ethereum) return;
    // const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
    // // 메타마스크 계정 접근 권한 요청
    // await provider.send('eth_requestAccounts', []);
    // // 현재 연결된 네트워크 체크
    // const network = await provider.getNetwork();
    // if (network.chainId !== 137) {
    //   console.error('메타마스크를 폴리곤 체인에 연결해주세요.');
    //   return;
    // }
    // // 현재 연결된 계정 주소 가져오기
    // const signer = provider.getSigner();
    // const address = await signer.getAddress();
    // console.log('폴리곤 체인 계정 주소: ', address);
    // const accounts = await (window as any).klaytn.enable();
    // setAddress(address);
    // 연결 후 api_wallet으로 보내서 nft수, address주소 확인
    // 만약 다른 계좌를 원할 경우 지갑에서 선택 후 다시 connect시키도록
    // 확인 후 디스코드로 연결해서 역할 부여 받는 api
    //
    // Create a connector object.
    // const connector = new NeopinConnect({
    //   bridge: 'https://bridge.walletconnect.org', // Required
    //   qrcodeModal: QRCodeModal,
    // });
    // // Session created after connection. > Open the QRCodeModal passed to the connector param.
    // if (!connector.connected) {
    //   connector.createSession();
    // }
    // const { accounts, chainId } = await connector.connect();
    // console.log('accounts, chainId', accounts, chainId);
    // const { accounts, chainId } = await connector.connect();
    // /**
    // get connector from nptconnector
    // **/
    // const uri = connector.uri;
    // console.log('url', uri);
    // /**
    //  *  Open QR Code Modal
    //  */
    // QRCodeModal.open(uri);
  };

  // useEffect(() => {
  //   console.log('userId, address', userId, address);
  // }, [userId, address]);

  return (
    <>
      {/* 결과 Result 컴포넌트로 따로 빼기 ->  */}
      {address && userId ? (
        <Result address={address} userId={userId} />
      ) : (
        <StBox>
          <p className="text-center text-[24px] font-[32px]">
            Click the Connect Wallet button below
            <br /> for holder authentication!
          </p>
          <St.WalletButton className="absolute top-[84px]" onClick={handleWalletConnect}>
            {/* Connect Kaikas Wallet */}
            <Web3Button />
          </St.WalletButton>
        </StBox>
      )}
      {/* <St.DiscordButton className="btn btn-warning">Return to Discord</St.DiscordButton> */}
    </>
  );
};

export default Auth;

const StBox = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-between; */
  margin-top: 320px;
  position: relative;
`;

const CommonButton = styled.button`
  font-size: large;
  background-color: #282727;
  font-weight: 800;
  border: none;
  color: #ffe83c;
  font-family: 'Jura';
  text-transform: none;

  &:hover {
    background-color: #242323;
  }
`;
const St = {
  WalletButton: styled(CommonButton)`
    /* top: 100px; */
    background: transparent;
    /* background: linear-gradient(
      180deg,
      rgba(215, 24, 128, 0.68) 0%,
      rgba(136, 79, 154, 0.6) 24.48%,
      rgba(123, 98, 163, 0.74) 51.04%,
      rgba(111, 128, 173, 0.63) 72.4%,
      #59a8af 99.99%,
      #55aeae 100%
    ); */
    &:hover {
      background: transparent;
    }
  `,
  DiscordButton: styled(CommonButton)``,
};
