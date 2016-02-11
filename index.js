"use script";

import fs from "fs";
import toposort from "toposort";

class Target {
  exists() {
    throw new Error("You must implement exists() function.");
  }
}

class FileTarget {
  constructor(path) {
    this.path = path;
  }

  exists() {
    try {
      fs.statSync(this.path);
      return true;
    } catch(error) {
      return false;
    }
  }
}

class Task {
  key() {
    throw new Error("You must implement key() function.");
  }

  run() {
    throw new Error("You must implement run() function.");
  }

  requires() {
    return [];
  }

  output() {
    throw new Error("You must implement output() function.");
  }
}

class DAG {
  constructor() {
    this._keys = {};
    this._tasks = [];
  }

  graph() {
    var graph = toposort(this._tasks);
    graph.reverse();
    return graph.map(key => this._keys[key]);
  }

  addTask(task) {
    var key = task.key();
    if (this._keys[key]) {
      return task;
    }

    this._keys[key] = task;
    task.requires().forEach(t => {
      this._tasks.push([key, t.key()]);
      this.addTask(t)
    }, this);

    return task;
  }
}

class Workflow {
  run(task) {
    var dag = new DAG();
    dag.addTask(task);
    dag.graph().forEach(t => {
      if (t.output().exists()) {
        return;
      }
      t.run()
    });
  }
}

export {Workflow, DAG, Task, Target, FileTarget};
