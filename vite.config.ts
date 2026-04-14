/* eslint-disable no-console */

import react from '@vitejs/plugin-react'
import ejs from 'ejs'
import { minify } from 'html-minifier-terser'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import packageInfo from './package.json'

const loadArgs = (env: Record<string, string>) => ({
  BASE_PATH: join('/', (env.BASE_PATH ?? '/').replace(/\/+$/, '')),
  BASE_URL: (env.BASE_URL ?? '').replace(/\/+$/, ''),
  BUILD_NUMBER: env.BUILD_NUMBER ?? 'local',
  DEBUG: env.DEBUG === 'true',
  DEFAULT_LOCALE: env.DEFAULT_LOCALE ?? 'en',
  VERSION: packageInfo.version,
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const args = loadArgs(env)
  const isDev = mode === 'development'
  const rootDir = resolve(__dirname, 'src')
  const libDir = resolve(__dirname, 'lib')
  const outDir = resolve(__dirname, 'build')
  const publicDir = resolve(__dirname, 'public')
  const skipOptimizations = isDev || env.npm_config_raw === 'true'

  return {
    base: args.BASE_PATH,
    build: {
      emptyOutDir: false,
      minify: !skipOptimizations,
      outDir: join(outDir, args.BASE_PATH),
      rollupOptions: {
        output: {
          assetFileNames: skipOptimizations ? 'assets/[name][extname]' : 'assets/[hash][extname]',
          chunkFileNames: skipOptimizations ? 'assets/[name].js' : 'assets/[hash].js',
          entryFileNames: skipOptimizations ? 'assets/[name].js' : 'assets/[hash].js',
        },
      },
    },
    define: {
      ...Object.entries(args).reduce((acc, [key, value]) => ({
        ...acc,
        [`import.meta.env.${key}`]: JSON.stringify(value),
      }), {}),
    },
    envDir: __dirname,
    plugins: [
      react(),
      logger({ buildArgs: args }),
      htmlRenderer({ outDir, skipOptimizations }),
    ],
    publicDir,
    resolve: {
      alias: {
        '@': rootDir,
        '@lib': libDir,
      },
    },
    root: rootDir,
    server: {
      host: '0.0.0.0',
      port: Number(env.PORT ?? 8080),
    },
    test: {
      coverage: {
        provider: 'v8',
        reportsDirectory: resolve(__dirname, 'coverage'),
      },
      environment: 'happy-dom',
      globals: true,
      include: [
        '**/*.spec.(ts|tsx)',
        '**/*.test.(ts|tsx)',
      ],
      reporters: [
        'tree',
        ...process.env.GITHUB_ACTIONS === 'true' ? ['github-actions'] : [],
      ],
      setupFiles: 'dotenv/config',
    },
    worker: {
      format: 'es',
      rollupOptions: {
        output: {
          entryFileNames: 'workers/[hash].js',
        },
      },
    },
  }
})

function logger({ buildArgs }: { buildArgs: ReturnType<typeof loadArgs> }): Plugin {
  return {
    buildStart: async () => {
      const green = (text: string) => `\x1b[32m${text}\x1b[0m`
      const magenta = (text: string) => `\x1b[35m${text}\x1b[0m`
      const gray = (text: string) => `\x1b[90m${text}\x1b[0m`

      console.log()
      console.log(green('loading build args...'))
      console.log(gray('------------------------------------------------------------------------------'))

      Object.entries(buildArgs).forEach(([key, value]) => {
        console.log(`${magenta(key)}: ${JSON.stringify(value)}`)
      })

      console.log(gray('------------------------------------------------------------------------------'))
      console.log()
    },
    name: 'Custom plugin for logging build arguments and environment variables',
  }
}

function htmlRenderer({ outDir, skipOptimizations }: { outDir: string; skipOptimizations: boolean }): Plugin {
  return {
    name: 'Custom plugin for rendering HTML templates after bundle generation',
    transformIndexHtml: {
      handler: ejs.render,
      order: 'pre',
    },
    writeBundle: async () => {
      if (skipOptimizations === true) return

      const files = await readdir(outDir, { recursive: true })

      await Promise.all(files.map(async file => {
        if (extname(file) !== '.html') return

        const filePath = resolve(outDir, file)
        const input = await readFile(filePath, 'utf8')
        const output = await minify(input, {
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        })

        await writeFile(filePath, output, 'utf8')
      }))
    },
  }
}
