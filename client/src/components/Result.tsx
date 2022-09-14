import React, { Suspense, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { connectDiscord } from '../utils/userAthentication';
import AuthModal from './common/AuthModal';
import CommonError from './common/CommonError';
import ErrorBoundary from './common/ErrorBoundary';
import { useQuery } from 'react-query';
import styled from 'styled-components';

interface ResultProps {
  address: string;
  userId: string;
}

function Result({ address, userId }: ResultProps) {
  return (
    <ErrorBoundary
      renderFallback={({ error, reset }) => <CommonError error={error} reset={reset} />}
    >
      <Suspense fallback={<ClipLoader size={50} color={'#ffffff'} />}>
        <Resolved address={address} userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
}

const Resolved = ({ address, userId }: ResultProps) => {
  const { data } = useQuery(['connect_discord'], () => connectDiscord(address, userId), {
    suspense: true,
    retry: 0,
  });

  const handleClose = () => {
    window.close();
  };
  return (
    <>
      <h2 className="text-xl text-[#ffe83c] mb-2 font-bold">Address</h2>
      <div>{address}</div>
      <h2 className="text-xl text-[#ffe83c] mb-2 mt-2">NFT Count</h2>
      <div>{data?.data?.count}</div>
      <h2 className="text-xl text-[#ffe83c] mb-2 mt-2">Role</h2>
      {/* <div>{data?.data?.role}</div> */}
      <div>{data?.data?.role}</div>
      <St.DiscordButton className="btn btn-warning mt-4" onClick={handleClose}>
        Confirm
      </St.DiscordButton>
    </>
  );
};
export default React.memo(Result);

const CommonButton = styled.button`
  font-size: large;
  background-color: #ffe83c;
  font-weight: 800;
  border: none;
  color: #1d1a1a;
  font-family: 'Jura';
  text-transform: none;

  &:hover {
    background-color: #edd941;
  }
`;
const St = {
  DiscordButton: styled(CommonButton)``,
};
