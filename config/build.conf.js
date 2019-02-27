/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
 */

import CopyPlugin from 'copy-webpack-plugin';
import HTMLPlugin from 'html-webpack-plugin';
import path from 'path';
import PrerenderSPAPlugin, { PuppeteerRenderer as Renderer } from 'prerender-spa-plugin';
import { DefinePlugin, EnvironmentPlugin, IgnorePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import appConf from './app.conf';
import { getLocaleDataFromDir, getLocalesFromDir, getLocalizedRoutesFromDir, getTranslationsFromDir } from './utils';

const isDev = process.env.NODE_ENV === 'development';
const useBundleAnalyzer = (!isDev && appConf.build.analyzer);
const cwd = path.join(__dirname, '../');
const inputDir = path.join(cwd, 'src');
const outputDir = path.join(cwd, 'build');
const localesDir = path.join(cwd, 'config/locales');
const locales = getLocalesFromDir(localesDir, appConf.locales[0], appConf.locales);

const config = {
  devtool: isDev ? 'cheap-eval-source-map' : (appConf.build.sourceMap ? 'source-map' : false),
  entry: {
    bundle: path.join(inputDir, 'index.jsx'),
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.jsx?$/,
      use: 'babel-loader?cacheDirectory',
    }, {
      test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
      loaders: [
        `url-loader?limit=8192&name=assets/images/[name]${isDev ? '' : '.[hash:6]'}.[ext]`,
        `image-webpack-loader?${isDev ? 'disable' : ''}`,
      ],
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: `url-loader?limit=8192&name=assets/media/[name]${isDev ? '' : '.[hash:6]'}.[ext]`,
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: `url-loader?limit=8192&name=assets/fonts/[name]${isDev ? '' : '.[hash:6]'}.[ext]`,
    }],
  },
  output: {
    filename: isDev ? '[name].js' : '[name].[chunkhash].js',
    path: outputDir,
    publicPath: appConf.build.publicPath,
    sourceMapFilename: '[file].map',
  },
  performance: {
    hints: isDev ? false : 'warning',
  },
  plugins: [
    new CopyPlugin([{
      from: path.join(inputDir, 'static'),
      ignore: ['.*'],
      to: outputDir,
    }]),
    new EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new DefinePlugin({
      __APP_CONFIG__: JSON.stringify(appConf),
      __INTL_CONFIG__: JSON.stringify({
        defaultLocale: appConf.locales[0],
        localeData: getLocaleDataFromDir(localesDir, locales),
        locales,
        dict: getTranslationsFromDir(localesDir, locales),
      }),
      __ROUTES_CONFIG__: JSON.stringify(getLocalizedRoutesFromDir(path.join(inputDir, 'containers'), locales)),
    }),
    new HTMLPlugin({
      appConf,
      filename: 'index.html',
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      template: path.join(inputDir, 'templates', 'index.html'),
    }),
    ...isDev ? [] : [
      new IgnorePlugin(/^.*\/config\/.*$/),
    ],
    ...!useBundleAnalyzer ? [] : [
      new BundleAnalyzerPlugin(),
    ],
    ...isDev ? [] : [
      new PrerenderSPAPlugin({
        staticDir: outputDir,
        routes: [
          '/',
          '/about/',
          '/ja/',
          '/ja/about/',
          '/404',
        ],
        // Optional minification.
        minify: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          keepClosingSlash: true,
          sortAttributes: true,
        },
        renderer: new Renderer({
          renderAfterTime: 100,
          injectProperty: '__PRERENDERING__',
          inject: {},
        }),
      }),
    ],
  ],
  ...!isDev ? {} : {
    devServer: {
      historyApiFallback: true,
    },
  },
  resolve: {
    alias: {
      ...!isDev ? {} : {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    extensions: ['.js', '.jsx'],
  },
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true,
  },
  target: 'web',
};

export default config;
