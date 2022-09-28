import debug from 'debug'

export default function useDebug(subnamespace = '', thread: 'app' | 'worker' = 'app') {
  if (process.env.NODE_ENV === 'development') {
    const namespace = [thread, ...subnamespace.split(':').filter(Boolean)].join(':')
    debug.enable(namespace)
    return debug(namespace)
  }
  else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }
}
