import fs from 'fs';
import archiver from 'archiver';
import process from 'process';
import pkg from '../package.json';

const createTimeFile = () => {
  const now = new Date();
  const y = now.getFullYear();
  const M = String(now.getMonth() + 1).length === 1 ? `0${now.getMonth()}${1}` : now.getMonth() + 1;
  const d = String(now.getDate()).length === 1 ? `0${now.getDate()}` : now.getDate();
  const h = String(now.getHours()).length === 1 ? `0${now.getHours()}` : now.getHours();
  const m = String(now.getMinutes()).length === 1 ? `0${now.getMinutes()}` : now.getMinutes();
  const s = String(now.getSeconds()).length === 1 ? `0${now.getSeconds()}` : now.getSeconds();
  const time = `${y}${M}${d}${h}${m}${s}`;
  fs.writeFile('./time.txt', time, {}, (err) => {
    if (err) {
      throw err;
    }
    console.log(`文件时间戳${time}`);
  });
  return time;
};

let output = fs.createWriteStream(`${__dirname}/../${pkg.name}-${pkg.version}.zip`);

if (process.env.RELEASE === 'production') {
  output = fs.createWriteStream(
    `${__dirname}/../${pkg.name}-${pkg.version}-${createTimeFile()}.zip`,
  );
}
const archive = archiver('zip');

const startTime = new Date().getTime();
console.log('正在打包部署包...');

output.on('close', () => {
  const endTime = new Date().getTime();
  const elaspedTime = (endTime - startTime) / 1000;
  const filesize = (archive.pointer() / 1000 / 1000).toFixed(2); // MB
  console.log(`打包部署包完成，包大小为：${filesize}MB，耗时：${elaspedTime}s`);
});

archive.on('error', (err) => {
  throw err;
});

archive.on('entry', (entry) => {
  if (!entry.name.match(/^node_modules/g) && entry.type === 'file') {
    console.log(`添加文件：${entry.name}`);
  }
});

const timestamp = new Date();

archive.pipe(output);

// let pm2ConfigFile = process.env.RELEASE === 'test' ? 'app.test.json' : 'app.prod.json';
const pm2ConfigFile = `app.${process.env.RELEASE}.json`;
archive.file(pm2ConfigFile, { date: timestamp, name: 'app.pm2.json' });
archive.file('start.sh', { date: timestamp });
archive.file('stop.sh', { date: timestamp });
archive.file('package.json', { date: timestamp });
archive.directory('build', '.', { date: timestamp });

// 添加Node运行时依赖
require('child_process').exec('npm ls --production --parseable', (err, stdout) => {
  if (err) throw err;
  const files = stdout.split('\n');
  files.forEach((f) => {
    const pos = f.indexOf('node_modules');
    if (pos !== -1) {
      const dir = f.substring(pos);
      console.log(`添加Node依赖：${dir}`);
      archive.directory(dir, true, { date: timestamp });
    }
  });
  archive.finalize();
});
