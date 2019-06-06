import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist) => {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach((file) => {
    const absFile = path.join(dir, file);
    if (fs.statSync(absFile).isDirectory()) {
      filelist = walkSync(absFile, filelist);
    } else {
      filelist.push(absFile);
    }
  });
  return filelist;
};

export default function (entryRoot, targetDir = '') {
  let entries = walkSync(entryRoot);
  entries = entries.reduce((entriesItem, dir) => {
    const regex = new RegExp(`^${entryRoot}/(.*)\.jsx?$`, 'g'); //eslint-disable-line
    entriesItem[dir.replace(regex, (match, p1) => targetDir + p1)] = dir;
    return entriesItem;
  }, {});

  return entries;
}
