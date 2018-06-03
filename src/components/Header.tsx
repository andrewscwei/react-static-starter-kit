import { Translations } from '@/types';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.header`
  top: 0;
  left: 0;
  padding: 0 5%;
  width: 100%;
  height: 70px;
  background: #111;
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
}

class Header extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <Root>
        <Link className='link' to='/'>{t[`home`]}</Link>
        <Link className='link' to='/about/'>{t[`about`]}</Link>
      </Root>
    );
  }
}

export default Header;
