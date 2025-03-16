/* eslint-disable no-console */

import react from '@vitejs/plugin-react'
import { render } from 'ejs'
import { minify } from 'html-minifier-terser'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import packageInfo from './package.json'

const defineArgs = (env: ReturnType<typeof loadEnv>) => ({
  BASE_PATH: env.BASE_PATH ?? '/',
  BASE_URL: (env.BASE_URL ?? '').replace(/\/+$/, ''),
  BUILD_NUMBER: env.BUILD_NUMBER ?? 'local',
  DEBUG: env.DEBUG ?? '',
  DEFAULT_LOCALE: env.DEFAULT_LOCALE ?? 'en',
  VERSION: packageInfo.version,
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const args = defineArgs(env)
  const isDev = mode === 'development'
  const rootDir = resolve(__dirname, 'src')
  const outDir = resolve(__dirname, join('build', args.BASE_PATH))
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
      outDir,
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
      ejs({ outDir, skipOptimizations }),
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

function printArgs(args: ReturnType<typeof defineArgs>) {
  const resetColor = '\x1b[0m'
  const magentaColor = '\x1b[35m'
  const greenColor = '\x1b[32m'

  console.log(`${greenColor}Build args:${resetColor}`)
  Object.entries(args).forEach(([key, value]) => {
    console.log(`${magentaColor}${key}${resetColor}: ${JSON.stringify(value)}`)
  })
}

function ejs({ outDir, skipOptimizations }): Plugin {
  return {
    name: 'ejs',
    transformIndexHtml: {
      order: 'pre',
      handler: render,
    },
    closeBundle: async () => {
      if (skipOptimizations === true) return

      let files: string[]

      try {
        files = await readdir(outDir, { recursive: true })
      }
      catch {
        console.warn('Minifying HTML...', 'SKIP', `No directory found at '${outDir}'`)
        return
      }

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
