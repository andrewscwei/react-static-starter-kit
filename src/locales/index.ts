import { loadTranslations } from '../../lib/i18n'

export default loadTranslations(require.context('./', true))
