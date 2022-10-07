/**
 * @file Webpack config for building the app in both `development` and `production` environments.
 */

import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import HTMLPlugin from 'html-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { Configuration, DefinePlugin, EnvironmentPlugin, IgnorePlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import * as buildArgs from './build.args'

const config: Configuration = {
  devtool: buildArgs.isDev ? 'eval-source-map' : false,
  entry: {
    polyfills: path.join(buildArgs.inputDir, 'polyfills.ts'),
    main: path.join(buildArgs.inputDir, 'index.tsx'),
  },
  infrastructureLogging: {
    level: 'error',
  },
  mode: buildArgs.isDev ? 'development' : 'production',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.[jt]sx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: [
            ...buildArgs.isDev ? [require.resolve('react-refresh/babel')] : [],
          ],
        },
      }],
    }, {
      test: /\.css$/,
      use: [{
        loader: buildArgs.isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: true,
          sourceMap: buildArgs.isDev,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: buildArgs.isDev,
          postcssOptions: {
            plugins: [
              ['postcss-preset-env', {
                features: {
                  'nesting-rules': true,
                },
              }],
              ...buildArgs.skipOptimizations ? [] : ['cssnano'],
            ],
          },
        },
      }],
    }, {
      test: /\.svg$/,
      include: /assets\/svgs/,
      type: 'asset/source',
    }, {
      test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
      include: /assets\/images/,
      type: 'asset',
      generator: {
        filename: `assets/images/${buildArgs.isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      include: /assets\/media/,
      type: 'asset',
      generator: {
        filename: `assets/media/${buildArgs.isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      include: /assets\/fonts/,
      type: 'asset',
      generator: {
        filename: `assets/fonts/${buildArgs.isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }, {
      test: /\.(jpe?g|png|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/,
      include: /assets\/meta/,
      type: 'asset/resource',
      generator: {
        filename: `${buildArgs.isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }],
  },
  optimization: {
    minimize: !buildArgs.skipOptimizations,
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
    filename: buildArgs.isDev ? '[name].js' : '[name].[chunkhash].js',
    path: buildArgs.outputDir,
    publicPath: buildArgs.publicPath,
    sourceMapFilename: '[file].map',
  },
  performance: {
    hints: buildArgs.isDev ? false : 'warning',
    maxAssetSize: 512 * 1024,
    maxEntrypointSize: 512 * 1024,
  },
  plugins: [
    new MiniCSSExtractPlugin({
      chunkFilename: buildArgs.isDev ? '[id].css' : '[id].[chunkhash].css',
      filename: buildArgs.isDev ? '[name].css' : '[name].[chunkhash].css',
    }),
    new ForkTSCheckerPlugin(),
    new CopyPlugin({
      patterns: [{
        from: path.join(buildArgs.inputDir, 'static'),
        to: buildArgs.outputDir,
      }],
    }),
    new EnvironmentPlugin({
      'NODE_ENV': 'production',
    }),
    new DefinePlugin({
      '__BUILD_ARGS__': JSON.stringify(buildArgs),
    }),
    new HTMLPlugin({
      chunks: ['common', 'main'].concat(buildArgs.isDev ? [] : ['polyfills']),
      filename: 'index.html',
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      template: path.join(buildArgs.inputDir, 'templates', 'index.html'),
    }),
    ...buildArgs.isDev ? [new ReactRefreshPlugin()] : [],
    ...buildArgs.isDev ? [] : [new IgnorePlugin({
      resourceRegExp: /^.*\/config\/.*$/,
    })],
    ...buildArgs.useBundleAnalyzer ? [new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    })] : [],
  ],
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
  ...buildArgs.isDev ? {
    devServer: {
      client: {
        logging: 'error',
      },
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,HEAD,PUT,POST,DELETE,PATCH',
        'Access-Control-Allow-Origin': `http://localhost:${buildArgs.devPort}`,
      },
      historyApiFallback: true,
      host: '0.0.0.0',
      hot: true,
      port: buildArgs.devPort,
      static: {
        publicPath: buildArgs.publicPath,
      },
    },
  } : {},
}

export default config
