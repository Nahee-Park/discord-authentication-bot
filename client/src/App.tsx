import { useEffect } from 'react';
import styled from 'styled-components';
import Auth from './components/Auth';
import useThrottle from './hook/useThrottle';
import { makeStars } from './utils/makeStars';

function App() {
  useEffect(() => {
    const $sky = document.querySelector('.sky');
    if ($sky) {
      makeStars($sky);
    }
    window.addEventListener('resize', () => {
      $sky && throttleMakeStars($sky);
    });
  }, []);

  const throttleMakeStars = useThrottle(makeStars, 300);

  return (
    <St.Root>
      <St.Box>
        <h1>NFT Holder Authentication</h1>
        <Auth />
        {/* <St.WalletButton className="btn btn-warning mb-4">Connect Kaikas Wallet</St.WalletButton>
        <St.DiscordButton className="btn btn-warning">Return to Discord</St.DiscordButton> */}
      </St.Box>
      <svg className="sky" />
    </St.Root>
  );
}

export default App;

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
  Root: styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    /* animation */
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: url('/ef_background.png') no-repeat;
    background-size: cover;
    background-position-x: center;
    background-position-y: center;
    /* 별을 감싼 부모 */
    .sky {
      width: 200vw;
      height: 200vw;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: moveStar 240s linear infinite;
      z-index: -1;
    }

    /* 별 */
    .sky .star {
      fill: #fff;
      stroke: none;
      stroke-width: 0;
    }

    /* 별 이동효과 */
    @keyframes moveStar {
      from {
        transform: translate(-50%, -50%) rotate(0);
      }

      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }
    h1 {
      font-family: 'Jura';
      font-style: normal;
      font-weight: 800;
      font-size: 32px;
      line-height: 38px;
      margin-bottom: 16px;
    }
  `,
  WalletButton: styled(CommonButton)``,
  DiscordButton: styled(CommonButton)``,
  Box: styled.div`
    /* background: #9c9c9c; */
    background-color: rgba(136, 136, 136, 0.433); /* 50% 불투명도 */

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 16px;
    border-radius: 16px;
  `,
};
