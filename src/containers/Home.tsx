import React, { ComponentType, useEffect } from 'react'
import styled from 'styled-components'
import ReactLogo from '../components/ReactLogo'
import { useLocalizedString } from '../modules/i18n'

export default function Home() {
  const ltxt = useLocalizedString()

  useEffect(() => {
    document.title = ltxt('window-title-home')
  }, [])

  return (
    <StyledRoot>
      <StyledReactLogo/>
      <h1>{ltxt('hello')}</h1>
      <pre>v{__APP_CONFIG__.version} ({__APP_CONFIG__.buildNumber})</pre>
      <p>{ltxt('description') }</p>
    </StyledRoot>
  )
}

const StyledRoot = styled.div`
  ${props => props.theme.layout.hp}
  align-items: center;
  box-sizing: border-box;;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;

  h1 {
    ${props => props.theme.texts.h1}
    color: ${props => props.theme.colors.white};
    margin: 0;
    max-width: 550px;
    text-align: center;
  }

  pre {
    ${props => props.theme.texts.m1}
    color: ${props => props.theme.colors.grey};
    text-align: center;
  }

  p {
    ${props => props.theme.texts.p1}
    color: ${props => props.theme.colors.grey};
    margin: 0;
    max-width: 400px;
    text-align: center;
  }
`

const StyledReactLogo = styled(ReactLogo as ComponentType)`
  height: 200px;
  margin-bottom: 30px;
`
