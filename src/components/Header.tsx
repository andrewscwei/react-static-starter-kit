import React, { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useLocalizedPath, useLocalizedString } from '../modules/i18n'

type Props = HTMLAttributes<HTMLElement>

export default function Header({ ...props }: Props) {
  const lpath = useLocalizedPath()
  const ltxt = useLocalizedString()

  return (
    <StyledRoot {...props}>
      <Link to={lpath('/')}>{ltxt('nav-title-home') }</Link>
      <Link to={lpath('/about')}>{ltxt('nav-title-about') }</Link>
    </StyledRoot>
  )
}

const StyledRoot = styled.header`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  height: 70px;
  justify-content: flex-end;
  padding: 0 5%;
  position: fixed;
  width: 100%;
  z-index: 10;

  > a {
    ${props => props.theme.texts.n1};
    color: ${props => props.theme.colors.white};
    cursor: pointer;
    transition: all .2s ease-out;

    :hover {
      opacity: .6;
    }

    :not(:last-child) {
      margin-right: 20px;
    }
  }
`
