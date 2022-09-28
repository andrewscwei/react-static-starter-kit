import { DependencyList, useEffect } from 'react'

export default function useScrollToTop(deps: DependencyList = []) {
  return useEffect(() => {
    window.scrollTo(0, 0)
  }, [...deps])
}
