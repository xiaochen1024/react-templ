import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import cloneDeep from 'lodash/cloneDeep';
import commandLineArgs from 'command-line-args';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import StatsPlugin from 'stats-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import _ from 'lodash';

import webpackBaseConfig from './webpackBaseConfig';

const HASH_LENGTH = 8;

const optionDefinitions = [
  { name: 'analyze', type: Boolean, defaultValue: false },
  { name: 'stats', type: Boolean, defaultValue: false },
];
const options = commandLineArgs(optionDefinitions);
let config = cloneDeep(webpackBaseConfig);
const plugins = [
  new MiniCSSExtractPlugin({
    filename: `styles/[name].[contenthash:${HASH_LENGTH}].css`,
    chunkFilename: `styles/[name].[contenthash:${HASH_LENGTH}].css`,
  }),
  new webpack.HashedModuleIdsPlugin(),
];

if (options.analyze) {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: '8888',
    openAnalyzer: false,
  }));
}

if (options.stats) {
  plugins.push(new StatsPlugin('stats.json', {
    chunkModules: true,
  }));
}

// Merge common configuration
config = webpackMerge(config, {
  output: {
    filename: `scripts/[name].[contenthash:${HASH_LENGTH}].js`,
    chunkFilename: `scripts/[name].[contenthash:${HASH_LENGTH}].js`,
  },
  parallelism: 1,
  profile: options.stats,
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
});

// Merge plugins
config = webpackMerge({
  customizeArray(a, b, key) {
    if (key === 'plugins') {
      return _.uniqBy(
        [...b, ...a],
        plugin => plugin.constructor || plugin.constructor.name,
      );
    }
    return undefined;
  },
})(config, { plugins });

// Merge loaders
config = webpackMerge.smart(config, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: `styles/fonts/[name].[hash:${HASH_LENGTH}].[ext]`,
        },
      }, {
        test: /\.(png|jp(e)?g|gif)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: `images/[name].[hash:${HASH_LENGTH}].[ext]`,
        },
      },
    ],
  },
});

const finalConfig = config;
export default finalConfig;
