import { useEffect, type DependencyList } from 'react'
import { updateElementAttributes } from './updateElementAttributes.js'

type Params = {
  statusBarStyle?: 'default' | 'black' | 'black-translucent'
  title?: string
}

type Options = {
  auto?: boolean
}

export function useAppleMeta(params: Params = {}, { auto = true }: Options = {}, deps?: DependencyList) {
  const title = params.title
  const statusBarStyle = params.statusBarStyle ?? (auto ? 'default' : undefined)

  const updateOptions: Parameters<typeof updateElementAttributes>[2] = { autoCreate: auto, parent: window.document.head }
  const getTagName = (value?: string): Parameters<typeof updateElementAttributes>[0] => value === undefined ? undefined : 'meta'

  useEffect(() => updateElementAttributes(getTagName(statusBarStyle), [
    { key: true, name: 'name', value: 'apple-mobile-web-app-status-bar-style' },
    { name: 'content', value: statusBarStyle },
  ], updateOptions), [statusBarStyle, ...deps ?? []])

  useEffect(() => updateElementAttributes(getTagName(title), [
    { key: true, name: 'name', value: 'apple-mobile-web-app-title' },
    { name: 'content', value: title },
  ], updateOptions), [title, ...deps ?? []])
}
