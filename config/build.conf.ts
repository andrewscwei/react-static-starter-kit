/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
 */

import appConfig from './app.conf';
import convert from 'koa-connect';
import fs from 'fs';
import history from 'connect-history-api-fallback';
import path from 'path';
import CachedInputFileSystem from 'enhanced-resolve/lib/CachedInputFileSystem';
import CopyPlugin from 'copy-webpack-plugin';
import HTMLPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import NodeJsInputFileSystem from 'enhanced-resolve/lib/NodeJsInputFileSystem';
import ResolverFactory from 'enhanced-resolve/lib/ResolverFactory';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { Configuration, EnvironmentPlugin, DefinePlugin, IgnorePlugin } from 'webpack';
import { Path } from 'typescript';

const isDev: boolean = process.env.NODE_ENV === `development`;
const useLinter: boolean = (isDev && appConfig.dev.linter) || (!isDev && appConfig.build.linter);
const useBundleAnalyzer: boolean = (!isDev && appConfig.build.analyzer);
const cwd: string = path.join(__dirname, `../`);
const inputDir: string = path.join(cwd, `src`);
const outputDir: string = path.join(cwd, `build`);
const translations = fs.readdirSync(path.join(cwd, `config/locales`))
  .filter(v => !(/(^|\/)\.[^/.]/g).test(v))
  .map(val => path.basename(val, `.json`))
  .filter(v => ~appConfig.locales.indexOf(v))
  .reduce((obj, val) => {
    obj[val] = require(path.join(cwd, `config/locales`, `${val}.json`));
    return obj;
  }, {});

const config: any = {
  mode: isDev ? `development` : `production`,
  target: `web`,
  devtool: isDev ? `eval-source-map` : (appConfig.build.sourceMap ? `source-map` : false),
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  entry: {
    bundle: path.join(inputDir, `index.jsx`)
  },
  output: {
    path: outputDir,
    publicPath: isDev ? `/` : appConfig.build.publicPath,
    filename: isDev ? `[name].js` : `[name].[chunkhash].js`,
    sourceMapFilename: `[file].map`
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: `babel-loader`
    }, {
      test: /\.p?css$/,
      use: [
        ...[isDev ? `style-loader?sourceMap` : MiniCSSExtractPlugin.loader],
        ...[{
          loader: `css-loader`,
          options: {
            modules: true,
            sourceMap: isDev ? true : appConfig.build.sourceMap,
            importLoaders: 1,
            localIdentName: `[hash:6]`
          }
        }, {
          loader: `postcss-loader`,
          options: {
            ident: `postcss`,
            sourceMap: isDev ? true : appConfig.build.sourceMap,
            plugins: () => [
              require(`postcss-import`)({
                resolve(id, basedir) {
                  return ResolverFactory.createResolver({
                    alias: {
                      '@': inputDir
                    },
                    extensions: [`.css`, `.pcss`],
                    useSyncFileSystemCalls: true,
                    fileSystem: new CachedInputFileSystem(new NodeJsInputFileSystem(), 60000)
                  }).resolveSync({}, basedir, id);
                }
              }),
              require(`precss`)(),
              require(`postcss-hexrgba`)(),
              require(`postcss-calc`)(),
              require(`autoprefixer`)(),
              require(`cssnano`)()
            ]
          }
        }]
      ]
    }, {
      test: /\.(jpe?g|png|gif|svg|ico)(\?.*)?$/,
      use: `url-loader?limit=10000&name=assets/images/[name]${isDev ? `` : `.[hash:6]`}.[ext]`
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: `url-loader?limit=10000&name=assets/media/[name]${isDev ? `` : `.[hash:6]`}.[ext]`
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: `url-loader?limit=10000&name=assets/fonts/[name]${isDev ? `` : `.[hash:6]`}.[ext]`
    },
    ...(isDev ? appConfig.dev.linter : appConfig.build.linter) ? [{
      test: /\.jsx?$/,
      include: [inputDir],
      enforce: `pre`,
      use: {
        loader: `eslint-loader`,
        options: {
          formatter: require(`eslint-friendly-formatter`)
        }
      }
    }] : []]
  },
  resolve: {
    extensions: [`.js`, `.jsx`],
    alias: {
      '@': inputDir
    }
  },
  // ...isDev ? {
  //   serve: {
  //     add: (app, middleware, options) => app.use(convert(history()))
  //   }
  // } : {}
};

export default config;
