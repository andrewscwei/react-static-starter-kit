const req = require.context('./', true, /^.*\.json$/)
const translations: Record<string, any> = {}

for (const key of req.keys()) {
  const phrases = req(key)
  const parts = key.replace('./', '').split('/')

  let t = translations

  for (const part of parts) {
    const subkey = part.replace('.json', '')
    t[subkey] = part.endsWith('.json') ? phrases : {}
    t = t[subkey]
  }
}

export default translations
