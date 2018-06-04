import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledRoot = styled.footer`
  padding: 0 5%;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid #1e1e1e;
  font-family: ${props => props.theme.font};
  position: fixed;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  z-index: 10;

  & > nav {
    flex-grow: 1;
  }

  & .github-button {
    width: 20px;
    height: 20px;
    transition: all .2s ease-out;
    background: url(${require(`@/assets/images/github-icon.svg`)}) center / 100% no-repeat;
    display: block;

    &:hover {
      opacity: .6;
    }
  }

  & .locale-button {
    width: 22px;
    height: 22px;
    background: ${props => props.theme.buttonColor};
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    display: flex;
    font-size: .8em;
    padding-top: 4px;
    cursor: pointer;
    border: none;
    color: ${props => props.theme.buttonTextColor};
    transition: all .2s ease-out;
    text-decoration: none;
    outline: none;

    &:hover {
      background: #fff;
      color: #111;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`;

interface Props {
  t: TranslationData;
}

export default class Footer extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <nav>
          <a className='github-button' href='https://github.com/andrewscwei/react-static-starter-kit'/>
        </nav>
        <Link className='locale-button' to='/'>{t[`en`]}</Link>
        <Link className='locale-button' to='/ja/'>{t[`jp`]}</Link>
      </StyledRoot>
    );
  }
}
