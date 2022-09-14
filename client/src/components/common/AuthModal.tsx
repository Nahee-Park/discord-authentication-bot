import React, { useEffect } from 'react';
import { CommonErrorProps } from './CommonError';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';

function AuthModal({ error, reset }: CommonErrorProps) {
  const customId = error?.message;
  useEffect(() => {
    if (error) {
      notify();
    }
  }, []);
  const notify = () =>
    toast.error('인증 시간이 만료되었습니다.', {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
      toastId: customId,
      theme: 'dark',
    });

  const handleClick = () => {
    // window.location.href = import.meta.env.VITE_URL;
    window.close();
  };

  return (
    <>
      <div>인증 시간이 만료되었습니다</div>
      <CommonButton className="btn btn-warning mb-4 mt-4" onClick={handleClick}>
        창 닫기
      </CommonButton>
    </>
  );
}

export default AuthModal;
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
