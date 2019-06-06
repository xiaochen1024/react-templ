import path from "path";
import url from "url";
import process from "process";
import webpack from "webpack";
import autoprefixer from "autoprefixer";
// import CopyWebpackPlugin from 'copy-webpack-plugin';
// import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import MiniCSSExtractPlugin from "mini-css-extract-plugin";
import ManifestPlugin from "webpack-manifest-plugin";
import merge from "lodash/merge";

import listEntries from "../utils/listEntries";
import server from "../../server/config/server";
import moduleAliases from "../../tools/moduleAliases";

process.traceDeprecation = true;

const env = process.env.NODE_ENV;
const isDev = env === "development";
const root = process.cwd();
const dirs = { res: "client", dist: "build/client", tmp: ".tmp/client" };
const baseDir = `${dirs.res}`;
const outputPath = dirs.dist;
const entryRoot = path.join(baseDir, "scripts/pages");

export const normalEntries = listEntries(entryRoot);
export const SUPPORT_BROWSERS = ["last 5 versions", "safari >= 8"];
export const GLOBALS = {
  __DEV__: JSON.stringify(env === "development")
};

const entries = merge(
  {
    vendor: [
      "react",
      "react-dom",
      "react-router",
      "mobx",
      "mobx-react",
      "axios",
      "lodash",
      "antd",
      "echarts"
      // 'monaco-editor', 'react-monaco-editor'
    ]
  },
  normalEntries
);

export default {
  target: "web",
  context: root,
  entry: entries,
  output: {
    path: path.join(root, outputPath),
    publicPath: url.resolve(`${server.h5root}/`, "."),
    filename: "scripts/[name].js",
    chunkFilename: "scripts/[name].js"
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: "vendor",
          name: "vendor",
          enforce: true
        },
        commons: {
          chunks: "initial",
          minChunks: 3,
          name: "commons",
          enforce: true
        }
      }
    }
  },
  plugins: [
    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),
    new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(zh-cn)$/),
    new MiniCSSExtractPlugin({
      filename: "styles/[name].css",
      chunkFilename: "styles/[name].css"
    }),
    new ManifestPlugin({
      fileName: "assetsManifest.json",
      generate(seed, files) {
        const assetsMap = {};
        files.forEach(({ name, path: assetPath }) => {
          let key;
          let ext;
          if (name.endsWith(".css")) {
            key = name.substring(0, name.length - 4);
            ext = "css";
          } else if (name.endsWith(".js")) {
            key = name.substring(0, name.length - 3);
            ext = "js";
          } else {
            return;
          }

          if (assetsMap[key]) {
            assetsMap[key][ext] = assetPath;
          } else {
            assetsMap[key] = { [ext]: assetPath };
          }
        });

        return { ...seed, ...assetsMap };
      }
    })
    // new MonacoWebpackPlugin(),
    // new CopyWebpackPlugin([
    //   {
    //     from: 'node_modules/monaco-editor/min/vs',
    //     to: 'vs',
    //   },
    // ]),
  ],
  module: {
    rules: [
      {
        test: /\.(es6|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            cacheDirectory: ".tmp/babel-loader",
            presets: [
              [
                "@babel/preset-env",
                {
                  modules: false,
                  useBuiltIns: "usage",
                  targets: { browsers: SUPPORT_BROWSERS }
                }
              ],
              "@babel/preset-react"
            ],
            plugins: [
              "@babel/plugin-transform-modules-commonjs",
              "@babel/plugin-syntax-dynamic-import",
              // '@babel/plugin-syntax-import-meta',
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              ["import", { libraryName: "antd", style: true }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: isDev,
              modules: false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: isDev,
              plugins() {
                return [autoprefixer({ browsers: SUPPORT_BROWSERS })];
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: isDev,
              modules: false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: isDev,
              plugins() {
                return [autoprefixer({ browsers: SUPPORT_BROWSERS })];
              }
            }
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
              sourceMap: isDev
            }
          }
        ]
      },
      {
        test: /\.(svg)$/i,
        loader: "svg-sprite-loader",
        include: [require.resolve("antd").replace(/warn\.js$/, "")]
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        exclude: /node_modules/,
        loader: "file-loader",
        options: {
          name: "styles/fonts/[name].[ext]"
        }
      },
      {
        test: /\.(png|jp(e)?g|gif)$/,
        exclude: /node_modules/,
        loader: "file-loader",
        options: {
          name: "images/[name].[ext]"
        }
      }
    ]
  },
  resolve: {
    extensions: [".web.js", ".jsx", ".js", ".es6", ".json"],
    modules: ["node_modules"].concat(moduleAliases.webpack.root),
    alias: moduleAliases.webpack.alias
  }
};
