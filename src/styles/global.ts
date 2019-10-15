import { css } from 'styled-components';
import normalize from 'styled-normalize';
import * as theme from './theme';

export default css`
  ${normalize} /* stylelint-disable-line max-empty-lines */

  html,
  body {
    background: ${theme.colors.background};
    font-family: 'Roboto';
    width: 100%;
  }

  body {
    height: auto;
    min-height: 100%;
  }
`;
