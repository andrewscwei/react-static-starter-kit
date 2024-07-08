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

type BuildArgs = {
  /**
   * Indicates whether the build is running in development mode.
   */
  isDev: boolean

  /**
   * Build number.
   */
  buildNumber: string

  /**
   * Version number.
   */
  version: string

  /**
   * Base URL of the app.
   */
  baseURL: string

  /**
   * Base path of the router (i.e. the `basename` property).
   */
  basePath: string

  /**
   * Absolute public URL for static assets.
   */
  publicURL: string

  /**
   * Public path for static assets.
   */
  publicPath: string

  /**
   * Specifies whether source maps should be generated.
   */
  useSourceMaps: boolean

  /**
   * Specifies whether HTML/JS/CSS minifications should be disabled while
   * building.
   */
  skipOptimizations: boolean

  /**
   * Specifies the port to use during development.
   */
  port: number
}

const parseBuildArgs = (mode: string): BuildArgs => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    basePath: env.BASE_PATH ?? '/',
    baseURL: env.BASE_URL ?? '',
    buildNumber: env.BUILD_NUMBER ?? 'local',
    isDev: env.NODE_ENV === 'development',
    port: Number(env.PORT ?? 8080),
    publicPath: env.PUBLIC_PATH ?? env.BASE_PATH ?? '/',
    publicURL: env.PUBLIC_URL ?? env.BASE_URL ?? '',
    skipOptimizations: env.NODE_ENV === 'development' || env.npm_config_raw === 'true',
    useSourceMaps: env.NODE_ENV === 'development',
    version: packageInfo.version,
  }
}

export default defineConfig(({ mode }) => {
  const buildArgs = parseBuildArgs(mode)
  const rootDir = path.resolve(__dirname, 'src')

  return {
    root: rootDir,
    base: buildArgs.publicPath,
    publicDir: path.resolve(rootDir, 'static'),
    build: {
      cssMinify: buildArgs.skipOptimizations ? false : 'esbuild',
      minify: buildArgs.skipOptimizations ? false : 'esbuild',
      outDir: path.resolve(__dirname, 'build'),
      reportCompressedSize: true,
      sourcemap: buildArgs.useSourceMaps ? 'inline' : true,
      target: 'esnext',
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: buildArgs.isDev ? '[name]_[local]_[hash:base64:5]' : '_[hash:base64:5]',
      },
      postcss: {
        plugins: [
          PostCSSImportPlugin(),
          PostCSSPresetEnvPlugin({
            features: {
              'nesting-rules': true,
            },
          }),
          ...buildArgs.isDev ? [] : [
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
        minify: !buildArgs.skipOptimizations,
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
      port: buildArgs.port,
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
