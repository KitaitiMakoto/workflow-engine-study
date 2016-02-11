"use strict";

import fs from "fs";
import {Task, LocalFileTarget} from "./promise.js";

class GenerateDataTask extends Task {
  _output() {
    return new LocalFileTarget("/tmp/data.txt");
  }

  _run(input) {
    var data = "";
    for (let i = 0; i < 10; i++) {
      data += `${i + 1}\n`;
    }
    fs.writeFile(this.output().path, data, error => {
      if (error) {
        throw error;
      }
    });
  }
};

class SumTask extends Task {
  _output() {
    return new LocalFileTarget("/tmp/output.txt");
  }

  _run(input) {
    fs.readFile(input.path, (error, data) => {
      if (error) {
        throw error
      }
      var sum = data.toString().split("\n")
          .map(line => parseInt(line.trim()))
          .filter(num => Number.isFinite(num))
          .reduce((acc, num) => acc + num);
      fs.writeFile(this.output().path, "" + sum, error => {
        if (error) {
          throw error;
        }
      });
    }).bind(this);
  }
};

(new GenerateDataTask()).run().
  then(input => {
    (new SumTask()).run(input);
  });
