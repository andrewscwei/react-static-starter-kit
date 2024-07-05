import PostCSSPurgeCSS from '@fullhuman/postcss-purgecss'
import react from '@vitejs/plugin-react'
import path from 'path'
import PostCSSImportPlugin from 'postcss-import'
import PostCSSPresetEnvPlugin from 'postcss-preset-env'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import svgr from 'vite-plugin-svgr'
import * as buildArgs from './config/build.args'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  root: buildArgs.inputDir,
  build: {
    target: 'esnext',
    reportCompressedSize: true,
    sourcemap: buildArgs.useSourceMaps,
    outDir: buildArgs.outputDir,
  },
  css: {
    postcss: {
      plugins: [
        PostCSSImportPlugin(),
        PostCSSPresetEnvPlugin({
          features: {
            'nesting-rules': true,
          },
        }),
        ...isDev ? [] : [PostCSSPurgeCSS({
          content: [
            path.join(buildArgs.libDir, '**/*.html'),
            path.join(buildArgs.inputDir, '**/*.html'),
            path.join(buildArgs.inputDir, '**/*.tsx'),
            path.join(buildArgs.inputDir, '**/*.ts'),
            path.join(buildArgs.inputDir, '**/*.module.css'),
          ],
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        })],
      ],
    },
  },
  define: {
    __BUILD_ARGS__: JSON.stringify(buildArgs),
  },
  plugins: [
    react(),
    svgr(),
    createHtmlPlugin({
      minify: true,
      entry: path.resolve(buildArgs.inputDir, 'index.tsx'),
      // template: path.resolve(buildArgs.libDir, 'templates/index.html'),
    }),
  ],
  resolve: {
    alias: {
      '@lib': buildArgs.libDir,
    },
  },
  server: {
    host: 'localhost',
    port: buildArgs.devPort,
  },
  // test: {
  //   coverage: {
  //     reportsDirectory: path.resolve(__dirname, 'coverage'),
  //     provider: 'v8',
  //   },
  //   reporters: ['default'],
  //   globals: true,
  //   environment: 'jsdom',
  // },
})
