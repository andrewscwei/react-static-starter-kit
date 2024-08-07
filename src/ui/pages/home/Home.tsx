import { useMeta } from '@lib/dom/useMeta.js'
import { useLocalizedString } from '@lib/i18n/index.js'
import { VERSION } from '../../../app.config.js'
import { ReactLogo } from '../../components/ReactLogo.js'
import styles from './Home.module.css'

export function Component() {
  const ltxt = useLocalizedString()

  useMeta({
    title: ltxt('window-title-home'),
  })

  return (
    <main>
      <div className={styles.content}>
        <ReactLogo className={styles.logo}/>
        <section>
          <h1 className={styles.title}>{ltxt('hello')}</h1>
          <code className={styles.version}>{VERSION}</code>
          <span>{ltxt('description')}</span>
        </section>
      </div>
    </main>
  )
}
