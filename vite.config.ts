import PostCSSPurgeCSS from '@fullhuman/postcss-purgecss'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import PostCSSImportPlugin from 'postcss-import'
import PostCSSPresetEnvPlugin from 'postcss-preset-env'
import { loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { defineConfig } from 'vitest/config'
import packageInfo from './package.json'

const parseBuildArgs = (env: Record<string, string>) => ({
  BASE_PATH: env.BASE_PATH ?? '/',
  BASE_URL: env.BASE_URL ?? '',
  BUILD_NUMBER: env.BUILD_NUMBER ?? 'local',
  DEFAULT_LOCALE: env.DEFAULT_LOCALE ?? 'en',
  DEFAULT_METADATA: {
    description: 'React static app starter kit',
    maskIconColor: '#000',
    themeColor: '#15141a',
    title: 'React Static Starter Kit',
    url: env.BASE_URL ?? '',
  },
  VERSION: packageInfo.version,
})

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  const env = loadEnv(mode, process.cwd(), '')
  const buildArgs = parseBuildArgs(env)
  const rootDir = path.resolve(__dirname, 'src')
  const outDir = path.resolve(__dirname, 'build')
  const skipOptimizations = isDev || env.npm_config_raw === 'true'

  return {
    root: rootDir,
    base: buildArgs.BASE_PATH,
    envDir: __dirname,
    publicDir: path.resolve(rootDir, 'static'),
    build: {
      cssMinify: skipOptimizations ? false : 'esbuild',
      minify: skipOptimizations ? false : 'esbuild',
      outDir,
      reportCompressedSize: true,
      sourcemap: isDev ? 'inline' : false,
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
      ...Object.keys(buildArgs).reduce((acc, key) => ({
        ...acc,
        [`import.meta.env.${key}`]: JSON.stringify(buildArgs[key]),
      }), {}),
    },
    plugins: [
      react(),
      createHtmlPlugin({
        minify: !skipOptimizations,
        entry: path.resolve(rootDir, 'main.tsx'),
        inject: {
          data: {
            ...buildArgs.DEFAULT_METADATA,
            locale: buildArgs.DEFAULT_LOCALE,
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
      port: Number(env.PORT ?? 8080),
    },
    test: {
      coverage: {
        reporter: ['text-summary'],
        provider: 'v8',
      },
      environment: 'happy-dom',
      globals: true,
      include: [
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
      setupFiles: 'dotenv/config',
    },
  }
})
