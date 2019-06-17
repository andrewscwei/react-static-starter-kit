import { css } from 'styled-components';
import normalize from 'styled-normalize';
import theme from './theme';

export default css`
  ${normalize} /* stylelint-disable-line max-empty-lines */

  html,
  body {
    background: ${theme.backgroundColor};
    font-family: 'Roboto', sans-serif;
    width: 100%;
  }

  body {
    height: auto;
    min-height: 100%;
  }
`;
