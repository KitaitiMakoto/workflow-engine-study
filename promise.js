"use strict";

import fs from "fs";

class LocalFileTarget {
  constructor(path) {
    this.path = path;
  }

  exists() {
    return new Promise((resolve, reject) => {
      fs.stat(this.path, (error, stats) => {
        resolve(error ? false : true);
      });
    });
  }
}

class Task {
  output() {
    if (! this._outputTarget) {
      this._outputTarget = this._output();
    }
    return this._outputTarget;
  }

  run(input) {
    return this.output().exists().then(exists => {
      if (exists) {
        return this.output();
      }
      var ran = this._run(input);
      if (ran && ran.then) {
        return ran.then(() => Promise.resolve(this.output()));
      }
      return this.output();
    });
  }
}

export {Task, LocalFileTarget};
