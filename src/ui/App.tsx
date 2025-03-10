import { useFavicon } from '@lib/dom'
import { StrictMode, type PropsWithChildren } from 'react'
import { BASE_PATH } from '../app.config.js'
import './styles/styles.css'

type Props = PropsWithChildren

export function App({ children }: Readonly<Props>) {
  useFavicon({
    icon: {
      darkImage: `${BASE_PATH}/favicon-dark.svg`,
    },
    alternateIcon: {
      darkImage: `${BASE_PATH}/favicon-dark.png`,
    },
  })

  return (
    <StrictMode>
      {children}
    </StrictMode>
  )
}
