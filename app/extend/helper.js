'use strict';

const fs = require('fs');
const exec = require('child_process').exec;

module.exports = {
  file: {
    fsStat: path => new Promise((resolve, reject) => {
      fs.stat(path, (e, stat) => {
        if (e instanceof Error) {
          reject(e);
        }
        resolve(stat);
      });
    }),
  },
  execShell: function execShell(shellCommands = 'pwd') {
    const shellCommandArray = shellCommands instanceof Array ? shellCommands : [ shellCommands ];
    const shellCommandLine = shellCommandArray.join(' && ');

    return new Promise((resolve, reject) => {
      exec(shellCommandLine, {
        cwd: this.config.baseDir,
      }, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          reject(stderr);
          return;
        }
        console.log(`stdout: ${stdout}`);
        resolve(stdout);
      });
    });
  },
};
