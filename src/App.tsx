import '@/styles/theme.css'
import { type PropsWithChildren, StrictMode } from 'react'

type Props = PropsWithChildren

export function App({ children }: Readonly<Props>) {
  return (
    <StrictMode>
      {children}
    </StrictMode>
  )
}
