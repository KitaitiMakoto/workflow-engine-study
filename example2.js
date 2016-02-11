"use strict";

import fs from "fs";
import {Workflow, Task, FileTarget} from "./index";

class GenerateDataTask extends Task {
  key() {
    return "GenerateDataTask";
  }

  output() {
    var now = new Date();
    return new FileTarget(`/tmp/data${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.txt`);
  }

  run() {
    fs.writeFileSync(this.output().path, `1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n`);
  }
}

class SumTask extends Task {
  key() {
    return "SumTask";
  }

  requires() {
    return [new GenerateDataTask()];
  }

  output() {
    var now = new Date();
    return new FileTarget(`/tmp/output_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.txt`);
  }

  run() {
    var data = fs.readFileSync(this.input()[0].path).toString();

    var sum = data
        .split("\n")
        .map(l => parseInt(l.trim()))
        .filter(n => Number.isFinite(n))
        .reduce((s, i) => s + i);

    fs.writeFileSync(this.output().path, sum);
  }
}

(new Workflow()).run(new SumTask())
