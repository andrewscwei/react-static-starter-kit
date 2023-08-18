/**
 * @file Webpack config for development and production.
 */

import PostCSSPurgeCSS from '@fullhuman/postcss-purgecss'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin'
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import HTMLPlugin from 'html-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import PostCSSPresetEnv from 'postcss-preset-env'
import TerserPlugin from 'terser-webpack-plugin'
import { Configuration, DefinePlugin, EnvironmentPlugin, IgnorePlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import * as buildArgs from './build.args'
import createResolveAssetPath from './utils/createResolveAssetPath'

const isDev = process.env.NODE_ENV === 'development'

const config: Configuration = {
  devtool: isDev ? 'source-map' : false,
  entry: {
    main: path.join(buildArgs.inputDir, 'index.ts'),
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
            ...isDev ? [require.resolve('react-refresh/babel')] : [],
          ],
        },
      }],
    }, ...[true, false].map(useCSSModules => ({
      test: /\.css$/,
      ...useCSSModules ? { include: /\.module\.css$/ } : { exclude: /\.module\.css$/ },
      use: [{
        loader: isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: useCSSModules,
          sourceMap: buildArgs.useSourceMaps,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: buildArgs.useSourceMaps,
          postcssOptions: {
            plugins: [
              PostCSSPresetEnv({
                features: {
                  'nesting-rules': true,
                },
              }),
              ...isDev ? [] : [PostCSSPurgeCSS({
                content: [
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
      }],
    })), {
      test: /\.svg$/,
      include: /assets\/svgs/,
      type: 'asset/source',
    }, {
      test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
      include: /assets\/images/,
      type: 'asset',
      generator: {
        filename: `assets/images/${isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      include: /assets\/media/,
      type: 'asset',
      generator: {
        filename: `assets/media/${isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      include: /assets\/fonts/,
      type: 'asset',
      generator: {
        filename: `assets/fonts/${isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }, {
      test: /\.(jpe?g|png|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/,
      include: /assets\/meta/,
      type: 'asset/resource',
      generator: {
        filename: `${isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }],
  },
  optimization: {
    minimize: !buildArgs.skipOptimizations,
    minimizer: [
      new CSSMinimizerPlugin(),
      new TerserPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        js: {
          chunks: 'all',
          enforce: true,
          name: 'common',
          test: /node_modules/,
        },
        css: {
          chunks: 'all',
          enforce: true,
          maxInitialRequests: 1,
          name: 'common',
          test: /\.css$/,
        },
      },
    },
  },
  output: {
    filename: isDev ? '[name].js' : '[name].[chunkhash].js',
    path: buildArgs.outputDir,
    publicPath: buildArgs.publicPath,
    sourceMapFilename: '[file].map',
  },
  performance: {
    hints: isDev ? false : 'warning',
    maxAssetSize: 512 * 1024,
    maxEntrypointSize: 512 * 1024,
  },
  plugins: [
    new MiniCSSExtractPlugin({
      chunkFilename: isDev ? '[id].css' : '[id].[chunkhash].css',
      filename: isDev ? '[name].css' : '[name].[chunkhash].css',
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
      buildArgs,
      resolvePublicPath: createResolveAssetPath(buildArgs.publicPath),
      resolvePublicURL: createResolveAssetPath(buildArgs.publicURL),
      chunks: ['common', 'main'],
      filename: 'index.html',
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      template: path.join(buildArgs.inputDir, 'templates', 'index.html'),
    }),
    ...isDev ? [new ReactRefreshPlugin()] : [],
    ...isDev ? [] : [new IgnorePlugin({
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
  ...isDev ? {
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
