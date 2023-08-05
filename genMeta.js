import fs from 'fs';
import fs_extra from 'fs-extra';
import path from 'path';

function getAllBlockComment(src) {
  const reg = /\/\*[:~][\s\S]*?\*\//g;
  //console.log(src);
  // console.log(src.match(reg));
  return src.match(reg)?.join('\n') ?? 'no comment';
}


export default function writeAFile(pluginDir = 'src/plugins', outDir = 'meta') {
  return {
    name: 'write-a-file',

    buildStart() {
      fs.mkdirSync('./' + outDir, { recursive: true });
      fs_extra.emptyDirSync('./' + outDir);
    },

    transform: {
      order: 'pre',
      handler(src, id) {
        //const pluginDirPath = path.resolve(__dirname, pluginDir);
        const pluginDirPath = __dirname.replace(/\\/g, '/') + '/' + pluginDir;
        // console.log(pluginDirPath);
        // console.log(id);
        // console.log(id.startsWith(pluginDirPath));
        // console.log(id.split('/') , pluginDirPath.split('/'));
        // console.log('');
        return new Promise((resolve, reject) => {
          // 确定文件是否属于pluginDir的第一级
          if (!id.startsWith(pluginDirPath) || id.split('/').length !== pluginDirPath.split('/').length + 1) {
            resolve({
              code: src,
              map: null
            });
            return;
          }

          const fileName = id.split('/').pop().split('.')[0];
          fs.writeFile(`./${outDir}/${fileName}.js`, getAllBlockComment(src), (err) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve({
                code: src,
                map: null
              });
            }
          })
        })
      }
    },
  }
}