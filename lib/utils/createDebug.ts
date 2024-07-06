import debug from 'debug'

const DEBUG_ENABLED: boolean = import.meta.env.VITE_DEBUG_ENABLED === 'true' || import.meta.env.DEV
const DEBUG_CHANNELS: string[] = import.meta.env.VITE_DEBUG_CHANNELS?.split(',') ?? ['app']

if (DEBUG_ENABLED && typeof window !== 'undefined') window.localStorage.debug = DEBUG_CHANNELS.map(t => `${t}*`).join(',')

/**
 * Returns an instance of {@link debug} decorated by the specified arguments.
 *
 * @param subnamespace Optional string to append to the namespace of the
 *                     returned {@link debug} instance, delimited by `:`.
 * @param thread The namespace of the returned {@link debug} instance.
 *
 * @returns A {@link debug} instance.
 */
export function createDebug(subnamespace = '', thread: 'app' | 'server' | 'worker' = 'app') {
  if (DEBUG_ENABLED) {
    const namespace = [thread, ...subnamespace.split(':').filter(Boolean)].join(':')
    if (typeof window === 'undefined') debug.enable(namespace)

    return debug(namespace)
  }
  else {
    return () => {}
  }
}
