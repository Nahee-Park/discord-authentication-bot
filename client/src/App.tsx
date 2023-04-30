import { useEffect } from 'react';
import styled from 'styled-components';
import Auth from './components/Auth';
import useThrottle from './hook/useThrottle';
import { makeStars } from './utils/makeStars';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';

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

  // test
  const chains = [mainnet, polygon];
  const projectId = import.meta.env.VITE_PROJECT_ID;
  const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    provider,
  });
  const ethereumClient = new EthereumClient(wagmiClient, chains);

  return (
    <St.Root>
      <St.Box>
        {/* <h1>NFT Holder Authentication</h1> */}
        <WagmiConfig client={wagmiClient}>
          <Auth />
        </WagmiConfig>
        <Web3Modal
          projectId={projectId}
          ethereumClient={ethereumClient}
          explorerRecommendedWalletIds={[
            'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
            '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
            'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
          ]}
          explorerExcludedWalletIds={[
            '225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f',
            '9d373b43ad4d2cf190fb1a774ec964a1addf406d6fd24af94ab7596e58c291b2',
            'bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6',
            'dceb063851b1833cbb209e3717a0a0b06bf3fb500fe9db8cd3a553e4b1d02137',
            'ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18',
            '74f8092562bd79675e276d8b2062a83601a4106d30202f2d509195e30e19673d',
            'afbd95522f4041c71dd4f1a065f971fd32372865b416f95a0b1db759ae33f2a7',
            '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
            '8308656f4548bb81b3508afe355cfbb7f0cb6253d1cc7f998080601f838ecee3',
            '47bb07617af518642f3413a201ec5859faa63acb1dd175ca95085d35d38afb83',
            '20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66',
            'a9751f17a3292f2d1493927f0555603d69e9a3fcbcdf5626f01b49afa21ced91',
            'c40b9bcef32fa6ce4e0df98be1420628bbc4957646f742380fe618fcb4ab74f1',
            '41f20106359ff63cf732adf1f7dc1a157176c9b02fd266b50da6dcc1e9b86071',
            'f1199beddccadb90712c187f53b5460d51193ed76f09f5cb3c6426ab9b76573e',
            'f896cbca30cd6dc414712d3d6fcc2f8f7d35d5bd30e3b1fc5d60cf6c8926f98f',
            'dccbd717df77b395445cc6080e01fffada9d8b92dacfda312a26c70c2e9af673',
            'f5b4eeb6015d66be3f5940a895cbaa49ef3439e518cd771270e6b553b48f31d2',
            'c482dfe368d4f004479977fd88e80dc9e81107f3245d706811581a6dfe69c534',
            'a0e04f1086aac204d4ebdd5f985c12ed226cd0006323fd8143715f9324da58d1',
            '5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489',
            'bb88a220ed4dcd3d717ec19b6ac00a672edf92e97ef7c243d35e25ff56a07301',
            '34c19e0afafeb86ffa75df1c04445b8840450217e79d30abc6def9aa537fb7d6',
            '21b071705a9b9de1646e6a3a0e894d807d0fa4a208e88fc003ee056021f208e1',
            'fa82693d6253e73be14a572f4d0d66bee9e9d3f6bceaa49104987b4ba66ee398',
            '87eecbca66faef32f044fc7c66090fc668efb02e2d17dda7bf095d51dff76659',
            '0563e0724f434298dda37acaa704857ab293b48f1b39b765569a0072de43c0cf',
            '19418ecfd44963883e4d6abca1adeb2036f3b5ffb9bee0ec61f267a9641f878b',
            'e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4',
            'c889f5add667a8c69d147d613c7f18a4bd97c2e47c946cabfdd13ec1d596e4a0',
            '7674bb4e353bf52886768a3ddc2a4562ce2f4191c80831291218ebd90f5f5e26',
            'c889f5add667a8c69d147d613c7f18a4bd97c2e47c946cabfdd13ec1d596e4a0',
            '802a2041afdaf4c7e41a2903e98df333c8835897532699ad370f829390c6900f',
            '0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150',
            'addb6cfece8fe6d2e7039baf5b2ba3249da48957b08bcc877a2e32eaffa6e7aa',
            'cf14642fb8736a99b733ada71863241c823743b16e2a822b3dba24e2fa25014d',
            '6464873279d46030c0b6b005b33da6be5ed57a752be3ef1f857dc10eaf8028aa',
            'f40ec77fbeb5caec027dcda0e779be30976cb8fc5f04759f4f13c666679d323b',
            '3b9f67c2c0887f71e4f9ba1bd2bf5b4eb6cda94419abd3f0c5c12931a60928b0',
            '2c81da3add65899baeac53758a07e652eea46dbb5195b8074772c62a77bbf568',
            'c87c562ce7f3a3ff9f4eed5f5a0edbcbd812db5aed4d14c7e6c044d8b6795d84',
            '5b8e33346dfb2a532748c247876db8d596734da8977905a27b947ba1e2cf465b',
            'f323633c1f67055a45aac84e321af6ffe46322da677ffdd32f9bc1e33bafe29c',
            '959c4774921adfcd49b30c88eb53f3831df6cc8c2f65577fbdd65c26a342577e',
            'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
            '4d0cf1b635a59175b4ad6d6522b0b748ee920b1f8c32030fa704c00926efdf3e',
            '163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3',
            '1f711d32b1df0f84741fafa2ad1d81599b01297cc7d22d153272cb3ef4232f19',
            'e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4',
            '1aedbcfc1f31aade56ca34c38b0a1607b41cccfa3de93c946ef3b4ba2dfab11c',
            '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
          ]}
          // mobileWallets={[
          //   {
          //     id: 'neopin',
          //     name: 'Neopin',
          //     links: {
          //       native: 'neopin:',
          //       universal: 'https://neopin.page.link',
          //     },
          //   },
          //   {
          //     id: 'neopin',
          //     name: 'Neopin',
          //     links: {
          //       native: 'neopin:',
          //       universal: 'https://neopin.page.link',
          //     },
          //   },
          // ]}
        />
        {/* <St.WalletButton className="btn btn-warning mb-4">Connect Kaikas Wallet</St.WalletButton>
        <St.DiscordButton className="btn btn-warning">Return to Discord</St.DiscordButton> */}
      </St.Box>
      {/* <svg className="sky" /> */}
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
    background: url('/lilli_background2.png') no-repeat;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background: #9c9c9c; */
    /* 50% 불투명도 */
    /* background-color: rgba(136, 136, 136, 0.433);  */
    /* 
    padding: 32px 16px;
    border-radius: 16px; */
    /* display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: space-between; */
    /* margin-top: 290px;
    position: relative;  */
  `,
};
