import { DependencyList, useEffect } from 'react'

export default function useWindowTitle(title: string, deps: DependencyList = []) {
  useEffect(() => {
    document.title = title
  }, [title, ...deps])
}
