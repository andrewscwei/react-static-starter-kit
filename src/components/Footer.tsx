import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import $$GitHubIcon from '../assets/images/github-icon.svg'
import { getLocalizedPath, ltxt } from '../utils/i18n'

type Props = {
  className?: string
}

const Footer: FunctionComponent<Props> = ({ className }) => (
  <StyledRoot className={className}>
    <nav>
      <a href='https://github.com/andrewscwei/react-isomorphic-starter-kit'/>
    </nav>
    <Link to={getLocalizedPath('/', 'en')}>{ltxt('en')}</Link>
    <Link to={getLocalizedPath('/', 'ja')}>{ltxt('jp')}</Link>
  </StyledRoot>
)

export default Footer

const StyledRoot = styled.footer`
  ${props => props.theme.layout.hp}
  align-items: center;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  height: 50px;
  left: 0;
  width: 100%;
  position: fixed;
  z-index: 10;

  nav {
    flex-grow: 1;
  }

  nav > a {
    background: url(${$$GitHubIcon}) center / 100% no-repeat;
    display: block;
    height: 20px;
    transition: all .2s ease-out;
    width: 20px;

    :hover {
      opacity: .6;
    }
  }

  > a {
    ${props => props.theme.texts.n2}
    align-items: center;
    background: ${props => props.theme.colors.grey};
    border: none;
    box-sizing: border-box;
    color: ${props => props.theme.colors.white};
    cursor: pointer;
    display: flex;
    height: 22px;
    justify-content: center;
    outline: none;
    padding: 2px 0 0 2px;
    transition: all .2s ease-out;
    width: 22px;

    :hover {
      background: ${props => props.theme.colors.white};
      color: ${props => props.theme.colors.black};
    }

    :not(:last-child) {
      margin-right: 10px;
    }
  }
`
