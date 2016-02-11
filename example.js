"use strict";

import fs from "fs";
import path from "path";
import {Workflow, Task, FileTarget} from "./index";
import mkdirp from "mkdirp";

class EchoTask extends Task {
  key() {
    return "EchoTask";
  }

  run() {
    console.log(this.key());
    var output = this.output().path;
    var dirname = path.dirname(output);
    mkdirp.sync(dirname);
    fs.writeFileSync(output, "done");
  }

  output() {
    return new FileTarget(`/tmp/workflow/${this.key()}.txt`);
  }
}

class TaskA extends EchoTask {
  key() {
    return "TaskA";
  }

  requires() {
    return [new TaskB(), new TaskC()];
  }
}

class TaskB extends EchoTask {
  key() {
    return "TaskB";
  }

  requires() {
    return [new TaskD()];
  }
}

class TaskC extends EchoTask {
  key() {
    return "TaskC";
  }

  requires() {
    return [new TaskD()];
  }
}

class TaskD extends EchoTask {
  key() {
    return "TaskD";
  }
}

(new Workflow()).run(new TaskA());
