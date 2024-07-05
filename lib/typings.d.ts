/* eslint-disable @typescript-eslint/consistent-type-imports */
/// <reference types="vite/client" />

declare module '*.jpg'
declare module '*.jpeg'
declare module '*.png'
declare module '*.gif'
declare module '*.svg'
declare module '*.mp4'
declare module '*.webm'
declare module '*.ogg'
declare module '*.mp3'
declare module '*.wav'
declare module '*.flac'
declare module '*.aac'
declare module '*.woff'
declare module '*.woff2'
declare module '*.eot'
declare module '*.ttf'
declare module '*.otf'
declare module '*.module.css'

declare const __BUILD_ARGS__: typeof import('../config/build.args')

interface Error {
  status?: number
}

interface Window {
  __VERSION__: string
}
