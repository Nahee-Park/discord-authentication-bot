import React, { Suspense, useEffect, useState } from 'react';
import ErrorBoundary from './common/ErrorBoundary';
import { ClipLoader } from 'react-spinners';
import { useQuery } from 'react-query';
import CommonError from './common/CommonError';
import { getUserData } from '../utils/userAthentication';
import AuthModal from './common/AuthModal';
import styled from 'styled-components';
import Result from './Result';

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
  const [address, setAddress] = useState<null | string>(null);
  const [userId, setUserId] = useState('');
  const { data } = useQuery(['auth'], () => getUserData(), {
    suspense: true,
    retry: 0,
  });

  useEffect(() => {
    data && setUserId(data.id);
  }, [data]);

  const handleWalletConnect = async () => {
    if (!(window as any)?.klaytn) {
      alert('카이카스 지갑을 먼저 설치해주세요.');
      return;
    }
    const accounts = await (window as any).klaytn.enable();
    console.log('accounts', accounts);

    setAddress(accounts[0]);
    // 연결 후 api_wallet으로 보내서 nft수, address주소 확인
    // 만약 다른 계좌를 원할 경우 지갑에서 선택 후 다시 connect시키도록
    // 확인 후 디스코드로 연결해서 역할 부여 받는 api

    //
  };

  return (
    <>
      <St.WalletButton className="btn btn-warning mb-4" onClick={handleWalletConnect}>
        Connect Kaikas Wallet
      </St.WalletButton>
      {/* 결과 Result 컴포넌트로 따로 빼기 ->  */}
      {address && <Result address={address} userId={userId} />}
      {/* <St.DiscordButton className="btn btn-warning">Return to Discord</St.DiscordButton> */}
    </>
  );
};

export default Auth;

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
  WalletButton: styled(CommonButton)``,
  DiscordButton: styled(CommonButton)``,
};
