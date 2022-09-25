import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useLocalizedString } from '../modules/i18n'

export default function NotFound() {
  const ltxt = useLocalizedString()

  useEffect(() => {
    document.title = ltxt('window-title-not-found')
  })

  return (
    <StyledRoot>
      <h1>{ltxt('not-found-title') }</h1>
    </StyledRoot>
  )
}

const StyledRoot = styled.div`
  ${props => props.theme.layout.hp}
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;

  h1 {
    ${props => props.theme.texts.h2}
    color: ${props => props.theme.colors.white};
    margin: 0;
    max-width: 550px;
    text-align: center;
  }
`
