import PostCSSPurgeCSS from '@fullhuman/postcss-purgecss'
import react from '@vitejs/plugin-react'
import path from 'path'
import PostCSSImportPlugin from 'postcss-import'
import PostCSSPresetEnvPlugin from 'postcss-preset-env'
import { loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'
import packageInfo from './package.json'

const packageVersion = packageInfo.version

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = env.NODE_ENV === 'development'
  const skipOptimizations = isDev || env.npm_config_raw === 'true'
  const port = Number(env.port ?? 8080)
  const rootDir = path.resolve(__dirname, 'src')
  const outDir = path.resolve(__dirname, 'build')
  const libDir = path.resolve(__dirname, 'lib')
  const publicDir = path.resolve(rootDir, 'static')
  const buildNumber = env.BUILD_NUMBER ?? 'local'
  const basePath = env.VITE_BASE_PATH ?? '/'
  const baseURL = env.BASE_URL ?? basePath
  const hostURL = env.VITE_HOST_URL ?? '/'
  const publicURL = env.PUBLIC_URL ?? hostURL
  const defaultLocale = env.VITE_DEFAULT_LOCALE ?? 'en'
  const debugEnabled = env.VITE_DEBUG_ENABLED === 'true'
  const debugChannels = env.VITE_DEBUG_CHANNELS ?? 'app'

  return {
    root: rootDir,
    base: baseURL,
    publicDir,
    build: {
      cssMinify: skipOptimizations ? false : 'esbuild',
      minify: skipOptimizations ? false : 'esbuild',
      outDir,
      reportCompressedSize: true,
      sourcemap: isDev ? 'inline' : true,
      target: 'esnext',
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: isDev ? '[name]-[local]-[hash:base64:5]' : '_[hash:base64:5]',
      },
      postcss: {
        plugins: [
          PostCSSImportPlugin(),
          PostCSSPresetEnvPlugin({
            features: {
              'nesting-rules': true,
            },
          }),
          ...isDev ? [] : [
            PostCSSPurgeCSS({
              content: [
                path.resolve(rootDir, '**/*.html'),
                path.resolve(rootDir, '**/*.tsx'),
                path.resolve(rootDir, '**/*.ts'),
                path.resolve(rootDir, '**/*.module.css'),
              ],
              safelist: [
                /^_[A-Za-z0-9-_]{5}$/,
              ],
              defaultExtractor: content => {
                const match = content.match(/[\w-/:]+(?<!:)/g) ?? []
                return match
              },
            }),
          ],
        ],
      },
    },
    define: {
      '__VERSION__': JSON.stringify(`v${packageVersion}+build.${buildNumber}`),
      'import.meta.env.VITE_DEBUG_CHANNELS': JSON.stringify(debugChannels),
      'import.meta.env.VITE_DEBUG_ENABLED': JSON.stringify(debugEnabled),
      'import.meta.env.VITE_DEFAULT_LOCALE': JSON.stringify(defaultLocale),
      'import.meta.env.VITE_BASE_PATH': JSON.stringify(basePath),
      'import.meta.env.VITE_HOST_URL': JSON.stringify(hostURL),
    },
    plugins: [
      react(),
      svgr(),
      createHtmlPlugin({
        minify: !skipOptimizations,
        entry: path.resolve(rootDir, 'index.tsx'),
        inject: {
          data: {
            title: 'React Static Starter Kit',
            description: 'An experimental React static app starter kit.',
            publicURL: publicURL.endsWith('/') ? publicURL : `${publicURL}/`,
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@lib': libDir,
      },
    },
    server: {
      host: 'localhost',
      port,
    },
    test: {
      coverage: {
        reportsDirectory: path.resolve(__dirname, 'coverage'),
        provider: 'v8',
      },
      reporters: ['default'],
      globals: true,
      environment: 'jsdom',
    },
  }
})
