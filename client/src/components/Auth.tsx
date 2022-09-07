import React, { Suspense, useEffect } from 'react';
import ErrorBoundary from './common/ErrorBoundary';
import { ClipLoader } from 'react-spinners';
import { useQuery } from 'react-query';
import CommonError from './common/CommonError';
import { getUserData } from '../utils/userAthentication';
import AuthModal from './common/AuthModal';
import styled from 'styled-components';

interface AuthProps {
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

function Auth({ setUserId }: AuthProps) {
  return (
    <ErrorBoundary renderFallback={({ error, reset }) => <AuthModal error={error} reset={reset} />}>
      <Suspense fallback={<ClipLoader size={50} color={'#ffffff'} />}>
        <Resolved setUserId={setUserId} />
      </Suspense>
    </ErrorBoundary>
  );
}

const Resolved = ({ setUserId }: AuthProps) => {
  const { data } = useQuery(['auth'], () => getUserData(), {
    suspense: true,
    retry: 0,
  });

  useEffect(() => {
    data?.data && console.log(data?.data);
  }, [data?.data]);
  // const getUserId = async () => {
  //   const { id } = await getUserData();
  //   console.log('>>chlwhwhlhwlwhlw', id);
  //   setUserId(id);
  // };

  // useEffect(() => {
  //   getUserId();
  // }, []);
  return (
    <>
      <St.WalletButton className="btn btn-warning mb-4">Connect Kaikas Wallet</St.WalletButton>
      <St.DiscordButton className="btn btn-warning">Return to Discord</St.DiscordButton>
    </>
  );
};

export default Auth;

const CommonButton = styled.button`
  font-size: large;
  background-color: #282727;
  font-weight: 800;
  border: none;
  color: #f3f3f3;
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
