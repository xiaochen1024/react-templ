import process from 'process';

let configPath;
switch (process.env.RELEASE) {
  case 'development':
    configPath = './development';
    break;
  case 'test':
    configPath = './test';
    break;
  case 'production':
    configPath = './production';
    break;
  default:
    configPath = './production';
}

const server = require(configPath); // eslint-disable-line import/no-dynamic-require

export default server;
