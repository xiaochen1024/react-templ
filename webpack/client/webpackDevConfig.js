import webpack from 'webpack';
import cloneDeep from 'lodash/cloneDeep';
import webpackMerge from 'webpack-merge';
import webpackBaseConfig from './webpackBaseConfig';

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

const baseConfig = cloneDeep(webpackBaseConfig);
const entries = baseConfig.entry;
Object.keys(entries).forEach((key) => {
  const val = entries[key];
  if (!Array.isArray(val)) {
    entries[key] = [hotMiddlewareScript].concat(entries[key]);
  }
});
baseConfig.entry = entries;

const finalConfig = webpackMerge.smart(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: '[file].map',
    //   exclude: /(vendor)\.\w{6}\.(js|css)/,
    // }),
  ],
});

export default finalConfig;
