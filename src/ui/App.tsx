/**
 * @file Client app root.
 */

import React, { PropsWithChildren, StrictMode } from 'react'
import { useFavicon, useThemeColor } from '../../lib/dom'
import { joinURL } from '../../lib/utils'
import { MASK_ICON_COLOR, THEME_COLOR } from '../app.conf'
import './styles/global.css'
import './styles/theme.css'

type Props = PropsWithChildren

const { publicPath } = __BUILD_ARGS__

export default function App({ children }: Props) {
  useThemeColor(THEME_COLOR)

  useFavicon({
    maskIcon: {
      color: MASK_ICON_COLOR,
    },
    icon: {
      darkImage: joinURL(publicPath, 'favicon-dark.svg'),
    },
    alternateIcon: {
      darkImage: joinURL(publicPath, 'favicon-dark.png'),
    },
  })

  return (
    <StrictMode>
      {children}
    </StrictMode>
  )
}
