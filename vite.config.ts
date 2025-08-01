/* eslint-disable no-console */

import react from '@vitejs/plugin-react'
import { render } from 'ejs'
import { minify } from 'html-minifier-terser'
import { readFile, readdir, writeFile } from 'node:fs/promises'
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
  const outDir = resolve(__dirname, 'build')
  const publicDir = resolve(__dirname, 'static')
  const skipOptimizations = isDev || env.npm_config_raw === 'true'

  printArgs(args)

  return {
    root: rootDir,
    base: args.BASE_PATH,
    envDir: __dirname,
    publicDir,
    build: {
      emptyOutDir: false,
      minify: skipOptimizations ? false : 'esbuild',
      outDir: join(outDir, args.BASE_PATH),
      rollupOptions: {
        treeshake: 'smallest',
      },
    },
    define: {
      ...Object.entries(args).reduce((acc, [key, value]) => ({
        ...acc,
        [`import.meta.env.${key}`]: JSON.stringify(value),
      }), {}),
    },
    plugins: [
      react(),
      htmlRenderer({ outDir, skipOptimizations }),
    ],
    resolve: {
      alias: {
        '@lib': resolve(__dirname, 'lib'),
      },
    },
    server: {
      host: '0.0.0.0',
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

function printArgs(args: ReturnType<typeof loadArgs>) {
  const green = (text: string) => `\x1b[32m${text}\x1b[0m`
  const magenta = (text: string) => `\x1b[35m${text}\x1b[0m`

  console.log(green('Build args:'))

  Object.entries(args).forEach(([key, value]) => {
    console.log(`${magenta(key)}: ${JSON.stringify(value)}`)
  })
}

function htmlRenderer({ outDir, skipOptimizations }: { outDir: string; skipOptimizations: boolean }): Plugin {
  return {
    name: 'Custom plugin for rendering HTML templates after bundle generation',
    transformIndexHtml: {
      order: 'pre',
      handler: render,
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
