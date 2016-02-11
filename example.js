"use strict";

import {Workflow, Task} from "./index";

class EchoTask extends Task {
  key() {
    return "EchoTask";
  }

  run() {
    console.log(this.constructor);
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
