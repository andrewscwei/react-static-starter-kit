import { css } from 'styled-components';
import normalize from 'styled-normalize';
import theme from './theme';

export default css`
  ${normalize} /* stylelint-disable-line max-empty-lines */

  @font-face {
    font-family: 'Roboto';
    src: url('${require('../assets/fonts/Roboto-Bold.ttf')}') format('truetype');
    font-style: normal;
    font-weight: 700;
    font-display: fallback;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('${require('../assets/fonts/Roboto-Regular.ttf')}') format('truetype');
    font-style: normal;
    font-weight: 400;
    font-display: fallback;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('${require('../assets/fonts/Roboto-Light.ttf')}') format('truetype');
    font-style: normal;
    font-weight: 300;
    font-display: fallback;
  }

  html,
  body {
    background: ${theme.backgroundColor};
    font-family: 'Roboto';
    width: 100%;
  }

  body {
    height: auto;
    min-height: 100%;
  }
`;
