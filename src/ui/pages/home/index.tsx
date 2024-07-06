import { useMetaTags } from '@lib/dom'
import { useLocalizedString } from '@lib/i18n'
import { ReactLogo } from '../../components/ReactLogo'
import styles from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()

  useMetaTags({ title: ltxt('window-title-home') })

  return (
    <main>
      <div className={styles.content}>
        <ReactLogo className={styles.logo}/>
        <section>
          <h1 className={styles.title}>{ltxt('hello')}</h1>
          <code className={styles.version}>{window.__VERSION__}</code>
          <span>{ltxt('description') }</span>
        </section>
      </div>
    </main>
  )
}
