/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
 */

import CopyPlugin from 'copy-webpack-plugin';
import { CachedInputFileSystem, NodeJsInputFileSystem, ResolverFactory } from 'enhanced-resolve';
import fs from 'fs';
import HTMLPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import { DefinePlugin, EnvironmentPlugin, IgnorePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import appConfig from './app.conf';

const isDev: boolean = process.env.NODE_ENV === `development`;
const useLinter: boolean = (isDev && appConfig.dev.linter) || (!isDev && appConfig.build.linter);
const useBundleAnalyzer: boolean = (!isDev && appConfig.build.analyzer);
const cwd: string = path.join(__dirname, `../`);
const inputDir: string = path.join(cwd, `src`);
const outputDir: string = path.join(cwd, `build`);
const translations = fs.readdirSync(path.join(cwd, `config/locales`))
  .filter((v) => !(/(^|\/)\.[^/.]/g).test(v))
  .map((val) => path.basename(val, `.json`))
  .filter((v) => ~appConfig.locales.indexOf(v))
  .reduce((obj, val) => {
    obj[val] = require(path.join(cwd, `config/locales`, `${val}.json`));
    return obj;
  }, {});

const config: any = {
  devtool: isDev ? `eval-source-map` : (appConfig.build.sourceMap ? `source-map` : false), ,
  entry: {
    bundle: path.join(inputDir, `index.tsx`)
  },
  mode: isDev ? `development` : `production`,
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.jsx?$/,
      use: `babel-loader`
    }, {
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: `awesome-typescript-loader`
    }, {
      test: /\.p?css$/,
      use: [
        ...[isDev ? `style-loader?sourceMap` : MiniCSSExtractPlugin.loader],
        ...[{
          loader: `css-loader`,
          options: {
            importLoaders: 1,
            localIdentName: `[hash:6]`,
            modules: true,
            sourceMap: isDev ? true : appConfig.build.sourceMap
          }
        }, {
          loader: `postcss-loader`,
          options: {
            ident: `postcss`,
            plugins: () => [
              require(`postcss-import`)({
                resolve(id, basedir) {
                  return ResolverFactory.createResolver({
                    alias: {
                      '@': inputDir
                    },
                    extensions: [`.css`, `.pcss`],
                    fileSystem: new CachedInputFileSystem(new NodeJsInputFileSystem(), 60000) as any,
                    useSyncFileSystemCalls: true
                  }).resolveSync({}, basedir, id);
                }
              }),
              require(`precss`)(),
              require(`postcss-hexrgba`)(),
              require(`postcss-calc`)(),
              require(`autoprefixer`)(),
              require(`cssnano`)()
            ],
            sourceMap: isDev ? true : appConfig.build.sourceMap
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
      enforce: `pre`,
      include: [inputDir],
      test: /\.jsx?$/,
      use: {
        loader: `eslint-loader`,
        options: {
          formatter: require(`eslint-friendly-formatter`)
        }
      }
    }] : []]
  },
  output: {
    filename: isDev ? `[name].js` : `[name].[chunkhash].js`,
    path: outputDir,
    publicPath: isDev ? `/` : appConfig.build.publicPath,
    sourceMapFilename: `[file].map`
  },
  plugins: [
    new CopyPlugin([{
      from: path.join(inputDir, `static`),
      ignore: [`.*`],
      to: outputDir
    }]),
    new EnvironmentPlugin({
      NODE_ENV: `production`
    }),
    new DefinePlugin({
      $APP_CONFIG: JSON.stringify(appConfig),
      $TRANSLATIONS: JSON.stringify(translations)
    }),
    new HTMLPlugin({
      appConfig,
      filename: `index.html`,
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      template: path.join(inputDir, `templates`, `index.html`)
    }),
    ...isDev ? [] : [
      new IgnorePlugin(/^.*\/config\/.*$/),
      new MiniCSSExtractPlugin({
        filename: `bundle.[chunkhash:8].css`
      })
    ],
    ...!useLinter ? [] : [
      new StyleLintPlugin({
        failOnError: false,
        files: [`**/*.css`, `**/*.pcss`],
        quiet: false
      })
    ],
    ...!useBundleAnalyzer ? [] : [
      new BundleAnalyzerPlugin()
    ]
  ],
  ...!isDev ? {} : {
    devServer: {
      historyApiFallback: true
    }
  },
  resolve: {
    alias: {
      '@': inputDir
    },
    extensions: [`.js`, `.jsx`, `.ts`, `.tsx`]
  },
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true
  },
  target: `web`
};

export default config;
