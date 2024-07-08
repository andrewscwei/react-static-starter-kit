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

const parseBuildArgs = (env: Record<string, string>) => ({
  // Base path of the router (i.e. the `basename` property)
  basePath: env.BASE_PATH ?? '/',
  // Base URL of the app
  baseURL: env.BASE_URL ?? '',
  // Build number
  buildNumber: env.BUILD_NUMBER ?? 'local',
  // Public path for static assets
  publicPath: env.PUBLIC_PATH ?? env.BASE_PATH ?? '/',
  // Absolute public URL for static assets
  publicURL: env.PUBLIC_URL ?? env.BASE_URL ?? '',
  // Version number
  version: packageInfo.version,
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
    root: rootDir,
    base: buildArgs.publicPath,
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
      'import.meta.env.BUILD_ARGS': JSON.stringify(buildArgs),
    },
    plugins: [
      react(),
      svgr(),
      createHtmlPlugin({
        minify: !skipOptimizations,
        entry: path.resolve(rootDir, 'index.tsx'),
        inject: {
          data: {
            buildArgs,
            resolveURL: (subpath: string) => path.join(buildArgs.publicURL, subpath),
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
        reportsDirectory: path.resolve(__dirname, 'coverage'),
        provider: 'v8',
      },
      reporters: ['default'],
      globals: true,
      environment: 'jsdom',
    },
  }
})
