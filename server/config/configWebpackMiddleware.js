/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
/* eslint-enable import/no-extraneous-dependencies */

import webpackConfig from 'project/webpack/client/webpackDevConfig';

export default function (app) {
  const compiler = webpack(webpackConfig);

  new webpack.ProgressPlugin().apply(compiler);

  const wdmInstance = webpackDevMiddleware(compiler, {
    lazy: false,
    quiet: false,
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    },
  });

  app.use(wdmInstance);

  app.locals.wdmInstance = wdmInstance;

  wdmInstance.waitUntilValid(() => {
    const url = `${app.locals.server.h5root}/assetsManifest.json`;
    const fileName = wdmInstance.getFilenameFromUrl(url);
    const manifestContent = wdmInstance.fileSystem.readFileSync(fileName);
    app.locals.assetsManifest = JSON.parse(manifestContent);
  });

  app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  }));
}
