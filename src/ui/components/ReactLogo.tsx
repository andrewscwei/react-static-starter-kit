import { type HTMLAttributes } from 'react'
import $$ReactLogo from '../assets/svgs/react-logo.svg?raw'
import styles from './ReactLogo.module.css'

type Props = HTMLAttributes<HTMLElement>

export function ReactLogo({ className, ...props }: Readonly<Props>) {
  return (
    <figure {...props} className={`${className} ${styles.root}`} dangerouslySetInnerHTML={{ __html: $$ReactLogo }}/>
  )
}
