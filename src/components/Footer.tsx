import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledRoot = styled.footer`
  align-items: center;
  box-sizing: border-box;
  border-top: 1px solid #1e1e1e;
  bottom: 0;
  display: flex;
  font-family: ${props => props.theme.font};
  height: 50px;
  justify-content: flex-start;
  left: 0;
  padding: 0 5%;
  position: fixed;
  width: 100%;
  z-index: 10;

  & > nav {
    flex-grow: 1;
  }

  & .github-button {
    background: url(${require(`@/assets/images/github-icon.svg`)}) center / 100% no-repeat;
    display: block;
    height: 20px;
    transition: all .2s ease-out;
    width: 20px;

    &:hover {
      opacity: .6;
    }
  }

  & > a {
    align-items: center;
    background: ${props => props.theme.buttonColor};
    border: none;
    box-sizing: border-box;
    color: ${props => props.theme.buttonTextColor};
    cursor: pointer;
    display: flex;
    font-size: .8em;
    height: 22px;
    justify-content: center;
    outline: none;
    padding-top: 4px;
    text-decoration: none;
    transition: all .2s ease-out;
    width: 22px;

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
        <Link to='/'>{t[`en`]}</Link>
        <Link to='/ja/'>{t[`jp`]}</Link>
      </StyledRoot>
    );
  }
}
