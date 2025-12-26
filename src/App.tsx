import '@/styles/theme.css'
import { StrictMode, type PropsWithChildren } from 'react'

type Props = PropsWithChildren

export function App({ children }: Readonly<Props>) {
  return (
    <StrictMode>
      {children}
    </StrictMode>
  )
}
