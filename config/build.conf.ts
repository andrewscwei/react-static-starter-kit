/**
 * @file Webpack config for building the app in both `development` and `production` environments.
 */

import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import HTMLPlugin from 'html-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { DefinePlugin, EnvironmentPlugin, IgnorePlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import appConf from './app.conf'

const isDev = process.env.NODE_ENV === 'development'
const inputDir = path.join(__dirname, '../', 'src')
const outputDir = path.join(__dirname, '../', 'build')
const port = Number(process.env.PORT ?? 8080)
const useBundleAnalyzer = process.env.npm_config_analyze === 'true'
const skipOptimizations = isDev || process.env.npm_config_raw === 'true'

export default {
  devtool: isDev ? 'eval-source-map' : false,
  entry: {
    main: path.join(inputDir, 'index.tsx'),
    polyfills: path.join(inputDir, 'polyfills.ts'),
  },
  infrastructureLogging: {
    level: 'error',
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.[jt]sx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: [
            isDev && require.resolve('react-refresh/babel'),
          ].filter(Boolean),
        },
      }],
    }, {
      test: /\.css$/,
      use: [{
        loader: isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: true,
          sourceMap: isDev,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: isDev,
          postcssOptions: {
            plugins: [
              ['postcss-preset-env', {
                features: {
                  'nesting-rules': true,
                },
              }],
              !skipOptimizations && 'cssnano',
            ].filter(Boolean),
          },
        },
      }],
    }, {
      test: /\.svg$/,
      include: /assets\/svgs/,
      type: 'asset/source',
    }, {
      test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
      exclude: /assets\/svgs/,
      type: 'asset',
      generator: {
        filename: `assets/images/${skipOptimizations ? '[name]' : '[hash:base64]'}.[ext]`,
      },
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: `assets/media/${skipOptimizations ? '[name]' : '[hash:base64]'}.[ext]`,
      },
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: `assets/fonts/${skipOptimizations ? '[name]' : '[hash:base64]'}.[ext]`,
      },
    }],
  },
  optimization: {
    minimize: !skipOptimizations,
    splitChunks: {
      cacheGroups: {
        common: {
          chunks: 'all',
          enforce: true,
          name: 'common',
          test: /node_modules/,
        },
      },
    },
  },
  output: {
    filename: skipOptimizations ? '[name].js' : '[chunkhash].js',
    path: outputDir,
    publicPath: process.env.PUBLIC_PATH || '/',
    sourceMapFilename: '[file].map',
  },
  performance: {
    hints: isDev ? false : 'warning',
    maxAssetSize: 512 * 1024,
    maxEntrypointSize: 512 * 1024,
  },
  plugins: [
    new MiniCSSExtractPlugin({
      chunkFilename: skipOptimizations ? '[id].css' : '[chunkhash].css',
      filename: skipOptimizations ? '[name].css' : '[chunkhash].css',
    }),
    new ForkTSCheckerPlugin(),
    new CopyPlugin({
      patterns: [{
        from: path.join(inputDir, 'static'),
        to: outputDir,
      }],
    }),
    new EnvironmentPlugin({
      'NODE_ENV': 'production',
    }),
    new DefinePlugin({
      '__CONFIG__': JSON.stringify(appConf),
    }),
    new HTMLPlugin({
      appConf,
      chunks: ['common', 'main'].concat(isDev ? [] : ['polyfills']),
      filename: 'index.html',
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      template: path.join(inputDir, 'templates', 'index.html'),
    }),
    isDev && new ReactRefreshPlugin(),
    !isDev && new IgnorePlugin({
      resourceRegExp: /^.*\/config\/.*$/,
    }),
    useBundleAnalyzer && new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
  ].filter(Boolean),
  devServer: {
    client: {
      logging: 'error',
    },
    headers: {
      'Access-Control-Allow-Origin': `http://localhost:${port}`,
      'Access-Control-Allow-Methods': 'GET,OPTIONS,HEAD,PUT,POST,DELETE,PATCH',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With',
      'Access-Control-Allow-Credentials': 'true',
    },
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    port,
    static: {
      publicPath: process.env.PUBLIC_PATH || '/',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true,
  },
  target: 'web',
}
