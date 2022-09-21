import React, { HTMLAttributes } from 'react'
import styled, { keyframes } from 'styled-components'
import * as assets from '../assets'

type Props = HTMLAttributes<HTMLElement>

export default function ReactLogo({ ...props }: Props) {
  return (
    <StyledRoot {...props} dangerouslySetInnerHTML={{ __html: assets.svgs.ReactLogo }}/>
  )
}

const KeyframesRoot = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const StyledRoot = styled.figure`
  animation: ${KeyframesRoot} 5s linear infinite;
  height: 100%;
  margin: 0;
  padding: 0;
  transform-origin: center;

  > svg {
    height: 100%;
    width: auto;
  }
`
