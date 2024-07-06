import { useFavicon, useThemeColor } from '@lib/dom'
import { joinURL } from '@lib/utils/joinURL'
import { StrictMode, type PropsWithChildren } from 'react'
import { MASK_ICON_COLOR, PUBLIC_PATH, THEME_COLOR } from '../app.conf'
import './styles/global.css'
import './styles/theme.css'

type Props = PropsWithChildren

export function App({ children }: Readonly<Props>) {
  useThemeColor(THEME_COLOR)

  useFavicon({
    maskIcon: {
      color: MASK_ICON_COLOR,
    },
    icon: {
      darkImage: joinURL(PUBLIC_PATH, 'favicon-dark.svg'),
    },
    alternateIcon: {
      darkImage: joinURL(PUBLIC_PATH, 'favicon-dark.png'),
    },
  })

  return (
    <StrictMode>
      {children}
    </StrictMode>
  )
}
