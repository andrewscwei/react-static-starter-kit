import { Translations } from '@/types';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledRoot = styled.header`
  top: 0;
  left: 0;
  padding: 0 5%;
  width: 100%;
  height: 70px;
  font-family: ${props => props.theme.font};
  position: fixed;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 10;

  & > .link {
    color: ${props => props.theme.linkColor};
    text-decoration: none;
    transition: all .2s ease-out;
    font-weight: 400;
    letter-spacing: 1px;
    font-size: .8em;
    cursor: pointer;
    text-transform: uppercase;

    &:not(:last-child) {
      margin-right: 20px;
    }

    &:hover {
      opacity: .6;
    }
  }
`;

export interface Props {
  t: Translations;
  locale: string;
}

class Header extends PureComponent<Props> {
  render() {
    const { t, locale } = this.props;

    return (
      <StyledRoot>
        <Link className='link' to={locale === `en` ? `/` : `/ja`}>{t[`home`]}</Link>
        <Link className='link' to={locale === `en` ? `/about` : `/ja/about`}>{t[`about`]}</Link>
      </StyledRoot>
    );
  }
}

export default Header;
