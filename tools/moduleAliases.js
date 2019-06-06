const path = require('path');

const root = [path.resolve(__dirname, '..')];

module.exports.babel = {
  root,
  alias: {
    project: '.',
    server: './server',
    client: './client',
    scripts: './client/scripts',
    styles: './client/styles',
    images: './client/images',

  },
};

module.exports.webpack = {
  root,
  alias: {
    project: '.',
    server: 'server',
    client: 'client',
    scripts: 'client/scripts',
    styles: 'client/styles',
    images: 'client/images',
  },
};
