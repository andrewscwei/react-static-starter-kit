import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import packageInfo from './package.json'

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
    publicDir: path.resolve(__dirname, 'static'),
    build: {
      cssMinify: skipOptimizations ? false : 'esbuild',
      emptyOutDir: false,
      minify: skipOptimizations ? false : 'esbuild',
      outDir,
      reportCompressedSize: true,
      sourcemap: isDev ? 'inline' : false,
      target: 'esnext',
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

function parseBuildArgs(env: Record<string, string>) {
  return {
    BASE_PATH: env.BASE_PATH ?? '/',
    BASE_URL: env.BASE_URL ?? '',
    BUILD_NUMBER: env.BUILD_NUMBER ?? 'local',
    DEBUG_MODE: env.DEBUG_MODE ?? '',
    DEFAULT_LOCALE: env.DEFAULT_LOCALE ?? 'en',
    DEFAULT_METADATA: {
      canonicalURL: env.BASE_URL ?? '',
      description: 'React static app starter kit',
      maskIconColor: '#000',
      themeColor: '#15141a',
      title: 'React Static Starter Kit',
    },
    VERSION: packageInfo.version,
  }
}
