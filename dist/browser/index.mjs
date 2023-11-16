var k = Object.defineProperty;
var w = (n, e, t) => e in n ? k(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var s = (n, e, t) => (w(n, typeof e != "symbol" ? e + "" : e, t), t);
class l {
  constructor(e, t = { type: "module" }) {
    s(this, "worker");
    s(this, "terminated", !1);
    s(this, "eventSeq", 0);
    s(this, "pendingTasks", /* @__PURE__ */ new Map());
    s(this, "taskWithTransferable", (e, t, ...r) => new Promise((a, i) => {
      if (this.terminated)
        return i(
          new Error(
            "Cannot start a new task: this worker is already terminated"
          )
        );
      const h = this.eventSeq++;
      this.pendingTasks.set(h, {
        resolve: a,
        reject: i
      });
      const d = {
        eventType: e,
        eventSeq: h,
        args: r
      };
      this.worker.postMessage(d, t);
    }));
    s(this, "task", (e, ...t) => this.taskWithTransferable(e, [], ...t));
    s(this, "handleResponse", (e) => {
      const { data: t } = e, r = this.pendingTasks.get(t.eventSeq);
      r && (t.result.success ? r.resolve(t.result.response) : r.reject(t.result.reason), this.pendingTasks.delete(t.eventSeq));
    });
    this.worker = new Worker(e, t), this.worker.addEventListener(
      "message",
      (r) => this.handleResponse(r)
    );
  }
  get pendingTaskCount() {
    return this.pendingTasks.size;
  }
  terminate() {
    if (this.terminated)
      throw new Error(
        "Cannot terminate this worker: this worker is already terminated"
      );
    this.worker.terminate(), this.terminated = !0;
  }
}
class o {
  constructor(e, t = null) {
    s(this, "lastWorkerIndex", 0);
    s(this, "_terminated", !1);
    s(this, "method", "rotate");
    s(this, "assign", (e) => {
      if (this.assertOnline(
        "Cannot assign a new task: this pool is already terminated"
      ), e > this.workers.length)
        throw new RangeError(
          `Cannot select ${e} workers: This pool has only ${this.workers.length} workers.`
        );
      switch (this.method) {
        case "rotate": {
          const t = new o(
            this.workers.concat(this.workers).slice(this.lastWorkerIndex, this.lastWorkerIndex + e),
            this
          );
          return this.lastWorkerIndex = (this.lastWorkerIndex + e) % this.workers.length, t;
        }
        case "idleFirst":
          return this.workers.sort((t, r) => t.pendingTaskCount - r.pendingTaskCount), new o(this.workers.slice(0, e), this);
      }
    });
    s(this, "task", (e, ...t) => this.assertOnline(
      "Cannot start a new task: this pool is already terminated"
    ).workers.map((r) => r.task(e, ...t)));
    s(this, "terminate", () => {
      if (this.parent)
        throw new Error(
          "Cannot terminate this pool: only the root-level pool can be terminated"
        );
      this.assertOnline(
        "Cannot terminate this pool: this pool is already terminated"
      ), this.workers.forEach((e) => e.terminate()), this.workers = [], this._terminated = !0;
    });
    this.workers = e, this.parent = t;
  }
  get terminated() {
    var e;
    return ((e = this.parent) == null ? void 0 : e.terminated) ?? this._terminated;
  }
  assertOnline(e) {
    if (this.terminated)
      throw new Error(e);
    return this;
  }
  get size() {
    return this.workers.length;
  }
  scheduler(e) {
    return this.method = e.method ?? this.method, this;
  }
}
function u(n, e = { type: "module" }) {
  const t = new l(n, e);
  return function() {
    return t;
  };
}
function p(n, e, t = { type: "module" }) {
  const r = [];
  for (let i = 0; i < n; i++)
    r.push(new l(e, t));
  const a = new o(r);
  return function() {
    return a;
  };
}
export {
  u as startWorker,
  p as startWorkerPool
};
