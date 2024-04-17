import React, { type HTMLAttributes } from 'react'
import $$ReactLogo from '../assets/svgs/react-logo.svg'
import styles from './ReactLogo.module.css'

type Props = HTMLAttributes<HTMLElement>

export function ReactLogo({ className, ...props }: Readonly<Props>) {
  return (
    <figure {...props} className={`${styles.root} ${className}`} dangerouslySetInnerHTML={{ __html: $$ReactLogo }}/>
  )
}
