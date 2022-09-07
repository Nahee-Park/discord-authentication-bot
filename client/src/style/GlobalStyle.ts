import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  :root {
    font-family: 'Jura';
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    /* color-scheme: light dark; */
    color: rgba(255, 255, 255, 0.87);

    /* background-color: #38393E; */

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
`;
