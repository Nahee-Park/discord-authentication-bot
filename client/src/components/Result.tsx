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
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleClose = () => {
    window.close();
  };
  return (
    <StDiv>
      <StSection className="">
        <h2 className="text-xl text-[#ffe83c] mb-2 font-bold">Address</h2>
        <div>{address}</div>
        <h2 className="text-xl text-[#ffe83c] mb-2 mt-2">Dumbell NFT Count</h2>
        <div>{data?.data?.dumbellNftCount}</div>
        <h2 className="text-xl text-[#ffe83c] mb-2 mt-2">Dumbell NFT Role</h2>
        {/* <div>{data?.data?.role}</div> */}
        <div>{data?.data?.dumbellRole}</div>
        <h2 className="text-xl text-[#ffe83c] mb-2 mt-2">Sports NFT Count</h2>
        <div>{data?.data?.sportsNftCount}</div>
        <h2 className="text-xl text-[#ffe83c] mb-2 mt-2">Sports NFT Role</h2>
        {/* <div>{data?.data?.role}</div> */}
        <div>{data?.data?.sportsRole}</div>
        <St.DiscordButton className="btn btn-warning mt-4" onClick={handleClose}>
          Confirm
        </St.DiscordButton>
      </StSection>
    </StDiv>
  );
};
export default Result;

const StDiv = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  /* position: fixed; */
  /* top: 0;
  left: 0;
  width: 100%;
  height: 100%; */
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background: red; */
  background: linear-gradient(
      180deg,
      rgba(215, 24, 128, 0.68) 0%,
      rgba(136, 79, 154, 0.6) 24.48%,
      rgba(123, 98, 163, 0.74) 51.04%,
      rgba(111, 128, 173, 0.63) 72.4%,
      #59a8af 99.99%,
      #55aeae 100%
    ),
    white;
  padding: 16px;
  border-radius: 32px;
`;

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
