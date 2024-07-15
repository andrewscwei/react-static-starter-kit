import PostCSSPurgeCSS from '@fullhuman/postcss-purgecss'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import PostCSSImportPlugin from 'postcss-import'
import PostCSSPresetEnvPlugin from 'postcss-preset-env'
import { loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'
import packageInfo from './package.json'
import { DEFAULT_LOCALE, DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE } from './src/app.conf'

const parseBuildArgs = (env: Record<string, string>) => ({
  // Base path of the router (i.e. the `basename` property)
  BASE_PATH: env.BASE_PATH ?? '/',
  // Base URL of the app
  BASE_URL: env.BASE_URL ?? '',
  // Build number
  BUILD_NUMBER: env.BUILD_NUMBER ?? 'local',
  // Version number
  VERSION: packageInfo.version,
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const buildArgs = parseBuildArgs(env)
  const rootDir = path.resolve(__dirname, 'src')
  const isDev = env.NODE_ENV === 'development'
  const skipOptimizations = isDev || env.npm_config_raw === 'true'
  const useSourceMaps = isDev
  const port = Number(env.PORT ?? 8080)

  return {
    base: buildArgs.BASE_PATH,
    publicDir: path.resolve(rootDir, 'static'),
    build: {
      cssMinify: skipOptimizations ? false : 'esbuild',
      minify: skipOptimizations ? false : 'esbuild',
      outDir: path.resolve(__dirname, 'build'),
      reportCompressedSize: true,
      sourcemap: useSourceMaps ? 'inline' : true,
      target: 'esnext',
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: isDev ? '[name]_[local]_[hash:base64:5]' : '_[hash:base64:5]',
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
              defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) ?? [],
            }),
          ],
        ],
      },
    },
    define: {
      'import.meta.env.VITE_DEFAULT_LOCALE': JSON.stringify(env.VITE_DEFAULT_LOCALE),
      ...Object.keys(buildArgs).reduce((acc, key) => ({
        ...acc,
        [`import.meta.env.${key}`]: JSON.stringify(buildArgs[key]),
      }), {}),
    },
    plugins: [
      react(),
      svgr(),
      createHtmlPlugin({
        minify: !skipOptimizations,
        entry: path.resolve(rootDir, 'main.tsx'),
        template: 'src/index.html',
        inject: {
          data: {
            baseTitle: TITLE,
            description: DESCRIPTION,
            locale: DEFAULT_LOCALE,
            maskIconColor: MASK_ICON_COLOR,
            themeColor: THEME_COLOR,
            title: TITLE,
            url: buildArgs.BASE_URL,
            resolveURL: (subpath: string) => path.join(buildArgs.BASE_URL, subpath),
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, 'lib'),
      },
    },
    server: {
      host: 'localhost',
      port,
    },
    test: {
      coverage: {
        reporter: ['text-summary'],
        provider: 'v8',
      },
      globals: true,
      include: [
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
      environment: 'jsdom',
    },
  }
})
