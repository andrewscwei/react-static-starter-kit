type ResolveAssetPath = (...args: string[]) => string

export default function createResolveAssetPath(...parts: string[]): ResolveAssetPath {
  return (...args) => [...parts, ...args]
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?')
}
