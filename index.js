"use script";

import toposort from "toposort";

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
}

class DAG {
  constructor() {
    this._keys = {};
    this._tasks = [];
  }

  graph() {
    var graph = toposort(this._tasks);
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
    dag.graph().forEach(t => t.run());
  }
}

export {Workflow, DAG, Task};
